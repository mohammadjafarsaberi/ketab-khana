import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Book } from '@/pages/Admin/Book/Column';

export default function Show({ book }: { book: Book }) {
    return (
        <div className="container mx-auto max-w-5xl p-8">
            <Head title={book.title} />
            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                <Card>
                    <CardContent className="p-4">
                        {book.cover_image ? (
                            <img
                                src={book.cover_image}
                                alt={book.title}
                                className="aspect-[3/4] w-full rounded-md object-cover"
                            />
                        ) : (
                            <div className="flex aspect-[3/4] items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                                No cover
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <CardTitle>{book.title}</CardTitle>
                            <Badge
                                variant={
                                    book.is_active ? 'default' : 'secondary'
                                }
                            >
                                {book.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <p>
                            <strong>Author:</strong> {book.author?.name ?? '-'}
                        </p>
                        <p>
                            <strong>Category:</strong>{' '}
                            {book.category?.name ?? '-'}
                        </p>
                        <p>
                            <strong>Language:</strong> {book.language}
                        </p>
                        <p>
                            <strong>ISBN:</strong> {book.isbn ?? '-'}
                        </p>
                        <p>
                            <strong>Pages:</strong> {book.pages ?? '-'}
                        </p>
                        <p>
                            <strong>Published:</strong>{' '}
                            {book.published_year ?? '-'}
                        </p>
                        <p>
                            <strong>Tags:</strong> {book.tags_text ?? '-'}
                        </p>
                        <p className="leading-7">
                            <strong>Description:</strong>{' '}
                            {book.description ?? '-'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
