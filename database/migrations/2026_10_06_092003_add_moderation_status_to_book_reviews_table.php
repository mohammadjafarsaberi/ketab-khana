<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('book_reviews', function (Blueprint $table) {
            $table->string('moderation_status')->default('pending')->after('is_approved')->index();
        });

        DB::table('book_reviews')->where('is_approved', true)->update(['moderation_status' => 'approved']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('book_reviews', function (Blueprint $table) {
            $table->dropColumn('moderation_status');
        });
    }
};
