<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeamResource;
use App\Http\Resources\WorkflowStateResource;
use App\Http\Resources\WorkflowTransitionResource;
use App\Models\Team;
use App\Models\WorkflowState;
use App\Models\WorkflowTransition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkflowController extends Controller
{
    /**
     * Display the workflow management page.
     */
    public function index()
    {
        $states = WorkflowStateResource::collection(
            WorkflowState::orderBy('order')->get()
        );
        
        $transitions = WorkflowTransitionResource::collection(
            WorkflowTransition::with(['fromState', 'toState', 'teamPermissions.team'])->get()
        );
        
        $teams = TeamResource::collection(
            Team::withCount('members')->get()
        );
        
        return Inertia::render('Workflow/Index', [
            'states' => $states,
            'transitions' => $transitions,
            'teams' => $teams,
        ]);
    }
    
    /**
     * Display the workflow configuration page for a specific team.
     */
    public function configure(Team $team)
    {
        $states = WorkflowStateResource::collection(
            WorkflowState::orderBy('order')->get()
        );
        
        $transitions = WorkflowTransition::with(['fromState', 'toState', 'teamPermissions' => function($query) use ($team) {
                $query->where('team_id', $team->id);
            }])->get();

        // $transitions = WorkflowTransition::all();

        return Inertia::render('Workflow/Configure', [
            'team' => new TeamResource($team->load('members')),
            'states' => $states,
            'transitions' => $transitions,
        ]);
    }
    
    /**
     * Update workflow permissions for a team.
     */
    public function updatePermissions(Request $request, Team $team)
    {
        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*.transition_id' => 'required|exists:workflow_transitions,id',
            'permissions.*.allowed_roles' => 'required|array',
        ]);
        
        // Remove existing permissions for this team
        $team->workflowPermissions()->delete();
        
        // Add new permissions
        foreach ($validated['permissions'] as $permission) {
            $team->workflowPermissions()->create([
                'transition_id' => $permission['transition_id'],
                'allowed_roles' => $permission['allowed_roles'],
                'is_active' => true,
            ]);
        }
        
        return back()->with('success', 'Workflow permissions updated successfully.');
    }
}
