<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'provider' => $this->provider,
            'avatar' => $this->avatar,
            'total_downloads' => $this->total_downloads,
            'last_download_at' => $this->last_download_at?->toDateTimeString(),
            'is_banned' => $this->is_banned,
            'role' => $this->getRoleNames()->first() ?? 'user',
            'downloads_count' => $this->whenCounted('downloads'),
            'favorites_count' => $this->whenCounted('favorites'),
            'reviews_count' => $this->whenCounted('reviews'),
        ];
    }
}
