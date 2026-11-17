<?php

test('development image installs factory dependencies for database seeding', function () {
    $dockerfile = file_get_contents(dirname(__DIR__, 2).'/Dockerfile');

    expect($dockerfile)
        ->toContain('composer install')
        ->not->toContain('composer install --no-dev');
});
