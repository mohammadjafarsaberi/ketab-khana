import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {

    useEffect(() => {
        const unbind = router.on('flash', (event: any) => {
            const success = event.detail.flash?.success;
            const error = event.detail.flash?.error;

            if (success) {
                 toast.success(success);
            }

            if (error) {
                toast.error(error);
            }
        });

        return () => unbind();
    }, []);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
