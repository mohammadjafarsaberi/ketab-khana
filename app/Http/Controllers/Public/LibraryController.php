<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicBookResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LibraryController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $favorites = $request->user()->favorites()
            ->whereHas('book', fn ($query) => $query->active())
            ->with(['book.author', 'book.category', 'book.files', 'book.favorites'])
            ->latest()->get()->pluck('book');

        $downloads = $request->user()->downloads()
            ->whereHas('book', fn ($query) => $query->active())
            ->with(['book.author', 'book.category', 'book.files', 'book.favorites', 'file'])
            ->latest('downloaded_at')->limit(30)->get()
            ->map(fn ($download) => [
                'id' => $download->id,
                'downloaded_at' => $download->downloaded_at?->toISOString(),
                'format' => $download->file?->format,
                'book' => (new PublicBookResource($download->book))->resolve($request),
            ]);

        return Inertia::render('public/library/index', [
            'favorites' => PublicBookResource::collection($favorites)->resolve($request),
            'downloads' => $downloads,
        ]);
    }
}
