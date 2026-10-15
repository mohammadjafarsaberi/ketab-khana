import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Library } from 'lucide-react';
import { BookDiscoveryResults } from '@/components/public/book-discovery-results';
import categoriesRoutes from '@/routes/categories';
import type { BookDiscoveryFilters, PaginatedBooks } from '@/types';

export default function CategoryPage({
    category,
    books,
    engine,
    filters,
    filterOptions,
}: {
    category: {
        id: number;
        name: string;
        slug: string;
        description: string | null;
    };
    books: PaginatedBooks;
    engine: string;
    filters: BookDiscoveryFilters;
    filterOptions: { languages: string[]; formats: string[] };
}) {
    return (
        <>
            <Head title={category.name} />
            <section className="border-b border-[#dfcdbb] bg-[#eedfcd]/65">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <Link
                        href={categoriesRoutes.index()}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#9b4545]"
                    >
                        <ArrowLeft className="size-4" /> All categories
                    </Link>
                    <div className="mt-8 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
                        <div className="grid size-24 place-items-center rounded-3xl bg-[#f2d4d0] text-[#B84E4E]">
                            <Library className="size-10" />
                        </div>
                        <div className="max-w-3xl">
                            <p className="text-xs font-bold tracking-[0.18em] text-[#B84E4E] uppercase">
                                Curated category
                            </p>
                            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#592323] sm:text-6xl">
                                {category.name}
                            </h1>
                            <p className="mt-4 max-w-2xl leading-7 text-[#725f53]">
                                {category.description ??
                                    'Explore every active title collected on this shelf.'}
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
                        categoriesRoutes.show.url(category.slug, {
                            query: nextFilters,
                        })
                    }
                    languages={filterOptions.languages}
                    formats={filterOptions.formats}
                    searchPlaceholder={`Search within ${category.name}`}
                />
            </main>
        </>
    );
}
