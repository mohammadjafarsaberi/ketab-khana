<?php

namespace App\Models;

use App\Models\Concerns\TracksCreatorAndUpdater;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use HasFactory, SoftDeletes, TracksCreatorAndUpdater;

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
}
