<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileHandler
{
    /**
     * Upload a file to the public disk with organized folders.
     *
     * @param  string  $folder  // e.g., 'authors', 'covers', 'books'
     * @param  string|null  $prefix  Optional prefix for filename
     * @return string // Full public URL
     */
    public function upload(UploadedFile $file, string $folder = 'uploads', ?string $prefix = null): string
    {
        $filename = $this->generateFilename($file, $prefix);

        return $path = $file->storeAs($folder, $filename, 'public');
    }

    /**
     * Upload multiple files (for book files)
     */
    public function uploadMultiple(array $files, string $folder = 'books'): array
    {
        $paths = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $paths[] = $this->upload($file, $folder);
            }
        }

        return $paths;
    }

    /**
     * Delete a file from public disk
     */
    public function delete(string $path): bool
    {
        // Remove '/storage/' from beginning if present
        $path = str_replace('/storage/', '', $path);

        return Storage::disk('public')->delete($path);
    }

    /**
     * Delete multiple files
     */
    public function deleteMultiple(array $paths): void
    {
        foreach ($paths as $path) {
            $this->delete($path);
        }
    }

    /**
     * Generate a clean, unique filename
     */
    private function generateFilename(UploadedFile $file, ?string $prefix = null): string
    {
        $extension = $file->getClientOriginalExtension();
        $name = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));

        $prefix = $prefix ? $prefix.'_' : '';

        return $prefix.uniqid().'_'.$name.'.'.$extension;
    }

    /**
     * Get full public URL from path
     */
    public function getUrl(string $path): string
    {
        return Storage::url($path);
    }

    /**
     * Check if file exists
     */
    public function exists(string $path): bool
    {
        $path = str_replace('/storage/', '', $path);

        return Storage::disk('public')->exists($path);
    }
}
