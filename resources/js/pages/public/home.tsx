import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Search,
    Sparkles,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import { BookCard } from '@/components/public/book-card';
import { BookGrid } from '@/components/public/book-grid';
import authorsRoutes from '@/routes/authors';
import booksRoutes from '@/routes/books';
import categoriesRoutes from '@/routes/categories';
import type { PublicBook } from '@/types';

type HomeProps = {
    recentBooks: PublicBook[];
    popularBooks: PublicBook[];
    categories: {
        id: number;
        name: string;
        slug: string;
        books_count: number;
    }[];
    authors: {
        id: number;
        name: string;
        image_url: string | null;
        books_count: number;
    }[];
    languages: { language: string; books_count: number }[];
};

const languageNames: Record<string, string> = {
    en: 'English',
    fa: 'Dari',
    ps: 'Pashto',
};

export default function Home({
    recentBooks,
    popularBooks,
    categories,
    authors,
    languages,
}: HomeProps) {
    const [query, setQuery] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
        [],
    );
    const popularBooksCarousel = useRef<HTMLDivElement>(null);
    const filteredRecentBooks = useMemo(
        () =>
            selectedCategoryIds.length === 0
                ? recentBooks
                : recentBooks.filter((book) =>
                      selectedCategoryIds.includes(book.category.id),
                  ),
        [recentBooks, selectedCategoryIds],
    );

    const search = (event: FormEvent) => {
        event.preventDefault();
        router.get(booksRoutes.index.url({ query: { query } }));
    };

    const toggleCategory = (categoryId: number) => {
        setSelectedCategoryIds((currentCategoryIds) =>
            currentCategoryIds.includes(categoryId)
                ? currentCategoryIds.filter((id) => id !== categoryId)
                : [...currentCategoryIds, categoryId],
        );
    };

    const scrollPopularBooks = (direction: -1 | 1) => {
        const carousel = popularBooksCarousel.current;
        const card = carousel?.querySelector<HTMLElement>('[data-book-card]');

        if (!carousel || !card) {
            return;
        }

        carousel.scrollBy({
            left: direction * (card.offsetWidth + 16),
            behavior: 'smooth',
        });
    };

    return (
        <>
            <Head title="Discover your next book" />
            <section className="relative isolate w-full overflow-hidden bg-[#f5e9d8]">
                <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 pt-14 sm:px-6 sm:pt-18 lg:px-8 lg:pt-20">
                    <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold tracking-wide text-[#963d3d] uppercase">
                            <Sparkles className="size-3.5" />
                            Your digital reading room
                        </div>
                        <div className="flex flex-wrap items-baseline justify-center uppercase">
                            <h1 className="max-w-3xl text-4xl leading-[1.05] font-[100px] tracking-[-0.04em] text-[#592323] sm:text-6xl lg:text-7xl">
                                Discover your next{' '}
                            </h1>
                            <h1 className="max-w-3xl text-4xl leading-[1.05] font-bold tracking-[-0.04em] text-[#592323] text-[#B84E4E] sm:text-6xl lg:text-7xl">
                                great read.
                            </h1>
                        </div>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-[#592323]/75 sm:text-lg">
                            Search across authors, categories, languages, and
                            formats. Save favorites and download your next read
                            securely.
                        </p>
                        <form
                            onSubmit={search}
                            className="mt-8 flex w-full max-w-xl rounded-2xl bg-white p-2 shadow-xl shadow-[#6f2929]/10"
                        >
                            <Search className="ml-3 size-5 self-center text-slate-400" />
                            <input
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Title, author, ISBN, or topic"
                                className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm outline-none sm:text-base"
                            />
                            <button className="rounded-xl bg-[#B84E4E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#963d3d]">
                                Search
                            </button>
                        </form>
                    </div>
                    <div className="relative mt-8 h-[160px] w-screen overflow-hidden sm:mt-10 sm:h-[24vw]">
                        <img
                            src="/images/hero-book-fan.png?v=3"
                            alt="A collection of classic books arranged in a semicircle"
                            className="absolute -top-2 left-1/2 w-[125vw] max-w-none min-w-[900px] -translate-x-1/2 drop-shadow-[0_20px_20px_rgba(89,35,35,0.14)] sm:-top-6 lg:-top-7"
                        />
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Section
                    title="Recently added"
                    subtitle="Fresh arrivals for your reading list"
                    href={booksRoutes.index()}
                >
                    <div className="mb-8">
                        <div className="flex items-center justify-end gap-4">
                            <Link
                                href={categoriesRoutes.index()}
                                className="text-sm font-semibold text-[#B84E4E] transition hover:text-[#963d3d]"
                            >
                                Browse all categories
                            </Link>
                            {selectedCategoryIds.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategoryIds([])}
                                    className="text-sm font-semibold text-[#B84E4E] transition hover:text-[#963d3d]"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2.5">
                            {categories.map((category) => {
                                const isSelected = selectedCategoryIds.includes(
                                    category.id,
                                );

                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() =>
                                            toggleCategory(category.id)
                                        }
                                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${isSelected ? 'border-[#B84E4E] bg-[#B84E4E] text-white shadow-sm' : 'border-[#d9c3ad] bg-white/55 text-[#704b3d] hover:border-[#B84E4E] hover:bg-[#f2d4d0] hover:text-[#963d3d]'}`}
                                    >
                                        {category.name}
                                        <span
                                            className={`ml-2 text-xs ${isSelected ? 'text-white/75' : 'text-slate-400'}`}
                                        >
                                            {category.books_count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <BookGrid
                        books={filteredRecentBooks}
                        empty={
                            selectedCategoryIds.length > 0
                                ? 'No recently added books match these categories.'
                                : 'The first books will appear here soon.'
                        }
                    />
                </Section>

                {popularBooks.length > 0 && (
                    <section className="py-12">
                        <div className="mb-7 flex items-end justify-between gap-4">
                            <SectionHeading
                                title="Most downloaded"
                                subtitle="Popular with readers this week"
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => scrollPopularBooks(-1)}
                                    aria-label="Show previous popular book"
                                    className="grid size-10 place-items-center rounded-full border border-[#d9c3ad] bg-white/55 text-[#704b3d] transition hover:border-[#B84E4E] hover:bg-[#B84E4E] hover:text-white"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollPopularBooks(1)}
                                    aria-label="Show next popular book"
                                    className="grid size-10 place-items-center rounded-full border border-[#d9c3ad] bg-white/55 text-[#704b3d] transition hover:border-[#B84E4E] hover:bg-[#B84E4E] hover:text-white"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                                <Link
                                    href={booksRoutes.index({
                                        query: { sort: 'popular' },
                                    })}
                                    className="ml-2 hidden items-center gap-2 text-sm font-semibold text-[#B84E4E] sm:flex"
                                >
                                    View all <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                        <div
                            ref={popularBooksCarousel}
                            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {popularBooks.map((book) => (
                                <div
                                    key={book.id}
                                    data-book-card
                                    className="w-[145px] shrink-0 snap-start sm:w-[165px] lg:w-[180px]"
                                >
                                    <BookCard book={book} compact />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="py-12">
                    <SectionHeading
                        title="Read in your language"
                        subtitle="Explore the collection your way"
                    />
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {languages.map((language) => (
                            <Link
                                key={language.language}
                                href={booksRoutes.index({
                                    query: {
                                        language: language.language,
                                    },
                                })}
                                className="flex items-center justify-between rounded-2xl bg-white/45 px-5 py-4 transition hover:bg-[#f2d4d0]"
                            >
                                <span className="font-semibold">
                                    {languageNames[language.language] ??
                                        language.language.toUpperCase()}
                                </span>
                                <span className="text-sm text-slate-500">
                                    {language.books_count} books
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {authors.length > 0 && (
                    <section className="py-12">
                        <div className="flex items-end justify-between gap-4">
                            <SectionHeading
                                title="Featured authors"
                                subtitle="Meet the voices behind the books"
                            />
                            <Link
                                href={authorsRoutes.index()}
                                className="hidden items-center gap-2 text-sm font-semibold text-[#B84E4E] sm:flex"
                            >
                                Meet all authors
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                            {authors.map((author) => (
                                <Link
                                    key={author.id}
                                    href={authorsRoutes.show(author.id)}
                                    className="rounded-2xl border border-[#dfcdbb] bg-white/35 p-4 text-center transition hover:-translate-y-1 hover:border-[#cf8989] hover:shadow-lg"
                                >
                                    <span className="mx-auto grid size-16 place-items-center overflow-hidden rounded-full bg-[#f2d4d0] font-bold text-[#B84E4E]">
                                        {author.image_url ? (
                                            <img
                                                src={author.image_url}
                                                alt=""
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            author.name.slice(0, 1)
                                        )}
                                    </span>
                                    <h3 className="mt-3 truncate font-semibold">
                                        {author.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {author.books_count} books
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}

function Section({
    title,
    subtitle,
    href,
    children,
}: {
    title: string;
    subtitle: string;
    href: ReturnType<typeof booksRoutes.index>;
    children: React.ReactNode;
}) {
    return (
        <section className="py-12">
            <div className="mb-7 flex items-end justify-between gap-4">
                <SectionHeading title={title} subtitle={subtitle} />
                <Link
                    href={href}
                    className="hidden items-center gap-2 text-sm font-semibold text-[#B84E4E] sm:flex"
                >
                    View all <ArrowRight className="size-4" />
                </Link>
            </div>
            {children}
        </section>
    );
}

function SectionHeading({
    title,
    subtitle,
}: {
    title: string;
    subtitle: string;
}) {
    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
                {subtitle}
            </p>
        </div>
    );
}
