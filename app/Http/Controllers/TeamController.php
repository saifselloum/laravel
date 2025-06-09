<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Http\Resources\TeamResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Display a listing of teams for a project.
     */
    public function index(Project $project)
    {
        // Check if user can access this project
        if (!$project->canBeAccessedBy(Auth::user())) {
            abort(403, 'You do not have access to this project');
        }
        
        $teams = $project->teams()
            ->with(['leader', 'creator', 'members'])
            ->withCount('members')
            ->orderBy('name')
            ->get();
            
        return inertia('Project/Teams/Index', [
            'project' => new ProjectResource($project),
            'teams' => $teams,
            'isCreator' => $project->isCreator(Auth::user()),
        ]);
    }

    /**
     * Show the form for creating a new team.
     */
    public function create(Project $project)
    {
        // Only project creator can create teams
        if (!$project->isCreator(Auth::user())) {
            abort(403, 'Only the project creator can create teams');
        }
        
        // Get project members (including creator) for team leader and member selection
        $projectMembers = collect([$project->createdBy])
            ->merge($project->members)
            ->unique('id')
            ->values();
            
        return inertia('Project/Teams/Create', [
            'project' => new ProjectResource($project),
            'projectMembers' => $projectMembers,
        ]);
    }

    /**
     * Store a newly created team in storage.
     */
    public function store(Request $request, Project $project)
    {
        // Only project creator can create teams
        if (!$project->isCreator(Auth::user())) {
            abort(403, 'Only the project creator can create teams');
        }
        
        $validated = $request->validate([
            'name' => [
                'required', 
                'string', 
                'max:255',
                Rule::unique('teams')->where(function ($query) use ($project) {
                    return $query->where('project_id', $project->id);
                }),
            ],
            'description' => ['nullable', 'string'],
            'color' => ['required', 'string', 'max:7'],
            'team_leader_id' => [
                'required', 
                'exists:users,id',
                function ($attribute, $value, $fail) use ($project) {
                    // Verify leader is a project member or creator
                    $user = User::find($value);
                    if (!$project->canBeAccessedBy($user)) {
                        $fail('The selected team leader must be a member of the project.');
                    }
                },
            ],
            'member_ids' => ['nullable', 'array'],
            'member_ids.*' => [
                'exists:users,id',
                function ($attribute, $value, $fail) use ($project) {
                    // Verify members are project members or creator
                    $user = User::find($value);
                    if (!$project->canBeAccessedBy($user)) {
                        $fail('All team members must be members of the project.');
                    }
                },
            ],
        ]);
        
        // Create team
        $team = Team::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'color' => $validated['color'],
            'project_id' => $project->id,
            'team_leader_id' => $validated['team_leader_id'],
            'created_by' => Auth::id(),
        ]);
        
        // Add members (excluding team leader as they're automatically included)
        if (!empty($validated['member_ids'])) {
            $memberIds = array_filter($validated['member_ids'], function($id) use ($validated) {
                return $id != $validated['team_leader_id'];
            });
            $team->members()->attach($memberIds);
        }
        
        return to_route('project.teams.index', $project->id)
            ->with('success', 'Team created successfully');
    }

    /**
     * Display the specified team.
     */
    public function show(Project $project, Team $team)
    {
        // Check if team belongs to this project
        if ($team->project_id !== $project->id) {
            abort(404);
        }
        
        // Check if user can access this project
        if (!$project->canBeAccessedBy(Auth::user())) {
            abort(403, 'You do not have access to this project');
        }
        
        // Load team relationships
        $team->load(['members', 'leader', 'creator']);
        
        // Load team tasks
        $tasks = $team->tasks()
            ->with(['assignedUser', 'createdBy'])
            ->orderBy('due_date')
            ->get();
            
        $user = Auth::user();
        $canManage = $team->canBeManageBy($user);
        
        return inertia('Project/Teams/Show', [
            'project' => $project,
            'team' => $team,
            'tasks' => $tasks,
            'canManage' => $canManage,
            'isProjectCreator' => $project->isCreator($user),
            'isTeamLeader' => $team->team_leader_id === $user->id,
        ]);
    }

    /**
     * Show the form for editing the specified team.
     */
    public function edit(Project $project, Team $team)
    {
        // Check if team belongs to this project
        if ($team->project_id !== $project->id) {
            abort(404);
        }
        
        // Check if user can manage this team
        if (!$team->canBeManageBy(Auth::user())) {
            abort(403, 'You do not have permission to edit this team');
        }
        
        // Get project members for team leader and member selection
        $projectMembers = collect([$project->createdBy])
            ->merge($project->members)
            ->unique('id')
            ->values();
            
        // Get current team members
        $teamMemberIds = $team->members()->pluck('user_id')->toArray();
        
        return inertia('Project/Teams/Edit', [
            'project' => $project,
            'team' => $team,
            'projectMembers' => $projectMembers,
            'teamMemberIds' => $teamMemberIds,
        ]);
    }

    /**
     * Update the specified team in storage.
     */
    public function update(Request $request, Project $project, Team $team)
    {
        // Check if team belongs to this project
        if ($team->project_id !== $project->id) {
            abort(404);
        }
        
        // Check if user can manage this team
        if (!$team->canBeManageBy(Auth::user())) {
            abort(403, 'You do not have permission to update this team');
        }
        
        $validated = $request->validate([
            'name' => [
                'required', 
                'string', 
                'max:255',
                Rule::unique('teams')->where(function ($query) use ($project) {
                    return $query->where('project_id', $project->id);
                })->ignore($team->id),
            ],
            'description' => ['nullable', 'string'],
            'color' => ['required', 'string', 'max:7'],
            'team_leader_id' => [
                'required', 
                'exists:users,id',
                function ($attribute, $value, $fail) use ($project) {
                    // Verify leader is a project member or creator
                    $user = User::find($value);
                    if (!$project->canBeAccessedBy($user)) {
                        $fail('The selected team leader must be a member of the project.');
                    }
                },
            ],
            'member_ids' => ['nullable', 'array'],
            'member_ids.*' => [
                'exists:users,id',
                function ($attribute, $value, $fail) use ($project) {
                    // Verify members are project members or creator
                    $user = User::find($value);
                    if (!$project->canBeAccessedBy($user)) {
                        $fail('All team members must be members of the project.');
                    }
                },
            ],
        ]);
        
        // Update team
        $team->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'color' => $validated['color'],
            'team_leader_id' => $validated['team_leader_id'],
        ]);
        
        // Update members (excluding team leader)
        $memberIds = array_filter($validated['member_ids'] ?? [], function($id) use ($validated) {
            return $id != $validated['team_leader_id'];
        });
        $team->members()->sync($memberIds);
        
        return to_route('project.teams.show', [$project->id, $team->id])
            ->with('success', 'Team updated successfully');
    }

    /**
     * Remove the specified team from storage.
     */
    public function destroy(Project $project, Team $team)
    {
        // Check if team belongs to this project
        if ($team->project_id !== $project->id) {
            abort(404);
        }
        
        // Only project creator can delete teams
        if (!$project->isCreator(Auth::user())) {
            abort(403, 'Only the project creator can delete teams');
        }
        
        $name = $team->name;
        $team->delete();
        
        return to_route('project.teams.index', $project->id)
            ->with('success', "Team \"$name\" was deleted");
    }

    /**
     * Add a member to the team.
     */
    public function addMember(Request $request, Project $project, Team $team)
    {
        // Check if team belongs to this project
        if ($team->project_id !== $project->id) {
            abort(404);
        }
        
        // Check if user can manage this team
        if (!$team->canBeManageBy(Auth::user())) {
            abort(403, 'You do not have permission to add members to this team');
        }

        $request->validate([
            'user_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) use ($project, $team) {
                    // Verify user is a project member
                    $user = User::find($value);
                    if (!$project->canBeAccessedBy($user)) {
                        $fail('User must be a member of the project.');
                    }
                    
                    // Check if already a team member
                    if ($team->isMember($user)) {
                        $fail('User is already a member of this team.');
                    }
                },
            ],
        ]);

        $team->members()->attach($request->user_id);

        return back()->with('success', 'Member added successfully.');
    }

    /**
     * Remove a member from the team.
     */
    public function removeMember(Project $project, Team $team, User $user)
    {
        // Check if team belongs to this project
        if ($team->project_id !== $project->id) {
            abort(404);
        }
        
        // Check if user can manage this team
        if (!$team->canBeManageBy(Auth::user())) {
            abort(403, 'You do not have permission to remove members from this team');
        }
        
        // Cannot remove team leader
        if ($team->team_leader_id === $user->id) {
            return back()->withErrors(['error' => 'Cannot remove the team leader']);
        }

        $team->members()->detach($user->id);

        return back()->with('success', 'Member removed successfully.');
    }
}
