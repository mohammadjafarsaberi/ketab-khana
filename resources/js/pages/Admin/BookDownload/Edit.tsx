/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- Legacy page retained temporarily; downloads are read-only.
import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const update = () => ({ url: '#', method: 'put' as const });
import type { Option } from '@/pages/Admin/Book/Column';
import type {
    BookDownload,
    BookFileOption,
} from '@/pages/Admin/BookDownload/Column';

export default function Edit({
    bookDownload,
    books,
    bookFiles,
    users,
}: {
    bookDownload: BookDownload;
    books: Option[];
    bookFiles: BookFileOption[];
    users: Option[];
}) {
    return (
        <div className="container mx-auto max-w-2xl p-8">
            <Head title="Edit Download" />
            <Form {...update.form(bookDownload.id)}>
                {({ errors, processing, defaults }) => (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="book_id">Book</Label>
                            <select
                                id="book_id"
                                name="book_id"
                                defaultValue={bookDownload.book_id}
                                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                            >
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
                            <Label htmlFor="book_file_id">Book File</Label>
                            <select
                                id="book_file_id"
                                name="book_file_id"
                                defaultValue={bookDownload.book_file_id ?? ''}
                                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                            >
                                <option value="">No specific file</option>
                                {bookFiles.map((file) => (
                                    <option key={file.id} value={file.id}>
                                        #{file.id} {file.book?.title ?? 'Book'}{' '}
                                        - {file.format.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            {errors.book_file_id && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.book_file_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="user_id">User</Label>
                            <select
                                id="user_id"
                                name="user_id"
                                defaultValue={bookDownload.user_id}
                                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                            >
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name ?? user.email}
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.user_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="downloaded_at">Downloaded At</Label>
                            <Input
                                id="downloaded_at"
                                name="downloaded_at"
                                type="datetime-local"
                                defaultValue={
                                    bookDownload.downloaded_at_input ?? ''
                                }
                            />
                            {errors.downloaded_at && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.downloaded_at}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Download'}
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
