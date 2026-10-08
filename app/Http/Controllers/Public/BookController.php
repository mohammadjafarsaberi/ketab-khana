<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicBookResource;
use App\Models\Book;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function show(Book $book): Response
    {
        abort_unless($book->is_active, 404);

        $book->load(['author', 'category', 'files', 'favorites']);
        $related = Book::query()
            ->active()
            ->whereKeyNot($book->id)
            ->where(fn ($query) => $query->where('category_id', $book->category_id)->orWhere('author_id', $book->author_id))
            ->with(['author', 'category', 'files', 'favorites'])
            ->limit(4)
            ->get();

        return Inertia::render('public/books/show', [
            'book' => (new PublicBookResource($book))->resolve(request()),
            'relatedBooks' => PublicBookResource::collection($related)->resolve(request()),
        ]);
    }
}
