// Components
import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { logout } from '@/routes';

export default function VerifyEmail() {
    return (
        <>
            <Head title="Email verification" />

            <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                    Email verification is currently disabled.
                </p>
                <TextLink
                    href={logout()}
                    method="post"
                    as="button"
                    className="text-sm"
                >
                    Log out
                </TextLink>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verify email',
    description: 'Email verification is currently disabled.',
};
