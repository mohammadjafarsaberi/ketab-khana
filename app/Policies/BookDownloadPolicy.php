<?php

namespace App\Policies;

use App\Models\BookDownload;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BookDownloadPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user) {}

    public function view(User $user, BookDownload $bookDownload) {}

    public function create(User $user) {}

    public function update(User $user, BookDownload $bookDownload) {}

    public function delete(User $user, BookDownload $bookDownload) {}

    public function restore(User $user, BookDownload $bookDownload) {}

    public function forceDelete(User $user, BookDownload $bookDownload) {}
}
