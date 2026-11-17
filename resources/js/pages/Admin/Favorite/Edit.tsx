/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- Legacy page retained temporarily; favorites are read-only.
import { Form, Head } from '@inertiajs/react';
import { FormSelect } from '@/components/form-select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const update = () => ({ url: '#', method: 'put' as const });
import type { Option } from '@/pages/Admin/Book/Column';
import type { Favorite } from '@/pages/Admin/Favorite/Column';

export default function Edit({
    favorite,
    books,
    users,
}: {
    favorite: Favorite;
    books: Option[];
    users: Option[];
}) {
    return (
        <div className="container mx-auto max-w-2xl p-8">
            <Head title="Edit Favorite" />
            <Form {...update.form(favorite.id)}>
                {({ errors, processing, defaults }) => (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="book_id">Book</Label>
                            <FormSelect
                                id="book_id"
                                name="book_id"
                                defaultValue={favorite.book_id}
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
                                defaultValue={favorite.user_id}
                                options={users.map((user) => ({
                                    value: user.id,
                                    label: user.name ?? user.email,
                                }))}
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Favorite'}
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
