<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BookFileRequest extends FormRequest
{
    public function rules(): array
    {
        $bookFile = $this->route('book_file');

        return [
            'book_id' => ['required', 'integer', Rule::exists('books', 'id')->whereNull('deleted_at')],
            'file' => [$bookFile ? 'nullable' : 'required', 'file', 'mimes:pdf,epub,mobi', 'max:51200'],
            'format' => ['required', Rule::in(['pdf', 'epub', 'mobi'])],
            'language' => ['nullable', Rule::in(['en', 'fa', 'ps'])],
            'version' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }
}
