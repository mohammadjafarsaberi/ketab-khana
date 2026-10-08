import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bookmark,
    Download,
    FileText,
    Heart,
    Languages,
    Library,
    UserRound,
} from 'lucide-react';
import { BookGrid } from '@/components/public/book-grid';
import { login } from '@/routes';
import authors from '@/routes/authors';
import books from '@/routes/books';
import categories from '@/routes/categories';
import type { PublicBook } from '@/types';

export default function ShowBook({
    book,
    relatedBooks,
}: {
    book: PublicBook;
    relatedBooks: PublicBook[];
}) {
    const user = usePage().props.auth.user;
    const favorite = () =>
        user
            ? router.post(
                  books.favorite.url(book.slug),
                  {},
                  { preserveScroll: true },
              )
            : router.visit(
                  login.url({ query: { redirect: books.show.url(book.slug) } }),
              );

    return (
        <>
            <Head title={book.title} />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-16">
                    <div>
                        <div className="aspect-[3/4.2] overflow-hidden rounded-3xl bg-gradient-to-br from-[#f8e1dc] to-[#e8aaa4] shadow-xl ring-1 shadow-[#6f2929]/10 ring-[#dfcdbb]">
                            {book.cover_url ? (
                                <img
                                    src={book.cover_url}
                                    alt={`Cover of ${book.title}`}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="grid size-full place-items-center">
                                    <Library className="size-20 text-[#cf8989]" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="py-2">
                        <Link
                            href={categories.show(book.category.slug)}
                            className="text-sm font-bold tracking-wide text-[#B84E4E] uppercase"
                        >
                            {book.category.name}
                        </Link>
                        <h1 className="mt-3 text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl">
                            {book.title}
                        </h1>
                        <Link
                            href={authors.show(book.author.id)}
                            className="mt-3 inline-flex items-center gap-2 text-lg text-slate-600 hover:text-[#B84E4E]"
                        >
                            <UserRound className="size-4" />
                            {book.author.name}
                        </Link>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <Meta
                                icon={<Languages />}
                                label={book.language.toUpperCase()}
                            />
                            {book.pages && (
                                <Meta
                                    icon={<FileText />}
                                    label={`${book.pages} pages`}
                                />
                            )}
                            {book.published_year && (
                                <Meta
                                    icon={<Bookmark />}
                                    label={String(book.published_year)}
                                />
                            )}
                        </div>
                        <p className="mt-8 max-w-3xl text-base leading-8 whitespace-pre-line text-slate-600">
                            {book.description ||
                                'No description is available for this book yet.'}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                onClick={favorite}
                                className="inline-flex h-12 items-center gap-2 rounded-full border border-[#cfb9a4] px-5 font-semibold text-slate-800 hover:bg-[#f2d4d0]"
                            >
                                <Heart
                                    className={`size-4 ${book.is_favorited ? 'fill-[#B84E4E] text-[#B84E4E]' : ''}`}
                                />
                                {book.is_favorited
                                    ? 'Saved'
                                    : 'Save to library'}
                            </button>
                        </div>
                        {book.files.length > 0 && (
                            <div className="mt-10">
                                <h2 className="font-semibold">
                                    Available downloads
                                </h2>
                                <div className="mt-3 flex flex-wrap gap-3">
                                    {book.files.map((file) =>
                                        user ? (
                                            <a
                                                key={file.id}
                                                href={books.download.url({
                                                    book: book.slug,
                                                    bookFile: file.id,
                                                })}
                                                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#B84E4E] px-5 font-semibold text-white hover:bg-[#963d3d]"
                                            >
                                                <Download className="size-4" />
                                                Download{' '}
                                                {file.format.toUpperCase()}
                                            </a>
                                        ) : (
                                            <Link
                                                key={file.id}
                                                href={books.download({
                                                    book: book.slug,
                                                    bookFile: file.id,
                                                })}
                                                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#B84E4E] px-5 font-semibold text-white"
                                            >
                                                <Download className="size-4" />
                                                Sign in to download
                                            </Link>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {relatedBooks.length > 0 && (
                    <section className="mt-20 border-t border-slate-200 pt-12">
                        <h2 className="mb-7 text-2xl font-bold">
                            You may also like
                        </h2>
                        <BookGrid books={relatedBooks} />
                    </section>
                )}
            </div>
        </>
    );
}

function Meta({ icon, label }: { icon: React.ReactElement; label: string }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
            {<span className="[&>svg]:size-4">{icon}</span>}
            {label}
        </span>
    );
}
