<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;
use Throwable;

class BookSearchService
{
    /** @param array<string, mixed> $filters */
    public function search(array $filters): array
    {
        if (config('scout.driver') === 'typesense') {
            try {
                return $this->typesense($filters);
            } catch (Throwable $exception) {
                Log::warning('Typesense book search failed; using the database fallback.', [
                    'exception' => $exception->getMessage(),
                ]);
            }
        }

        return $this->database($filters);
    }

    /** @param array<string, mixed> $filters */
    private function typesense(array $filters): array
    {
        $options = [
            'query_by' => 'title,author,category,isbn,description,tags',
            'highlight_full_fields' => 'title,author,category',
            'sort_by' => $this->typesenseSort($filters),
        ];

        $filterBy = $this->typesenseFilters($filters);

        if ($filterBy !== '') {
            $options['filter_by'] = $filterBy;
        }

        $paginator = Book::search((string) ($filters['query'] ?? '*'))
            ->options($options)
            ->query(fn (Builder $query) => $query->active())
            ->paginate((int) ($filters['per_page'] ?? 12), 'page', (int) ($filters['page'] ?? 1));

        $paginator->getCollection()->load(['author', 'category', 'files', 'favorites']);

        return ['paginator' => $paginator, 'engine' => 'typesense'];
    }

    /** @param array<string, mixed> $filters */
    private function database(array $filters): array
    {
        $query = Book::query()
            ->active()
            ->with(['author', 'category', 'files', 'favorites']);

        $term = trim((string) ($filters['query'] ?? ''));

        if ($term !== '') {
            $query->where(function (Builder $query) use ($term): void {
                $query->where('title', 'like', "%{$term}%")
                    ->orWhere('isbn', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%")
                    ->orWhereHas('author', fn (Builder $author) => $author->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('category', fn (Builder $category) => $category->where('name', 'like', "%{$term}%"));
            });
        }

        $this->applyDatabaseFilters($query, $filters);

        $paginator = $query->paginate(
            (int) ($filters['per_page'] ?? 12),
            ['*'],
            'page',
            (int) ($filters['page'] ?? 1),
        );

        return ['paginator' => $paginator, 'engine' => 'database'];
    }

    /** @param array<string, mixed> $filters */
    private function applyDatabaseFilters(Builder $query, array $filters): void
    {
        $query
            ->when($filters['category'] ?? null, fn (Builder $query, $value) => $query->where('category_id', $value))
            ->when($filters['author'] ?? null, fn (Builder $query, $value) => $query->where('author_id', $value))
            ->when($filters['language'] ?? null, fn (Builder $query, $value) => $query->where('language', $value))
            ->when($filters['format'] ?? null, fn (Builder $query, $value) => $query->whereHas('files', fn (Builder $files) => $files->where('format', $value)))
            ->when($filters['year_from'] ?? null, fn (Builder $query, $value) => $query->where('published_year', '>=', $value))
            ->when($filters['year_to'] ?? null, fn (Builder $query, $value) => $query->where('published_year', '<=', $value));

        match ($filters['sort'] ?? 'relevance') {
            'newest' => $query->latest(),
            'popular' => $query->orderByDesc('downloads_count'),
            'title' => $query->orderBy('title'),
            default => $query->when(empty($filters['query']), fn (Builder $query) => $query->latest()),
        };
    }

    /** @param array<string, mixed> $filters */
    private function typesenseFilters(array $filters): string
    {
        return collect([
            isset($filters['category']) ? 'category_id:='.$filters['category'] : null,
            isset($filters['author']) ? 'author_id:='.$filters['author'] : null,
            isset($filters['language']) ? 'language:='.$filters['language'] : null,
            isset($filters['format']) ? 'formats:='.$filters['format'] : null,
            isset($filters['year_from']) ? 'published_year:>='.$filters['year_from'] : null,
            isset($filters['year_to']) ? 'published_year:<='.$filters['year_to'] : null,
        ])->filter()->implode(' && ');
    }

    /** @param array<string, mixed> $filters */
    private function typesenseSort(array $filters): string
    {
        return match ($filters['sort'] ?? 'relevance') {
            'newest' => 'created_at:desc',
            'popular' => 'downloads_count:desc',
            'title' => 'title:asc',
            default => '_text_match:desc,downloads_count:desc',
        };
    }
}
