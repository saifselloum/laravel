<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskWorkflowController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkflowController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/register');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('project', ProjectController::class);
    Route::get('/task/my-tasks', [TaskController::class, 'myTasks'])
        ->name('task.myTasks');
    Route::resource('task', TaskController::class);
    Route::resource('user', UserController::class);
    
    // Team routes
    Route::resource('teams', TeamController::class);
    Route::post('teams/{team}/members', [TeamController::class, 'addMember'])->name('teams.add-member');
    Route::delete('teams/{team}/members/{user}', [TeamController::class, 'removeMember'])->name('teams.remove-member');
    Route::patch('teams/{team}/members/{user}/role', [TeamController::class, 'updateMemberRole'])->name('teams.update-member-role');
    
    // Workflow routes
    Route::get('/workflow', [WorkflowController::class, 'index'])->name('workflow.index');
    Route::get('/workflow/teams/{team}', [WorkflowController::class, 'configure'])->name('workflow.configure');
    Route::patch('/workflow/teams/{team}/permissions', [WorkflowController::class, 'updatePermissions'])->name('workflow.update-permissions');
    
    // Task workflow routes
    Route::post('tasks/{task}/transition', [TaskWorkflowController::class, 'transition'])->name('tasks.transition');
    Route::get('tasks/{task}/workflow/history', [TaskWorkflowController::class, 'history'])->name('tasks.workflow.history');
    Route::get('tasks/{task}/workflow/transitions', [TaskWorkflowController::class, 'availableTransitions'])->name('tasks.workflow.transitions');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
