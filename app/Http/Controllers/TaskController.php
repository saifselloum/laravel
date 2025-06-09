<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\TeamResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get projects the user has access to
        $accessibleProjectIds = $this->getUserAccessibleProjectIds($user);
        
        if (empty($accessibleProjectIds)) {
            return inertia('Task/Index', [
                "tasks" => [],
                'queryParams' => request()->query() ?: null,
                'success' => session('success'),
                'hasProjectAccess' => false,
                'message' => 'You need to be a member of at least one project to view tasks.',
            ]);
        }
        
        // Get tasks from accessible projects
        $query = Task::query()
            ->whereIn('project_id', $accessibleProjectIds)
            ->where(function($q) use ($user) {
                $q->where('assigned_user_id', $user->id)
                  ->orWhere('created_by', $user->id);
            });
            
        $sortField = request('sort_field', "created_at");
        $sortDirection = request('sort_direction', "desc");

        if(request('name')){
            $query->where('name', 'like', '%'.request('name').'%');
        }
        
        if(request('status')){
            $query->where('status', request('status'));
        }

        $tasks = $query->with(['project', 'team', 'assignedUser'])
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);
            
        return inertia('Task/Index', [
            "tasks" => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'hasProjectAccess' => true,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $user = Auth::user();
        $projectId = $request->query('project_id');
        $teamId = $request->query('team_id');
        
        // Get projects the user has access to
        $accessibleProjects = $this->getUserAccessibleProjects($user);
        
        if ($accessibleProjects->isEmpty()) {
            return redirect()->route('task.index')
                ->with('error', 'You need to be a member of at least one project to create tasks.');
        }
        
        $selectedProject = null;
        $selectedTeam = null;
        $assignableUsers = collect();
        $teams = collect();
        
        // If specific project is requested
        if ($projectId) {
            $selectedProject = $accessibleProjects->find($projectId);
            if (!$selectedProject) {
                abort(403, 'You do not have access to this project');
            }
            
            // Get teams for this project
            $teams = $selectedProject->teams()->get();
            
            // Get assignable users for this project
            $assignableUsers = $this->getProjectAssignableUsers($selectedProject);
        }
        
        // If specific team is requested
        if ($teamId) {
            $selectedTeam = Team::with('project')->find($teamId);
            if (!$selectedTeam || !$accessibleProjects->contains($selectedTeam->project)) {
                abort(403, 'You do not have access to this team');
            }
            
            $selectedProject = $selectedTeam->project;
            $teams = $selectedProject->teams()->get();
            
            // Get assignable users for this team
            $assignableUsers = $this->getTeamAssignableUsers($selectedTeam);
        }
        
        return inertia('Task/Create', [
            'projects' => ProjectResource::collection($accessibleProjects),
            'teams' => TeamResource::collection($teams),
            'users' => UserResource::collection($assignableUsers),
            'selectedProjectId' => $selectedProject?->id,
            'selectedTeamId' => $selectedTeam?->id,
        ]);
    }

    /**
     * Get project data for task creation (AJAX endpoint)
     */
    public function getProjectData(Project $project)
    {
        $user = Auth::user();
        
        // Check if user can access this project
        if (!$project->canBeAccessedBy($user)) {
            abort(403, 'You do not have access to this project');
        }
        
        // Get teams for this project
        $teams = $project->teams()->get();
        
        // Get assignable users for this project
        $assignableUsers = $this->getProjectAssignableUsers($project);
        
        return response()->json([
            'teams' => TeamResource::collection($teams),
            'users' => UserResource::collection($assignableUsers),
        ]);
    }

    /**
     * Get team data for task creation (AJAX endpoint)
     */
    public function getTeamData(Team $team)
    {
        $user = Auth::user();
        
        // Check if user can access this team's project
        if (!$team->project->canBeAccessedBy($user)) {
            abort(403, 'You do not have access to this team');
        }
        
        // Get assignable users for this team
        $assignableUsers = $this->getTeamAssignableUsers($team);
        
        return response()->json([
            'users' => UserResource::collection($assignableUsers),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $user = Auth::user();
        
        // Validate project access
        $project = Project::findOrFail($data['project_id']);
        if (!$project->canBeAccessedBy($user)) {
            abort(403, 'You do not have access to this project');
        }
        
        // Validate team access if provided
        if (!empty($data['team_id'])) {
            $team = Team::findOrFail($data['team_id']);
            if ($team->project_id !== $project->id) {
                abort(400, 'Team does not belong to this project');
            }
        }
        
        // Validate assigned user
        if (!empty($data['assigned_user_id'])) {
            $assignedUser = User::findOrFail($data['assigned_user_id']);
            if (!$this->canUserBeAssignedToTask($assignedUser, $project, $data['team_id'] ?? null)) {
                abort(400, 'This user cannot be assigned to this task');
            }
        }
        
        $image = $data['image'] ?? null;
        $data['created_by'] = $user->id;
        $data['updated_by'] = $user->id;
        
        if ($image) {
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }
        
        $task = Task::create($data);
        
        return to_route('project.show', $project->id)
            ->with('success', 'Task was created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $user = Auth::user();
        
        // Check if user can access this task's project
        if (!$task->project->canBeAccessedBy($user)) {
            abort(403, 'You do not have access to this task');
        }
        
        return inertia('Task/Show', [
            'task' => new TaskResource($task->load(['project', 'team', 'assignedUser', 'createdBy'])),
            'canManage' => $this->canUserManageTask($user, $task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $user = Auth::user();
        
        // Check if user can manage this task
        if (!$this->canUserManageTask($user, $task)) {
            abort(403, 'You do not have permission to edit this task');
        }
        
        // Get assignable users
        $assignableUsers = $task->team_id 
            ? $this->getTeamAssignableUsers($task->team) 
            : $this->getProjectAssignableUsers($task->project);
            
        // Get teams for the project
        $teams = $task->project->teams()->get();
        
        return inertia('Task/Edit', [
            'task' => new TaskResource($task->load(['project', 'team'])),
            'users' => UserResource::collection($assignableUsers),
            'teams' => TeamResource::collection($teams),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $user = Auth::user();
        
        // Check if user can manage this task
        if (!$this->canUserManageTask($user, $task)) {
            abort(403, 'You do not have permission to update this task');
        }
        
        $data = $request->validated();
        
        // Validate assigned user if changed
        if (!empty($data['assigned_user_id']) && $data['assigned_user_id'] != $task->assigned_user_id) {
            $assignedUser = User::findOrFail($data['assigned_user_id']);
            if (!$this->canUserBeAssignedToTask($assignedUser, $task->project, $data['team_id'] ?? $task->team_id)) {
                abort(400, 'This user cannot be assigned to this task');
            }
        }
        
        $image = $data['image'] ?? null;
        $data['updated_by'] = $user->id;
        
        if ($image) {
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }
        
        $task->update($data);
        
        return to_route('task.show', $task->id)
            ->with('success', "Task \"{$task->name}\" was updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $user = Auth::user();
        
        // Check if user can manage this task
        if (!$this->canUserManageTask($user, $task)) {
            abort(403, 'You do not have permission to delete this task');
        }
        
        $name = $task->name;
        $projectId = $task->project_id;
        
        if ($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }
        
        $task->delete();
        
        return to_route('project.show', $projectId)
            ->with('success', "Task \"{$name}\" was deleted successfully");
    }

    /**
     * Get projects accessible by user
     */
    private function getUserAccessibleProjects(User $user)
    {
        return Project::where(function($query) use ($user) {
            $query->where('created_by', $user->id)
                  ->orWhereHas('members', function($q) use ($user) {
                      $q->where('user_id', $user->id);
                  });
        })->with(['teams', 'members'])->get();
    }

    /**
     * Get project IDs accessible by user
     */
    private function getUserAccessibleProjectIds(User $user)
    {
        return Project::where(function($query) use ($user) {
            $query->where('created_by', $user->id)
                  ->orWhereHas('members', function($q) use ($user) {
                      $q->where('user_id', $user->id);
                  });
        })->pluck('id')->toArray();
    }

    /**
     * Get users that can be assigned to tasks in a project
     */
    private function getProjectAssignableUsers(Project $project)
    {
        // Get all project members including the creator
        $members = $project->members()->get();
        $creator = $project->createdBy;
        
        // Combine members and creator, removing duplicates
        $allUsers = collect();
        
        if ($creator) {
            $allUsers->push($creator);
        }
        
        foreach ($members as $member) {
            if (!$allUsers->contains('id', $member->id)) {
                $allUsers->push($member);
            }
        }
        
        return $allUsers;
    }

    /**
     * Get users that can be assigned to tasks in a team
     */
    private function getTeamAssignableUsers(Team $team)
    {
        $teamMembers = $team->members()->get();
        $teamLeader = $team->leader;
        
        $allUsers = collect();
        
        if ($teamLeader) {
            $allUsers->push($teamLeader);
        }
        
        foreach ($teamMembers as $member) {
            if (!$allUsers->contains('id', $member->id)) {
                $allUsers->push($member);
            }
        }
        
        return $allUsers;
    }

    /**
     * Check if user can be assigned to a task
     */
    private function canUserBeAssignedToTask(User $user, Project $project, $teamId = null)
    {
        if ($teamId) {
            $team = Team::find($teamId);
            return $team && ($team->members()->where('user_id', $user->id)->exists() || $team->team_leader_id === $user->id);
        }
        
        return $project->canBeAccessedBy($user);
    }

    /**
     * Check if user can manage a task
     */
    private function canUserManageTask(User $user, Task $task)
    {
        // Project creator can manage all tasks
        if ($task->project->isCreator($user)) {
            return true;
        }
        
        // Team leader can manage team tasks
        if ($task->team_id && $task->team && $task->team->team_leader_id === $user->id) {
            return true;
        }
        
        // Task creator can manage their own tasks
        return $task->created_by === $user->id;
    }
}
