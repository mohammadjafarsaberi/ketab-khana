<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\CategoryIndexRequest;
use App\Http\Requests\Admin\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CategoryIndexRequest $request)
    {
        $search = $request->string('search')->trim()->toString();

        $categories = QueryBuilder::for(Category::class)
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->whereLike('name', "%{$search}%")
                        ->orWhereLike('description', "%{$search}%");

                    if (ctype_digit($search)) {
                        $query->orWhere('id', (int) $search);
                    }

                    $active = match (strtolower($search)) {
                        'yes', 'active', 'true' => true,
                        'no', 'inactive', 'false' => false,
                        default => null,
                    };

                    if ($active !== null) {
                        $query->orWhere('is_active', $active);
                    }
                });
            })
            ->allowedSorts('id', 'name', 'is_active', 'created_at')
            ->defaultSort('-created_at')
            ->paginate($request->integer('per_page', 10))
            ->withQueryString();

        return Inertia::render('Admin/Category/Index', [
            'data' => CategoryResource::collection($categories),
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Category/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {

        Category::create([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active'),
        ]);

        Inertia::flash('success', 'Category created successfully.');

        return redirect()->route('admin.categories.index');

    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {

        return Inertia::render('Admin/Category/Show', [
            'category' => new CategoryResource($category),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        return Inertia::render('Admin/Category/Edit', ['category' => new CategoryResource($category)]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        $category->update([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active'),
        ]);

        Inertia::flash('success', 'Category updated successfully.');

        return redirect()->route('admin.categories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if ($category->books()->exists()) {
            Inertia::flash('error', 'Cannot delete a category that still has books. Reassign or delete those books first.');

            return redirect()->back();
        }

        $category->delete();

        Inertia::flash('success', 'Category deleted successfully.');

        return redirect()->back();
    }
}
