<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\BookFile;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookFileFactory extends Factory
{
    protected $model = BookFile::class;

    public function definition()
    {
        $formats = ['pdf', 'epub', 'mobi'];

        return [
            'book_id' => Book::factory(),
            'file_path' => 'books/'.fake()->uuid().'.'.fake()->randomElement($formats),
            'format' => fake()->randomElement($formats),
            'language' => fake()->randomElement(['en', 'fa', 'ps']),
            'version' => fake()->optional()->randomElement(['1st', '2nd', 'Revised']),
            'file_size' => fake()->numberBetween(1024 * 500, 1024 * 1024 * 25), // 0.5MB - 25MB
        ];
    }
}
