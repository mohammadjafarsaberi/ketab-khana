<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FavoriteRequest extends FormRequest
{
    public function rules(): array
    {
        $favorite = $this->route('favorite');

        return [
            'user_id' => ['required', 'exists:users,id'],
            'book_id' => [
                'required',
                'exists:books,id',
                Rule::unique('favorites', 'book_id')
                    ->where('user_id', $this->input('user_id'))
                    ->ignore($favorite),
            ],
        ];
    }

    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }
}
