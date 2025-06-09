<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'description',
        'status',
        'due_date',
        'image_path',
        'created_by',
        'updated_by',
        'assigned_user_id',
        'priority',
    ];
    
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }
    
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
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
     * Members of the project (using pivot table)
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_members')
            ->withPivot('role')
            ->withTimestamps();
    }
    
    /**
     * All project members including the creator
     */
    public function allMembers()
    {
        $members = $this->members()->get();
        $creator = $this->createdBy;
        
        // Add creator to members if not already included
        if ($creator && !$members->contains('id', $creator->id)) {
            $creator->pivot = (object) ['role' => 'owner'];
            $members->prepend($creator);
        }
        
        return $members;
    }
    
    /**
     * Teams in the project
     */
    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }
    
    /**
     * Invitations to the project
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(ProjectInvitation::class);
    }
    
    /**
     * Check if a user is the creator of the project
     */
    public function isCreator(User $user): bool
    {
        return $this->created_by === $user->id;
    }
    
    /**
     * Check if a user is a member of the project
     */
    public function isMember(User $user): bool
    {
        // Check if user is the creator
        if ($this->isCreator($user)) {
            return true;
        }
        
        // Check if user is in the members pivot table
        return $this->members()->where('user_id', $user->id)->exists();
    }
    
    /**
     * Check if a user can access the project
     */
    public function canBeAccessedBy(User $user): bool
    {
        return $this->isCreator($user) || $this->isMember($user);
    }
    
    /**
     * Check if a user can manage the project
     */
    public function canBeManageBy(User $user): bool
    {
        return $this->isCreator($user);
    }
    
    /**
     * Get all users who can be assigned to tasks in this project
     */
    public function getAssignableUsers()
    {
        return $this->allMembers();
    }
}
