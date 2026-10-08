import { Head, useHttp } from '@inertiajs/react';
import { Search, SlidersHorizontal } from 'lucide-react';
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
type CatalogProps = {
    books: PaginatedBooks;
    engine: string;
    filters: Filters;
    filterOptions: {
        categories: { id: number; name: string }[];
        authors: { id: number; name: string }[];
        languages: string[];
        formats: string[];
    };
};

export default function Catalog({
    books: initialBooks,
    engine: initialEngine,
    filters: initialFilters,
    filterOptions,
}: CatalogProps) {
    const [filters, setFilters] = useState<Filters>({
        sort: 'relevance',
        per_page: 12,
        ...initialFilters,
    });
    const [results, setResults] = useState(initialBooks);
    const [engine, setEngine] = useState(initialEngine);
    const firstRender = useRef(true);
    const { get, processing } = useHttp<
        Record<string, never>,
        PaginatedBooks & { engine: string }
    >({});

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;

            return;
        }

        const timer = window.setTimeout(
            () => {
                get(booksRoutes.search.url({ query: filters }), {
                    onSuccess: (response) => {
                        setResults(response);
                        setEngine(response.engine);
                    },
                }).catch(() => undefined);
            },
            filters.query !== undefined ? 250 : 0,
        );

        return () => window.clearTimeout(timer);
    }, [filters, get]);

    const update = (key: keyof Filters, value: string | number | undefined) =>
        setFilters((current) => ({
            ...current,
            [key]: value || undefined,
            page: 1,
        }));

    return (
        <>
            <Head title="Book catalog" />
            <div className="border-b border-[#dfcdbb] bg-[#eedfcd]/70">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <p className="text-sm font-bold tracking-wide text-[#B84E4E] uppercase">
                        Explore the library
                    </p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                        Find your next great read
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-600">
                        Search instantly, then refine by author, category,
                        language, format, or year.
                    </p>
                    <div className="relative mt-7 max-w-2xl">
                        <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
                        <input
                            value={filters.query ?? ''}
                            onChange={(event) =>
                                update('query', event.target.value)
                            }
                            placeholder="Search by title, author, ISBN, or topic"
                            className="h-14 w-full rounded-2xl border border-[#dfcdbb] bg-white pr-4 pl-12 shadow-sm outline-none focus:border-[#B84E4E] focus:ring-3 focus:ring-[#eabbbb]"
                        />
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 rounded-2xl border border-[#dfcdbb] bg-white/65 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        <SlidersHorizontal className="size-4 text-[#B84E4E]" />
                        Refine results
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
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
                            options={filterOptions.languages.map((value) => ({
                                id: value,
                                name: value.toUpperCase(),
                            }))}
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
                        <input
                            type="number"
                            min="1000"
                            max={new Date().getFullYear()}
                            value={filters.year_from ?? ''}
                            onChange={(event) =>
                                update(
                                    'year_from',
                                    event.target.value
                                        ? Number(event.target.value)
                                        : undefined,
                                )
                            }
                            placeholder="From year"
                            className="h-11 rounded-xl border border-[#dfcdbb] bg-white px-3 text-sm outline-none focus:border-[#B84E4E]"
                        />
                        <FilterSelect
                            label="Sort"
                            value={filters.sort}
                            options={[
                                { id: 'relevance', name: 'Relevance' },
                                { id: 'newest', name: 'Newest' },
                                { id: 'popular', name: 'Popular' },
                                { id: 'title', name: 'Title A–Z' },
                            ]}
                            onChange={(value) => update('sort', value)}
                        />
                    </div>
                </div>
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        <strong className="text-slate-900">
                            {results.meta.total}
                        </strong>{' '}
                        books found
                    </p>
                    <span className="text-xs text-slate-400">
                        Search:{' '}
                        {engine === 'typesense'
                            ? 'instant'
                            : 'database fallback'}
                    </span>
                </div>
                {processing ? (
                    <div
                        className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                        aria-label="Loading books"
                    >
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="aspect-[3/4.2] rounded-2xl bg-slate-200" />
                                <div className="mt-4 h-4 rounded bg-slate-200" />
                                <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <BookGrid books={results.data} />
                )}
                {results.meta.last_page > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-3">
                        <button
                            disabled={
                                results.meta.current_page <= 1 || processing
                            }
                            onClick={() =>
                                setFilters((current) => ({
                                    ...current,
                                    page: results.meta.current_page - 1,
                                }))
                            }
                            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-500">
                            Page {results.meta.current_page} of{' '}
                            {results.meta.last_page}
                        </span>
                        <button
                            disabled={
                                results.meta.current_page >=
                                    results.meta.last_page || processing
                            }
                            onClick={() =>
                                setFilters((current) => ({
                                    ...current,
                                    page: results.meta.current_page + 1,
                                }))
                            }
                            className="rounded-full bg-[#B84E4E] px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
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
    options: { id: string | number; name: string }[];
    onChange: (value: string) => void;
}) {
    return (
        <select
            aria-label={label}
            value={value ?? ''}
            onChange={(event) => onChange(event.target.value)}
            className="h-11 min-w-0 rounded-xl border border-[#dfcdbb] bg-white px-3 text-sm outline-none focus:border-[#B84E4E]"
        >
            <option value="">All {label.toLowerCase()}s</option>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    );
}
