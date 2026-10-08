import { Form, Head } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/BookController';
import { FileInput } from '@/components/file-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Book, Option } from '@/pages/Admin/Book/Column';

export default function Edit({
    book,
    authors,
    categories,
}: {
    book: Book;
    authors: Option[];
    categories: Option[];
}) {
    return (
        <div className="container mx-auto max-w-3xl p-8">
            <Head title={`Edit ${book.title}`} />
            <Form {...update.form(book.id)}>
                {({ errors, processing, defaults }) => (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={book.title}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                name="slug"
                                defaultValue={book.slug}
                            />
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
                                    defaultValue={book.author_id}
                                    className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                >
                                    {authors.map((author) => (
                                        <option
                                            key={author.id}
                                            value={author.id}
                                        >
                                            {author.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="category_id">Category</Label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    defaultValue={book.category_id}
                                    className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="language">Language</Label>
                                <Input
                                    id="language"
                                    name="language"
                                    defaultValue={book.language}
                                />
                            </div>
                            <div>
                                <Label htmlFor="pages">Pages</Label>
                                <Input
                                    id="pages"
                                    name="pages"
                                    type="number"
                                    defaultValue={book.pages ?? ''}
                                />
                            </div>
                            <div>
                                <Label htmlFor="published_year">
                                    Published Year
                                </Label>
                                <Input
                                    id="published_year"
                                    name="published_year"
                                    type="number"
                                    defaultValue={book.published_year ?? ''}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="isbn">ISBN</Label>
                            <Input
                                id="isbn"
                                name="isbn"
                                defaultValue={book.isbn ?? ''}
                            />
                        </div>
                        <div>
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                name="tags"
                                defaultValue={book.tags_text ?? ''}
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={5}
                                defaultValue={book.description ?? ''}
                            />
                        </div>
                        <div>
                            <Label htmlFor="cover_image">Cover Image</Label>
                            <FileInput
                                id="cover_image"
                                name="cover_image"
                                accept="image/*"
                                existingPreviewUrl={book.cover_image}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_active"
                                name="is_active"
                                value="1"
                                defaultChecked={book.is_active}
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Book'}
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
