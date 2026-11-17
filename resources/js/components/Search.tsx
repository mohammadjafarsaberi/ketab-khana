import { router, usePage } from '@inertiajs/react';
import { Search as SearchIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';

type SearchProps = {
    url: string;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    placeholder?: string;
    only?: string[];
};

export default function Search({
    url,
    searchTerm,
    setSearchTerm,
    placeholder = 'Search...',
    only,
}: SearchProps) {
    const { url: currentUrl } = usePage();
    const searchTimer = useRef<number | undefined>(undefined);

    const updateSearch = (value: string) => {
        setSearchTerm(value);
        window.clearTimeout(searchTimer.current);
        searchTimer.current = window.setTimeout(() => {
            const current = new URL(currentUrl, window.location.origin);
            const destination = new URL(url, window.location.origin);

            if (value.trim()) {
                current.searchParams.set('search', value.trim());
            } else {
                current.searchParams.delete('search');
            }

            current.searchParams.set('page', '1');
            destination.search = current.searchParams.toString();

            router.get(
                destination.pathname + destination.search,
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only,
                },
            );
        }, 300);
    };

    useEffect(() => () => window.clearTimeout(searchTimer.current), []);

    return (
        <div className="relative w-full max-w-sm">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                value={searchTerm}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="border-border/70 bg-transparent pl-9 shadow-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10"
            />
        </div>
    );
}
