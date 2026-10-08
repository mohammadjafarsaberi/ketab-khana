import { Link, router, usePage } from '@inertiajs/react';
import { BookOpen, Heart } from 'lucide-react';
import { login } from '@/routes';
import books from '@/routes/books';
import type { PublicBook } from '@/types';

export function BookCard({
    book,
    compact = false,
}: {
    book: PublicBook;
    compact?: boolean;
}) {
    const user = usePage().props.auth.user;

    const toggleFavorite = () => {
        if (!user) {
            router.visit(
                login.url({ query: { redirect: books.show.url(book.slug) } }),
            );

            return;
        }

        router.post(
            books.favorite.url(book.slug),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <article className={`group min-w-0 ${compact ? 'mb-2' : 'mb-6'}`}>
            <div
                className={`relative aspect-[3/4.2] overflow-hidden rounded-md bg-[#eedfcd] shadow-sm ring-1 ring-[#dfcdbb] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-[#6f2929]/10 ${compact ? 'mb-3' : 'mb-4'}`}
            >
                <Link
                    href={books.show(book.slug)}
                    className="relative block h-full overflow-hidden"
                >
                    {book.cover_url ? (
                        <img
                            src={book.cover_url}
                            alt={`Cover of ${book.title}`}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#f8e1dc] to-[#e8aaa4] p-6 text-center text-[#6f2929]">
                            <BookOpen className="size-9" />
                            <span className="line-clamp-3 font-semibold">
                                {book.title}
                            </span>
                        </div>
                    )}
                    <span className="pointer-events-none absolute inset-0 bg-[#B84E4E]/0 transition-colors duration-300 group-hover:bg-[#B84E4E]/12" />
                </Link>
                <button
                    type="button"
                    onClick={toggleFavorite}
                    aria-label={
                        book.is_favorited
                            ? 'Remove from library'
                            : 'Save to library'
                    }
                    className={`absolute z-10 grid place-items-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:scale-105 hover:bg-[#fff7f2] hover:text-[#B84E4E] ${compact ? 'top-2 right-2 size-8' : 'top-3 right-3 size-9'}`}
                >
                    <Heart
                        className={`size-4 ${book.is_favorited ? 'fill-[#B84E4E] text-[#B84E4E]' : ''}`}
                    />
                </button>
            </div>
            <div className={compact ? 'space-y-1' : 'space-y-2.5'}>
                <Link href={books.show(book.slug)} className="block">
                    <h3
                        className={`line-clamp-2 font-semibold tracking-tight text-slate-950 transition group-hover:text-[#B84E4E] ${compact ? 'text-sm leading-5' : ''}`}
                    >
                        {book.title}
                    </h3>
                    <p
                        className={`mt-1 truncate text-slate-500 ${compact ? 'text-xs' : 'text-sm'}`}
                    >
                        {book.author.name}
                    </p>
                </Link>
                {!compact && book.tags.length > 0 && (
                    <div className="flex min-h-7 flex-wrap gap-1.5">
                        {book.tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="cursor-default rounded-full bg-[#ead7c3] px-2.5 py-1 text-[11px] font-medium text-[#704b3d] transition hover:bg-[#dca8a3] hover:text-[#6f2929]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                {!compact && (
                    <div className="flex items-center justify-between border-t border-[#dfcdbb] pt-2.5 text-[11px] font-medium text-slate-500">
                        <span className="truncate pr-2">
                            {book.category.name}
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 uppercase">
                            {book.language}
                            {book.published_year && (
                                <>
                                    <span
                                        aria-hidden="true"
                                        className="size-1 rounded-full bg-[#c7a98f]"
                                    />
                                    <span>{book.published_year}</span>
                                </>
                            )}
                            {book.files[0] && (
                                <>
                                    <span
                                        aria-hidden="true"
                                        className="size-1 rounded-full bg-[#c7a98f]"
                                    />
                                    <span>{book.files[0].format}</span>
                                </>
                            )}
                        </span>
                    </div>
                )}
            </div>
        </article>
    );
}
