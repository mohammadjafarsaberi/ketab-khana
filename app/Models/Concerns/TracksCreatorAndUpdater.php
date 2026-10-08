<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

trait TracksCreatorAndUpdater
{
    public static function bootTracksCreatorAndUpdater(): void
    {
        static::creating(function (Model $model): void {
            $userId = Auth::id();

            if (! $userId) {
                return;
            }

            if ($model->getAttribute($model->getCreatedByColumn()) === null) {
                $model->setAttribute($model->getCreatedByColumn(), $userId);
            }

            if ($model->getAttribute($model->getUpdatedByColumn()) === null) {
                $model->setAttribute($model->getUpdatedByColumn(), $userId);
            }
        });

        static::updating(function (Model $model): void {
            $userId = Auth::id();

            if (! $userId) {
                return;
            }

            $model->setAttribute($model->getUpdatedByColumn(), $userId);
        });
    }

    public function getCreatedByColumn(): string
    {
        return defined(static::class.'::CREATED_BY') ? static::CREATED_BY : 'created_by';
    }

    public function getUpdatedByColumn(): string
    {
        return defined(static::class.'::UPDATED_BY') ? static::UPDATED_BY : 'updated_by';
    }
}
