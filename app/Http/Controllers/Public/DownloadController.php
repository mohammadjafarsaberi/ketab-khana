<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookDownload;
use App\Models\BookFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DownloadController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Book $book, BookFile $bookFile): StreamedResponse
    {
        abort_unless($book->is_active && $bookFile->book_id === $book->id, 404);
        abort_unless(Storage::disk('local')->exists($bookFile->file_path), 404);

        DB::transaction(function () use ($book, $bookFile): void {
            BookDownload::query()->create([
                'user_id' => auth()->id(),
                'book_id' => $book->id,
                'book_file_id' => $bookFile->id,
                'downloaded_at' => now(),
            ]);
            $book->increment('downloads_count');
            auth()->user()->incrementDownloads();
        });

        return Storage::disk('local')->download(
            $bookFile->file_path,
            $bookFile->file_name ?: $book->slug.'.'.$bookFile->format,
        );
    }
}
