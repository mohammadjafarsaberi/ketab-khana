import { Head } from '@inertiajs/react';
import { AvatarWithFallback } from '@/components/AvatarWithFallback';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AdminUser } from '@/pages/Admin/User/Column';

export default function Show({ user }: { user: AdminUser }) {
    return (
        <div className="container mx-auto max-w-4xl p-8">
            <Head title={user.name} />
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <AvatarWithFallback
                            image={user.avatar}
                            name={user.name}
                            className="h-16 w-16"
                        />
                        <div>
                            <CardTitle>{user.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                        <Badge
                            variant={user.is_banned ? 'destructive' : 'default'}
                            className="ml-auto"
                        >
                            {user.is_banned ? 'Banned' : 'Active'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm md:grid-cols-2">
                    <p>
                        <strong>Provider:</strong> {user.provider ?? 'email'}
                    </p>
                    <p>
                        <strong>Total Downloads:</strong> {user.total_downloads}
                    </p>
                    <p>
                        <strong>Last Download:</strong>{' '}
                        {user.last_download_at ?? '-'}
                    </p>
                    <p>
                        <strong>Favorites:</strong> {user.favorites_count ?? 0}
                    </p>
                    <p>
                        <strong>Reviews:</strong> {user.reviews_count ?? 0}
                    </p>
                    <p>
                        <strong>Downloads:</strong> {user.downloads_count ?? 0}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
