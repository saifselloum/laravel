<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Projects created by the user
     */
    public function createdProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'created_by');
    }

    /**
     * Projects the user is a member of
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * Teams the user is a member of
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_members')
            ->withTimestamps();
    }

    /**
     * Teams the user leads
     */
    public function ledTeams(): HasMany
    {
        return $this->hasMany(Team::class, 'team_leader_id');
    }

    /**
     * Tasks assigned to the user
     */
    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_user_id');
    }

    /**
     * Project invitations sent by the user
     */
    public function sentInvitations(): HasMany
    {
        return $this->hasMany(ProjectInvitation::class, 'invited_by');
    }

    /**
     * Check if user has access to a project
     */
    public function canAccessProject(Project $project): bool
    {
        // User is the creator of the project
        if ($project->created_by === $this->id) {
            return true;
        }

        // User is a member of the project
        return $this->projects()->where('project_id', $project->id)->exists();
    }

    /**
     * Check if user has access to a team
     */
    public function canAccessTeam(Team $team): bool
    {
        // User can access the project
        if (!$this->canAccessProject($team->project)) {
            return false;
        }

        // User is the team leader
        if ($team->team_leader_id === $this->id) {
            return true;
        }

        // User is a member of the team
        return $this->teams()->where('team_id', $team->id)->exists();
    }
}
