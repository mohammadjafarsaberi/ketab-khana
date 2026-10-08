import { Form, Head, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';

type Props = {
    status?: string;
    canRegister: boolean;
    canResetPassword?: boolean;
};

export default function Login({
    status,
    canRegister,
    canResetPassword = true,
}: Props) {
    const redirect = new URL(
        usePage().url,
        'http://localhost',
    ).searchParams.get('redirect');

    return (
        <>
            <Head title="Log in" />

            <div className="flex flex-col gap-8">
                {/* Google Login Button */}
                <Button
                    variant="outline"
                    className="flex w-full cursor-pointer items-center justify-center gap-3 py-6 text-base"
                    onClick={() => (window.location.href = '/auth/google')}
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="h-5 w-5"
                    />
                    Continue with Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            OR
                        </span>
                    </div>
                </div>

                {/* Email + Password Form */}
                <Form action={store()} className="space-y-4">
                    {({ errors, processing }) => (
                        <>
                            {redirect && (
                                <input
                                    type="hidden"
                                    name="redirect"
                                    value={redirect}
                                />
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoFocus
                                    placeholder="you@example.com"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href="/forgot-password"
                                            className="text-sm"
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-6 text-base"
                                disabled={processing}
                            >
                                {processing && <Spinner className="mr-2" />}
                                Log in
                            </Button>
                        </>
                    )}
                </Form>
                {/* Register Link */}
                {canRegister && (
                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <TextLink href={register()} className="font-medium">
                            Sign up
                        </TextLink>
                    </div>
                )}

                {status && (
                    <div className="text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
            </div>
        </>
    );
}

Login.layout = {
    title: 'Log in to Ketab Khana',
    description: 'Sign in to access free digital books',
};
