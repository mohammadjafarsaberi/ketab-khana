import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, BookOpen, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import categoriesRoutes from '@/routes/categories';
import type { DirectoryPage, PublicCategory } from '@/types';

type Filters = {
    query?: string;
    sort?: 'popular' | 'books' | 'name';
    page?: number;
};

export default function CategoriesIndex({
    categories,
    filters,
}: {
    categories: DirectoryPage<PublicCategory>;
    filters: Filters;
}) {
    const [query, setQuery] = useState(filters.query ?? '');
    const searchTimer = useRef<number | undefined>(undefined);

    const visit = (nextFilters: Filters) => {
        router.get(
            categoriesRoutes.index.url({ query: nextFilters }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['categories', 'filters'],
            },
        );
    };

    const updateQuery = (value: string) => {
        setQuery(value);
        window.clearTimeout(searchTimer.current);
        searchTimer.current = window.setTimeout(
            () => visit({ ...filters, query: value || undefined, page: 1 }),
            300,
        );
    };

    useEffect(() => () => window.clearTimeout(searchTimer.current), []);

    return (
        <>
            <Head title="Browse categories" />
            <section className="border-b border-[#dfcdbb] bg-[#eedfcd]/65">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold tracking-[0.18em] text-[#B84E4E] uppercase">
                            Find your shelf
                        </p>
                        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#592323] sm:text-6xl">
                            Browse by category
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-[#725f53]">
                            Wander through subjects, stories, and ideas until a
                            shelf feels like yours.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl border border-[#dfcdbb] bg-white px-4 shadow-sm focus-within:border-[#B84E4E]/60 focus-within:ring-4 focus-within:ring-[#B84E4E]/10 lg:w-96">
                        <Search className="size-5 shrink-0 text-[#a28272]" />
                        <input
                            value={query}
                            onChange={(event) =>
                                updateQuery(event.target.value)
                            }
                            placeholder="Search categories"
                            className="hero-search-input h-14 min-w-0 flex-1 border-0 bg-transparent outline-none"
                        />
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-[#806c60]">
                        <strong className="text-[#38241d]">
                            {categories.meta.total}
                        </strong>{' '}
                        categories to explore
                    </p>
                    <select
                        aria-label="Sort categories"
                        value={filters.sort ?? 'popular'}
                        onChange={(event) =>
                            visit({
                                ...filters,
                                sort: event.target.value as Filters['sort'],
                                page: 1,
                            })
                        }
                        className="h-11 rounded-xl border border-[#d9c2ad] bg-white px-4 text-sm outline-none focus:border-[#B84E4E]"
                    >
                        <option value="popular">Most popular</option>
                        <option value="books">Most books</option>
                        <option value="name">Name A–Z</option>
                    </select>
                </div>

                {categories.data.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {categories.data.map((category, index) => (
                            <Link
                                key={category.id}
                                href={categoriesRoutes.show(category.slug)}
                                className="group relative min-h-72 overflow-hidden rounded-3xl border border-[#dfcdbb] bg-white/45 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#cf8989] hover:shadow-xl hover:shadow-[#6f2929]/10"
                            >
                                <div className="relative z-10 max-w-[62%]">
                                    <span className="text-xs font-bold tracking-[0.16em] text-[#B84E4E] uppercase">
                                        Collection{' '}
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <h2 className="mt-3 text-2xl font-semibold text-[#38241d]">
                                        {category.name}
                                    </h2>
                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#806c60]">
                                        {category.description ??
                                            'Discover books selected for this corner of the library.'}
                                    </p>
                                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#9b4545]">
                                        {category.books_count} books
                                        <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                                    </span>
                                </div>
                                <CoverStack covers={category.cover_urls} />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState query={filters.query} />
                )}

                <Pagination
                    current={categories.meta.current_page}
                    last={categories.meta.last_page}
                    onPage={(page) => visit({ ...filters, page })}
                />
            </main>
        </>
    );
}

function CoverStack({ covers }: { covers: string[] }) {
    if (covers.length === 0) {
        return (
            <div className="absolute right-5 bottom-5 grid h-32 w-24 place-items-center rounded-2xl bg-[#f2d4d0] text-[#B84E4E]">
                <BookOpen className="size-8" />
            </div>
        );
    }

    return (
        <div className="absolute right-2 bottom-3 flex h-44 w-36 items-end justify-end">
            {covers.slice(0, 3).map((cover, index) => (
                <img
                    key={cover}
                    src={cover}
                    alt=""
                    className="absolute bottom-0 h-36 w-24 rounded-lg object-cover shadow-lg transition-transform duration-300 group-hover:-translate-y-1"
                    style={{
                        right: `${index * 18}px`,
                        transform: `rotate(${(index - 1) * 7}deg)`,
                        zIndex: 3 - index,
                    }}
                />
            ))}
        </div>
    );
}

function EmptyState({ query }: { query?: string }) {
    return (
        <div className="rounded-3xl border border-dashed border-[#d9c2ad] px-6 py-20 text-center">
            <BookOpen className="mx-auto size-9 text-[#B84E4E]" />
            <h2 className="mt-4 text-2xl font-semibold text-[#38241d]">
                No categories found
            </h2>
            <p className="mt-2 text-sm text-[#806c60]">
                {query
                    ? 'Try a broader search term.'
                    : 'Categories will appear here once books are published.'}
            </p>
        </div>
    );
}

function Pagination({
    current,
    last,
    onPage,
}: {
    current: number;
    last: number;
    onPage: (page: number) => void;
}) {
    if (last <= 1) {
        return null;
    }

    return (
        <div className="mt-12 flex items-center justify-center gap-3">
            <button
                disabled={current <= 1}
                onClick={() => onPage(current - 1)}
                className="rounded-full border border-[#d9c2ad] px-5 py-2 text-sm font-semibold disabled:opacity-40"
            >
                Previous
            </button>
            <span className="text-sm text-[#806c60]">
                Page {current} of {last}
            </span>
            <button
                disabled={current >= last}
                onClick={() => onPage(current + 1)}
                className="rounded-full bg-[#B84E4E] px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
                Next
            </button>
        </div>
    );
}
