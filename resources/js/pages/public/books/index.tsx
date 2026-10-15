import { Head, router } from '@inertiajs/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BookGrid } from '@/components/public/book-grid';
import booksRoutes from '@/routes/books';
import type { PaginatedBooks } from '@/types';

type Filters = {
    query?: string;
    category?: number;
    author?: number;
    language?: string;
    format?: string;
    year_from?: number;
    year_to?: number;
    sort?: string;
    page?: number;
    per_page?: number;
};

type Option = { id: string | number; name: string };

export default function Catalog({
    books,
    engine,
    filters,
    filterOptions,
}: {
    books: PaginatedBooks;
    engine: string;
    filters: Filters;
    filterOptions: {
        categories: Option[];
        authors: Option[];
        languages: string[];
        formats: string[];
    };
}) {
    const [query, setQuery] = useState(filters.query ?? '');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const timer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    const visit = (nextFilters: Filters) => {
        router.get(
            booksRoutes.index.url({ query: nextFilters }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['books', 'engine', 'filters'],
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    };

    const update = (key: keyof Filters, value: string | number | undefined) =>
        visit({ ...filters, [key]: value || undefined, page: 1 });

    const updateQuery = (value: string) => {
        setQuery(value);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => update('query', value), 300);
    };

    const chips = [
        filters.query
            ? { key: 'query' as const, label: `Search: ${filters.query}` }
            : null,
        filters.category
            ? {
                  key: 'category' as const,
                  label:
                      filterOptions.categories.find(
                          (item) => Number(item.id) === filters.category,
                      )?.name ?? 'Category',
              }
            : null,
        filters.author
            ? {
                  key: 'author' as const,
                  label:
                      filterOptions.authors.find(
                          (item) => Number(item.id) === filters.author,
                      )?.name ?? 'Author',
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
            ? { key: 'year_from' as const, label: `From ${filters.year_from}` }
            : null,
        filters.year_to
            ? { key: 'year_to' as const, label: `To ${filters.year_to}` }
            : null,
    ].filter((chip) => chip !== null);

    return (
        <>
            <Head title="Book catalog" />
            <section className="border-b border-[#dfcdbb] bg-[#eedfcd]/65">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <p className="text-xs font-bold tracking-[0.18em] text-[#B84E4E] uppercase">
                        The complete collection
                    </p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#592323] sm:text-6xl">
                        Explore the catalog
                    </h1>
                    <p className="mt-4 max-w-2xl leading-7 text-[#725f53]">
                        Search every title, author, ISBN, and topic, then refine
                        the results to exactly what you want.
                    </p>
                    <div className="mt-8 flex max-w-3xl items-center gap-2 rounded-2xl border border-[#dfcdbb] bg-white px-4 shadow-sm focus-within:border-[#B84E4E]/60 focus-within:ring-4 focus-within:ring-[#B84E4E]/10">
                        <Search className="size-5 shrink-0 text-[#a28272]" />
                        <input
                            value={query}
                            onChange={(event) =>
                                updateQuery(event.target.value)
                            }
                            placeholder="Search by title, author, ISBN, or topic"
                            className="hero-search-input h-14 min-w-0 flex-1 border-0 bg-transparent outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setFiltersOpen((open) => !open)}
                            className="grid size-10 place-items-center rounded-xl bg-[#f2d4d0] text-[#963d3d] lg:hidden"
                            aria-label="Toggle catalog filters"
                        >
                            {filtersOpen ? (
                                <X className="size-4" />
                            ) : (
                                <SlidersHorizontal className="size-4" />
                            )}
                        </button>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {chips.length > 0 && (
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        {chips.map((chip) => (
                            <button
                                key={chip.key}
                                type="button"
                                onClick={() => {
                                    if (chip.key === 'query') {
                                        setQuery('');
                                    }

                                    update(chip.key, undefined);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#ead8c5] px-3 py-1.5 text-xs font-semibold text-[#7e5148] transition hover:bg-[#f2d4d0]"
                            >
                                {chip.label}
                                <X className="size-3" />
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                visit({
                                    sort: filters.sort ?? 'relevance',
                                    per_page: filters.per_page ?? 12,
                                });
                            }}
                            className="px-2 text-xs font-semibold text-[#B84E4E]"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                    <aside
                        className={`${filtersOpen ? 'block' : 'hidden'} h-fit rounded-3xl border border-[#dfcdbb] bg-white/55 p-5 lg:block`}
                    >
                        <div className="mb-5 flex items-center gap-2 font-semibold text-[#38241d]">
                            <SlidersHorizontal className="size-4 text-[#B84E4E]" />{' '}
                            Refine results
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                            <FilterSelect
                                label="Category"
                                value={filters.category}
                                options={filterOptions.categories}
                                onChange={(value) =>
                                    update(
                                        'category',
                                        value ? Number(value) : undefined,
                                    )
                                }
                            />
                            <FilterSelect
                                label="Author"
                                value={filters.author}
                                options={filterOptions.authors}
                                onChange={(value) =>
                                    update(
                                        'author',
                                        value ? Number(value) : undefined,
                                    )
                                }
                            />
                            <FilterSelect
                                label="Language"
                                value={filters.language}
                                options={filterOptions.languages.map(
                                    (value) => ({
                                        id: value,
                                        name: value.toUpperCase(),
                                    }),
                                )}
                                onChange={(value) => update('language', value)}
                            />
                            <FilterSelect
                                label="Format"
                                value={filters.format}
                                options={filterOptions.formats.map((value) => ({
                                    id: value,
                                    name: value.toUpperCase(),
                                }))}
                                onChange={(value) => update('format', value)}
                            />
                            <div>
                                <span className="mb-2 block text-xs font-bold tracking-wide text-[#806c60] uppercase">
                                    Publication year
                                </span>
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
                                books found{' '}
                                <span className="ml-2 text-xs text-[#a28272]">
                                    ·{' '}
                                    {engine === 'typesense'
                                        ? 'instant search'
                                        : 'database fallback'}
                                </span>
                            </p>
                            <select
                                aria-label="Sort books"
                                value={filters.sort ?? 'relevance'}
                                onChange={(event) =>
                                    update('sort', event.target.value)
                                }
                                className="h-11 rounded-xl border border-[#dfcdbb] bg-white px-3 text-sm outline-none focus:border-[#B84E4E]"
                            >
                                <option value="relevance">Relevance</option>
                                <option value="newest">Newest</option>
                                <option value="popular">Popular</option>
                                <option value="title">Title A–Z</option>
                            </select>
                        </div>
                        {loading ? (
                            <BookSkeletons />
                        ) : (
                            <BookGrid
                                books={books.data}
                                empty="No books match these filters. Try removing one of your selections."
                            />
                        )}
                        {books.meta.last_page > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-3">
                                <button
                                    disabled={
                                        books.meta.current_page <= 1 || loading
                                    }
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
                                            books.meta.last_page || loading
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
            </main>
        </>
    );
}

function FilterSelect({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string | number | undefined;
    options: Option[];
    onChange: (value: string) => void;
}) {
    return (
        <label>
            <span className="mb-2 block text-xs font-bold tracking-wide text-[#806c60] uppercase">
                {label}
            </span>
            <select
                aria-label={label}
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value)}
                className="h-11 w-full rounded-xl border border-[#dfcdbb] bg-white px-3 text-sm outline-none focus:border-[#B84E4E]"
            >
                <option value="">All {label.toLowerCase()}s</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </label>
    );
}

function BookSkeletons() {
    return (
        <div
            className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-5"
            aria-label="Loading books"
        >
            {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                    <div className="aspect-[3/4.2] rounded-2xl bg-[#ead8c5]" />
                    <div className="mt-4 h-4 rounded bg-[#ead8c5]" />
                    <div className="mt-2 h-3 w-2/3 rounded bg-[#efe1d2]" />
                </div>
            ))}
        </div>
    );
}
