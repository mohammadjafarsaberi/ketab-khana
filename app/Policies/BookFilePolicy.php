<?php

namespace App\Policies;

use App\Models\BookFile;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BookFilePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user) {}

    public function view(User $user, BookFile $bookFile) {}

    public function create(User $user) {}

    public function update(User $user, BookFile $bookFile) {}

    public function delete(User $user, BookFile $bookFile) {}

    public function restore(User $user, BookFile $bookFile) {}

    public function forceDelete(User $user, BookFile $bookFile) {}
}
