<?php

use App\Models\Book;
use App\Models\BookDownload;
use App\Models\BookFile;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('guests are redirected to login when downloading a book', function () {
    $book = Book::factory()->create();
    $bookFile = BookFile::factory()->create(['book_id' => $book->id]);

    $this->get(route('books.download', [$book, $bookFile]))
        ->assertRedirect(route('login'));
});

test('a download records activity and increments book and user counters', function () {
    Storage::fake('local');

    $user = User::factory()->create(['total_downloads' => 4, 'last_download_at' => null]);
    $book = Book::factory()->create(['downloads_count' => 9]);
    $bookFile = BookFile::factory()->create([
        'book_id' => $book->id,
        'file_path' => 'books/guide.pdf',
        'file_name' => 'reading-guide.pdf',
        'format' => 'pdf',
    ]);
    Storage::disk('local')->put($bookFile->file_path, 'book contents');

    $response = $this->actingAs($user)->get(route('books.download', [$book, $bookFile]));

    $response->assertDownload('reading-guide.pdf');

    $download = BookDownload::query()->sole();

    expect($download->user_id)->toBe($user->id)
        ->and($download->book_id)->toBe($book->id)
        ->and($download->book_file_id)->toBe($bookFile->id)
        ->and($download->downloaded_at)->not->toBeNull()
        ->and($book->refresh()->downloads_count)->toBe(10)
        ->and($user->refresh()->total_downloads)->toBe(5)
        ->and($user->last_download_at)->not->toBeNull();
});

test('a file from another book cannot be downloaded through a mismatched route', function () {
    Storage::fake('local');

    $user = User::factory()->create(['total_downloads' => 0]);
    $book = Book::factory()->create(['downloads_count' => 0]);
    $otherBook = Book::factory()->create();
    $bookFile = BookFile::factory()->create([
        'book_id' => $otherBook->id,
        'file_path' => 'books/other.pdf',
    ]);
    Storage::disk('local')->put($bookFile->file_path, 'book contents');

    $this->actingAs($user)
        ->get(route('books.download', [$book, $bookFile]))
        ->assertNotFound();

    expect(BookDownload::query()->count())->toBe(0)
        ->and($book->refresh()->downloads_count)->toBe(0)
        ->and($user->refresh()->total_downloads)->toBe(0);
});

test('inactive books cannot be downloaded', function () {
    Storage::fake('local');

    $user = User::factory()->create(['total_downloads' => 0]);
    $book = Book::factory()->create(['is_active' => false, 'downloads_count' => 0]);
    $bookFile = BookFile::factory()->create([
        'book_id' => $book->id,
        'file_path' => 'books/inactive.pdf',
    ]);
    Storage::disk('local')->put($bookFile->file_path, 'book contents');

    $this->actingAs($user)
        ->get(route('books.download', [$book, $bookFile]))
        ->assertNotFound();

    expect(BookDownload::query()->count())->toBe(0)
        ->and($book->refresh()->downloads_count)->toBe(0)
        ->and($user->refresh()->total_downloads)->toBe(0);
});

test('missing private files return not found without recording a download', function () {
    Storage::fake('local');

    $user = User::factory()->create(['total_downloads' => 0]);
    $book = Book::factory()->create(['downloads_count' => 0]);
    $bookFile = BookFile::factory()->create([
        'book_id' => $book->id,
        'file_path' => 'books/missing.pdf',
    ]);

    $this->actingAs($user)
        ->get(route('books.download', [$book, $bookFile]))
        ->assertNotFound();

    expect(BookDownload::query()->count())->toBe(0)
        ->and($book->refresh()->downloads_count)->toBe(0)
        ->and($user->refresh()->total_downloads)->toBe(0);
});
