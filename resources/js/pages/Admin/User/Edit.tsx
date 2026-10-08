import { Form, Head } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/UserController';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AdminUser } from '@/pages/Admin/User/Column';

export default function Edit({ user }: { user: AdminUser }) {
    return (
        <div className="container mx-auto max-w-2xl p-8">
            <Head title={`Edit ${user.name}`} />
            <Form {...update.form(user.id)}>
                {({ errors, processing, defaults }) => (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={user.name}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={user.email}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="password_confirmation">
                                Confirm new password
                            </Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                name="role"
                                defaultValue={user.role}
                                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.role}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_banned"
                                name="is_banned"
                                value="1"
                                defaultChecked={user.is_banned}
                            />
                            <Label htmlFor="is_banned">Banned</Label>
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save User'}
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
