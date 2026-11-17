<?php

test('postgresql is the application default database', function () {
    $projectRoot = dirname(__DIR__, 2);
    $databaseConfiguration = file_get_contents($projectRoot.'/config/database.php');
    $queueConfiguration = file_get_contents($projectRoot.'/config/queue.php');
    $environmentExample = file_get_contents($projectRoot.'/.env.example');

    expect($databaseConfiguration)
        ->toContain("env('DB_CONNECTION', 'pgsql')")
        ->and($queueConfiguration)
        ->not->toContain("env('DB_CONNECTION', 'sqlite')")
        ->and($environmentExample)
        ->toContain('DB_CONNECTION=pgsql');
});
