<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;

class StockPeekController extends Controller
{
    public function index(Request $request, $warehouseId)
    {
        $search = $request->query('search');

        $products = Product::query()
            ->withSum(['stocks' => function ($query) use ($warehouseId) {
                $query->where('warehouse_id', $warehouseId);
            }], 'quantity')
            ->withSum('reservations', 'reserved_quantity')
            ->when($search, fn($q) =>
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('part_number', 'like', "%{$search}%"))
            ->latest()
            ->paginate(10);

        return response()->json($products);
    }

    public function adjust(Request $request, $warehouseId)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer'], // Can be negative for decrease
        ]);

        $stock = Stock::firstOrNew([
            'warehouse_id' => $warehouseId,
            'product_id' => $validated['product_id'],
        ]);

        $stock->quantity += $validated['quantity'];
        $stock->save();

        return back()->with('success', 'Stock adjusted successfully!');
    }
}
