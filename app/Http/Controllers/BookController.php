<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\BookRequest;
use App\Http\Resources\BookResource;
use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use App\Services\FileHandler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $books = QueryBuilder::for(Book::class)
            ->with(['author', 'category'])
            ->withCount(['files', 'reviews', 'favorites'])
            ->allowedSorts('id', 'title', 'language', 'downloads_count', 'created_at')
            ->defaultSort('-created_at')
            ->paginate($request->query('per_page', 10))
            ->withQueryString();

        return Inertia::render('Admin/Book/Index', [
            'data' => BookResource::collection($books),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Book/Create', [
            'authors' => Author::query()->orderBy('name')->get(['id', 'name']),
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(BookRequest $request, FileHandler $fileHandler)
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active');
        $validated['tags'] = $this->normalizeTags($validated['tags'] ?? null);

        unset($validated['cover_image']);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $fileHandler->upload($request->file('cover_image'), 'covers', 'cover');
        }

        Book::create($validated);

        Inertia::flash('success', 'Book created successfully.');

        return redirect()->route('admin.books.index');
    }

    public function show(Book $book)
    {
        $book->load(['author', 'category', 'files', 'reviews.user']);
        $book->loadCount(['files', 'reviews', 'favorites']);

        return Inertia::render('Admin/Book/Show', [
            'book' => new BookResource($book),
        ]);
    }

    public function edit(Book $book)
    {
        return Inertia::render('Admin/Book/Edit', [
            'book' => new BookResource($book->load(['author', 'category'])),
            'authors' => Author::query()->orderBy('name')->get(['id', 'name']),
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(BookRequest $request, Book $book, FileHandler $fileHandler)
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active');
        $validated['tags'] = $this->normalizeTags($validated['tags'] ?? null);

        unset($validated['cover_image']);

        if ($request->hasFile('cover_image')) {
            $oldCoverImage = $book->cover_image;
            $validated['cover_image'] = $fileHandler->upload($request->file('cover_image'), 'covers', 'cover');
        }

        $book->update($validated);

        if (isset($oldCoverImage) && $oldCoverImage) {
            $fileHandler->delete($oldCoverImage);
        }

        Inertia::flash('success', 'Book updated successfully.');

        return redirect()->route('admin.books.index');
    }

    public function destroy(Book $book)
    {
        $book->delete();

        Inertia::flash('success', 'Book deleted successfully.');

        return redirect()->back();
    }

    private function normalizeTags(?string $tags): ?array
    {
        if (! $tags) {
            return null;
        }

        return collect(explode(',', $tags))
            ->map(fn (string $tag): string => trim($tag))
            ->filter()
            ->values()
            ->all();
    }
}
