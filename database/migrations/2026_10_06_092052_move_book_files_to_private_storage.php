<?php

use App\Models\BookFile;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        BookFile::query()->eachById(function (BookFile $bookFile): void {
            if (! Storage::disk('public')->exists($bookFile->file_path)) {
                return;
            }

            Storage::disk('local')->writeStream(
                $bookFile->file_path,
                Storage::disk('public')->readStream($bookFile->file_path),
            );
            Storage::disk('public')->delete($bookFile->file_path);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        BookFile::query()->eachById(function (BookFile $bookFile): void {
            if (! Storage::disk('local')->exists($bookFile->file_path)) {
                return;
            }

            Storage::disk('public')->writeStream(
                $bookFile->file_path,
                Storage::disk('local')->readStream($bookFile->file_path),
            );
            Storage::disk('local')->delete($bookFile->file_path);
        });
    }
};
