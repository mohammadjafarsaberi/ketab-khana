<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::findOrCreate('user');
});

function googleUser(array $attributes = []): SocialiteUser
{
    return (new SocialiteUser)->map(array_merge([
        'id' => 'google-user-123',
        'name' => 'Google Reader',
        'email' => 'reader@example.test',
        'avatar' => 'https://example.test/avatar.jpg',
    ], $attributes));
}

test('users can be redirected to Google', function () {
    Socialite::fake('google');

    $this->get(route('auth.google'))
        ->assertRedirect('https://socialite.fake/google/authorize');
});

test('a new Google user is created authenticated and assigned the user role', function () {
    Socialite::fake('google', googleUser());

    $response = $this->get(route('auth.google.callback'));

    $user = User::query()->where('email', 'reader@example.test')->firstOrFail();

    $response
        ->assertRedirect(route('home'))
        ->assertSessionHas('success');
    $this->assertAuthenticatedAs($user);
    expect($user)
        ->provider->toBe('google')
        ->provider_id->toBe('google-user-123')
        ->avatar->toBe('https://example.test/avatar.jpg')
        ->and($user->hasRole('user'))->toBeTrue();
});

test('an existing Google identity is reused without creating another account', function () {
    $user = User::factory()->create([
        'provider' => 'google',
        'provider_id' => 'google-user-123',
        'email' => 'existing@example.test',
    ]);
    Socialite::fake('google', googleUser(['email' => 'different@example.test']));

    $this->get(route('auth.google.callback'))->assertRedirect(route('home'));

    $this->assertAuthenticatedAs($user);
    expect(User::query()->count())->toBe(1)
        ->and($user->fresh()->hasRole('user'))->toBeTrue();
});

test('a matching email account is linked to Google', function () {
    $user = User::factory()->unverified()->create([
        'name' => 'Original Name',
        'email' => 'reader@example.test',
    ]);
    Socialite::fake('google', googleUser());

    $this->get(route('auth.google.callback'))->assertRedirect(route('home'));

    $user->refresh();

    $this->assertAuthenticatedAs($user);
    expect(User::query()->count())->toBe(1)
        ->and($user->provider)->toBe('google')
        ->and($user->provider_id)->toBe('google-user-123')
        ->and($user->name)->toBe('Google Reader')
        ->and($user->email_verified_at)->not->toBeNull();
});

test('administrators return to the admin dashboard after Google login', function () {
    $admin = User::factory()->create([
        'provider' => 'google',
        'provider_id' => 'google-user-123',
    ]);
    $admin->assignRole(Role::findOrCreate('admin'));
    Socialite::fake('google', googleUser());

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('admin.dashboard'));

    $this->assertAuthenticatedAs($admin);
});

test('banned Google users are rejected', function () {
    $user = User::factory()->create([
        'provider' => 'google',
        'provider_id' => 'google-user-123',
        'is_banned' => true,
    ]);
    Socialite::fake('google', googleUser());

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('login'))
        ->assertSessionHas('error', 'Your account has been suspended.');

    $this->assertGuest();
    expect($user->fresh())->not->toBeNull();
});

test('provider failures return users to login with a safe error', function () {
    Socialite::fake('google', fn () => throw new RuntimeException('provider secret'));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('login'))
        ->assertSessionHas('error', 'Google login failed. Please try again or use email login.');

    $this->assertGuest();
});
