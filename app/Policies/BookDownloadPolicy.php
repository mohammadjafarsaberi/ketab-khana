<?php

namespace App\Policies;

use App\Models\BookDownload;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BookDownloadPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, BookDownload $bookDownload): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, BookDownload $bookDownload): bool
    {
        return false;
    }

    public function delete(User $user, BookDownload $bookDownload): bool
    {
        return false;
    }

    public function restore(User $user, BookDownload $bookDownload): bool
    {
        return false;
    }

    public function forceDelete(User $user, BookDownload $bookDownload): bool
    {
        return false;
    }
}
