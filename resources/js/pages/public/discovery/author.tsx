import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { BookDiscoveryResults } from '@/components/public/book-discovery-results';
import authorsRoutes from '@/routes/authors';
import type { BookDiscoveryFilters, PaginatedBooks } from '@/types';

export default function AuthorPage({
    author,
    books,
    engine,
    filters,
    filterOptions,
}: {
    author: {
        id: number;
        name: string;
        bio: string | null;
        image_url: string | null;
    };
    books: PaginatedBooks;
    engine: string;
    filters: BookDiscoveryFilters;
    filterOptions: {
        categories: { id: number; name: string }[];
        languages: string[];
        formats: string[];
    };
}) {
    return (
        <>
            <Head title={author.name} />
            <section className="border-b border-[#dfcdbb] bg-[#eedfcd]/65">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <Link
                        href={authorsRoutes.index()}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#9b4545]"
                    >
                        <ArrowLeft className="size-4" /> All authors
                    </Link>
                    <div className="mt-8 flex max-w-5xl flex-col gap-7 sm:flex-row sm:items-center">
                        <div className="grid size-36 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f2d4d0] text-5xl font-semibold text-[#B84E4E] ring-8 ring-white/55">
                            {author.image_url ? (
                                <img
                                    src={author.image_url}
                                    alt={author.name}
                                    className="size-full object-cover"
                                />
                            ) : (
                                author.name.slice(0, 1).toUpperCase()
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-[0.18em] text-[#B84E4E] uppercase">
                                Author collection
                            </p>
                            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#592323] sm:text-6xl">
                                {author.name}
                            </h1>
                            <p className="mt-4 max-w-3xl leading-7 text-[#725f53]">
                                {author.bio ??
                                    'Explore every active title by this author in the Ketab Khana collection.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <BookDiscoveryResults
                    books={books}
                    engine={engine}
                    filters={filters}
                    routeUrl={(nextFilters) =>
                        authorsRoutes.show.url(author.id, {
                            query: nextFilters,
                        })
                    }
                    categories={filterOptions.categories}
                    languages={filterOptions.languages}
                    formats={filterOptions.formats}
                    searchPlaceholder={`Search books by ${author.name}`}
                />
            </main>
        </>
    );
}
