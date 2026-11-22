<?php

use App\Models\Book;
use App\Models\BookDownload;
use App\Models\BookFile;
use App\Models\Favorite;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login when favoriting a book or viewing the library', function () {
    $book = Book::factory()->create();

    $this->post(route('books.favorite', $book))->assertRedirect(route('login'));
    $this->get(route('library.index'))->assertRedirect(route('login'));
});

test('users can add and remove an active book from their favorites', function () {
    $user = User::factory()->create();
    $book = Book::factory()->create(['is_active' => true]);

    $this->actingAs($user)
        ->from(route('books.show', $book))
        ->post(route('books.favorite', $book))
        ->assertRedirect(route('books.show', $book))
        ->assertSessionHas('success', 'Saved to your library.');

    $favorite = Favorite::query()->whereBelongsTo($user)->whereBelongsTo($book)->sole();
    $this->assertModelExists($favorite);

    $this->actingAs($user)
        ->from(route('books.show', $book))
        ->post(route('books.favorite', $book))
        ->assertRedirect(route('books.show', $book))
        ->assertSessionHas('success', 'Removed from your library.');

    $this->assertModelMissing($favorite);
});

test('inactive books cannot be favorited', function () {
    $user = User::factory()->create();
    $book = Book::factory()->create(['is_active' => false]);

    $this->actingAs($user)
        ->post(route('books.favorite', $book))
        ->assertNotFound();

    expect(Favorite::query()->count())->toBe(0);
});

test('the library contains only the current users active favorites and downloads', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $favoriteBook = Book::factory()->create(['title' => 'Owned favorite', 'is_active' => true]);
    $downloadedBook = Book::factory()->create(['title' => 'Owned download', 'is_active' => true]);
    $inactiveBook = Book::factory()->create(['title' => 'Inactive owned book', 'is_active' => false]);
    $otherBook = Book::factory()->create(['title' => 'Another users book', 'is_active' => true]);

    Favorite::query()->create(['user_id' => $user->id, 'book_id' => $favoriteBook->id]);
    Favorite::query()->create(['user_id' => $user->id, 'book_id' => $inactiveBook->id]);
    Favorite::query()->create(['user_id' => $otherUser->id, 'book_id' => $otherBook->id]);

    $downloadedFile = BookFile::factory()->create(['book_id' => $downloadedBook->id, 'format' => 'epub']);
    $inactiveFile = BookFile::factory()->create(['book_id' => $inactiveBook->id]);
    $otherFile = BookFile::factory()->create(['book_id' => $otherBook->id]);

    BookDownload::query()->create([
        'user_id' => $user->id,
        'book_id' => $downloadedBook->id,
        'book_file_id' => $downloadedFile->id,
        'downloaded_at' => now(),
    ]);
    BookDownload::query()->create([
        'user_id' => $user->id,
        'book_id' => $inactiveBook->id,
        'book_file_id' => $inactiveFile->id,
        'downloaded_at' => now()->subMinute(),
    ]);
    BookDownload::query()->create([
        'user_id' => $otherUser->id,
        'book_id' => $otherBook->id,
        'book_file_id' => $otherFile->id,
        'downloaded_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('library.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/library/index')
            ->has('favorites', 1)
            ->where('favorites.0.id', $favoriteBook->id)
            ->where('favorites.0.is_favorited', true)
            ->has('downloads', 1)
            ->where('downloads.0.book.id', $downloadedBook->id)
            ->where('downloads.0.format', 'epub'));
});
