<?php

use App\Models\Author;
use App\Models\Book;
use App\Models\BookDownload;
use App\Models\BookFile;
use App\Models\BookReview;
use App\Models\Category;
use App\Models\Favorite;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    config(['app.key' => 'base64:MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=']);

    $admin = User::factory()->create();
    $admin->assignRole(Role::findOrCreate('admin'));
    $this->actingAs($admin);
});

test('remaining admin tables search their visible and related columns', function () {
    $category = Category::factory()->create(['name' => 'Technical']);
    $otherCategory = Category::factory()->create(['name' => 'History']);
    $author = Author::factory()->create(['name' => 'Ada Search', 'bio' => 'Quasar researcher']);
    $otherAuthor = Author::factory()->create(['name' => 'Other Writer', 'bio' => 'Unrelated biography']);
    $book = Book::factory()->create([
        'title' => 'Nebula Manual',
        'author_id' => $author->id,
        'category_id' => $category->id,
    ]);
    $otherBook = Book::factory()->create([
        'title' => 'Ordinary History',
        'author_id' => $otherAuthor->id,
        'category_id' => $otherCategory->id,
    ]);
    $file = BookFile::factory()->create([
        'book_id' => $book->id,
        'file_name' => 'archive-special.epub',
        'format' => 'epub',
    ]);
    $otherFile = BookFile::factory()->create([
        'book_id' => $otherBook->id,
        'file_name' => 'ordinary.pdf',
        'format' => 'pdf',
    ]);
    $reader = User::factory()->create([
        'name' => 'Searchable Reader',
        'email' => 'reader-search@example.test',
    ]);
    $otherReader = User::factory()->create([
        'name' => 'Another Member',
        'email' => 'member@example.test',
    ]);
    $download = BookDownload::query()->create([
        'user_id' => $reader->id,
        'book_id' => $book->id,
        'book_file_id' => $file->id,
        'downloaded_at' => now(),
    ]);
    BookDownload::query()->create([
        'user_id' => $otherReader->id,
        'book_id' => $otherBook->id,
        'book_file_id' => $otherFile->id,
        'downloaded_at' => now(),
    ]);
    $review = BookReview::query()->create([
        'user_id' => $reader->id,
        'book_id' => $book->id,
        'rating' => 5,
        'review_text' => 'A singular review phrase',
        'moderation_status' => 'pending',
    ]);
    BookReview::query()->create([
        'user_id' => $otherReader->id,
        'book_id' => $otherBook->id,
        'rating' => 3,
        'review_text' => 'Nothing relevant here',
        'moderation_status' => 'pending',
    ]);
    $favorite = Favorite::query()->create(['user_id' => $reader->id, 'book_id' => $book->id]);
    Favorite::query()->create(['user_id' => $otherReader->id, 'book_id' => $otherBook->id]);

    $searches = [
        ['admin.authors.index', 'quasar', $author->id],
        ['admin.books.index', 'Nebula', $book->id],
        ['admin.book-files.index', 'archive-special', $file->id],
        ['admin.downloads.index', 'reader-search@example.test', $download->id],
        ['admin.users.index', 'reader-search@example.test', $reader->id],
        ['admin.reviews.index', 'singular review', $review->id],
        ['admin.favorites.index', 'Nebula Manual', $favorite->id],
    ];

    foreach ($searches as [$routeName, $search, $expectedId]) {
        $this->get(route($routeName, ['search' => $search]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('data.data', 1)
                ->where('data.data.0.id', $expectedId)
                ->where('data.meta.total', 1)
                ->where('filters.search', $search));
    }
});
