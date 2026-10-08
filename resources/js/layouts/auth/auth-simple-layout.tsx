import { Link } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { initializeTheme } from '@/hooks/use-appearance';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('public-scrollbar');
        document.documentElement.style.colorScheme = 'light';

        return () => {
            document.documentElement.classList.remove('public-scrollbar');
            initializeTheme();
        };
    }, []);

    return (
        <div className="public-site flex min-h-svh flex-col items-center justify-center gap-6 bg-[#f5e9d8] p-6 text-slate-950 [--primary:#B84E4E] [--ring:#B84E4E] md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[#B84E4E]" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
