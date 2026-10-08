<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\ModerateBookReviewRequest;
use App\Http\Resources\BookReviewResource;
use App\Models\BookReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class BookReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = QueryBuilder::for(BookReview::class)
            ->with(['book', 'user', 'approvedBy'])
            ->allowedSorts('id', 'rating', 'is_approved', 'created_at')
            ->defaultSort('-created_at')
            ->paginate($request->query('per_page', 10))
            ->withQueryString();

        return Inertia::render('Admin/BookReview/Index', [
            'data' => BookReviewResource::collection($reviews),
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
