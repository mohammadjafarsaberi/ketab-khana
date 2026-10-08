<?php

namespace App\Policies;

use App\Models\BookReview;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BookReviewPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, BookReview $bookReview): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, BookReview $bookReview): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, BookReview $bookReview): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, BookReview $bookReview): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, BookReview $bookReview): bool
    {
        return $user->isAdmin();
    }
}
