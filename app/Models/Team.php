<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Team extends Model
{
    use HasFactory;

    // define the pivot table name if different
    protected $table = 'teams';
    // the pivot table is 'team_members' by default, but you can specify it if needed

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($team) {
            if (empty($team->slug)) {
                $team->slug = Str::slug($team->name);
            }
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_members')
            ->withTimestamps()
            ->withPivot('role');
    }

    public function activeMembers(): BelongsToMany
    {
        return $this->members()->wherePivot('is_active', true);
    }

    public function teamMembers(): HasMany
    {
        return $this->hasMany(TeamMember::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function workflowPermissions(): HasMany
    {
        return $this->hasMany(TeamWorkflowPermission::class);
    }

    public function getMemberRole(User $user): ?string
    {
        $member = $this->members()->where('user_id', $user->id)->first();
        return $member?->pivot->role;
    }

    public function hasMember(User $user): bool
    {
        return $this->activeMembers()->where('user_id', $user->id)->exists();
    }

    public function canUserPerformTransition(User $user, WorkflowTransition $transition): bool
    {
        $userRole = $this->getMemberRole($user);
        if (!$userRole) {
            return false;
        }

        $permission = $this->workflowPermissions()
            ->where('transition_id', $transition->id)
            ->where('is_active', true)
            ->first();

        if (!$permission) {
            return false;
        }

        return in_array($userRole, $permission->allowed_roles);
    }
}
