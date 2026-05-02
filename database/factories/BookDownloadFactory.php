<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\BookDownload;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookDownloadFactory extends Factory
{
    protected $model = BookDownload::class;

    public function definition()
    {
        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? 1,
            'book_id' => Book::inRandomOrder()->first()?->id ?? 1,
            'book_file_id' => null,
            'downloaded_at' => fake()->dateTimeThisYear(),
        ];
    }
}
