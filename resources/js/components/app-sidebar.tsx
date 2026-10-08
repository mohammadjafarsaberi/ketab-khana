import { Link, usePage } from '@inertiajs/react';
import {
    BookMarked,
    BookOpen,
    Download,
    FileText,
    FolderGit2,
    Heart,
    LayoutGrid,
    Star,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { home } from '@/routes';
import { dashboard } from '@/routes/admin';
import { index as authors } from '@/routes/admin/authors';
import { index as bookFiles } from '@/routes/admin/book-files';
import { index as books } from '@/routes/admin/books';
import { index as categories } from '@/routes/admin/categories';
import { index as bookDownloads } from '@/routes/admin/downloads';
import { index as favorites } from '@/routes/admin/favorites';
import { index as bookReviews } from '@/routes/admin/reviews';
import { index as users } from '@/routes/admin/users';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Categories',
        href: categories(),
        icon: LayoutGrid,
    },
    {
        title: 'Authors',
        href: authors(),
        icon: LayoutGrid,
    },
    {
        title: 'Books',
        href: books(),
        icon: BookMarked,
    },
    {
        title: 'Book Files',
        href: bookFiles(),
        icon: FileText,
    },
    {
        title: 'Downloads',
        href: bookDownloads(),
        icon: Download,
    },
    {
        title: 'Users',
        href: users(),
        icon: Users,
    },
    {
        title: 'Reviews',
        href: bookReviews(),
        icon: Star,
    },
    {
        title: 'Favorites',
        href: favorites(),
        icon: Heart,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const navigationItems = auth.user?.is_admin ? mainNavItems : [];
    const logoHref = auth.user?.is_admin ? dashboard() : home();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={logoHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navigationItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
