import { Head } from '@inertiajs/react';
import { BookGrid } from '@/components/public/book-grid';
import type { PaginatedBooks } from '@/types';

export default function CategoryPage({
    category,
    books,
}: {
    category: { name: string; description: string | null };
    books: PaginatedBooks;
}) {
    return (
        <>
            <Head title={category.name} />
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <header className="mb-10 max-w-3xl">
                    <p className="text-sm font-bold text-[#B84E4E] uppercase">
                        Category
                    </p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="mt-4 text-lg leading-8 text-slate-600">
                            {category.description}
                        </p>
                    )}
                    <p className="mt-3 text-sm text-slate-500">
                        {books.meta.total} available books
                    </p>
                </header>
                <BookGrid books={books.data} />
            </div>
        </>
    );
}
