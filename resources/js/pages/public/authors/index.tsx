import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Search, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import authorsRoutes from '@/routes/authors';
import categoriesRoutes from '@/routes/categories';
import type { DirectoryPage, PublicAuthor } from '@/types';

type Filters = {
    query?: string;
    letter?: string;
    sort?: 'name' | 'books' | 'downloaded';
    page?: number;
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function AuthorsIndex({
    authors,
    filters,
}: {
    authors: DirectoryPage<PublicAuthor>;
    filters: Filters;
}) {
    const [query, setQuery] = useState(filters.query ?? '');
    const searchTimer = useRef<number | undefined>(undefined);

    const visit = (nextFilters: Filters) => {
        router.get(
            authorsRoutes.index.url({ query: nextFilters }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['authors', 'filters'],
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
            <Head title="Meet the authors" />
            <section className="border-b border-[#dfcdbb] bg-[#eedfcd]/65">
                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold tracking-[0.18em] text-[#B84E4E] uppercase">
                            The voices behind the books
                        </p>
                        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#592323] sm:text-6xl">
                            Meet the authors
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-[#725f53]">
                            Explore writers, their ideas, and the collections
                            they have shaped.
                        </p>
                    </div>
                    <div className="mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-[#dfcdbb] bg-white px-4 shadow-sm focus-within:border-[#B84E4E]/60 focus-within:ring-4 focus-within:ring-[#B84E4E]/10">
                        <Search className="size-5 shrink-0 text-[#a28272]" />
                        <input
                            value={query}
                            onChange={(event) =>
                                updateQuery(event.target.value)
                            }
                            placeholder="Search authors by name or biography"
                            className="hero-search-input h-14 min-w-0 flex-1 border-0 bg-transparent outline-none"
                        />
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <button
                        onClick={() =>
                            visit({ ...filters, letter: undefined, page: 1 })
                        }
                        className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold transition ${!filters.letter ? 'bg-[#B84E4E] text-white' : 'border border-[#d9c2ad] bg-white/45 text-[#725f53] hover:border-[#B84E4E]'}`}
                    >
                        All
                    </button>
                    {alphabet.map((letter) => (
                        <button
                            key={letter}
                            onClick={() =>
                                visit({ ...filters, letter, page: 1 })
                            }
                            className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold transition ${filters.letter === letter ? 'bg-[#B84E4E] text-white' : 'border border-[#d9c2ad] bg-white/45 text-[#725f53] hover:border-[#B84E4E]'}`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>

                <div className="my-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-[#806c60]">
                        <strong className="text-[#38241d]">
                            {authors.meta.total}
                        </strong>{' '}
                        authors found
                    </p>
                    <select
                        aria-label="Sort authors"
                        value={filters.sort ?? 'name'}
                        onChange={(event) =>
                            visit({
                                ...filters,
                                sort: event.target.value as Filters['sort'],
                                page: 1,
                            })
                        }
                        className="h-11 rounded-xl border border-[#d9c2ad] bg-white px-4 text-sm outline-none focus:border-[#B84E4E]"
                    >
                        <option value="name">Name A–Z</option>
                        <option value="books">Most books</option>
                        <option value="downloaded">Most downloaded</option>
                    </select>
                </div>

                {authors.data.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {authors.data.map((author) => (
                            <article
                                key={author.id}
                                className="group rounded-3xl border border-[#dfcdbb] bg-white/45 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#cf8989] hover:shadow-xl hover:shadow-[#6f2929]/10"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f2d4d0] text-2xl font-semibold text-[#B84E4E] ring-4 ring-white/70">
                                        {author.image_url ? (
                                            <img
                                                src={author.image_url}
                                                alt={author.name}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            author.name
                                                .slice(0, 1)
                                                .toUpperCase()
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-2xl font-semibold text-[#38241d]">
                                            {author.name}
                                        </h2>
                                        <p className="mt-1 text-sm text-[#806c60]">
                                            {author.books_count} books ·{' '}
                                            {author.downloads_total.toLocaleString()}{' '}
                                            downloads
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-5 line-clamp-3 min-h-18 text-sm leading-6 text-[#725f53]">
                                    {author.bio ??
                                        'Discover this author’s published works in the Ketab Khana collection.'}
                                </p>
                                {author.categories.length > 0 && (
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {author.categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={categoriesRoutes.show(
                                                    category.slug,
                                                )}
                                                className="rounded-full bg-[#ead8c5] px-3 py-1 text-xs font-semibold text-[#7e5148] transition hover:bg-[#f2d4d0] hover:text-[#963d3d]"
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                <Link
                                    href={authorsRoutes.show(author.id)}
                                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#B84E4E]"
                                >
                                    View books{' '}
                                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-[#d9c2ad] px-6 py-20 text-center">
                        <Users className="mx-auto size-9 text-[#B84E4E]" />
                        <h2 className="mt-4 text-2xl font-semibold text-[#38241d]">
                            No authors found
                        </h2>
                        <p className="mt-2 text-sm text-[#806c60]">
                            Try another name, biography term, or letter.
                        </p>
                    </div>
                )}

                {authors.meta.last_page > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-3">
                        <button
                            disabled={authors.meta.current_page <= 1}
                            onClick={() =>
                                visit({
                                    ...filters,
                                    page: authors.meta.current_page - 1,
                                })
                            }
                            className="rounded-full border border-[#d9c2ad] px-5 py-2 text-sm font-semibold disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-[#806c60]">
                            Page {authors.meta.current_page} of{' '}
                            {authors.meta.last_page}
                        </span>
                        <button
                            disabled={
                                authors.meta.current_page >=
                                authors.meta.last_page
                            }
                            onClick={() =>
                                visit({
                                    ...filters,
                                    page: authors.meta.current_page + 1,
                                })
                            }
                            className="rounded-full bg-[#B84E4E] px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </>
    );
}
