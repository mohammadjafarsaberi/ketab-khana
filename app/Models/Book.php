<?php

namespace App\Models;

use App\Models\Concerns\TracksCreatorAndUpdater;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Book extends Model
{
    use HasFactory, Searchable, SoftDeletes, TracksCreatorAndUpdater;

    protected $fillable = [
        'title',
        'slug',
        'author_id',
        'category_id',
        'isbn',
        'description',
        'cover_image',
        'language',
        'pages',
        'published_year',
        'tags',
        'meta_data',
        'downloads_count',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'tags' => 'array',
        'meta_data' => 'array',
        'is_active' => 'boolean',
        'published_year' => 'integer',
        'pages' => 'integer',
        'downloads_count' => 'integer',
    ];

    // Relationships
    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function files()
    {
        return $this->hasMany(BookFile::class);
    }

    public function downloads()
    {
        return $this->hasMany(BookDownload::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function reviews()
    {
        return $this->hasMany(BookReview::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByLanguage($query, $language)
    {
        return $query->where('language', $language);
    }

    public function searchableAs(): string
    {
        return 'books';
    }

    public function shouldBeSearchable(): bool
    {
        return $this->is_active && $this->deleted_at === null;
    }

    /** @return array<string, mixed> */
    public function toSearchableArray(): array
    {
        $this->loadMissing(['author', 'category', 'files']);

        return [
            'id' => (string) $this->getKey(),
            'title' => $this->title,
            'description' => $this->description ?? '',
            'isbn' => $this->isbn ?? '',
            'author_id' => (int) $this->author_id,
            'author' => $this->author?->name ?? '',
            'category_id' => (int) $this->category_id,
            'category' => $this->category?->name ?? '',
            'language' => $this->language,
            'tags' => array_values($this->tags ?? []),
            'formats' => $this->files->pluck('format')->unique()->values()->all(),
            'published_year' => (int) ($this->published_year ?? 0),
            'downloads_count' => (int) $this->downloads_count,
            'created_at' => $this->created_at?->timestamp ?? 0,
        ];
    }
}
