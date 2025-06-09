<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectInvitationController;
use App\Http\Controllers\TeamController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Public invitation routes (accessible without auth for email links)
Route::get('/invitations/{token}', [ProjectInvitationController::class, 'show'])->name('invitations.show');

Route::middleware(['auth', 'verified'])->group(function () {
    // Projects
    Route::resource('project', ProjectController::class);
    
    // Project Invitations
    Route::prefix('projects/{project}')->group(function () {
        Route::get('/invitations', [ProjectInvitationController::class, 'index'])->name('project.invitations.index');
        Route::get('/invitations/create', [ProjectInvitationController::class, 'create'])->name('project.invitations.create');
        Route::post('/invitations', [ProjectInvitationController::class, 'store'])->name('project.invitations.store');
        Route::delete('/invitations/{invitation}', [ProjectInvitationController::class, 'destroy'])->name('project.invitations.destroy');
        Route::delete('/members/{user}', [ProjectInvitationController::class, 'removeMember'])->name('project.members.remove');
        
        // Teams within projects
        Route::get('/teams', [TeamController::class, 'index'])->name('project.teams.index');
        Route::get('/teams/create', [TeamController::class, 'create'])->name('project.teams.create');
        Route::post('/teams', [TeamController::class, 'store'])->name('project.teams.store');
        Route::get('/teams/{team}', [TeamController::class, 'show'])->name('project.teams.show');
        Route::get('/teams/{team}/edit', [TeamController::class, 'edit'])->name('project.teams.edit');
        Route::put('/teams/{team}', [TeamController::class, 'update'])->name('project.teams.update');
        Route::delete('/teams/{team}', [TeamController::class, 'destroy'])->name('project.teams.destroy');
        Route::post('/teams/{team}/members', [TeamController::class, 'addMember'])->name('project.teams.addMember');
        Route::delete('/teams/{team}/members/{user}', [TeamController::class, 'removeMember'])->name('project.teams.removeMember');
    });
    
    // Invitation acceptance (requires auth)
    Route::post('/invitations/{token}/accept', [ProjectInvitationController::class, 'accept'])->name('invitations.accept');
    Route::post('/invitations/{token}/decline', [ProjectInvitationController::class, 'decline'])->name('invitations.decline');
    
    // Tasks
    Route::resource('task', TaskController::class);
    
    // Task creation helper API routes
    Route::get('/api/task/project/{project}/data', [TaskController::class, 'getProjectData'])->name('task.project-data');
    Route::get('/api/task/team/{team}/data', [TaskController::class, 'getTeamData'])->name('task.team-data');
    
    // Users (Admin only)
    Route::middleware('can:admin-only')->group(function () {
        Route::resource('user', UserController::class);
    });
    
    // Debug routes (remove in production)
    Route::get('/debug/project/{project}/members', [ProjectInvitationController::class, 'debugMembers'])->name('debug.project.members');
});

require __DIR__.'/auth.php';
