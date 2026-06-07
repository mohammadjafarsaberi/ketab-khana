<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $categories = QueryBuilder::for(Category::class)->allowedSorts('id', 'is_active', 'created_at')->defaultSort('-created_at')->paginate(perPage: ($request->query('perPage', 10)), page: $request->query('page', 1))->appends($request->query());

        return Inertia::render('Admin/Category/Index', [
            'data' => CategoryResource::collection($categories),
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

        Category::create($request->validated());

        Inertia::flash('success', 'Category created successfully.');

        return redirect()->route('categories.index');

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
        $category->update($request->validated());

        Inertia::flash('success', 'Category updated successfully.');

        return redirect()->route('categories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();

        Inertia::flash('success', 'Category deleted successfully.');
    }
}
