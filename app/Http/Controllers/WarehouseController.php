<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $warehouses = Warehouse::when($search, function ($query, $search) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('location', 'like', "%$search%");
        })
        ->orderBy('created_at', 'desc')
        ->paginate(10)
        ->withQueryString();
        
        return Inertia::render('warehouses/index', [
            'warehouses' => $warehouses,
            'filters' => ['search' => $search]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        Warehouse::create($validated);

        return redirect()->route('warehouses.index')->with('success', 'Warehouse created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Warehouse $warehouse)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'location' => 'required|string|max:255',
    ]);

    try {
        DB::transaction(function () use ($warehouse, $validated) {
            $warehouse->update($validated);
        });

        return redirect()->route('warehouses.index')->with('success', 'Warehouse updated successfully.');
    } catch (\Exception $e) {
        return back()->withErrors(['error' => 'Failed to update warehouse.']);
    }
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
