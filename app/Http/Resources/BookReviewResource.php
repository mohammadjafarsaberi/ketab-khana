<?php

namespace App\Http\Resources;

use App\Models\BookReview;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BookReview */
class BookReviewResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [

        ];
    }
}
