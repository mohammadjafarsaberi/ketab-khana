<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\BookFileRequest;
use App\Http\Resources\BookFileResource;
use App\Models\Book;
use App\Models\BookFile;
use App\Services\FileHandler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class BookFileController extends Controller
{
    public function index(Request $request)
    {
        $bookFiles = QueryBuilder::for(BookFile::class)
            ->with('book')
            ->allowedSorts('id', 'format', 'language', 'file_size', 'created_at')
            ->defaultSort('-created_at')
            ->paginate($request->query('per_page', 10))
            ->withQueryString();

        return Inertia::render('Admin/BookFile/Index', [
            'data' => BookFileResource::collection($bookFiles),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/BookFile/Create', [
            'books' => Book::query()->orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function store(BookFileRequest $request, FileHandler $fileHandler)
    {
        $validated = $request->validated();
        $file = $request->file('file');

        $validated['file_path'] = $fileHandler->upload($file, 'books', 'book', 'local');
        $validated['file_name'] = $file->getClientOriginalName();
        $validated['file_size'] = $file->getSize();

        unset($validated['file']);

        BookFile::create($validated);

        Inertia::flash('success', 'Book file created successfully.');

        return redirect()->route('admin.book-files.index');
    }

    public function show(BookFile $bookFile)
    {
        return Inertia::render('Admin/BookFile/Show', [
            'bookFile' => new BookFileResource($bookFile->load('book')),
        ]);
    }

    public function edit(BookFile $bookFile)
    {
        return Inertia::render('Admin/BookFile/Edit', [
            'bookFile' => new BookFileResource($bookFile->load('book')),
            'books' => Book::query()->orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function update(BookFileRequest $request, BookFile $bookFile, FileHandler $fileHandler)
    {
        $validated = $request->validated();

        unset($validated['file']);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $oldPath = $bookFile->file_path;
            $validated['file_path'] = $fileHandler->upload($file, 'books', 'book', 'local');
            $validated['file_name'] = $file->getClientOriginalName();
            $validated['file_size'] = $file->getSize();
        }

        $bookFile->update($validated);

        if (isset($oldPath)) {
            $fileHandler->delete($oldPath, 'local');
        }

        Inertia::flash('success', 'Book file updated successfully.');

        return redirect()->route('admin.book-files.index');
    }

    public function destroy(BookFile $bookFile, FileHandler $fileHandler)
    {
        $fileHandler->delete($bookFile->file_path, 'local');
        $bookFile->delete();

        Inertia::flash('success', 'Book file deleted successfully.');

        return redirect()->back();
    }
}
