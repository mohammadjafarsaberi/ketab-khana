<?php

namespace App\Http\Controllers;

use App\Http\Resources\FavoriteResource;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = QueryBuilder::for(Favorite::class)
            ->with(['book', 'user'])
            ->allowedSorts('id', 'created_at')
            ->defaultSort('-created_at')
            ->paginate($request->query('per_page', 10))
            ->withQueryString();

        return Inertia::render('Admin/Favorite/Index', [
            'data' => FavoriteResource::collection($favorites),
        ]);
    }

    public function show(Favorite $favorite)
    {
        return Inertia::render('Admin/Favorite/Show', [
            'favorite' => new FavoriteResource($favorite->load(['book', 'user'])),
        ]);
    }
}
