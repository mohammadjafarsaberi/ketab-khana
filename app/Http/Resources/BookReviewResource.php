<?php

namespace App\Http\Resources;

use App\Models\BookReview;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BookReview */
class BookReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'book_id' => $this->book_id,
            'rating' => $this->rating,
            'review_text' => $this->review_text,
            'is_approved' => $this->is_approved,
            'moderation_status' => $this->moderation_status,
            'approved_by' => $this->approved_by,
            'user' => new UserResource($this->whenLoaded('user')),
            'book' => new BookResource($this->whenLoaded('book')),
            'approved_by_user' => new UserResource($this->whenLoaded('approvedBy')),
        ];
    }
}
