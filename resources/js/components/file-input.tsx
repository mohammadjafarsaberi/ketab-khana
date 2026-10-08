import { Eye, FileIcon, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface FileInputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value'
> {
    existingFileName?: string | null;
    existingPreviewUrl?: string | null;
    onFileSelect?: (file: File | null) => void;
}

export function FileInput({
    existingFileName,
    existingPreviewUrl,
    onFileSelect,
    className,
    ...props
}: FileInputProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [objectUrl, setObjectUrl] = React.useState<string | null>(null);
    const [showExisting, setShowExisting] = React.useState(true);
    const previewUrl = objectUrl ?? (showExisting ? existingPreviewUrl : null);
    const displayName =
        selectedFile?.name ?? (showExisting ? existingFileName : null);

    React.useEffect(
        () => () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        },
        [objectUrl],
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }

        setSelectedFile(file);
        setObjectUrl(
            file?.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        );
        setShowExisting(false);
        onFileSelect?.(file);
    };

    const clearSelection = () => {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }

        setSelectedFile(null);
        setObjectUrl(null);
        setShowExisting(false);

        if (inputRef.current) {
            inputRef.current.value = '';
        }

        onFileSelect?.(null);
    };

    return (
        <div className="space-y-2">
            <div className="relative">
                <Input
                    {...props}
                    ref={inputRef}
                    type="file"
                    onChange={handleChange}
                    className={className}
                />
                {(displayName || previewUrl) && (
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute top-0 right-0"
                        onClick={clearSelection}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear selected file</span>
                    </Button>
                )}
            </div>

            {displayName && (
                <p className="text-sm text-muted-foreground">
                    Current: {displayName}
                </p>
            )}

            {previewUrl && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                            Preview image
                        </Button>
                    </DialogTrigger>
                    <DialogContent
                        className="max-w-3xl"
                        aria-describedby={undefined}
                    >
                        <DialogHeader>
                            <DialogTitle>Image preview</DialogTitle>
                        </DialogHeader>
                        <img
                            src={previewUrl}
                            alt="Selected file preview"
                            className="max-h-[70vh] w-full rounded-md object-contain"
                        />
                    </DialogContent>
                </Dialog>
            )}

            {!previewUrl && displayName && (
                <FileIcon className="h-5 w-5 text-muted-foreground" />
            )}
        </div>
    );
}
