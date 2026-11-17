/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- Legacy page retained temporarily; no route exposes download creation.
import { Form, Head } from '@inertiajs/react';
import { FormSelect } from '@/components/form-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const store = () => ({ url: '#', method: 'post' as const });
import type { Option } from '@/pages/Admin/Book/Column';
import type { BookFileOption } from '@/pages/Admin/BookDownload/Column';

export default function Create({
    books,
    bookFiles,
    users,
}: {
    books: Option[];
    bookFiles: BookFileOption[];
    users: Option[];
}) {
    return (
        <div className="container mx-auto max-w-2xl p-8">
            <Head title="Create Download" />
            <Form action={store()} method="post" resetOnSuccess>
                {({ errors, processing, reset }) => (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="book_id">Book</Label>
                            <FormSelect
                                id="book_id"
                                name="book_id"
                                placeholder="Select book"
                                options={books.map((book) => ({
                                    value: book.id,
                                    label: book.title,
                                }))}
                            />
                            {errors.book_id && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.book_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="book_file_id">Book File</Label>
                            <FormSelect
                                id="book_file_id"
                                name="book_file_id"
                                placeholder="No specific file"
                                options={bookFiles.map((file) => ({
                                    value: file.id,
                                    label: `#${file.id} ${file.book?.title ?? 'Book'} - ${file.format.toUpperCase()}`,
                                }))}
                            />
                            {errors.book_file_id && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.book_file_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="user_id">User</Label>
                            <FormSelect
                                id="user_id"
                                name="user_id"
                                placeholder="Select user"
                                options={users.map((user) => ({
                                    value: user.id,
                                    label: user.name ?? user.email,
                                }))}
                            />
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
                            />
                            {errors.downloaded_at && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.downloaded_at}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Download'}
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
