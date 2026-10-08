import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Favorite } from '@/pages/Admin/Favorite/Column';

export default function Show({ favorite }: { favorite: Favorite }) {
    return (
        <div className="container mx-auto max-w-3xl p-8">
            <Head title="Favorite" />
            <Card>
                <CardHeader>
                    <CardTitle>Favorite #{favorite.id}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p>
                        <strong>Book:</strong> {favorite.book?.title ?? '-'}
                    </p>
                    <p>
                        <strong>User:</strong>{' '}
                        {favorite.user?.name ?? favorite.user?.email ?? '-'}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
