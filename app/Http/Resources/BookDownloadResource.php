<?php

namespace App\Http\Resources;

use App\Models\BookDownload;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BookDownload */
class BookDownloadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'book_id' => $this->book_id,
            'book_file_id' => $this->book_file_id,
            'downloaded_at' => $this->downloaded_at?->toDateTimeString(),
            'downloaded_at_input' => $this->downloaded_at?->format('Y-m-d\TH:i'),
            'user' => new UserResource($this->whenLoaded('user')),
            'book' => new BookResource($this->whenLoaded('book')),
            'file' => new BookFileResource($this->whenLoaded('file')),
        ];
    }
}
