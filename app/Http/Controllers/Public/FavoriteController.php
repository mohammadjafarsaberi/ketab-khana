<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\RedirectResponse;

class FavoriteController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Book $book): RedirectResponse
    {
        abort_unless($book->is_active, 404);

        $favorite = auth()->user()->favorites()->where('book_id', $book->id)->first();

        if ($favorite) {
            $favorite->delete();

            return back()->with('success', 'Removed from your library.');
        }

        auth()->user()->favorites()->create(['book_id' => $book->id]);

        return back()->with('success', 'Saved to your library.');
    }
}
