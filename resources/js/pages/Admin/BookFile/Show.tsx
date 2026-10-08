import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BookFile } from '@/pages/Admin/BookFile/Column';

export default function Show({ bookFile }: { bookFile: BookFile }) {
    return (
        <div className="container mx-auto max-w-3xl p-8">
            <Head title="Book File" />
            <Card>
                <CardHeader>
                    <CardTitle>{bookFile.book?.title ?? 'Book File'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p>
                        <strong>Format:</strong>{' '}
                        <Badge variant="secondary">
                            {bookFile.format.toUpperCase()}
                        </Badge>
                    </p>
                    <p>
                        <strong>Language:</strong> {bookFile.language ?? '-'}
                    </p>
                    <p>
                        <strong>Version:</strong> {bookFile.version ?? '-'}
                    </p>
                    <p>
                        <strong>File:</strong>{' '}
                        {bookFile.file_name ?? `File #${bookFile.id}`}
                    </p>
                    <p className="text-muted-foreground">
                        The binary is stored privately and is not directly
                        accessible.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
