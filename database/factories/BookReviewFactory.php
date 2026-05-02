<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookReviewFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? 1,
            'book_id' => Book::inRandomOrder()->first()?->id ?? 1,
            'rating' => fake()->numberBetween(1, 5),
            'review_text' => fake()->paragraph(2),
            'is_approved' => fake()->boolean(70),   // 70% approved
            'approved_by' => fake()->optional(0.6)->numberBetween(1, 5), // sometimes approved by admin
        ];
    }
}
