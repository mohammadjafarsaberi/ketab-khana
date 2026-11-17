<?php

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    config(['app.key' => 'base64:MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=']);

    $admin = User::factory()->create();
    $admin->assignRole(Role::findOrCreate('admin'));
    $this->actingAs($admin);
});

test('categories can be searched by visible text columns', function () {
    Category::factory()
        ->count(12)
        ->sequence(fn (Sequence $sequence) => [
            'name' => "Archive {$sequence->index}",
            'slug' => "archive-{$sequence->index}",
            'description' => 'Contains the requested needle',
        ])
        ->create();
    Category::factory()->create([
        'name' => 'Unrelated',
        'description' => 'Does not match',
    ]);

    $this->get(route('admin.categories.index', ['search' => 'needle']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Category/Index')
            ->has('data.data', 10)
            ->where('data.meta.total', 12)
            ->where('filters.search', 'needle')
            ->where('data.links.next', fn (?string $url) => str_contains((string) $url, 'search=needle')));
});

test('categories can be searched by id and active status', function () {
    $active = Category::factory()->create(['name' => 'Published shelf', 'is_active' => true]);
    $inactive = Category::factory()->create(['name' => 'Hidden shelf', 'is_active' => false]);

    $this->get(route('admin.categories.index', ['search' => (string) $inactive->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('data.data', 1)
            ->where('data.data.0.id', $inactive->id));

    $this->get(route('admin.categories.index', ['search' => 'inactive']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('data.data', 1)
            ->where('data.data.0.id', $inactive->id)
            ->where('data.data.0.is_active', false));

    expect($active->is_active)->toBeTrue();
});
