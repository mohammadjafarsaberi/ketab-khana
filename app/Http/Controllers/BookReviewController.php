<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\AdminTableIndexRequest;
use App\Http\Requests\Admin\ModerateBookReviewRequest;
use App\Http\Resources\BookReviewResource;
use App\Models\BookReview;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class BookReviewController extends Controller
{
    public function index(AdminTableIndexRequest $request)
    {
        $search = $request->string('search')->trim()->toString();

        $reviews = QueryBuilder::for(BookReview::class)
            ->when($search !== '', fn (Builder $query) => $query->where(function (Builder $query) use ($search): void {
                $query->whereLike('review_text', "%{$search}%")
                    ->orWhereLike('moderation_status', "%{$search}%")
                    ->orWhereHas('book', fn (Builder $book) => $book->whereLike('title', "%{$search}%"))
                    ->orWhereHas('user', fn (Builder $user) => $user->where(function (Builder $user) use ($search): void {
                        $user->whereLike('name', "%{$search}%")->orWhereLike('email', "%{$search}%");
                    }));

                if (ctype_digit($search)) {
                    $query->orWhere('id', (int) $search);

                    if ((int) $search >= 1 && (int) $search <= 5) {
                        $query->orWhere('rating', (int) $search);
                    }
                }
            }))
            ->with(['book', 'user', 'approvedBy'])
            ->allowedSorts('id', 'rating', 'is_approved', 'created_at')
            ->defaultSort('-created_at')
            ->paginate($request->integer('per_page', 10))
            ->withQueryString();

        return Inertia::render('Admin/BookReview/Index', [
            'data' => BookReviewResource::collection($reviews),
            'filters' => ['search' => $search],
        ]);
    }

    public function show(BookReview $review)
    {
        return Inertia::render('Admin/BookReview/Show', [
            'bookReview' => new BookReviewResource($review->load(['book', 'user', 'approvedBy'])),
        ]);
    }

    public function update(ModerateBookReviewRequest $request, BookReview $review)
    {
        $isApproved = $request->validated('status') === 'approved';
        $review->update([
            'is_approved' => $isApproved,
            'moderation_status' => $request->validated('status'),
            'approved_by' => $isApproved ? Auth::id() : null,
        ]);

        Inertia::flash('success', 'Review updated successfully.');

        return redirect()->route('admin.reviews.index');
    }

    public function destroy(BookReview $review)
    {
        $review->delete();

        Inertia::flash('success', 'Review deleted successfully.');

        return redirect()->back();
    }
}
