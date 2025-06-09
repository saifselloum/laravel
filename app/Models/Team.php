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

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'project_id',
        'team_leader_id',
        'created_by',
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

    /**
     * The project this team belongs to
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * The team leader
     */
    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'team_leader_id');
    }

    /**
     * The user who created the team
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Members of the team
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_members')
            ->withTimestamps();
    }

    /**
     * Tasks assigned to this team
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Check if a user is a member of the team
     */
    public function isMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists() || 
               $this->team_leader_id === $user->id;
    }

    /**
     * Check if a user can manage the team
     */
    public function canBeManageBy(User $user): bool
    {
        return $this->team_leader_id === $user->id || 
               $this->project->isCreator($user);
    }

    /**
     * Get all users who can be assigned to tasks in this team
     */
    public function getAssignableUsers()
    {
        return $this->members()->get()->merge([$this->leader]);
    }
}
