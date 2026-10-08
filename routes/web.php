<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookDownloadController;
use App\Http\Controllers\BookFileController;
use App\Http\Controllers\BookReviewController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified', 'not-banned', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', DashboardController::class)->name('dashboard');
        Route::resource('categories', CategoryController::class);
        Route::resource('authors', AuthorController::class);
        Route::resource('books', BookController::class);
        Route::resource('book-files', BookFileController::class);
        Route::resource('users', UserController::class)->except('create', 'store');
        Route::resource('reviews', BookReviewController::class)->only('index', 'show', 'update', 'destroy');
        Route::resource('downloads', BookDownloadController::class)->only('index', 'show');
        Route::resource('favorites', FavoriteController::class)->only('index', 'show');
    });

Route::get('/auth/google', [GoogleController::class, 'redirect'])
    ->name('auth.google');

Route::get('/auth/google/callback', [GoogleController::class, 'callback'])
    ->name('auth.google.callback');

require __DIR__.'/settings.php';
