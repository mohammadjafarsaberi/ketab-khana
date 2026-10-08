import { Head } from '@inertiajs/react';
import {
    BookOpen,
    Download,
    FileText,
    FolderOpen,
    MessageSquare,
    UserRoundPen,
    Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { BookDownload } from '@/pages/Admin/BookDownload/Column';
import { dashboard } from '@/routes/admin';

type DashboardStats = {
    books: number;
    book_files: number;
    authors: number;
    categories: number;
    users: number;
    pending_reviews: number;
    downloads: number;
};

const statDefinitions = [
    ['books', 'Books', BookOpen],
    ['book_files', 'Book files', FileText],
    ['authors', 'Authors', UserRoundPen],
    ['categories', 'Categories', FolderOpen],
    ['users', 'Users', Users],
    ['pending_reviews', 'Pending reviews', MessageSquare],
    ['downloads', 'Downloads', Download],
] as const;

export default function Dashboard({
    stats,
    recentDownloads,
}: {
    stats: DashboardStats;
    recentDownloads: BookDownload[];
}) {
    return (
        <>
            <Head title="Admin dashboard" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Library overview
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Catalog and member activity at a glance.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statDefinitions.map(([key, label, Icon]) => (
                        <Card key={key}>
                            <CardContent className="flex items-center justify-between p-5">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {label}
                                    </p>
                                    <p className="text-2xl font-semibold">
                                        {stats[key].toLocaleString()}
                                    </p>
                                </div>
                                <Icon className="h-5 w-5 text-muted-foreground" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent downloads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Book</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Format</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentDownloads.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center text-muted-foreground"
                                        >
                                            No download activity yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentDownloads.map((download) => (
                                        <TableRow key={download.id}>
                                            <TableCell>
                                                {download.book?.title ?? '-'}
                                            </TableCell>
                                            <TableCell>
                                                {download.user?.name ??
                                                    download.user?.email ??
                                                    '-'}
                                            </TableCell>
                                            <TableCell>
                                                {download.file?.format.toUpperCase() ??
                                                    '-'}
                                            </TableCell>
                                            <TableCell>
                                                {download.downloaded_at ?? '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = { breadcrumbs: [{ title: 'Dashboard', href: dashboard() }] };
