<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();

            $table->foreignId('author_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');

            $table->string('isbn')->nullable()->unique();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();

            $table->string('language');                    // en, fa, ps
            $table->integer('pages')->nullable();
            $table->integer('published_year')->nullable();

            $table->json('tags')->nullable();
            $table->json('meta_data')->nullable();

            $table->unsignedBigInteger('downloads_count')->default(0);
            $table->boolean('is_active')->default(true);

            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');

            $table->timestamps();
            $table->softDeletes();

            // Performance indexes
            $table->index(['is_active', 'language']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
