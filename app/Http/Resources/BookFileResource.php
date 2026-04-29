<?php

namespace App\Http\Resources;

use App\Models\BookFile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BookFile */
class BookFileResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [

        ];
    }
}
