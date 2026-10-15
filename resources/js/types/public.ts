export type PublicBookFile = {
    id: number;
    format: string;
    language: string | null;
    version: string | null;
    file_name: string | null;
    file_size: number | null;
};

export type PublicBook = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    isbn: string | null;
    cover_url: string | null;
    language: string;
    pages: number | null;
    published_year: number | null;
    tags: string[];
    downloads_count: number;
    created_at: string;
    is_favorited: boolean;
    author: { id: number; name: string };
    category: { id: number; name: string; slug: string };
    files: PublicBookFile[];
};

export type PaginatedBooks = {
    data: PublicBook[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    links: { url: string | null; label: string; active: boolean }[];
};

export type DirectoryMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type PublicCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    books_count: number;
    downloads_total: number;
    cover_urls: string[];
};

export type PublicAuthor = {
    id: number;
    name: string;
    bio: string | null;
    image_url: string | null;
    books_count: number;
    downloads_total: number;
    categories: { id: number; name: string; slug: string }[];
};

export type DirectoryPage<T> = {
    data: T[];
    meta: DirectoryMeta;
};

export type BookDiscoveryFilters = {
    query?: string;
    category?: number;
    language?: string;
    format?: string;
    year_from?: number;
    year_to?: number;
    sort?: string;
    page?: number;
};
