<?php

namespace App\Policies;

use App\Models\BookFile;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BookFilePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, BookFile $bookFile): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, BookFile $bookFile): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, BookFile $bookFile): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, BookFile $bookFile): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, BookFile $bookFile): bool
    {
        return $user->isAdmin();
    }
}
