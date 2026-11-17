/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- Legacy page retained temporarily; reviews are user-authored.
import { Form, Head } from '@inertiajs/react';
import { FormSelect } from '@/components/form-select';
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
                            <Label htmlFor="rating">Rating</Label>
                            <FormSelect
                                id="rating"
                                name="rating"
                                defaultValue={1}
                                options={[1, 2, 3, 4, 5].map((rating) => ({
                                    value: rating,
                                    label: rating,
                                }))}
                            />
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
