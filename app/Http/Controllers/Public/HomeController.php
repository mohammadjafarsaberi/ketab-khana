<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicBookResource;
use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $bookRelations = ['author', 'category', 'files', 'favorites'];
        $recentBooks = Book::query()->active()->with($bookRelations)->latest()->limit(6)->get();
        $popularBooks = Book::query()->active()->with($bookRelations)->orderByDesc('downloads_count')->limit(8)->get();

        return Inertia::render('public/home', [
            'recentBooks' => PublicBookResource::collection($recentBooks)->resolve(request()),
            'popularBooks' => PublicBookResource::collection($popularBooks)->resolve(request()),
            'categories' => Category::query()->active()->withCount(['books' => fn ($query) => $query->active()])->orderByDesc('books_count')->limit(8)->get(['id', 'name', 'slug']),
            'authors' => Author::query()->whereHas('books', fn ($query) => $query->active())->withCount(['books' => fn ($query) => $query->active()])->orderByDesc('books_count')->limit(6)->get()->map(fn (Author $author) => [
                'id' => $author->id,
                'name' => $author->name,
                'image_url' => $author->image ? Storage::disk('public')->url($author->image) : null,
                'books_count' => $author->books_count,
            ]),
            'languages' => Book::query()->active()->selectRaw('language, count(*) as books_count')->groupBy('language')->orderByDesc('books_count')->get(),
        ]);
    }
}
