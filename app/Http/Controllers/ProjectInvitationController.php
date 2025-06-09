<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectInvitation;
use App\Models\User;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Mail\ProjectInvitationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProjectInvitationController extends Controller
{
    /**
     * Display a listing of invitations for a project.
     */
    public function index(Project $project)
    {
        // Only project creator can view invitations
        if (!$project->isCreator(Auth::user())) {
            abort(403, 'Only the project creator can view invitations');
        }
        
        $invitations = $project->invitations()
            ->with('invitedBy')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return inertia('Project/Invitations/Index', [
            'project' => new ProjectResource($project),
            'invitations' => $invitations,
        ]);
    }

    /**
     * Show the form for creating a new invitation.
     */
    public function create(Project $project)
    {
        // Only project creator can create invitations
        if (!$project->isCreator(Auth::user())) {
            abort(403, 'Only the project creator can create invitations');
        }
        
        // Get existing users for search/autocomplete
        $users = User::select('id', 'name', 'email')
            ->where('id', '!=', $project->created_by) // Exclude project creator
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
            
        return inertia('Project/Invitations/Create', [
            'project' => new ProjectResource($project),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Store a newly created invitation in storage.
     */
    public function store(Request $request, Project $project)
    {
        // Only project creator can create invitations
        if (!$project->isCreator(Auth::user())) {
            abort(403, 'Only the project creator can create invitations');
        }
        
        $validated = $request->validate([
            'email' => [
                'required', 
                'email',
                Rule::unique('project_invitations')->where(function ($query) use ($project) {
                    return $query->where('project_id', $project->id)
                                ->where('status', 'pending');
                }),
            ],
            'user_id' => ['nullable', 'exists:users,id'],
        ]);
        
        // Check if user is already a member
        $existingUser = User::where('email', $validated['email'])->first();
        if ($existingUser && $project->isMember($existingUser)) {
            return back()->withErrors([
                'email' => 'This user is already a member of the project',
            ]);
        }
        
        // Check if user is the project creator
        if ($existingUser && $project->created_by === $existingUser->id) {
            return back()->withErrors([
                'email' => 'Cannot invite the project creator',
            ]);
        }
        
        // Create invitation
        $invitation = ProjectInvitation::create([
            'project_id' => $project->id,
            'invited_by' => Auth::id(),
            'email' => $validated['email'],
            'user_id' => $validated['user_id'],
            'token' => Str::random(64),
            'expires_at' => now()->addDays(7),
        ]);
        
        // Log invitation creation
        Log::info('Project invitation created', [
            'invitation_id' => $invitation->id,
            'project_id' => $project->id,
            'email' => $validated['email'],
            'invited_by' => Auth::id()
        ]);
        
        // Send invitation email
        try {
            Log::info('Attempting to send invitation email', [
                'to' => $validated['email'],
                'invitation_id' => $invitation->id
            ]);
            
            Mail::to($validated['email'])->send(new ProjectInvitationMail($invitation));
            
            Log::info('Invitation email sent successfully', [
                'to' => $validated['email'],
                'invitation_id' => $invitation->id
            ]);
            
            return back()->with('success', 'Invitation email sent successfully to ' . $validated['email']);
            
        } catch (\Exception $e) {
            // Log the error details
            Log::error('Failed to send invitation email', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'invitation_id' => $invitation->id,
                'email' => $validated['email']
            ]);
            
            // Don't delete the invitation, just show error
            return back()->withErrors([
                'email' => 'Failed to send invitation email: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Show the invitation acceptance page.
     */
    public function show($token)
    {
        $invitation = ProjectInvitation::where('token', $token)
            ->with(['project', 'invitedBy'])
            ->first();
            
        if (!$invitation) {
            return inertia('Project/Invitations/NotFound');
        }
        
        // Check if invitation is expired
        if ($invitation->isExpired()) {
            return inertia('Project/Invitations/Expired', [
                'invitation' => $invitation,
            ]);
        }
        
        // Check if invitation is already accepted or declined
        if ($invitation->status !== 'pending') {
            return inertia('Project/Invitations/AlreadyProcessed', [
                'invitation' => $invitation,
            ]);
        }
        
        return inertia('Project/Invitations/Accept', [
            'invitation' => $invitation,
            'project' => $invitation->project,
            'invitedBy' => $invitation->invitedBy,
        ]);
    }

    /**
     * Accept an invitation - automatically adds the invited user to the project.
     */
    public function accept(Request $request, $token)
    {
        Log::info('Starting invitation acceptance process', ['token' => $token]);
        
        $invitation = ProjectInvitation::where('token', $token)
            ->where('status', 'pending')
            ->with('project')
            ->first();
            
        if (!$invitation) {
            Log::error('Invitation not found or not pending', ['token' => $token]);
            return inertia('Project/Invitations/NotFound');
        }
            
        // Check if invitation is expired
        if ($invitation->isExpired()) {
            Log::error('Invitation expired', ['invitation_id' => $invitation->id]);
            return inertia('Project/Invitations/Expired', [
                'invitation' => $invitation,
            ]);
        }
        
        // Find the invited user by email
        $invitedUser = User::where('email', $invitation->email)->first();
        
        if (!$invitedUser) {
            Log::error('Invited user not found', ['email' => $invitation->email]);
            return back()->withErrors([
                'error' => 'The invited user account was not found. Please make sure the user has registered with email: ' . $invitation->email
            ]);
        }
        
        Log::info('Found invited user', [
            'invited_user_id' => $invitedUser->id,
            'invited_user_email' => $invitedUser->email,
            'invitation_email' => $invitation->email
        ]);
        
        // Check if user is already a member
        if ($invitation->project->isMember($invitedUser)) {
            Log::error('User already a member', [
                'user_id' => $invitedUser->id,
                'project_id' => $invitation->project_id
            ]);
            
            // Update invitation status to accepted since user is already a member
            $invitation->update(['status' => 'accepted']);
            
            return back()->with('success', 'User is already a member of this project.');
        }
        
        try {
            Log::info('Starting database transaction for invitation acceptance');
            DB::beginTransaction();
            
            // Update the invitation status first
            $invitation->update(['status' => 'accepted']);
            Log::info('Invitation status updated to accepted', ['invitation_id' => $invitation->id]);
            
            // Check if project_members table exists
            $tableExists = DB::select("SHOW TABLES LIKE 'project_members'");
            Log::info('Project members table check', ['exists' => !empty($tableExists)]);
            
            if (empty($tableExists)) {
                Log::error('project_members table does not exist');
                throw new \Exception('Project members table does not exist');
            }
            
            // Check if member already exists (double-check)
            $existingMember = DB::table('project_members')
                ->where('project_id', $invitation->project_id)
                ->where('user_id', $invitedUser->id)
                ->first();
                
            if ($existingMember) {
                Log::info('Member already exists in database', [
                    'project_id' => $invitation->project_id,
                    'user_id' => $invitedUser->id
                ]);
                DB::commit();
                return back()->with('success', 'User is already a member of this project.');
            }
            
            // Insert the invited user into project_members table
            $inserted = DB::table('project_members')->insert([
                'project_id' => $invitation->project_id,
                'user_id' => $invitedUser->id,
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            Log::info('Direct insert result', [
                'inserted' => $inserted,
                'project_id' => $invitation->project_id,
                'user_id' => $invitedUser->id
            ]);
            
            if (!$inserted) {
                throw new \Exception('Failed to insert into project_members table');
            }
            
            // Verify the insertion
            $memberExists = DB::table('project_members')
                ->where('project_id', $invitation->project_id)
                ->where('user_id', $invitedUser->id)
                ->exists();
                
            Log::info('Member existence verification', ['exists' => $memberExists]);
            
            if (!$memberExists) {
                throw new \Exception('Member was not properly inserted');
            }
            
            DB::commit();
            
            Log::info('User successfully added to project', [
                'user_id' => $invitedUser->id,
                'user_email' => $invitedUser->email,
                'project_id' => $invitation->project_id,
                'invitation_id' => $invitation->id
            ]);
            
            // Clear any cached data
            cache()->forget("project_members_{$invitation->project_id}");
            
            return back()->with('success', 'Invitation accepted! User "' . $invitedUser->name . '" has been successfully added to the project "' . $invitation->project->name . '"');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to add user to project', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $invitedUser->id,
                'project_id' => $invitation->project_id,
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            
            return back()->withErrors([
                'error' => 'Failed to add user to project: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Decline an invitation.
     */
    public function decline(Request $request, $token)
    {
        $invitation = ProjectInvitation::where('token', $token)
            ->where('status', 'pending')
            ->with('project')
            ->first();
            
        if (!$invitation) {
            return inertia('Project/Invitations/NotFound');
        }
            
        $invitation->update(['status' => 'declined']);
        
        return back()->with('success', 'Invitation declined for "' . $invitation->project->name . '"');
    }

    /**
     * Cancel an invitation (by project creator).
     */
    public function destroy(Project $project, ProjectInvitation $invitation)
    {
        // Only project creator can cancel invitations
        if (!$project->isCreator(Auth::user())) {
            abort(403, 'Only the project creator can cancel invitations');
        }
        
        // Verify invitation belongs to this project
        if ($invitation->project_id !== $project->id) {
            abort(404);
        }
        
        $invitation->delete();
        
        return back()->with('success', 'Invitation cancelled');
    }

    /**
     * Remove a member from the project.
     */
    public function removeMember(Project $project, User $user)
    {
        // Only project creator can remove members
        if (!$project->isCreator(Auth::user())) {
            abort(403, 'Only the project creator can remove members');
        }
        
        // Cannot remove project creator
        if ($project->created_by === $user->id) {
            return back()->withErrors(['error' => 'Cannot remove the project creator']);
        }
        
        // Remove from project_members table
        DB::table('project_members')
            ->where('project_id', $project->id)
            ->where('user_id', $user->id)
            ->delete();
        
        // Remove from all teams in this project
        foreach ($project->teams as $team) {
            $team->members()->detach($user->id);
        }
        
        return back()->with('success', 'Member removed from project');
    }

    /**
     * Auto-accept invitation (for testing or admin purposes)
     */
    public function autoAccept(ProjectInvitation $invitation)
    {
        // Only project creator or admin can auto-accept
        if (!$invitation->project->isCreator(Auth::user()) && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }
        
        return $this->accept(request(), $invitation->token);
    }

    /**
     * Debug method to check project members
     */
    public function debugMembers(Project $project)
    {
        $members = DB::table('project_members')
            ->where('project_id', $project->id)
            ->get();
            
        $pivotMembers = $project->members()->get();
        
        return response()->json([
            'project_id' => $project->id,
            'direct_query' => $members,
            'pivot_relationship' => $pivotMembers,
            'table_exists' => DB::select("SHOW TABLES LIKE 'project_members'"),
            'all_members' => DB::table('project_members')->get(),
        ]);
    }
}
