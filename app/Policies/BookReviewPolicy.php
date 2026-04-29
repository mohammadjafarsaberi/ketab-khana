<?php

namespace App\Policies;

use App\Models\BookReview;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BookReviewPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user) {}

    public function view(User $user, BookReview $bookReview) {}

    public function create(User $user) {}

    public function update(User $user, BookReview $bookReview) {}

    public function delete(User $user, BookReview $bookReview) {}

    public function restore(User $user, BookReview $bookReview) {}

    public function forceDelete(User $user, BookReview $bookReview) {}
}
