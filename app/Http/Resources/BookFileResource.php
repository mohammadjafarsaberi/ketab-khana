<?php

namespace App\Http\Resources;

use App\Models\BookFile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BookFile */
class BookFileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'book_id' => $this->book_id,
            'book' => new BookResource($this->whenLoaded('book')),
            'format' => $this->format,
            'language' => $this->language,
            'version' => $this->version,
            'file_name' => $this->file_name,
            'file_size' => $this->file_size,
        ];
    }
}
