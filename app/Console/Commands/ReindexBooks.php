<?php

namespace App\Console\Commands;

use App\Models\Book;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('books:reindex')]
#[Description('Rebuild the public Typesense book collection')]
class ReindexBooks extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (config('scout.driver') !== 'typesense') {
            $this->components->error('Set SCOUT_DRIVER=typesense before rebuilding the search collection.');

            return self::FAILURE;
        }

        $this->call('scout:flush', ['model' => Book::class]);
        $this->call('scout:import', ['model' => Book::class]);
        $this->components->info('The public book search collection has been rebuilt.');

        return self::SUCCESS;
    }
}
