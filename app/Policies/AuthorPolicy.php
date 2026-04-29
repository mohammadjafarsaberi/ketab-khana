<?php

namespace App\Policies;

use App\Models\Author;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AuthorPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user) {}

    public function view(User $user, Author $author) {}

    public function create(User $user) {}

    public function update(User $user, Author $author) {}

    public function delete(User $user, Author $author) {}

    public function restore(User $user, Author $author) {}

    public function forceDelete(User $user, Author $author) {}
}
