import { Form, Head } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/BookReviewController';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Option } from '@/pages/Admin/Book/Column';
import type { BookReview } from '@/pages/Admin/BookReview/Column';

export default function Edit({
    bookReview,
    books,
    users,
}: {
    bookReview: BookReview;
    books: Option[];
    users: Option[];
}) {
    return (
        <div className="container mx-auto max-w-2xl p-8">
            <Head title="Edit Review" />
            <Form {...update.form(bookReview.id)}>
                {({ errors, processing, defaults }) => (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="book_id">Book</Label>
                            <select
                                id="book_id"
                                name="book_id"
                                defaultValue={bookReview.book_id}
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
                            <Label htmlFor="user_id">User</Label>
                            <select
                                id="user_id"
                                name="user_id"
                                defaultValue={bookReview.user_id}
                                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                            >
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name ?? user.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="rating">Rating</Label>
                            <select
                                id="rating"
                                name="rating"
                                defaultValue={bookReview.rating}
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
                                defaultValue={bookReview.review_text}
                            />
                            {errors.review_text && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.review_text}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_approved"
                                name="is_approved"
                                defaultChecked={bookReview.is_approved}
                            />
                            <Label htmlFor="is_approved">Approved</Label>
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Review'}
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
