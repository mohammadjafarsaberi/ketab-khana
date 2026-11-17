<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\AdminTableIndexRequest;
use App\Http\Resources\BookDownloadResource;
use App\Models\BookDownload;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class BookDownloadController extends Controller
{
    public function index(AdminTableIndexRequest $request)
    {
        $search = $request->string('search')->trim()->toString();

        $downloads = QueryBuilder::for(BookDownload::class)
            ->when($search !== '', fn (Builder $query) => $query->where(function (Builder $query) use ($search): void {
                $query->whereHas('book', fn (Builder $book) => $book->whereLike('title', "%{$search}%"))
                    ->orWhereHas('user', fn (Builder $user) => $user->where(function (Builder $user) use ($search): void {
                        $user->whereLike('name', "%{$search}%")->orWhereLike('email', "%{$search}%");
                    }))
                    ->orWhereHas('file', fn (Builder $file) => $file->where(function (Builder $file) use ($search): void {
                        $file->whereLike('format', "%{$search}%")->orWhereLike('file_name', "%{$search}%");
                    }));

                if (ctype_digit($search)) {
                    $query->orWhere('id', (int) $search);
                }

                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $search) === 1) {
                    $query->orWhereDate('downloaded_at', $search);
                }
            }))
            ->with(['book', 'file', 'user'])
            ->allowedSorts('id', 'downloaded_at', 'created_at')
            ->defaultSort('-downloaded_at')
            ->paginate($request->integer('per_page', 10))
            ->withQueryString();

        return Inertia::render('Admin/BookDownload/Index', [
            'data' => BookDownloadResource::collection($downloads),
            'filters' => ['search' => $search],
        ]);
    }

    public function show(BookDownload $download)
    {
        return Inertia::render('Admin/BookDownload/Show', [
            'bookDownload' => new BookDownloadResource($download->load(['book', 'file', 'user'])),
        ]);
    }
}
