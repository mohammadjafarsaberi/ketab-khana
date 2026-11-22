<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

test('guests are redirected from authenticated application areas', function (string $routeName) {
    $this->get(route($routeName))->assertRedirect(route('login'));
})->with([
    'library' => 'library.index',
    'profile settings' => 'profile.edit',
    'security settings' => 'security.edit',
    'admin dashboard' => 'admin.dashboard',
]);

test('regular users cannot access admin areas', function (string $routeName) {
    $this->actingAs(User::factory()->create())
        ->get(route($routeName))
        ->assertForbidden();
})->with([
    'dashboard' => 'admin.dashboard',
    'categories' => 'admin.categories.index',
    'authors' => 'admin.authors.index',
    'books' => 'admin.books.index',
    'book files' => 'admin.book-files.index',
    'users' => 'admin.users.index',
    'reviews' => 'admin.reviews.index',
    'downloads' => 'admin.downloads.index',
    'favorites' => 'admin.favorites.index',
]);

test('administrators can access every admin index', function (string $routeName) {
    $admin = User::factory()->create();
    $admin->assignRole(Role::findOrCreate('admin'));

    $this->actingAs($admin)
        ->get(route($routeName))
        ->assertOk();
})->with([
    'dashboard' => 'admin.dashboard',
    'categories' => 'admin.categories.index',
    'authors' => 'admin.authors.index',
    'books' => 'admin.books.index',
    'book files' => 'admin.book-files.index',
    'users' => 'admin.users.index',
    'reviews' => 'admin.reviews.index',
    'downloads' => 'admin.downloads.index',
    'favorites' => 'admin.favorites.index',
]);

test('banned users are logged out and redirected with an error', function () {
    $user = User::factory()->create(['is_banned' => true]);

    $this->actingAs($user)
        ->get(route('profile.edit'))
        ->assertRedirect(route('login'))
        ->assertSessionHas('error', 'Your account has been suspended.');

    $this->assertGuest();
});

test('email verification middleware is intentionally inactive when verification is disabled', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get(route('library.index'))
        ->assertOk();
});
