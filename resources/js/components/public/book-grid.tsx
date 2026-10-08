import { BookOpen } from 'lucide-react';
import type { PublicBook } from '@/types';
import { BookCard } from './book-card';

export function BookGrid({
    books,
    empty = 'No books found.',
}: {
    books: PublicBook[];
    empty?: string;
}) {
    if (books.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-[#cfb9a4] bg-white/40 px-6 py-16 text-center">
                <BookOpen className="mx-auto size-9 text-slate-400" />
                <p className="mt-3 font-medium text-slate-700">{empty}</p>
                <p className="mt-1 text-sm text-slate-500">
                    Try another search or check back after new books are added.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-x-12 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
            {books.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}
        </div>
    );
}
