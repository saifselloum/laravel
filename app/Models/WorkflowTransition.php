<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkflowTransition extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_state_id',
        'to_state_id',
        'name',
        'description',
        'conditions',
        'requires_approval',
        'is_active',
    ];

    protected $casts = [
        'conditions' => 'array',
        'requires_approval' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function fromState(): BelongsTo
    {
        return $this->belongsTo(WorkflowState::class, 'from_state_id');
    }

    public function toState(): BelongsTo
    {
        return $this->belongsTo(WorkflowState::class, 'to_state_id');
    }

    public function teamPermissions(): HasMany
    {
        return $this->hasMany(TeamWorkflowPermission::class, 'transition_id');
    }

    public function workflowLogs(): HasMany
    {
        return $this->hasMany(TaskWorkflowLog::class, 'transition_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function canBePerformedBy(User $user, Team $team): bool
    {
        $permission = $this->teamPermissions()
            ->where('team_id', $team->id)
            ->where('is_active', true)
            ->first();

        if (!$permission) {
            return false;
        }

        $userRole = $team->getMemberRole($user);
        return $userRole && in_array($userRole, $permission->allowed_roles);
    }
}
