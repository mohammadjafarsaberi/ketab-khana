import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BookReview } from '@/pages/Admin/BookReview/Column';

export default function Show({ bookReview }: { bookReview: BookReview }) {
    return (
        <div className="container mx-auto max-w-3xl p-8">
            <Head title="Review" />
            <Card>
                <CardHeader>
                    <CardTitle>{bookReview.book?.title ?? 'Review'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p>
                        <strong>User:</strong>{' '}
                        {bookReview.user?.name ?? bookReview.user?.email ?? '-'}
                    </p>
                    <p>
                        <strong>Rating:</strong> {bookReview.rating}/5
                    </p>
                    <p>
                        <strong>Status:</strong>{' '}
                        <Badge
                            variant={
                                bookReview.moderation_status === 'approved'
                                    ? 'default'
                                    : 'secondary'
                            }
                        >
                            {bookReview.moderation_status}
                        </Badge>
                    </p>
                    <p className="leading-7">
                        <strong>Review:</strong> {bookReview.review_text}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
