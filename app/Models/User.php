<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password', 'provider',
    'provider_id',
    'avatar',
    'total_downloads',
    'last_download_at',
    'is_banned', ])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable, SoftDeletes, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'last_download_at' => 'datetime',
            'is_banned' => 'boolean',
            'total_downloads' => 'integer',
        ];

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
    public function scopeNotBanned($query)
    {
        return $query->where('is_banned', false);
    }

    // Helper Methods
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function incrementDownloads(): void
    {
        $this->increment('total_downloads');
        $this->update(['last_download_at' => now()]);
    }

    // Google OAuth Helper Method
    public static function findOrCreateFromGoogle($googleUser)
    {
        // Check if user already exists via Google
        $user = self::where('provider', 'google')
            ->where('provider_id', $googleUser->getId())
            ->first();

        if ($user) {
            if (! $user->roles()->exists()) {
                $user->assignRole('user');
            }

            return $user;
        }

        // If user exists with same email (from magic link)
        $user = self::where('email', $googleUser->getEmail())->first();

        if ($user) {
            $user->update([
                'provider' => 'google',
                'provider_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => now(),
                'name' => $googleUser->getName() ?? $user->name,
            ]);

            if (! $user->roles()->exists()) {
                $user->assignRole('user');
            }

            return $user;
        }

        // Create new user from Google
        $user = self::create([
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'provider' => 'google',
            'provider_id' => $googleUser->getId(),
            'avatar' => $googleUser->getAvatar(),
            'email_verified_at' => now(),
            'password' => null,
        ]);

        $user->assignRole('user');

        return $user;
    }
}
