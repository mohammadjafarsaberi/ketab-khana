import { router } from '@inertiajs/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BookGrid } from '@/components/public/book-grid';
import type { BookDiscoveryFilters, PaginatedBooks } from '@/types';

type Option = { id: string | number; name: string };

export function BookDiscoveryResults({
    books,
    engine,
    filters,
    routeUrl,
    categories = [],
    languages,
    formats,
    searchPlaceholder,
}: {
    books: PaginatedBooks;
    engine: string;
    filters: BookDiscoveryFilters;
    routeUrl: (filters: BookDiscoveryFilters) => string;
    categories?: Option[];
    languages: string[];
    formats: string[];
    searchPlaceholder: string;
}) {
    const [query, setQuery] = useState(filters.query ?? '');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const searchTimer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(searchTimer.current), []);

    const visit = (nextFilters: BookDiscoveryFilters) => {
        router.get(
            routeUrl(nextFilters),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['books', 'engine', 'filters'],
            },
        );
    };

    const update = (
        key: keyof BookDiscoveryFilters,
        value: string | number | undefined,
    ) => visit({ ...filters, [key]: value || undefined, page: 1 });

    const updateQuery = (value: string) => {
        setQuery(value);
        window.clearTimeout(searchTimer.current);
        searchTimer.current = window.setTimeout(
            () => update('query', value),
            300,
        );
    };

    const activeFilters = [
        filters.query
            ? { key: 'query' as const, label: `Search: ${filters.query}` }
            : null,
        filters.category
            ? {
                  key: 'category' as const,
                  label:
                      categories.find(
                          (category) => category.id === filters.category,
                      )?.name ?? 'Category',
              }
            : null,
        filters.language
            ? {
                  key: 'language' as const,
                  label: filters.language.toUpperCase(),
              }
            : null,
        filters.format
            ? { key: 'format' as const, label: filters.format.toUpperCase() }
            : null,
        filters.year_from
            ? {
                  key: 'year_from' as const,
                  label: `From ${filters.year_from}`,
              }
            : null,
        filters.year_to
            ? { key: 'year_to' as const, label: `To ${filters.year_to}` }
            : null,
    ].filter((filter) => filter !== null);

    return (
        <div className="mt-10">
            <div className="flex items-center gap-2 rounded-2xl border border-[#dfcdbb] bg-white px-4 shadow-sm focus-within:border-[#B84E4E]/60 focus-within:ring-4 focus-within:ring-[#B84E4E]/10">
                <Search className="size-5 shrink-0 text-[#a28272]" />
                <input
                    value={query}
                    onChange={(event) => updateQuery(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="hero-search-input h-14 min-w-0 flex-1 border-0 bg-transparent outline-none"
                />
                <button
                    type="button"
                    onClick={() => setFiltersOpen((open) => !open)}
                    className="grid size-10 place-items-center rounded-xl bg-[#f2d4d0] text-[#963d3d] lg:hidden"
                    aria-label="Toggle filters"
                >
                    {filtersOpen ? (
                        <X className="size-4" />
                    ) : (
                        <SlidersHorizontal className="size-4" />
                    )}
                </button>
            </div>

            {activeFilters.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {activeFilters.map((filter) => (
                        <button
                            key={filter.key}
                            type="button"
                            onClick={() => {
                                if (filter.key === 'query') {
                                    setQuery('');
                                }

                                update(filter.key, undefined);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#ead8c5] px-3 py-1.5 text-xs font-semibold text-[#7e5148] transition hover:bg-[#f2d4d0]"
                        >
                            {filter.label}
                            <X className="size-3" />
                        </button>
                    ))}
                </div>
            )}

            <div className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr]">
                <aside
                    className={`${filtersOpen ? 'block' : 'hidden'} h-fit rounded-3xl border border-[#dfcdbb] bg-white/55 p-5 lg:block`}
                >
                    <div className="mb-5 flex items-center gap-2 font-semibold text-[#38241d]">
                        <SlidersHorizontal className="size-4 text-[#B84E4E]" />
                        Refine books
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                        {categories.length > 0 && (
                            <FilterSelect
                                label="Category"
                                value={filters.category}
                                options={categories}
                                onChange={(value) =>
                                    update(
                                        'category',
                                        value ? Number(value) : undefined,
                                    )
                                }
                            />
                        )}
                        <FilterSelect
                            label="Language"
                            value={filters.language}
                            options={languages.map((language) => ({
                                id: language,
                                name: language.toUpperCase(),
                            }))}
                            onChange={(value) => update('language', value)}
                        />
                        <FilterSelect
                            label="Format"
                            value={filters.format}
                            options={formats.map((format) => ({
                                id: format,
                                name: format.toUpperCase(),
                            }))}
                            onChange={(value) => update('format', value)}
                        />
                        <div>
                            <label className="mb-2 block text-xs font-bold tracking-wide text-[#806c60] uppercase">
                                Publication year
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    min="1000"
                                    max={new Date().getFullYear()}
                                    defaultValue={filters.year_from ?? ''}
                                    onBlur={(event) =>
                                        update(
                                            'year_from',
                                            event.target.value
                                                ? Number(event.target.value)
                                                : undefined,
                                        )
                                    }
                                    placeholder="From"
                                    className="h-10 min-w-0 rounded-xl border border-[#dfcdbb] bg-white px-3 text-sm outline-none"
                                />
                                <input
                                    type="number"
                                    min="1000"
                                    max={new Date().getFullYear()}
                                    defaultValue={filters.year_to ?? ''}
                                    onBlur={(event) =>
                                        update(
                                            'year_to',
                                            event.target.value
                                                ? Number(event.target.value)
                                                : undefined,
                                        )
                                    }
                                    placeholder="To"
                                    className="h-10 min-w-0 rounded-xl border border-[#dfcdbb] bg-white px-3 text-sm outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="min-w-0">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-[#806c60]">
                            <strong className="text-[#38241d]">
                                {books.meta.total}
                            </strong>{' '}
                            books found
                            <span className="ml-2 text-xs text-[#a28272]">
                                ·{' '}
                                {engine === 'typesense'
                                    ? 'instant search'
                                    : 'database search'}
                            </span>
                        </p>
                        <FilterSelect
                            label="Sort"
                            value={filters.sort ?? 'relevance'}
                            options={[
                                { id: 'relevance', name: 'Relevance' },
                                { id: 'newest', name: 'Newest' },
                                { id: 'popular', name: 'Popular' },
                                { id: 'title', name: 'Title A–Z' },
                            ]}
                            onChange={(value) => update('sort', value)}
                            compact
                        />
                    </div>

                    <BookGrid
                        books={books.data}
                        empty="No books match these filters yet. Try removing one of your selections."
                    />

                    {books.meta.last_page > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-3">
                            <button
                                disabled={books.meta.current_page <= 1}
                                onClick={() =>
                                    visit({
                                        ...filters,
                                        page: books.meta.current_page - 1,
                                    })
                                }
                                className="rounded-full border border-[#d9c2ad] px-5 py-2 text-sm font-semibold disabled:opacity-40"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-[#806c60]">
                                Page {books.meta.current_page} of{' '}
                                {books.meta.last_page}
                            </span>
                            <button
                                disabled={
                                    books.meta.current_page >=
                                    books.meta.last_page
                                }
                                onClick={() =>
                                    visit({
                                        ...filters,
                                        page: books.meta.current_page + 1,
                                    })
                                }
                                className="rounded-full bg-[#B84E4E] px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function FilterSelect({
    label,
    value,
    options,
    onChange,
    compact = false,
}: {
    label: string;
    value: string | number | undefined;
    options: Option[];
    onChange: (value: string) => void;
    compact?: boolean;
}) {
    return (
        <label className={compact ? '' : 'block'}>
            {!compact && (
                <span className="mb-2 block text-xs font-bold tracking-wide text-[#806c60] uppercase">
                    {label}
                </span>
            )}
            <select
                aria-label={label}
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value)}
                className={`${compact ? 'w-auto' : 'w-full'} h-11 rounded-xl border border-[#dfcdbb] bg-white px-3 text-sm outline-none focus:border-[#B84E4E]`}
            >
                {!compact && (
                    <option value="">All {label.toLowerCase()}s</option>
                )}
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </label>
    );
}
