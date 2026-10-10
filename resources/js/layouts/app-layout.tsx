import { usePage } from '@inertiajs/react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import PublicLayout from '@/layouts/public-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const page = usePage();
    const isMemberSettingsPage =
        page.component.startsWith('settings/') &&
        page.props.auth.user?.is_admin !== true;

    if (isMemberSettingsPage) {
        return <PublicLayout>{children}</PublicLayout>;
    }

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
