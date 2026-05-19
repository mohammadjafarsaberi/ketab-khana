import { Form, Head } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/AuthorController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Author } from '@/pages/Admin/Author/Column';
const Edit = ({author}:{author:Author}) => {
    console.log(author);

    return (
        <div>
            <Head title="Authors" />

            <Form
                action={update(author.id)}
                method="post"
                resetOnSuccess
                // onSuccess={}
            >
                {({ errors, processing, defaults }) => (
                    <>
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={author.name}
                            />
                            {errors.name && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                rows={4}
                                placeholder="Enter author bio"
                                defaultValue={author.bio || ''}
                            />
                            {errors.bio && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.bio}
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="image">Image</Label>
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                            />
                            {errors.image && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.image}
                                </div>
                            )}
                            {author.image && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">Current image:</p>
                                    <img 
                                        src={author.image} 
                                        alt={author.name} 
                                        className="mt-1 h-20 w-20 rounded object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div className={'mt-4 flex items-center gap-4'}>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer disabled:opacity-50"
                            >
                                {processing ? 'Editing...' : 'Edit Author'}
                            </Button>
                            <Button
                                className={'cursor-pointer'}
                                type={'button'}
                                onClick={() => defaults()}
                            >
                                Reset
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
};

export default Edit;