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
            <div className="flex flex-col gap-7 p-4 md:p-6">
                <div className="rounded-2xl bg-gradient-to-r from-[#B84E4E] to-[#8f3737] px-6 py-7 text-white shadow-[0_18px_45px_-24px_rgba(111,41,41,0.75)]">
                    <p className="mb-2 text-xs font-bold tracking-[0.18em] text-white/70 uppercase">
                        Admin dashboard
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Ketab Khana overview
                    </h1>
                    <p className="mt-1 text-sm text-white/75">
                        Catalog and member activity at a glance.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statDefinitions.map(([key, label, Icon], index) => (
                        <Card
                            key={key}
                            className="group relative overflow-hidden border-[#dfcdbb] bg-gradient-to-br from-[#fffaf5] via-[#fff8f1] to-[#efd8c5] shadow-[0_12px_35px_-22px_rgba(86,43,32,0.75)] transition duration-300 hover:-translate-y-1 hover:border-[#cf8989] hover:shadow-[0_20px_45px_-22px_rgba(111,41,41,0.65)]"
                        >
                            <div className="pointer-events-none absolute -right-8 -bottom-10 size-28 rounded-full bg-[#B84E4E]/8 transition-transform duration-300 group-hover:scale-125" />
                            <CardContent className="relative flex min-h-32 items-center justify-between gap-4 p-5">
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs font-bold tracking-[0.12em] text-[#87675a] uppercase">
                                        {label}
                                    </p>
                                    <p className="text-3xl font-bold tracking-tight text-[#4d3029]">
                                        {stats[key].toLocaleString()}
                                    </p>
                                    <span className="h-1 w-9 rounded-full bg-[#B84E4E]/70 transition-all duration-300 group-hover:w-14" />
                                </div>
                                <span
                                    className={`grid size-12 shrink-0 place-items-center rounded-2xl shadow-sm ring-1 ring-[#B84E4E]/10 ${index % 2 === 0 ? 'bg-[#B84E4E] text-white' : 'bg-[#f2d4d0] text-[#963d3d]'}`}
                                >
                                    <Icon className="size-5" />
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="overflow-hidden border-[#dfcdbb] bg-[#fffaf5] shadow-[0_16px_45px_-28px_rgba(86,43,32,0.8)]">
                    <CardHeader className="border-b border-[#ead7c3] bg-gradient-to-r from-[#fffaf5] to-[#f2dfd4]">
                        <CardTitle className="text-[#4d3029]">
                            Recent downloads
                        </CardTitle>
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
