import { Head } from "@inertiajs/react";
import {
    User,
    BookOpen,
    FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import type { Author } from '@/pages/Admin/Author/Column';



export default function Show({author,}: {
    author: Author;
}) {

    return (
        <>
            <Head title={author.name} />

            <div className="container mx-auto max-w-6xl p-6">
                <Card className="overflow-hidden border-border/50">
                    <div className="relative h-40 bg-linear-to-r from-primary/20 via-primary/10 to-transparent" />

                    <CardContent className="relative px-8 pb-8">
                        <div className="-mt-20 flex flex-col gap-6 md:flex-row md:items-end">
                            <div className="overflow-hidden rounded-2xl border-4 border-background shadow-lg">
                                {author.image ? (
                                    <img
                                        src={author.image}
                                        alt={author.name}
                                        className="h-40 w-40 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-40 w-40 items-center justify-center bg-muted">
                                        <User className="h-16 w-16 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <h1 className="text-4xl font-bold tracking-tight">
                                    {author.name}
                                </h1>

                                <p className="mt-2 text-muted-foreground">
                                    Author Profile
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Badge
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        <BookOpen className="h-3 w-3" />
                                        {author.books_count} Books
                                    </Badge>

                                    <Badge
                                        variant="outline"
                                        className="gap-1"
                                    >
                                        ID #{author.id}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                Biography
                            </CardTitle>

                            <CardDescription>
                                Information about the author
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {author.bio ? (
                                <p className="leading-7 text-muted-foreground">
                                    {author.bio}
                                </p>
                            ) : (
                                <p className="italic text-muted-foreground">
                                    No biography available.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Statistics
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4 rounded-lg border p-4">
                                <BookOpen className="h-8 w-8 text-primary" />

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Books
                                    </p>

                                    <p className="text-2xl font-bold">
                                        {author.books_count}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-lg border p-4">
                                <FileText className="h-8 w-8 text-primary" />

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Author ID
                                    </p>

                                    <p className="font-semibold">
                                        #{author.id}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
