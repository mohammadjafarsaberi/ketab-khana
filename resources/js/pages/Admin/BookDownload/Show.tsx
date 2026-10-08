import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BookDownload } from '@/pages/Admin/BookDownload/Column';

export default function Show({ bookDownload }: { bookDownload: BookDownload }) {
    return (
        <div className="container mx-auto max-w-3xl p-8">
            <Head title="Download" />
            <Card>
                <CardHeader>
                    <CardTitle>Download #{bookDownload.id}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p>
                        <strong>Book:</strong> {bookDownload.book?.title ?? '-'}
                    </p>
                    <p>
                        <strong>User:</strong>{' '}
                        {bookDownload.user?.name ??
                            bookDownload.user?.email ??
                            '-'}
                    </p>
                    <p>
                        <strong>File:</strong>{' '}
                        {bookDownload.file
                            ? `${bookDownload.file.format.toUpperCase()} #${bookDownload.file.id}`
                            : '-'}
                    </p>
                    <p>
                        <strong>Downloaded At:</strong>{' '}
                        {bookDownload.downloaded_at ?? '-'}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
