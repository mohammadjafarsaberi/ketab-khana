/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- Legacy page retained temporarily; reviews are user-authored.
import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const store = () => ({ url: '#', method: 'post' as const });
import { Textarea } from '@/components/ui/textarea';
import type { Option } from '@/pages/Admin/Book/Column';

export default function Create({
    books,
    users,
}: {
    books: Option[];
    users: Option[];
}) {
    return (
        <div className="container mx-auto max-w-2xl p-8">
            <Head title="Create Review" />
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
                            <Label htmlFor="user_id">User</Label>
                            <select
                                id="user_id"
                                name="user_id"
                                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                            >
                                <option value="">Select user</option>
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
                            <Label htmlFor="rating">Rating</Label>
                            <select
                                id="rating"
                                name="rating"
                                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                            >
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="review_text">Review</Label>
                            <Textarea
                                id="review_text"
                                name="review_text"
                                rows={5}
                            />
                            {errors.review_text && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.review_text}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="is_approved" name="is_approved" />
                            <Label htmlFor="is_approved">Approved</Label>
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Review'}
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
