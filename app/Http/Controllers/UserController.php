<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = QueryBuilder::for(User::class)
            ->with('roles')
            ->withCount(['downloads', 'favorites', 'reviews'])
            ->allowedSorts('id', 'name', 'email', 'total_downloads', 'is_banned', 'created_at')
            ->defaultSort('-created_at')
            ->paginate($request->query('per_page', 10))
            ->withQueryString();

        return Inertia::render('Admin/User/Index', [
            'data' => UserResource::collection($users),
        ]);
    }

    public function show(User $user)
    {
        $user->loadCount(['downloads', 'favorites', 'reviews']);

        return Inertia::render('Admin/User/Show', [
            'user' => new UserResource($user),
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/User/Edit', [
            'user' => new UserResource($user),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();
        $validated['is_banned'] = $request->boolean('is_banned');
        $role = $validated['role'];
        unset($validated['role']);

        if ($request->user()->is($user) && ($validated['is_banned'] || $role !== 'admin')) {
            return back()->with('error', 'You cannot ban or demote your own account.');
        }

        if ($user->hasRole('admin') && $role !== 'admin' && User::role('admin')->count() <= 1) {
            return back()->with('error', 'The final administrator cannot be demoted.');
        }

        if (blank($validated['password'] ?? null)) {
            unset($validated['password']);
        }

        $user->update($validated);
        $user->syncRoles([$role]);

        Inertia::flash('success', 'User updated successfully.');

        return redirect()->route('admin.users.index');
    }

    public function destroy(User $user)
    {
        if (request()->user()->is($user)) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        if ($user->hasRole('admin') && User::role('admin')->count() <= 1) {
            return back()->with('error', 'The final administrator cannot be deleted.');
        }

        $user->delete();

        Inertia::flash('success', 'User deleted successfully.');

        return redirect()->back();
    }
}
