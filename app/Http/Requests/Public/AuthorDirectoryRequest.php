<?php

namespace App\Http\Requests\Public;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AuthorDirectoryRequest extends FormRequest
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
            'query' => ['nullable', 'string', 'max:100'],
            'letter' => ['nullable', 'string', 'size:1', 'regex:/^[A-Z]$/'],
            'sort' => ['nullable', Rule::in(['name', 'books', 'downloaded'])],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
