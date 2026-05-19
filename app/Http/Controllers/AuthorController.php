<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\AuthorRequest;
use App\Http\Resources\AuthorResource;
use App\Models\Author;
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
     * Store a newly created resource in storage.
     */
    public function store(AuthorRequest $request)
    {
        Author::create($request->validated());

        Inertia::flash('success', 'Author created successfully.');

        return redirect()->route('authors.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Author $author) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Author $author)
    {
        return Inertia::render('Admin/Author/Edit', ['author' => new AuthorResource($author)]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AuthorRequest $request, Author $author)
    {
        $author->update($request->validated());

        Inertia::flash('success', 'Author updated successfully.');

        return redirect()->route('authors.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Author $author)
    {
        $author->delete();

        Inertia::flash('success', 'Author deleted successfully.');
    }
}
