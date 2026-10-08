<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BookRequest extends FormRequest
{
    public function rules(): array
    {
        $book = $this->route('book');

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('books', 'slug')->ignore($book)],
            'author_id' => ['required', 'integer', Rule::exists('authors', 'id')],
            'category_id' => ['required', 'integer', Rule::exists('categories', 'id')],
            'isbn' => ['nullable', 'string', 'max:255', Rule::unique('books', 'isbn')->ignore($book)],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'language' => ['required', Rule::in(['en', 'fa', 'ps'])],
            'pages' => ['nullable', 'integer', 'min:1'],
            'published_year' => ['nullable', 'integer', 'min:1', 'max:'.now()->year],
            'tags' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }
}
