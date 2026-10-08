<?php

namespace App\Http\Resources;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin Book */
class BookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'author_id' => $this->author_id,
            'category_id' => $this->category_id,
            'isbn' => $this->isbn,
            'description' => $this->description,
            'cover_image' => $this->cover_image ? Storage::url($this->cover_image) : null,
            'language' => $this->language,
            'pages' => $this->pages,
            'published_year' => $this->published_year,
            'tags' => $this->tags,
            'tags_text' => is_array($this->tags) ? implode(', ', $this->tags) : null,
            'downloads_count' => $this->downloads_count,
            'is_active' => $this->is_active,
            'author' => new AuthorResource($this->whenLoaded('author')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'files' => BookFileResource::collection($this->whenLoaded('files')),
            'reviews' => BookReviewResource::collection($this->whenLoaded('reviews')),
            'files_count' => $this->whenCounted('files'),
            'reviews_count' => $this->whenCounted('reviews'),
            'favorites_count' => $this->whenCounted('favorites'),
        ];
    }
}
