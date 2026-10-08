<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookDownloadResource;
use App\Models\BookDownload;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class BookDownloadController extends Controller
{
    public function index(Request $request)
    {
        $downloads = QueryBuilder::for(BookDownload::class)
            ->with(['book', 'file', 'user'])
            ->allowedSorts('id', 'downloaded_at', 'created_at')
            ->defaultSort('-downloaded_at')
            ->paginate($request->query('per_page', 10))
            ->withQueryString();

        return Inertia::render('Admin/BookDownload/Index', [
            'data' => BookDownloadResource::collection($downloads),
        ]);
    }

    public function show(BookDownload $download)
    {
        return Inertia::render('Admin/BookDownload/Show', [
            'bookDownload' => new BookDownloadResource($download->load(['book', 'file', 'user'])),
        ]);
    }
}
