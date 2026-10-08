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
use App\Http\Controllers\Public\BookController as PublicBookController;
use App\Http\Controllers\Public\CatalogController;
use App\Http\Controllers\Public\DiscoveryController;
use App\Http\Controllers\Public\DownloadController as PublicDownloadController;
use App\Http\Controllers\Public\FavoriteController as PublicFavoriteController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\LibraryController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/books', [CatalogController::class, 'index'])->name('books.index');
Route::get('/search/books', [CatalogController::class, 'search'])->middleware('throttle:60,1')->name('books.search');
Route::get('/books/{book:slug}', [PublicBookController::class, 'show'])->name('books.show');
Route::get('/categories/{category:slug}', [DiscoveryController::class, 'category'])->name('categories.show');
Route::get('/authors/{author}', [DiscoveryController::class, 'author'])->name('authors.show');

Route::middleware(['auth', 'verified', 'not-banned'])->group(function () {
    Route::get('/my-library', LibraryController::class)->name('library.index');
    Route::post('/books/{book:slug}/favorite', PublicFavoriteController::class)->name('books.favorite');
    Route::get('/books/{book:slug}/download/{bookFile}', PublicDownloadController::class)
        ->middleware('throttle:20,1')
        ->name('books.download');
});

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
