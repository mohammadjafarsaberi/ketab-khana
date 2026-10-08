<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PublicBookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'isbn' => $this->isbn,
            'cover_url' => $this->cover_image ? Storage::disk('public')->url($this->cover_image) : null,
            'language' => $this->language,
            'pages' => $this->pages,
            'published_year' => $this->published_year,
            'tags' => $this->tags ?? [],
            'downloads_count' => $this->downloads_count,
            'created_at' => $this->created_at?->toISOString(),
            'author' => $this->whenLoaded('author', fn () => ['id' => $this->author->id, 'name' => $this->author->name]),
            'category' => $this->whenLoaded('category', fn () => ['id' => $this->category->id, 'name' => $this->category->name, 'slug' => $this->category->slug]),
            'files' => $this->whenLoaded('files', fn () => $this->files->map(fn ($file) => [
                'id' => $file->id,
                'format' => $file->format,
                'language' => $file->language,
                'version' => $file->version,
                'file_name' => $file->file_name,
                'file_size' => $file->file_size,
            ])->values()),
            'is_favorited' => $request->user()
                ? $this->favorites->contains('user_id', $request->user()->id)
                : false,
        ];
    }
}
