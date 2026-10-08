import { Head } from '@inertiajs/react';
import { BookGrid } from '@/components/public/book-grid';
import type { PaginatedBooks } from '@/types';

export default function AuthorPage({
    author,
    books,
}: {
    author: { name: string; bio: string | null; image_url: string | null };
    books: PaginatedBooks;
}) {
    return (
        <>
            <Head title={author.name} />
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <header className="mb-12 flex max-w-4xl flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="grid size-28 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f2d4d0] text-3xl font-bold text-[#B84E4E]">
                        {author.image_url ? (
                            <img
                                src={author.image_url}
                                alt={author.name}
                                className="size-full object-cover"
                            />
                        ) : (
                            author.name.slice(0, 1)
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#B84E4E] uppercase">
                            Author
                        </p>
                        <h1 className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">
                            {author.name}
                        </h1>
                        {author.bio && (
                            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                                {author.bio}
                            </p>
                        )}
                    </div>
                </header>
                <BookGrid books={books.data} />
            </div>
        </>
    );
}
