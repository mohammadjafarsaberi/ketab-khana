import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarWithFallbackProps {
    image: string | null | undefined;
    name: string;
    className?: string;
}

export function AvatarWithFallback({
    image,
    name,
    className,
}: AvatarWithFallbackProps) {
    const firstLetter = name?.charAt(0)?.toUpperCase() ?? '?';

    return (
        <Avatar className={className}>
            <AvatarImage src={image || undefined} alt={name} />
            <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
    );
}
