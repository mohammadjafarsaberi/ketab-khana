<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\AuthorRequest;
use App\Http\Resources\AuthorResource;
use App\Models\Author;
use App\Services\FileHandler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class AuthorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $authors = QueryBuilder::for(Author::class)
            ->allowedSorts('id', 'name', 'created_at')
            ->withCount('books')
            ->defaultSort('-created_at')
            ->paginate($request->query('per_page', 10))
            ->withQueryString();

        return Inertia::render('Admin/Author/Index', [
            'data' => AuthorResource::collection($authors),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Author/Create');
    }

    /**
     * Show the profile for a given user.
     */
    public function show(Author $author)
    {
        $author->loadCount('books');

        return Inertia::render('Admin/Author/Show', [
            'author' => new AuthorResource($author),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AuthorRequest $request, FileHandler $fileHandler)
    {
        $validated = $request->validated();

        $author = Author::create([
            'name' => $validated['name'],
            'bio' => $validated['bio'] ?? null,
        ]);

        // Handle Image Upload
        if ($request->hasFile('image')) {
            $author->image = $fileHandler->upload(
                $request->file('image'),
                'authors',
                'author'
            );
            $author->save();
        }

        Inertia::flash('success', 'Author created successfully.');

        return redirect()->route('admin.authors.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Author $author)
    {
        return Inertia::render('Admin/Author/Edit', [
            'author' => new AuthorResource($author),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AuthorRequest $request, Author $author, FileHandler $fileHandler)
    {
        $validated = $request->validated();

        $newImage = $request->hasFile('image')
            ? $fileHandler->upload($request->file('image'), 'authors', 'author')
            : null;
        $oldImage = $author->image;

        $author->update([
            'name' => $validated['name'],
            'bio' => $validated['bio'] ?? null,
            ...($newImage ? ['image' => $newImage] : []),
        ]);

        if ($newImage && $oldImage) {
            $fileHandler->delete($oldImage);
        }

        Inertia::flash('success', 'Author updated successfully.');

        return redirect()->route('admin.authors.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Author $author, FileHandler $fileHandler)
    {
        if ($author->books()->exists()) {
            Inertia::flash('error', 'Cannot delete an author that still has books. Reassign or delete those books first.');

            return redirect()->back();
        }

        // Delete image if exists
        if ($author->image) {
            $fileHandler->delete($author->image);   // since no injection here
        }

        $author->delete();

        Inertia::flash('success', 'Author deleted successfully.');

        return redirect()->back();
    }
}
