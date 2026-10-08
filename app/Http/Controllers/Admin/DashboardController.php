<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookDownloadResource;
use App\Models\Author;
use App\Models\Book;
use App\Models\BookDownload;
use App\Models\BookFile;
use App\Models\BookReview;
use App\Models\Category;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $recentDownloads = BookDownload::query()
            ->with(['book', 'file', 'user'])
            ->latest('downloaded_at')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'books' => Book::query()->count(),
                'book_files' => BookFile::query()->count(),
                'authors' => Author::query()->count(),
                'categories' => Category::query()->count(),
                'users' => User::query()->count(),
                'pending_reviews' => BookReview::query()->where('is_approved', false)->count(),
                'downloads' => BookDownload::query()->count(),
            ],
            'recentDownloads' => BookDownloadResource::collection($recentDownloads),
        ]);
    }
}
