import { Form, Head } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/CategoryController';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Category } from '@/pages/Admin/Category/Column';
const Edit = ({category}:{category:Category}) => {

    return (
        <div>
            <Head title="Categories" />

            <Form
                action={update(category.id)}
                method="post"
                resetOnSuccess
            >
                {({ errors, processing, defaults }) => (
                    <>
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={category.name}
                            />
                            {errors.name && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder="Enter category description"
                                defaultValue={category.description}
                            />
                            {errors.description && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.description}
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <Checkbox
                                id="is_active"
                                name="is_active"
                                defaultChecked={category.is_active}
                            />
                            <Label htmlFor="is_active">Active</Label>
                            {errors.is_active && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.is_active}
                                </div>
                            )}
                        </div>
                        <div className={'mt-4 flex items-center gap-4'}>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer disabled:opacity-50"
                            >
                                {processing ? 'Editing...' : 'Edit Category'}
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
