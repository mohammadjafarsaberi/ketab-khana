<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\AdminTableIndexRequest;
use App\Http\Resources\FavoriteResource;
use App\Models\Favorite;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class FavoriteController extends Controller
{
    public function index(AdminTableIndexRequest $request)
    {
        $search = $request->string('search')->trim()->toString();

        $favorites = QueryBuilder::for(Favorite::class)
            ->when($search !== '', fn (Builder $query) => $query->where(function (Builder $query) use ($search): void {
                $query->whereHas('book', fn (Builder $book) => $book->whereLike('title', "%{$search}%"))
                    ->orWhereHas('user', fn (Builder $user) => $user->where(function (Builder $user) use ($search): void {
                        $user->whereLike('name', "%{$search}%")->orWhereLike('email', "%{$search}%");
                    }));

                if (ctype_digit($search)) {
                    $query->orWhere('id', (int) $search);
                }
            }))
            ->with(['book', 'user'])
            ->allowedSorts('id', 'created_at')
            ->defaultSort('-created_at')
            ->paginate($request->integer('per_page', 10))
            ->withQueryString();

        return Inertia::render('Admin/Favorite/Index', [
            'data' => FavoriteResource::collection($favorites),
            'filters' => ['search' => $search],
        ]);
    }

    public function show(Favorite $favorite)
    {
        return Inertia::render('Admin/Favorite/Show', [
            'favorite' => new FavoriteResource($favorite->load(['book', 'user'])),
        ]);
    }
}
