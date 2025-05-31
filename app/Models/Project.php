<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
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
    
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }
    public function tasks(){
        return $this->hasMany(Task::class);
    }
    public function createdBy(){
        return $this->belongsTo(User::class,'created_by');
    }
    public function updatedBy(){
        return $this->belongsTo(User::class,'updated_by');
    }
}
