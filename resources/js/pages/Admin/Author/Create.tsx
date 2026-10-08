import { Form, Head } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/AuthorController';
import { FileInput } from '@/components/file-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
const Create = () => {
    return (
        <div>
            <Head title="Authors" />
            <Form action={store()} method="post" resetOnSuccess>
                {({ errors, processing, reset }) => (
                    <>
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" />
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
                            />
                            {errors.bio && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.bio}
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="image">Image</Label>
                            <FileInput
                                id="image"
                                name="image"
                                accept="image/*"
                            />
                            {errors.image && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.image}
                                </div>
                            )}
                        </div>

                        <div className={'mt-4 flex items-center gap-4'}>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Author'}
                            </Button>
                            <Button
                                className={'cursor-pointer'}
                                type={'button'}
                                onClick={() => reset()}
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

export default Create;
