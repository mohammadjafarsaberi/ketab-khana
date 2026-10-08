import { Form, Head } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/BookFileController';
import { FileInput } from '@/components/file-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Option } from '@/pages/Admin/Book/Column';

export default function Create({ books }: { books: Option[] }) {
    return (
        <div className="container mx-auto max-w-2xl p-8">
            <Head title="Create Book File" />
            <Form action={store()} method="post" resetOnSuccess>
                {({ errors, processing, reset }) => (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="book_id">Book</Label>
                            <select
                                id="book_id"
                                name="book_id"
                                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                            >
                                <option value="">Select book</option>
                                {books.map((book) => (
                                    <option key={book.id} value={book.id}>
                                        {book.title}
                                    </option>
                                ))}
                            </select>
                            {errors.book_id && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.book_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="format">Format</Label>
                            <select
                                id="format"
                                name="format"
                                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                            >
                                <option value="pdf">PDF</option>
                                <option value="epub">EPUB</option>
                                <option value="mobi">MOBI</option>
                            </select>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="language">Language</Label>
                                <Input
                                    id="language"
                                    name="language"
                                    placeholder="en, fa, ps"
                                />
                            </div>
                            <div>
                                <Label htmlFor="version">Version</Label>
                                <Input id="version" name="version" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="file">File</Label>
                            <FileInput
                                id="file"
                                name="file"
                                accept=".pdf,.epub,.mobi"
                            />
                            {errors.file && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.file}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Creating...'
                                    : 'Create Book File'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </div>
    );
}
