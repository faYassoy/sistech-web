<?php

namespace App\Http\Controllers;

use App\Models\DeliveryOrder;
use App\Models\DeliveryItem;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DeliveryOrderController extends Controller
{
    /**
     * Display a listing of the delivery orders.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $deliveryOrders = DeliveryOrder::with('warehouse', 'creator')
            ->when($search, function ($query) use ($search) {
                $query->where('order_number', 'like', "%{$search}%")
                    ->orWhere('buyer', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('delivery-orders/index', [
            'deliveryOrders' => $deliveryOrders,
            'warehouses' => Warehouse::select('id', 'name')->get(),
            'search' => $search
        ]);
    }
    public function create()
    {
        return Inertia::render('delivery-orders/formDeliveryOrder', [
            'warehouses' => Warehouse::select('id', 'name')->get(),
            'products' => Product::select('id', 'name', 'price')->with('stocks')->get(),
        ]);
    }
    /**
     * Store a newly created delivery order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'buyer' => 'required|string|max:255',
            'warehouse_id' => 'required|exists:warehouses,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $order = DeliveryOrder::create([
                'order_number' => $this->generateOrderNumber(),
                'date' => $validated['date'],
                'buyer' => $validated['buyer'],
                'warehouse_id' => $validated['warehouse_id'],
                'created_by' => auth()->id(),
                'status' => 'pending', // Default status
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Check stock availability
                $reservedStock = $product->reservations()->sum('reserved_quantity');
                $availableStock = $product->stocks()->sum('quantity') - $reservedStock;

                if ($item['quantity'] > $availableStock) {
                    throw new \Exception("Not enough stock for {$product->name}");
                }

                // Deduct stock
                $product->stocks()->decrement('quantity', $item['quantity']);

                DeliveryItem::create([
                    'delivery_order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        });

        return redirect()->route('delivery-orders.index')->with('success', 'Delivery order created successfully.');
    }

    public function edit(DeliveryOrder $deliveryOrder)
    {
        $deliveryOrder->load([
            'items:id,delivery_order_id,product_id,quantity,unit_price'
        ]);
        return Inertia::render('delivery-orders/formDeliveryOrder', [
            'deliveryOrder' => $deliveryOrder,
            'warehouses' => Warehouse::select('id', 'name')->get(),
            'products' => Product::select('id', 'name', 'price')->with('stocks')->get(),
        ]);
    }

    public function update(Request $request, DeliveryOrder $deliveryOrder)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'buyer' => ['required', 'string'],
            'warehouse_id' => ['required', 'exists:warehouses,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);
    
        DB::transaction(function () use ($deliveryOrder, $validated) {
            // Restore the previous stock before updating
            foreach ($deliveryOrder->items as $item) {
                Stock::where('product_id', $item->product_id)
                    ->where('warehouse_id', $deliveryOrder->warehouse_id)
                    ->increment('quantity', $item->quantity);
            }
    
            // Update Delivery Order
            $deliveryOrder->update([
                'date' => $validated['date'],
                'buyer' => $validated['buyer'],
                'warehouse_id' => $validated['warehouse_id'],
            ]);
    
            // Remove old items
            $deliveryOrder->items()->delete();
    
            // Insert new items & deduct stock
            foreach ($validated['items'] as $item) {
                $deliveryOrder->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['unit_price']*$item['quantity'],
                ]);
    
                // Deduct stock from the correct warehouse
                Stock::where('product_id', $item['product_id'])
                    ->where('warehouse_id', $validated['warehouse_id'])
                    ->decrement('quantity', $item['quantity']);
            }
        });
    
        return redirect()->route('delivery-orders.index')->with('success', 'Delivery Order updated successfully!');
    }    

    /**
     * Generate a unique order number.
     */
    private function generateOrderNumber()
    {
        $latestOrder = DeliveryOrder::latest()->first();
        $nextNumber = $latestOrder ? ((int) substr($latestOrder->order_number, -5)) + 1 : 1;
        return 'DO-' . now()->format('Ymd') . '-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }


    public function print(DeliveryOrder $deliveryOrder)
{
    return Inertia::render('delivery-orders/Print', [
        'deliveryOrder' => $deliveryOrder->load('items.product')
    ]);
}

}
