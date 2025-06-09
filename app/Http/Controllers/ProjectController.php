<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\TeamResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get projects the user has access to (created or is a member of)
        $query = Project::query()
            ->where(function($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhereHas('members', function($q) use ($user) {
                      $q->where('user_id', $user->id);
                  });
            });
            
        $sortField = request('sort_field', "created_at");
        $sortDirection = request('sort_direction', "desc");

        if(request('name')){
            $query->where('name', 'like', '%'.request('name').'%');
        }
        
        if(request('status')){
            $query->where('status', request('status'));
        }

        $projects = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);
            
        return inertia('Project/Index', [
            "projects" => ProjectResource::collection($projects),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Project/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $data['assigned_user_id'] = Auth::id();
        
        if ($image) {
            $data['image_path'] = $image->store('project/' . Str::random(), 'public');
        }
        
        Project::create($data);
    
        return to_route('project.index')->with('success', 'Project was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {   
        // Check if user can access this project
        $user = Auth::user();
        if (!$project->canBeAccessedBy($user)) {
            abort(403, 'You do not have access to this project');
        }
        
        Log::info('Loading project show page', [
            'project_id' => $project->id,
            'user_id' => $user->id
        ]);
        
        // Load project relationships
        $project->load([
            'createdBy', 
            'updatedBy', 
            'assignedUser',
            'teams.leader',
            'teams.members'
        ]);
        
        // Get project members directly from database
        $projectMembersData = DB::table('project_members')
            ->join('users', 'project_members.user_id', '=', 'users.id')
            ->where('project_members.project_id', $project->id)
            ->select('users.id', 'users.name', 'users.email', 'project_members.role')
            ->get()
            ->toArray();
            
        Log::info('Project members data', [
            'project_id' => $project->id,
            'members_count' => count($projectMembersData),
            'members' => $projectMembersData
        ]);
        
        $query = $project->tasks();
        $sortField = request('sort_field', "created_at");
        $sortDirection = request('sort_direction', "desc");

        if(request('name')){
            $query->where('name', 'like', '%'.request('name').'%');
        }
        
        if(request('status')){
            $query->where('status', request('status'));
        }
        
        $tasks = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        // Get available users for invitation (excluding project creator and current members)
        $availableUsers = User::select('id', 'name', 'email')
            ->where('id', '!=', $project->created_by)
            ->whereNotIn('id', function($query) use ($project) {
                $query->select('user_id')
                      ->from('project_members')
                      ->where('project_id', $project->id);
            })
            ->whereNotIn('email', function($query) use ($project) {
                $query->select('email')
                      ->from('project_invitations')
                      ->where('project_id', $project->id)
                      ->where('status', 'pending');
            })
            ->orderBy('name')
            ->get();

        // Get teams data
        $projectTeams = $project->teams ?? collect();
            
        return inertia('Project/Show', [
            'project' => new ProjectResource($project),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'isCreator' => $project->isCreator($user),
            'projectMembers' => $projectMembersData,
            'teams' => $projectTeams->toArray(),
            'availableUsers' => $availableUsers->toArray(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        // Only project creator can edit
        $user = Auth::user();
        if (!$project->isCreator($user)) {
            abort(403, 'Only the project creator can edit this project');
        }
        
        return inertia('Project/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        // Only project creator can update
        $user = Auth::user();
        if (!$project->isCreator($user)) {
            abort(403, 'Only the project creator can update this project');
        }
        
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['updated_by'] = Auth::id();
        
        if ($image) {
            if ($project->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($project->image_path));
            }
            $data['image_path'] = $image->store('project/' . Str::random(), 'public');
        }
        
        $project->update($data);

        return to_route('project.index')
            ->with('success', "Project \"$project->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        // Only project creator can delete
        $user = Auth::user();
        if (!$project->isCreator($user)) {
            abort(403, 'Only the project creator can delete this project');
        }
        
        $name = $project->name;
        
        if ($project->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($project->image_path));
        }
        
        $project->delete();
        
        return to_route('project.index')
            ->with('success', "Project \"$name\" was deleted");
    }
}
