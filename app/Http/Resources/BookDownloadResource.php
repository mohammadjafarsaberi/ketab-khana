<?php

namespace App\Http\Resources;

use App\Models\BookDownload;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BookDownload */
class BookDownloadResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [

        ];
    }
}
