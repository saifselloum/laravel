<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_path',
        'status',
        'priority',
        'due_date',
        'assigned_user_id',
        'created_by',
        'updated_by',
        'project_id',
        'team_id',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Check if a user can be assigned to this task
     */
    public function canBeAssignedTo(User $user): bool
    {
        // If task belongs to a team, user must be in that team
        if ($this->team_id) {
            return $this->team->isMember($user);
        }
        
        // Otherwise, user must be a project member or creator
        return $this->project->canBeAccessedBy($user);
    }

    /**
     * Check if a user can manage this task
     */
    public function canBeManageBy(User $user): bool
    {
        // Project creator can manage all tasks
        if ($this->project->isCreator($user)) {
            return true;
        }
        
        // Team leader can manage team tasks
        if ($this->team_id && $this->team->team_leader_id === $user->id) {
            return true;
        }
        
        // Task creator can manage their own tasks
        return $this->created_by === $user->id;
    }
}
