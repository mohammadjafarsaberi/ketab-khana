<?php

namespace App\Policies;

use App\Models\Favorite;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FavoritePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user) {}

    public function view(User $user, Favorite $favorite) {}

    public function create(User $user) {}

    public function update(User $user, Favorite $favorite) {}

    public function delete(User $user, Favorite $favorite) {}

    public function restore(User $user, Favorite $favorite) {}

    public function forceDelete(User $user, Favorite $favorite) {}
}
