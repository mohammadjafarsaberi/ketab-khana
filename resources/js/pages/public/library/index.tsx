import { Head, Link } from '@inertiajs/react';
import { Clock3, Heart, Library } from 'lucide-react';
import { BookGrid } from '@/components/public/book-grid';
import books from '@/routes/books';
import type { PublicBook } from '@/types';

type DownloadRecord = {
    id: number;
    downloaded_at: string;
    format: string | null;
    book: PublicBook;
};

export default function MyLibrary({
    favorites,
    downloads,
}: {
    favorites: PublicBook[];
    downloads: DownloadRecord[];
}) {
    return (
        <>
            <Head title="My Library" />
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <header>
                    <p className="text-sm font-bold text-[#B84E4E] uppercase">
                        Your reading space
                    </p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                        My Library
                    </h1>
                    <p className="mt-3 text-slate-600">
                        Saved books and your recent download activity, together
                        in one place.
                    </p>
                </header>
                <section className="mt-12">
                    <h2 className="mb-7 flex items-center gap-2 text-2xl font-bold">
                        <Heart className="size-5 text-[#B84E4E]" />
                        Saved books
                    </h2>
                    <BookGrid
                        books={favorites}
                        empty="You have not saved any books yet."
                    />
                </section>
                <section className="mt-16 border-t border-slate-200 pt-12">
                    <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                        <Clock3 className="size-5 text-[#B84E4E]" />
                        Download history
                    </h2>
                    {downloads.length === 0 ? (
                        <div className="rounded-3xl bg-white/40 px-6 py-12 text-center text-slate-500">
                            <Library className="mx-auto mb-3 size-8" />
                            Your downloads will appear here.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
                            {downloads.map((download) => (
                                <Link
                                    key={download.id}
                                    href={books.show(download.book.slug)}
                                    className="flex items-center gap-4 p-4 transition hover:bg-[#f2d4d0]"
                                >
                                    <div className="h-16 w-12 overflow-hidden rounded-lg bg-[#f2d4d0]">
                                        {download.book.cover_url && (
                                            <img
                                                src={download.book.cover_url}
                                                alt=""
                                                className="size-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate font-semibold">
                                            {download.book.title}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {download.book.author.name}
                                        </p>
                                    </div>
                                    <div className="text-right text-xs text-slate-500">
                                        <p className="font-semibold text-slate-700 uppercase">
                                            {download.format}
                                        </p>
                                        <time>
                                            {new Date(
                                                download.downloaded_at,
                                            ).toLocaleDateString()}
                                        </time>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
