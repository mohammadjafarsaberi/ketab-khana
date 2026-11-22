<?php

use App\Models\Author;
use App\Models\Book;
use App\Models\BookFile;
use App\Models\Category;

test('active non-deleted books are eligible for search indexing', function () {
    $active = Book::factory()->create(['is_active' => true]);
    $inactive = Book::factory()->create(['is_active' => false]);
    $deleted = Book::factory()->create(['is_active' => true]);
    $deleted->delete();

    expect($active->shouldBeSearchable())->toBeTrue()
        ->and($inactive->shouldBeSearchable())->toBeFalse()
        ->and($deleted->shouldBeSearchable())->toBeFalse();
});

test('book search documents contain normalized related and sortable data', function () {
    $author = Author::factory()->create(['name' => 'Search Author']);
    $category = Category::factory()->create(['name' => 'Search Category']);
    $book = Book::factory()->create([
        'author_id' => $author->id,
        'category_id' => $category->id,
        'title' => 'Indexed Book',
        'description' => null,
        'isbn' => null,
        'language' => 'ps',
        'tags' => ['history', 'culture'],
        'published_year' => 2020,
        'downloads_count' => 42,
    ]);
    BookFile::factory()->create(['book_id' => $book->id, 'format' => 'pdf']);
    BookFile::factory()->create(['book_id' => $book->id, 'format' => 'pdf']);
    BookFile::factory()->create(['book_id' => $book->id, 'format' => 'epub']);

    $searchable = $book->toSearchableArray();

    expect($searchable)->toMatchArray([
        'id' => (string) $book->id,
        'title' => 'Indexed Book',
        'description' => '',
        'isbn' => '',
        'author_id' => $author->id,
        'author' => 'Search Author',
        'category_id' => $category->id,
        'category' => 'Search Category',
        'language' => 'ps',
        'tags' => ['history', 'culture'],
        'formats' => ['pdf', 'epub'],
        'published_year' => 2020,
        'downloads_count' => 42,
    ])->and($searchable['created_at'])->toBeInt();
});
