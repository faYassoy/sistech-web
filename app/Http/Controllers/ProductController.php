<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Stock;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $supplierId = $request->query('supplier_id');
    
        $products = Product::query()
        ->with('supplier') // Include supplier details
        ->withSum('stocks', 'quantity') // Get total stock quantity
        ->when($search, fn($query) => 
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('part_number', 'like', "%{$search}%")
        )
        ->when($supplierId, fn($query) => 
            $query->where('supplier_id', $supplierId)
        )
        ->paginate(10)
        ->withQueryString();
    
        $suppliers = Supplier::select('id', 'name')->get();
    
        return Inertia::render('products/index', [
            'products' => $products,
            'search' => $search,
            'suppliers' => $suppliers,
            'selectedSupplier' => $supplierId,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
{
    return Inertia::render('products/formProduct', [
        'suppliers' => Supplier::all(['id', 'name']),
    ]);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'part_number' => 'required|string|max:255',
        'serial_number' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'description' => 'nullable|string',
        'supplier_id' => 'nullable|exists:suppliers,id',
        'initial_stock' => 'required|integer|min:0', // Handling initial stock
        'warehouse_id' => 'nullable|exists:warehouses,id',
    ]);

    try {
        DB::transaction(function () use ($validated) {
            $product = Product::create([
                'name' => $validated['name'],
                'part_number' => $validated['part_number'],
                'serial_number' => $validated['serial_number'],
                'price' => $validated['price'],
                'description' => $validated['description'] ?? null,
                'supplier_id' => $validated['supplier_id'] ?? null,
            ]);

            if ($validated['initial_stock'] > 0) {
                Stock::create([
                    'product_id' => $product->id,
                    'warehouse_id' => $validated['warehouse_id'] ?? null,
                    'quantity' => $validated['initial_stock'],
                ]);
            }
        });

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    } catch (\Exception $e) {
        return back()->withErrors(['error' => 'Failed to create product: ' . $e->getMessage()]);
    }
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
    public function edit(Product $product)
    {
        return Inertia::render('products/formProduct', [
            'product' => $product,
            'suppliers' => Supplier::all(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric|min:0',
        'part_number' => 'nullable|string|max:255',
        'serial_number' => 'required|string|max:255',
        'supplier_id' => 'nullable|exists:suppliers,id',
        // 'initial_stock' => 'required|integer|min:0',
    ]);

    DB::beginTransaction();
    try {
        // Update product
        $product->update($validated);

        // If stock handling is needed later, we can add it here
        // e.g., $product->stocks()->updateOrCreate([...]);

        DB::commit();
        return redirect()->route('products.index')->with('success', 'Product updated successfully!');
    } catch (\Exception $e) {
        DB::rollBack();
        return back()->withErrors(['error' => 'Failed to update product: ' . $e->getMessage()]);
    }
}
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
{
    DB::transaction(function () use ($product) {
        // // Check if there are related records (e.g., stock movements, orders)
        // if ($product->orders()->exists()) {
        //     return response()->json(['message' => 'Cannot delete product with existing orders'], 400);
        // }

        $product->delete();
    });

    return back()->with('success', 'Product deleted successfully.');
}
}
