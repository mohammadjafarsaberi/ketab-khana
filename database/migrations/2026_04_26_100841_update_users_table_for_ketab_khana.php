<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Fix name field (make it nullable if not already)
            if (Schema::hasColumn('users', 'name')) {
                $table->string('name')->nullable()->change();
            }

            // Password remains nullable for regular users (only admins will use it)
            $table->string('password')->nullable()->change();

            // === OAuth / Google Support ===
            $table->string('provider')->nullable()->after('password');      // 'google'
            $table->string('provider_id')->nullable()->after('provider');
            $table->string('avatar')->nullable()->after('provider_id');

            // === Ketab-Khana Library Fields ===
            $table->unsignedBigInteger('total_downloads')->default(0);
            $table->timestamp('last_download_at')->nullable();
            $table->boolean('is_banned')->default(false);

            $table->softDeletes();

            // Prevent duplicate OAuth accounts
            $table->unique(['provider', 'provider_id'])->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropUnique(['provider', 'provider_id']);

            // Optional: revert changes if needed
            $table->string('name')->nullable(false)->change();
            $table->string('password')->nullable(false)->change();
        });
    }
};
