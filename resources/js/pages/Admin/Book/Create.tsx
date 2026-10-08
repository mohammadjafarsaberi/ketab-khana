import { Form, Head } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/BookController';
import { FileInput } from '@/components/file-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Option } from '@/pages/Admin/Book/Column';

export default function Create({
    authors,
    categories,
}: {
    authors: Option[];
    categories: Option[];
}) {
    return (
        <div className="container mx-auto max-w-3xl p-8">
            <Head title="Create Book" />
            <Form action={store()} method="post" resetOnSuccess>
                {({ errors, processing, reset }) => (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" name="slug" />
                            {errors.slug && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.slug}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="author_id">Author</Label>
                                <select
                                    id="author_id"
                                    name="author_id"
                                    className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                >
                                    <option value="">Select author</option>
                                    {authors.map((author) => (
                                        <option
                                            key={author.id}
                                            value={author.id}
                                        >
                                            {author.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.author_id && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.author_id}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="category_id">Category</Label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="language">Language</Label>
                                <Input
                                    id="language"
                                    name="language"
                                    placeholder="en, fa, ps"
                                />
                                {errors.language && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.language}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="pages">Pages</Label>
                                <Input id="pages" name="pages" type="number" />
                            </div>
                            <div>
                                <Label htmlFor="published_year">
                                    Published Year
                                </Label>
                                <Input
                                    id="published_year"
                                    name="published_year"
                                    type="number"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="isbn">ISBN</Label>
                            <Input id="isbn" name="isbn" />
                        </div>
                        <div>
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                name="tags"
                                placeholder="fiction, history, science"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={5}
                            />
                        </div>
                        <div>
                            <Label htmlFor="cover_image">Cover Image</Label>
                            <FileInput
                                id="cover_image"
                                name="cover_image"
                                accept="image/*"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_active"
                                name="is_active"
                                value="1"
                                defaultChecked
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Book'}
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
