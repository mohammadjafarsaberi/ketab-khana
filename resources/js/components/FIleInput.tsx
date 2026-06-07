import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { File, FileText, FileTextIcon, Eye, X } from 'lucide-react';

type FileCategory =
    | 'image'
    | 'pdf'
    | 'word'
    | 'excel'
    | 'powerpoint'
    | 'text'
    | 'other';

interface FileInputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value'
> {
    value?: File | null | string;
    onFileSelect?: (file: File | null) => void;
}

const detectFileCategory = (value: File | string): FileCategory => {
    if (typeof value === 'string') {
        const lower = value.toLowerCase();

        if (lower.endsWith('.pdf')) return 'pdf';

        if (
            lower.endsWith('.jpg') ||
            lower.endsWith('.jpeg') ||
            lower.endsWith('.png') ||
            lower.endsWith('.gif') ||
            lower.endsWith('.webp') ||
            lower.endsWith('.svg')
        ) {
            return 'image';
        }

        if (
            lower.endsWith('.doc') ||
            lower.endsWith('.docx') ||
            lower.endsWith('.dotx')
        ) {
            return 'word';
        }

        if (
            lower.endsWith('.xls') ||
            lower.endsWith('.xlsx') ||
            lower.endsWith('.csv')
        ) {
            return 'excel';
        }

        if (
            lower.endsWith('.ppt') ||
            lower.endsWith('.pptx') ||
            lower.endsWith('.ppsx')
        ) {
            return 'powerpoint';
        }

        if (lower.endsWith('.txt')) {
            return 'text';
        }

        return 'other';
    }

    const mimeType = value.type;

    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word')) return 'word';

    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
        return 'excel';
    }

    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
        return 'powerpoint';
    }

    if (mimeType.includes('text')) {
        return 'text';
    }

    return 'other';
};

export function FileInput({
    value,
    onFileSelect,
    className,
    ...props
}: FileInputProps) {
    const [file, setFile] = React.useState<File | null>(null);

    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const [fileCategory, setFileCategory] = React.useState<FileCategory | null>(
        null,
    );

    const [isOpen, setIsOpen] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleRemoveFile = React.useCallback(() => {
        setFile(null);
        setPreviewUrl(null);
        setFileCategory(null);

        if (inputRef.current) {
            inputRef.current.value = '';
        }

        onFileSelect?.(null);
    }, [onFileSelect]);

    React.useEffect(() => {
        if (!value) {
            return;
        }

        if (typeof value === 'string') {
            setPreviewUrl(value);
            setFileCategory(detectFileCategory(value));
            setFile(null);
        } else {
            const url = URL.createObjectURL(value);

            setPreviewUrl(url);
            setFile(value);
            setFileCategory(detectFileCategory(value));
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] ?? null;

        setFile(selectedFile);

        onFileSelect?.(selectedFile);

        if (!selectedFile) {
            setPreviewUrl(null);
            setFileCategory(null);
            return;
        }

        const url = URL.createObjectURL(selectedFile);

        setPreviewUrl(url);
        setFileCategory(detectFileCategory(selectedFile));
    };

    const renderPreview = () => {
        if (!previewUrl) return null;

        switch (fileCategory) {
            case 'image':
                return (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-[70vh] w-full rounded-md object-contain"
                    />
                );

            case 'pdf':
                return (
                    <iframe
                        src={previewUrl}
                        className="h-[70vh] w-full"
                        title="PDF Preview"
                    />
                );

            case 'word':
            case 'excel':
            case 'powerpoint':
            case 'text':
                return (
                    <div className="flex flex-col items-center justify-center rounded border p-8">
                        <FileTextIcon className="mb-4 h-16 w-16" />
                        <p className="font-medium">
                            {typeof value === 'string' ? value : file?.name}
                        </p>
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col items-center justify-center rounded border p-8">
                        <File className="mb-4 h-16 w-16" />
                        <p>Preview unavailable</p>
                    </div>
                );
        }
    };

    return (
        <div className="relative">
            <Input
                {...props}
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
                className={`pr-20 ${className ?? ''}`}
            />

            {(previewUrl || file) && (
                <div className="absolute inset-y-0 right-1 flex items-center gap-1">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" size="icon" variant="ghost">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>

                        <DialogContent
                            className="max-w-3xl"
                            aria-describedby={undefined}
                        >
                            <DialogHeader>
                                <DialogTitle>File Preview</DialogTitle>
                            </DialogHeader>

                            {renderPreview()}
                        </DialogContent>
                    </Dialog>

                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={handleRemoveFile}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
