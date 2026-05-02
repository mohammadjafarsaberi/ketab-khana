<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition()
    {
        return [
            'name' => fake()->unique()->word(),
            'slug' => fn ($attr) => \Str::slug($attr['name']),
            'description' => fake()->sentence(10),
            'is_active' => true,
        ];
    }
}
