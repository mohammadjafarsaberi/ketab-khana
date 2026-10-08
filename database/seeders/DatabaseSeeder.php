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

        // Avoid unique slug constraint violations during repeated seeding
        Category::query()->delete();
        Author::query()->delete();

        Category::factory(30)->create();
        Author::factory(80)->create();

        // Keep development data small and fast to reseed.
        $booksCount = 100;
        $filesPerBook = 1;
        $favoritesCount = 100;
        $reviewsCount = 100;

        // Books + Files
        $this->command->info('Seeding Books + Files...');
        Book::factory($booksCount)
            ->create()
            ->each(function ($book) use ($filesPerBook) {
                BookFile::factory($filesPerBook)->create([
                    'book_id' => $book->id,
                ]);
            });

        // Favorites - safe insert (avoid duplicates)
        $this->command->info('Seeding Favorites (safe)...');
        $users = User::pluck('id');
        $books = Book::pluck('id');

        $inserted = 0;
        for ($i = 0; $i < $favoritesCount; $i++) {
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

        // Insert reviews with valid FK values under sqlite FK constraints.
        $reviewUsers = User::pluck('id');
        $reviewBooks = Book::pluck('id');

        for ($i = 0; $i < $reviewsCount; $i++) {
            BookReview::create([
                'user_id' => $reviewUsers->random(),
                'book_id' => $reviewBooks->random(),
                'rating' => fake()->numberBetween(1, 5),
                'review_text' => fake()->paragraph(2),
                'is_approved' => fake()->boolean(70),
                'approved_by' => null,
            ]);
        }

        $this->command->info('=== Full Seeding Completed! ===');
    }
}
