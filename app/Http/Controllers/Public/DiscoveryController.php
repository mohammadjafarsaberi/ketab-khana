<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\AuthorDirectoryRequest;
use App\Http\Requests\Public\BookSearchRequest;
use App\Http\Requests\Public\CategoryDirectoryRequest;
use App\Http\Resources\PublicBookResource;
use App\Models\Author;
use App\Models\Category;
use App\Services\BookSearchService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DiscoveryController extends Controller
{
    public function __construct(private readonly BookSearchService $searchService) {}

    public function categories(CategoryDirectoryRequest $request): Response
    {
        $filters = $request->validated();
        $query = Category::query()
            ->active()
            ->whereHas('books', fn (Builder $query) => $query->active())
            ->withCount(['books' => fn (Builder $query) => $query->active()])
            ->withSum(['books as downloads_total' => fn (Builder $query) => $query->active()], 'downloads_count')
            ->with(['books' => fn (HasMany $query) => $query->active()->latest()->limit(3)->select(['id', 'category_id', 'cover_image'])])
            ->when($filters['query'] ?? null, function (Builder $query, string $term): void {
                $query->where(function (Builder $query) use ($term): void {
                    $query->where('name', 'like', "%{$term}%")
                        ->orWhere('description', 'like', "%{$term}%");
                });
            });

        match ($filters['sort'] ?? 'popular') {
            'books' => $query->orderByDesc('books_count')->orderBy('name'),
            'name' => $query->orderBy('name'),
            default => $query->orderByDesc('downloads_total')->orderBy('name'),
        };

        $categories = $query->paginate(12)->withQueryString();

        return Inertia::render('public/categories/index', [
            'categories' => $this->categoryDirectoryPayload($categories),
            'filters' => $filters,
        ]);
    }

    public function authors(AuthorDirectoryRequest $request): Response
    {
        $filters = $request->validated();
        $query = Author::query()
            ->whereHas('books', fn (Builder $query) => $query->active())
            ->withCount(['books' => fn (Builder $query) => $query->active()])
            ->withSum(['books as downloads_total' => fn (Builder $query) => $query->active()], 'downloads_count')
            ->with(['books' => fn (HasMany $query) => $query->active()->with('category:id,name,slug')->latest()->limit(6)->select(['id', 'author_id', 'category_id'])])
            ->when($filters['query'] ?? null, function (Builder $query, string $term): void {
                $query->where(function (Builder $query) use ($term): void {
                    $query->where('name', 'like', "%{$term}%")
                        ->orWhere('bio', 'like', "%{$term}%");
                });
            })
            ->when($filters['letter'] ?? null, fn (Builder $query, string $letter) => $query->where('name', 'like', "{$letter}%"));

        match ($filters['sort'] ?? 'name') {
            'books' => $query->orderByDesc('books_count')->orderBy('name'),
            'downloaded' => $query->orderByDesc('downloads_total')->orderBy('name'),
            default => $query->orderBy('name'),
        };

        $authors = $query->paginate(12)->withQueryString();

        return Inertia::render('public/authors/index', [
            'authors' => $this->authorDirectoryPayload($authors),
            'filters' => $filters,
        ]);
    }

    public function category(BookSearchRequest $request, Category $category): Response
    {
        abort_unless($category->is_active, 404);

        $filters = [...$request->validated(), 'category' => $category->id];
        $result = $this->searchService->search($filters);

        return Inertia::render('public/discovery/category', [
            'category' => $category->only(['id', 'name', 'slug', 'description']),
            'books' => PublicBookResource::collection($result['paginator']),
            'engine' => $result['engine'],
            'filters' => $request->safe()->except('category'),
            'filterOptions' => [
                'languages' => ['en', 'fa', 'ps'],
                'formats' => ['pdf', 'epub', 'mobi'],
            ],
        ]);
    }

    public function author(BookSearchRequest $request, Author $author): Response
    {
        abort_unless($author->books()->active()->exists(), 404);

        $filters = [...$request->validated(), 'author' => $author->id];
        $result = $this->searchService->search($filters);

        return Inertia::render('public/discovery/author', [
            'author' => [
                ...$author->only(['id', 'name', 'bio']),
                'image_url' => $author->image ? Storage::disk('public')->url($author->image) : null,
            ],
            'books' => PublicBookResource::collection($result['paginator']),
            'engine' => $result['engine'],
            'filters' => $request->safe()->except('author'),
            'filterOptions' => [
                'categories' => Category::query()
                    ->active()
                    ->whereHas('books', fn (Builder $query) => $query->active()->where('author_id', $author->id))
                    ->orderBy('name')
                    ->get(['id', 'name']),
                'languages' => ['en', 'fa', 'ps'],
                'formats' => ['pdf', 'epub', 'mobi'],
            ],
        ]);
    }

    /** @return array<string, mixed> */
    private function categoryDirectoryPayload(LengthAwarePaginator $categories): array
    {
        return [
            'data' => $categories->getCollection()->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'books_count' => $category->books_count,
                'downloads_total' => (int) ($category->downloads_total ?? 0),
                'cover_urls' => $category->books
                    ->map(fn ($book) => $book->cover_image ? Storage::disk('public')->url($book->cover_image) : null)
                    ->filter()
                    ->values(),
            ])->values(),
            'meta' => $this->paginationMeta($categories),
        ];
    }

    /** @return array<string, mixed> */
    private function authorDirectoryPayload(LengthAwarePaginator $authors): array
    {
        return [
            'data' => $authors->getCollection()->map(fn (Author $author) => [
                'id' => $author->id,
                'name' => $author->name,
                'bio' => $author->bio,
                'image_url' => $author->image ? Storage::disk('public')->url($author->image) : null,
                'books_count' => $author->books_count,
                'downloads_total' => (int) ($author->downloads_total ?? 0),
                'categories' => $author->books
                    ->pluck('category')
                    ->filter()
                    ->unique('id')
                    ->take(3)
                    ->map->only(['id', 'name', 'slug'])
                    ->values(),
            ])->values(),
            'meta' => $this->paginationMeta($authors),
        ];
    }

    /** @return array{current_page: int, last_page: int, per_page: int, total: int} */
    private function paginationMeta(LengthAwarePaginator $paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
        ];
    }
}
