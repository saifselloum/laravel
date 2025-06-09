<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamWorkflowPermission extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'transition_id',
        'allowed_roles',
        'conditions',
        'is_active',
    ];

    protected $casts = [
        'allowed_roles' => 'array',
        'conditions' => 'array',
        'is_active' => 'boolean',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function transition(): BelongsTo
    {
        return $this->belongsTo(WorkflowTransition::class, 'transition_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
