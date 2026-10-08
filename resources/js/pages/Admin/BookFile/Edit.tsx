import { Form, Head } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/BookFileController';
import { FileInput } from '@/components/file-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Option } from '@/pages/Admin/Book/Column';
import type { BookFile } from '@/pages/Admin/BookFile/Column';

export default function Edit({
    bookFile,
    books,
}: {
    bookFile: BookFile;
    books: Option[];
}) {
    return (
        <div className="container mx-auto max-w-2xl p-8">
            <Head title="Edit Book File" />
            <Form {...update.form(bookFile.id)}>
                {({ errors, processing, defaults }) => (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="book_id">Book</Label>
                            <select
                                id="book_id"
                                name="book_id"
                                defaultValue={bookFile.book_id}
                                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                            >
                                {books.map((book) => (
                                    <option key={book.id} value={book.id}>
                                        {book.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="format">Format</Label>
                            <select
                                id="format"
                                name="format"
                                defaultValue={bookFile.format}
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
                                    defaultValue={bookFile.language ?? ''}
                                />
                            </div>
                            <div>
                                <Label htmlFor="version">Version</Label>
                                <Input
                                    id="version"
                                    name="version"
                                    defaultValue={bookFile.version ?? ''}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="file">Replace File</Label>
                            <FileInput
                                id="file"
                                name="file"
                                accept=".pdf,.epub,.mobi"
                                existingFileName={bookFile.file_name}
                            />
                            {errors.file && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.file}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Book File'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => defaults()}
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
