<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\BookSearchRequest;
use App\Http\Resources\PublicBookResource;
use App\Models\Author;
use App\Models\Category;
use App\Services\BookSearchService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function __construct(private readonly BookSearchService $searchService) {}

    public function index(BookSearchRequest $request): Response
    {
        $result = $this->searchService->search($request->validated());

        return Inertia::render('public/books/index', [
            'books' => PublicBookResource::collection($result['paginator']),
            'engine' => $result['engine'],
            'filters' => $request->validated(),
            'filterOptions' => $this->filterOptions(),
        ]);
    }

    public function search(BookSearchRequest $request): JsonResponse
    {
        $result = $this->searchService->search($request->validated());
        $resource = PublicBookResource::collection($result['paginator'])->response()->getData(true);

        return response()->json([...$resource, 'engine' => $result['engine']]);
    }

    /** @return array<string, mixed> */
    private function filterOptions(): array
    {
        return [
            'categories' => Category::query()->active()->orderBy('name')->get(['id', 'name']),
            'authors' => Author::query()->whereHas('books', fn ($query) => $query->active())->orderBy('name')->get(['id', 'name']),
            'languages' => ['en', 'fa', 'ps'],
            'formats' => ['pdf', 'epub', 'mobi'],
        ];
    }
}
