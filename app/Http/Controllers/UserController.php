<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCrudResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Only admins can view user list
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Only administrators can access user management');
        }
        
        $query = User::query();
        $sortField = request('sort_field', "created_at");
        $sortDirection = request('sort_direction', "desc");

        if(request('name')){
            $query->where('name', 'like', '%'.request('name').'%');
        }
        
        if(request('email')){
            $query->where('email', 'like', '%'.request('email').'%');
        }

        $users = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);
            
        return inertia('User/Index', [
            "users" => UserCrudResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Only admins can create users
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Only administrators can create users');
        }
        
        return inertia('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // Only admins can create users
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Only administrators can create users');
        }
        
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        
        User::create($data);
        
        return to_route('user.index')->with('success', 'User was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // Only admins can view user details
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Only administrators can view user details');
        }
        
        return inertia('User/Show', [
            'user' => new UserCrudResource($user),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        // Only admins can edit users
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Only administrators can edit users');
        }
        
        return inertia('User/Edit', [
            'user' => new UserCrudResource($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        // Only admins can update users
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Only administrators can update users');
        }
        
        $data = $request->validated();
        
        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        
        $user->update($data);
        
        return to_route('user.index')
            ->with('success', "User \"$user->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Only admins can delete users
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Only administrators can delete users');
        }
        
        // Prevent self-deletion
        if ($user->id === Auth::id()) {
            abort(400, 'You cannot delete your own account');
        }
        
        $name = $user->name;
        $user->delete();
        
        return to_route('user.index')
            ->with('success', "User \"$name\" was deleted");
    }
}
