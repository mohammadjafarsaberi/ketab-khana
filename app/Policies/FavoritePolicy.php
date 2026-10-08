<?php

namespace App\Policies;

use App\Models\Favorite;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FavoritePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Favorite $favorite): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Favorite $favorite): bool
    {
        return false;
    }

    public function delete(User $user, Favorite $favorite): bool
    {
        return false;
    }

    public function restore(User $user, Favorite $favorite): bool
    {
        return false;
    }

    public function forceDelete(User $user, Favorite $favorite): bool
    {
        return false;
    }
}
