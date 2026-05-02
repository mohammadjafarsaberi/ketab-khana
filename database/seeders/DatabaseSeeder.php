<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\BookFile;
use App\Models\BookReview;
use App\Models\Category;
use App\Models\Favorite;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('=== Full Seeding Started ===');

        $this->call(UserSeeder::class);

        Category::factory(30)->create();
        Author::factory(800)->create();

        // Books + Files
        $this->command->info('Seeding Books + Files...');
        Book::factory(50000)->create()->each(function ($book) {
            BookFile::factory(fake()->numberBetween(1, 3))->create([
                'book_id' => $book->id,
            ]);
        });

        // Favorites - Safe insert (avoid duplicates)
        $this->command->info('Seeding Favorites (safe)...');
        $users = User::pluck('id');
        $books = Book::pluck('id');

        $inserted = 0;
        for ($i = 0; $i < 5000; $i++) {   // Increase if needed
            $userId = $users->random();
            $bookId = $books->random();

            Favorite::firstOrCreate([
                'user_id' => $userId,
                'book_id' => $bookId,
            ]);
            $inserted++;
        }

        $this->command->info("Inserted {$inserted} unique favorites.");

        // Reviews
        $this->command->info('Seeding Reviews...');
        BookReview::factory(5000)->create();   // Reduced for safety

        $this->command->info('=== Full Seeding Completed! ===');
    }
}
