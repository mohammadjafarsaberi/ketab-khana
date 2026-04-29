<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'file_path',
        'format',
        'language',
        'version',
        'file_name',
        'file_size',
    ];

    // Relationships
    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
