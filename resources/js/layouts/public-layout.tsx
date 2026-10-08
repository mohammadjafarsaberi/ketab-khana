import { Link, router, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    Library,
    LogOut,
    Menu,
    Settings,
    ShieldCheck,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { initializeTheme } from '@/hooks/use-appearance';
import { home, login, logout, register } from '@/routes';
import admin from '@/routes/admin';
import books from '@/routes/books';
import library from '@/routes/library';
import profile from '@/routes/profile';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { auth } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('public-scrollbar');
        document.documentElement.style.colorScheme = 'light';

        return () => {
            document.documentElement.classList.remove('public-scrollbar');
            initializeTheme();
        };
    }, []);

    const nav = [
        { label: 'Home', href: home() },
        { label: 'Catalog', href: books.index() },
        {
            label: 'Categories',
            href: books.index({ query: { focus: 'categories' } }),
        },
        {
            label: 'Authors',
            href: books.index({ query: { focus: 'authors' } }),
        },
    ];

    return (
        <div className="public-site min-h-screen bg-[#f5e9d8] text-slate-950 antialiased">
            <header className="sticky top-0 z-50 border-b border-[#dfcdbb] bg-[#f5e9d8]/90 backdrop-blur-xl">
                <div className="relative mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                    <Link
                        href={home()}
                        className="relative z-10 flex shrink-0 items-center"
                    >
                        <img
                            src="/images/logo-k.png"
                            alt="Ketab Khana"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>
                    <nav className="absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-center text-sm font-medium text-slate-600 lg:flex">
                        <div className="flex items-center gap-6">
                            {nav.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="transition hover:text-[#B84E4E]"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </nav>
                    <div className="relative z-10 ml-auto hidden items-center gap-2 md:flex">
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 rounded-full border border-[#dfcdbb] bg-white/55 py-1 pr-3 pl-1 text-sm font-semibold text-slate-700 transition hover:border-[#cf8989] hover:bg-[#f2d4d0] data-[state=open]:border-[#B84E4E] data-[state=open]:bg-[#f2d4d0]"
                                    >
                                        <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-[#B84E4E] text-xs text-white">
                                            {auth.user.avatar ? (
                                                <img
                                                    src={auth.user.avatar}
                                                    alt=""
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                auth.user.name
                                                    .slice(0, 1)
                                                    .toUpperCase()
                                            )}
                                        </span>
                                        <span className="max-w-32 truncate">
                                            {auth.user.name}
                                        </span>
                                        <ChevronDown className="size-4 text-slate-400" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    sideOffset={8}
                                    className="w-60 border-[#dfcdbb] bg-[#fffaf5] p-2 shadow-xl shadow-[#6f2929]/10"
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex items-center gap-3 py-1">
                                            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#B84E4E] text-sm font-semibold text-white">
                                                {auth.user.avatar ? (
                                                    <img
                                                        src={auth.user.avatar}
                                                        alt=""
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    auth.user.name
                                                        .slice(0, 1)
                                                        .toUpperCase()
                                                )}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block truncate font-semibold text-slate-900">
                                                    {auth.user.name}
                                                </span>
                                                <span className="block truncate text-xs text-slate-500">
                                                    {auth.user.email}
                                                </span>
                                            </span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-[#ead7c3]" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={library.index()}
                                                className="cursor-pointer gap-2 rounded-lg focus:bg-[#f2d4d0]"
                                            >
                                                <Library className="size-4 text-[#B84E4E]" />
                                                My Library
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={profile.edit()}
                                                className="cursor-pointer gap-2 rounded-lg focus:bg-[#f2d4d0]"
                                            >
                                                <Settings className="size-4 text-[#B84E4E]" />
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        {auth.user.is_admin && (
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={admin.dashboard()}
                                                    className="cursor-pointer gap-2 rounded-lg focus:bg-[#f2d4d0]"
                                                >
                                                    <ShieldCheck className="size-4 text-[#B84E4E]" />
                                                    Admin panel
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="bg-[#ead7c3]" />
                                    <DropdownMenuItem asChild>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.post(logout.url())
                                            }
                                            className="w-full cursor-pointer gap-2 rounded-lg text-[#963d3d] focus:bg-[#f2d4d0] focus:text-[#963d3d]"
                                        >
                                            <LogOut className="size-4" />
                                            Sign out
                                        </button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-[#f2d4d0]"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-full bg-[#B84E4E] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#963d3d]"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="grid size-10 place-items-center rounded-full border border-slate-200 md:hidden"
                        aria-label="Toggle navigation"
                    >
                        {mobileOpen ? (
                            <X className="size-5" />
                        ) : (
                            <Menu className="size-5" />
                        )}
                    </button>
                </div>
                {mobileOpen && (
                    <div className="border-t border-[#dfcdbb] bg-[#f5e9d8] px-4 py-4 md:hidden">
                        <nav className="grid gap-1">
                            {nav.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="rounded-xl px-3 py-2.5 font-medium text-slate-700"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            {auth.user ? (
                                <>
                                    <Link
                                        href={library.index()}
                                        className="rounded-xl px-3 py-2.5 font-medium"
                                    >
                                        My Library
                                    </Link>
                                    <Link
                                        href={profile.edit()}
                                        className="rounded-xl px-3 py-2.5 font-medium"
                                    >
                                        Settings
                                    </Link>
                                    {auth.user.is_admin && (
                                        <Link
                                            href={admin.dashboard()}
                                            className="rounded-xl px-3 py-2.5 font-medium text-[#B84E4E]"
                                        >
                                            Admin panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={() =>
                                            router.post(logout.url())
                                        }
                                        className="rounded-xl px-3 py-2.5 text-left font-medium"
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <div className="mt-3 flex gap-2">
                                    <Link
                                        href={login()}
                                        className="flex-1 rounded-full border px-4 py-2 text-center font-semibold"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="flex-1 rounded-full bg-[#B84E4E] px-4 py-2 text-center font-semibold text-white"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </header>
            <main>{children}</main>
            <footer className="mt-24 border-t border-[#dfcdbb] bg-[#eedfcd]">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <Link href={home()}>
                        <img
                            src="/images/logo-k.png"
                            alt="Ketab Khana"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                    <span>Read freely. Discover thoughtfully.</span>
                    <span>© {new Date().getFullYear()}</span>
                </div>
            </footer>
        </div>
    );
}
