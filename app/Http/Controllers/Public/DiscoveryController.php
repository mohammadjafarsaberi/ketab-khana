<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicBookResource;
use App\Models\Author;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DiscoveryController extends Controller
{
    public function category(Category $category): Response
    {
        abort_unless($category->is_active, 404);

        $books = $category->books()->active()->with(['author', 'category', 'files', 'favorites'])->latest()->paginate(12);

        return Inertia::render('public/discovery/category', [
            'category' => $category->only(['id', 'name', 'slug', 'description']),
            'books' => PublicBookResource::collection($books),
        ]);
    }

    public function author(Author $author): Response
    {
        $books = $author->books()->active()->with(['author', 'category', 'files', 'favorites'])->latest()->paginate(12);

        abort_if($books->total() === 0, 404);

        return Inertia::render('public/discovery/author', [
            'author' => [
                ...$author->only(['id', 'name', 'bio']),
                'image_url' => $author->image ? Storage::disk('public')->url($author->image) : null,
            ],
            'books' => PublicBookResource::collection($books),
        ]);
    }
}
