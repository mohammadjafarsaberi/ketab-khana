<?php

namespace Database\Factories;

use App\Models\Author;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuthorFactory extends Factory
{
    protected $model = Author::class;

    public function definition()
    {
        return [
            'name' => fake()->name(),
            'bio' => fake()->paragraph(3),
            'image' => null, // or fake()->imageUrl()
        ];
    }
}
