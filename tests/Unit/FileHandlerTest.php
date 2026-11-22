<?php

use App\Services\FileHandler;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

uses(TestCase::class);

test('it uploads files with a generated name to the requested disk', function () {
    Storage::fake('public');

    $path = app(FileHandler::class)->upload(
        UploadedFile::fake()->image('Author Portrait.jpg'),
        'authors',
        'author',
    );

    Storage::disk('public')->assertExists($path);
    expect($path)->toStartWith('authors/author_')->toEndWith('_author-portrait.jpg');
});

test('it normalizes storage paths when checking and deleting files', function () {
    Storage::fake('public');
    Storage::disk('public')->put('covers/example.jpg', 'cover');

    $fileHandler = app(FileHandler::class);

    expect($fileHandler->exists('/storage/covers/example.jpg'))->toBeTrue();
    expect($fileHandler->delete('/storage/covers/example.jpg'))->toBeTrue();
    Storage::disk('public')->assertMissing('covers/example.jpg');
});

test('it uploads only valid uploaded files from a mixed collection', function () {
    Storage::fake('public');

    $paths = app(FileHandler::class)->uploadMultiple([
        UploadedFile::fake()->create('first.pdf'),
        null,
        'not-a-file',
        UploadedFile::fake()->create('second.epub'),
    ]);

    expect($paths)->toHaveCount(2);
    Storage::disk('public')->assertExists($paths);
});
