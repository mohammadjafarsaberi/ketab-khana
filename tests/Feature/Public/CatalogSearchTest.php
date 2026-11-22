<?php

use App\Models\Author;
use App\Models\Book;
use App\Models\BookFile;
use App\Models\Category;
use Illuminate\Support\Facades\Log;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Scout\EngineManager;
use Laravel\Scout\Engines\Engine;

test('catalog searches every supported database text field and excludes inactive books', function (string $field, string $term) {
    $author = Author::factory()->create(['name' => $field === 'author' ? $term : 'Target Author']);
    $category = Category::factory()->create(['name' => $field === 'category' ? $term : 'Target Category']);
    $book = Book::factory()->create([
        'author_id' => $author->id,
        'category_id' => $category->id,
        'title' => $field === 'title' ? $term : 'Target Book',
        'isbn' => $field === 'isbn' ? $term : '9780000000001',
        'description' => $field === 'description' ? "Contains {$term}" : 'Target description',
    ]);
    $otherCategory = Category::factory()->create(['name' => 'Other Category']);
    $otherAuthor = Author::factory()->create(['name' => 'Other Author']);
    Book::factory()->create([
        'title' => $term,
        'author_id' => $otherAuthor->id,
        'category_id' => $otherCategory->id,
        'is_active' => false,
    ]);
    Book::factory()->create([
        'title' => 'Unrelated book',
        'author_id' => $otherAuthor->id,
        'category_id' => $otherCategory->id,
    ]);

    $this->getJson(route('books.search', ['query' => $term]))
        ->assertOk()
        ->assertJsonPath('engine', 'database')
        ->assertJsonPath('meta.total', 1)
        ->assertJsonPath('data.0.id', $book->id);
})->with([
    'title' => ['title', 'Needle Title'],
    'ISBN' => ['isbn', '9781234567890'],
    'description' => ['description', 'singular-description-needle'],
    'author' => ['author', 'Distinctive Author'],
    'category' => ['category', 'Distinctive Category'],
]);

test('catalog combines category author language format and publication year filters', function () {
    $author = Author::factory()->create();
    $category = Category::factory()->create();
    $book = Book::factory()->create([
        'author_id' => $author->id,
        'category_id' => $category->id,
        'language' => 'fa',
        'published_year' => 2018,
    ]);
    BookFile::factory()->create(['book_id' => $book->id, 'format' => 'epub']);
    Book::factory()->count(2)->create();

    $this->getJson(route('books.search', [
        'category' => $category->id,
        'author' => $author->id,
        'language' => 'fa',
        'format' => 'epub',
        'year_from' => 2015,
        'year_to' => 2020,
    ]))
        ->assertOk()
        ->assertJsonPath('meta.total', 1)
        ->assertJsonPath('data.0.id', $book->id);
});

test('catalog applies supported sorting modes', function (string $sort, array $expectedTitles) {
    Book::factory()->create(['title' => 'Zulu', 'downloads_count' => 10, 'created_at' => now()->subDays(2)]);
    Book::factory()->create(['title' => 'Alpha', 'downloads_count' => 100, 'created_at' => now()]);

    $response = $this->getJson(route('books.search', ['sort' => $sort]))->assertOk();

    expect(collect($response->json('data'))->pluck('title')->all())->toBe($expectedTitles);
})->with([
    'newest' => ['newest', ['Alpha', 'Zulu']],
    'popular' => ['popular', ['Alpha', 'Zulu']],
    'title' => ['title', ['Alpha', 'Zulu']],
]);

test('catalog paginates and preserves validated filters', function () {
    Book::factory()->count(13)->create(['language' => 'en']);

    $this->get(route('books.index', ['language' => 'en', 'page' => 2, 'per_page' => 12]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/books/index')
            ->has('books.data', 1)
            ->where('books.meta.current_page', 2)
            ->where('books.meta.total', 13)
            ->where('filters.language', 'en')
            ->where('filters.per_page', '12'));
});

test('catalog exposes only active filter options with active books', function () {
    $activeCategory = Category::factory()->create(['name' => 'Active Shelf']);
    $inactiveCategory = Category::factory()->create(['name' => 'Hidden Shelf', 'is_active' => false]);
    $listedAuthor = Author::factory()->create(['name' => 'Listed Author']);
    $hiddenAuthor = Author::factory()->create(['name' => 'Hidden Author']);
    Book::factory()->create(['category_id' => $activeCategory->id, 'author_id' => $listedAuthor->id]);
    Book::factory()->create(['category_id' => $inactiveCategory->id, 'author_id' => $hiddenAuthor->id, 'is_active' => false]);

    $this->get(route('books.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('filterOptions.categories', 1)
            ->where('filterOptions.categories.0.id', $activeCategory->id)
            ->has('filterOptions.authors', 1)
            ->where('filterOptions.authors.0.id', $listedAuthor->id));
});

test('catalog rejects invalid filters', function (array $filters, string $error) {
    $this->getJson(route('books.search', $filters))
        ->assertUnprocessable()
        ->assertJsonValidationErrors($error);
})->with([
    'unknown category' => [['category' => 999999], 'category'],
    'unsupported language' => [['language' => 'de'], 'language'],
    'unsupported format' => [['format' => 'docx'], 'format'],
    'inverted years' => [['year_from' => 2020, 'year_to' => 2010], 'year_to'],
    'unsupported sort' => [['sort' => 'random'], 'sort'],
    'unsupported page size' => [['per_page' => 10], 'per_page'],
]);

test('catalog falls back to database search when typesense fails', function () {
    $book = Book::factory()->create(['title' => 'Fallback Result']);
    $engine = Mockery::mock(Engine::class);
    $engine->shouldReceive('paginate')->once()->andThrow(new RuntimeException('Typesense unavailable'));

    config(['scout.driver' => 'typesense']);
    app(EngineManager::class)->forgetDrivers();
    app(EngineManager::class)->extend('typesense', fn () => $engine);
    Log::spy();

    $this->getJson(route('books.search', ['query' => 'Fallback Result']))
        ->assertOk()
        ->assertJsonPath('engine', 'database')
        ->assertJsonPath('meta.total', 1)
        ->assertJsonPath('data.0.id', $book->id);

    Log::shouldHaveReceived('warning')->once()->with(
        'Typesense book search failed; using the database fallback.',
        Mockery::on(fn (array $context): bool => $context['exception'] === 'Typesense unavailable'),
    );
});
