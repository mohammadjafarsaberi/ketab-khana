<?php

use App\Models\Author;
use App\Models\Book;
use App\Models\BookFile;
use App\Models\BookReview;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('admin'));
    $this->actingAs($this->admin);
});

test('an administrator can create update and delete an empty category', function () {
    $this->post(route('admin.categories.store'), [
        'name' => 'Technology',
        'description' => 'Technical books',
        'is_active' => true,
    ])->assertRedirect(route('admin.categories.index'));

    $category = Category::query()->where('name', 'Technology')->firstOrFail();

    $this->put(route('admin.categories.update', $category), [
        'name' => 'Computing',
        'description' => 'Updated description',
        'is_active' => false,
    ])->assertRedirect(route('admin.categories.index'));

    expect($category->refresh())->name->toBe('Computing')->is_active->toBeFalse();

    $this->delete(route('admin.categories.destroy', $category))->assertRedirect();
    $this->assertModelMissing($category);
});

test('category validation and relationships prevent invalid destructive changes', function () {
    $this->post(route('admin.categories.store'), ['name' => ''])->assertSessionHasErrors('name');

    $book = Book::factory()->create();

    $this->from(route('admin.categories.index'))
        ->delete(route('admin.categories.destroy', $book->category))
        ->assertRedirect(route('admin.categories.index'));

    $this->assertModelExists($book->category);
});

test('author images are stored replaced and removed with the author', function () {
    Storage::fake('public');

    $this->post(route('admin.authors.store'), [
        'name' => 'Original Author',
        'bio' => 'Biography',
        'image' => UploadedFile::fake()->image('original.jpg'),
    ])->assertRedirect(route('admin.authors.index'));

    $author = Author::query()->where('name', 'Original Author')->firstOrFail();
    $originalImage = $author->image;
    Storage::disk('public')->assertExists($originalImage);

    $this->put(route('admin.authors.update', $author), [
        'name' => 'Updated Author',
        'bio' => 'New biography',
        'image' => UploadedFile::fake()->image('replacement.png'),
    ])->assertRedirect(route('admin.authors.index'));

    $replacementImage = $author->refresh()->image;
    Storage::disk('public')->assertMissing($originalImage);
    Storage::disk('public')->assertExists($replacementImage);

    $this->delete(route('admin.authors.destroy', $author))->assertRedirect();
    Storage::disk('public')->assertMissing($replacementImage);
    $this->assertModelMissing($author);
});

test('books normalize tags and replace their cover image', function () {
    Storage::fake('public');
    $author = Author::factory()->create();
    $category = Category::factory()->create();

    $this->post(route('admin.books.store'), [
        'title' => 'Testing Laravel',
        'slug' => 'testing-laravel',
        'author_id' => $author->id,
        'category_id' => $category->id,
        'language' => 'en',
        'tags' => ' testing, laravel, , pest ',
        'is_active' => true,
        'cover_image' => UploadedFile::fake()->image('first.jpg'),
    ])->assertRedirect(route('admin.books.index'));

    $book = Book::query()->where('slug', 'testing-laravel')->firstOrFail();
    $oldCover = $book->cover_image;
    expect($book->tags)->toBe(['testing', 'laravel', 'pest']);
    Storage::disk('public')->assertExists($oldCover);

    $this->put(route('admin.books.update', $book), [
        'title' => 'Testing Laravel Well',
        'slug' => 'testing-laravel',
        'author_id' => $author->id,
        'category_id' => $category->id,
        'language' => 'fa',
        'tags' => 'updated',
        'is_active' => true,
        'cover_image' => UploadedFile::fake()->image('second.jpg'),
    ])->assertRedirect(route('admin.books.index'));

    $book->refresh();
    expect($book->title)->toBe('Testing Laravel Well')->and($book->tags)->toBe(['updated']);
    Storage::disk('public')->assertMissing($oldCover);
    Storage::disk('public')->assertExists($book->cover_image);
});

test('private book files are stored replaced and deleted', function () {
    Storage::fake('local');
    $book = Book::factory()->create();

    $this->post(route('admin.book-files.store'), [
        'book_id' => $book->id,
        'format' => 'pdf',
        'language' => 'en',
        'file' => UploadedFile::fake()->create('first.pdf', 20, 'application/pdf'),
    ])->assertRedirect(route('admin.book-files.index'));

    $bookFile = BookFile::query()->where('book_id', $book->id)->firstOrFail();
    $oldPath = $bookFile->file_path;
    Storage::disk('local')->assertExists($oldPath);

    $this->put(route('admin.book-files.update', $bookFile), [
        'book_id' => $book->id,
        'format' => 'epub',
        'language' => 'fa',
        'file' => UploadedFile::fake()->create('second.epub', 25, 'application/epub+zip'),
    ])->assertRedirect(route('admin.book-files.index'));

    $newPath = $bookFile->refresh()->file_path;
    Storage::disk('local')->assertMissing($oldPath);
    Storage::disk('local')->assertExists($newPath);

    $this->delete(route('admin.book-files.destroy', $bookFile))->assertRedirect();
    Storage::disk('local')->assertMissing($newPath);
    $this->assertModelMissing($bookFile);
});

test('review moderation records the administrator only for approval', function () {
    $review = BookReview::factory()->create([
        'user_id' => User::factory(),
        'book_id' => Book::factory(),
        'is_approved' => false,
        'approved_by' => null,
        'moderation_status' => 'pending',
    ]);

    $this->put(route('admin.reviews.update', $review), ['status' => 'approved'])
        ->assertRedirect(route('admin.reviews.index'));

    expect($review->refresh())
        ->is_approved->toBeTrue()
        ->moderation_status->toBe('approved')
        ->approved_by->toBe($this->admin->id);

    $this->put(route('admin.reviews.update', $review), ['status' => 'rejected'])
        ->assertRedirect(route('admin.reviews.index'));

    expect($review->refresh())
        ->is_approved->toBeFalse()
        ->moderation_status->toBe('rejected')
        ->approved_by->toBeNull();
});

test('an administrator cannot demote ban or delete their own account', function () {
    $this->from(route('admin.users.edit', $this->admin))
        ->put(route('admin.users.update', $this->admin), [
            'name' => $this->admin->name,
            'email' => $this->admin->email,
            'role' => 'user',
            'is_banned' => true,
        ])->assertRedirect(route('admin.users.edit', $this->admin));

    expect($this->admin->refresh()->is_banned)->toBeFalse()
        ->and($this->admin->hasRole('admin'))->toBeTrue();

    $this->from(route('admin.users.index'))
        ->delete(route('admin.users.destroy', $this->admin))
        ->assertRedirect(route('admin.users.index'));

    $this->assertModelExists($this->admin);
});
