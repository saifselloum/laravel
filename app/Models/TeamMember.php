<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamMember extends Model
{
    use HasFactory;


    protected $fillable = [
        'team_id',
        'user_id',
        'role',
        'is_active',
        'joined_at',
        'added_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'joined_at' => 'datetime',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function addedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    public static function getRoles(): array
    {
        return [
            'contributor' => 'Contributor',
            'reviewer' => 'Reviewer',
            'approver' => 'Approver',
            'manager' => 'Manager',
        ];
    }

    public function getRoleDisplayName(): string
    {
        return self::getRoles()[$this->role] ?? $this->role;
    }
}
