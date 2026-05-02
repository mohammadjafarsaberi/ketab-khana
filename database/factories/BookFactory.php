<?php

namespace Database\Factories;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{
    protected $model = Book::class;

    public function definition()
    {
        return [
            'title' => fake()->sentence(4),
            'slug' => fn ($attr) => \Str::slug($attr['title']).'-'.fake()->unique()->numberBetween(1000, 999999),
            'author_id' => Author::factory(),
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),
            'isbn' => fake()->unique()->isbn13(),
            'description' => fake()->paragraph(5),
            'cover_image' => 'covers/'.fake()->uuid().'.jpg',
            'language' => fake()->randomElement(['en', 'fa', 'ps']),
            'pages' => fake()->numberBetween(100, 800),
            'published_year' => fake()->numberBetween(1990, 2026),
            'tags' => fake()->randomElements(['fiction', 'science', 'history', 'self-help', 'islamic'], 3),
            'is_active' => true,
            'downloads_count' => fake()->numberBetween(0, 50000),
        ];
    }
}
