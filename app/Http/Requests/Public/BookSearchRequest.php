<?php

namespace App\Http\Requests\Public;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BookSearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'query' => ['nullable', 'string', 'max:150'],
            'category' => ['nullable', 'integer', 'exists:categories,id'],
            'author' => ['nullable', 'integer', 'exists:authors,id'],
            'language' => ['nullable', Rule::in(['en', 'fa', 'ps'])],
            'format' => ['nullable', Rule::in(['pdf', 'epub', 'mobi'])],
            'year_from' => ['nullable', 'integer', 'min:1000', 'max:'.now()->year],
            'year_to' => ['nullable', 'integer', 'min:1000', 'max:'.now()->year, 'gte:year_from'],
            'sort' => ['nullable', Rule::in(['relevance', 'newest', 'popular', 'title'])],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', Rule::in([12, 24, 48])],
        ];
    }
}
