<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Http\Resources\TeamResource;
use App\Http\Resources\UserResource;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $query = Team::with(['creator', 'members']);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $teams = $query->orderBy('name')->paginate(10);

        return Inertia::render('Teams/Index', [
            'teams' => TeamResource::collection($teams),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Teams/Create');
    }

    public function store(StoreTeamRequest $request)
    {
        $team = Team::create([
            ...$request->validated(),
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('teams.index', $team)
            ->with('success', 'Team created successfully.');
    }

    public function show(Team $team)
    {
        $team->load(['creator', 'members', 'workflowPermissions.transition.fromState', 'workflowPermissions.transition.toState']);
        
        // Get users who are not already members of this team
        $availableUsers = User::whereNotIn('id', $team->members->pluck('id'))->get();

        return Inertia::render('Teams/Show', [
            'team' => new TeamResource($team),
            'availableUsers' => $availableUsers,
        ]);
    }

    public function edit(Team $team)
    {
        return Inertia::render('Teams/Edit', [
            'team' => new TeamResource($team),
        ]);
    }

    public function update(UpdateTeamRequest $request, Team $team)
    {
        $team->update($request->validated());

        return redirect()->route('teams.show', $team)
            ->with('success', 'Team updated successfully.');
    }

    public function destroy(Team $team)
    {
        $team->delete();

        return redirect()->route('teams.index')
            ->with('success', 'Team deleted successfully.');
    }

    public function addMember(Request $request, Team $team)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:contributor,reviewer,approver,manager',
        ]);

        $team->members()->attach($request->user_id, [
            'role' => $request->role,
            'added_by' => Auth::id(),
            'joined_at' => now(),
            'is_active' => true,
        ]);

        return back()->with('success', 'Member added successfully.');
    }

    public function removeMember(Team $team, User $user)
    {
        $team->members()->detach($user->id);

        return back()->with('success', 'Member removed successfully.');
    }

    public function updateMemberRole(Request $request, Team $team, User $user)
    {
        $request->validate([
            'role' => 'required|in:contributor,reviewer,approver,manager',
        ]);

        $team->members()->updateExistingPivot($user->id, [
            'role' => $request->role,
        ]);

        return back()->with('success', 'Member role updated successfully.');
    }
}
