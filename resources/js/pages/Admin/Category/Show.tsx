import { Head } from '@inertiajs/react';
import { Tag, Hash, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { Category } from '@/pages/Admin/Category/Column';

export default function Show({ category }: { category: Category }) {
    return (
        <>
            <Head title={category.name} />

            <div className="container mx-auto max-w-5xl p-6">
                <Card className="overflow-hidden">
                    <div className="h-32 bg-linear-to-r from-primary/20 via-primary/10 to-transparent" />

                    <CardContent className="relative px-8 pb-8">
                        <div className="-mt-12 flex items-center gap-5">
                            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-background bg-primary/10 shadow-md">
                                <Tag className="h-10 w-10 text-primary" />
                            </div>

                            <div className="flex-1">
                                <h1 className="text-4xl font-bold tracking-tight">
                                    {category.name}
                                </h1>

                                <p className="mt-1 text-muted-foreground">
                                    Category Details
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="outline">
                                        ID #{category.id}
                                    </Badge>

                                    {category.is_active ? (
                                        <Badge className="gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="destructive"
                                            className="gap-1"
                                        >
                                            <XCircle className="h-3 w-3" />
                                            Inactive
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Core category details
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4 rounded-lg border p-4">
                                <Tag className="h-8 w-8 text-primary" />

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Name
                                    </p>

                                    <p className="font-semibold">
                                        {category.name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-lg border p-4">
                                <Hash className="h-8 w-8 text-primary" />

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Slug
                                    </p>

                                    <code className="rounded bg-muted px-2 py-1 text-sm">
                                        {category.slug}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                            <CardDescription>
                                Current category state
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-center gap-4 rounded-lg border p-4">
                                {category.is_active ? (
                                    <>
                                        <CheckCircle2 className="h-8 w-8 text-green-500" />

                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Status
                                            </p>

                                            <p className="font-semibold">
                                                Active
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-8 w-8 text-red-500" />

                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Status
                                            </p>

                                            <p className="font-semibold">
                                                Inactive
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                        <CardDescription>
                            Information about this category
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {category.description ? (
                            <div className="flex gap-3">
                                <FileText className="mt-1 h-5 w-5 text-primary" />

                                <p className="leading-7 text-muted-foreground">
                                    {category.description}
                                </p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">
                                No description provided.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
