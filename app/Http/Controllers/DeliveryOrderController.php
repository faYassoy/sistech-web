<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\DeliveryOrder;
use App\Models\DeliveryItem;
use App\Models\Product;
use App\Models\Reservation;
use App\Models\ReservationDelivery;
use App\Models\Stock;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DeliveryOrderController extends Controller
{
    /**
     * Display a listing of the delivery orders.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $deliveryOrders = DeliveryOrder::with([
            'items' => function ($query) {
                $query->with('product');
            },
            'warehouse' => function ($query) {
                $query->select('id', 'name');
            },
            'creator' => function ($query) {
                $query->select('id', 'name');
            },
            'buyer' => function ($query) {
                $query->select('id', 'name', 'address');
            }
        ])
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
            'products' => Product::select('id', 'name', 'price')
                ->whereHas('stocks', function ($query) {
                    // Filter the products where the sum of related stock quantities is greater than 0
                    $query->havingRaw('SUM(quantity) > 0');
                })->withSum('stocks', 'quantity')->withSum('reservations', 'reserved_quantity')
                ->get(),
            'customers' => Customer::select('id', 'name', 'company')->get(),
        ]);
    }
    /**
     * Store a newly created delivery order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'buyer_id' => 'required|integer|exists:customers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            // Step 1: Create the delivery order
            $order = DeliveryOrder::create([
                'order_number' => $this->generateOrderNumber(),
                'date' => $validated['date'],
                'buyer_id' => $validated['buyer_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'created_by' => auth()->id(),
                'status' => 'pending',
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Step 2: Check stock availability
                $reservedStock = $product->reservations()->sum('reserved_quantity');
                $availableStock = $product->stocks()->sum('quantity') - $reservedStock;

                if ($item['quantity'] > ($reservedStock + $availableStock)) {
                    throw new \Exception("Not enough total stock for {$product->name}");
                }

                // Step 3: Create delivery item
                $deliveryItem = DeliveryItem::create([
                    'delivery_order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                ]);

                // Step 4: Deduct from reservation first (if available)
                $remainingToDeduct = $item['quantity'];

                $reservations = $product->reservations()
                    ->where('salesperson_id', auth()->id())
                    ->whereNull('delivery_order_id') // only unused reservations
                    ->orderBy('id')
                    ->get();

                foreach ($reservations as $reservation) {
                    if ($remainingToDeduct <= 0) break;

                    $deduct = min($reservation->reserved_quantity, $remainingToDeduct);

                    // Log reservation usage in pivot
                    ReservationDelivery::create([
                        'delivery_item_id' => $deliveryItem->id,
                        'reservation_id' => $reservation->id,
                        'deducted_quantity' => $deduct,
                        'source' => 'reservation',
                    ]);

                    $remainingToDeduct -= $deduct;
                    if ($deduct === $reservation->reserved_quantity) {
                        $reservation->update([
                            'delivery_order_id' => $order->id,
                        ]);
                    }
                }

                \Log::info("Updated reservation ID {$reservation->id} with DO ID {$order->id}");
                \Log::info("Updated reservation {$reservation}");
                // Step 5: Deduct remaining from warehouse if needed
                if ($remainingToDeduct > 0) {
                    $product->stocks()->decrement('quantity', $remainingToDeduct);

                    // Log warehouse usage in pivot
                    ReservationDelivery::create([
                        'delivery_item_id' => $deliveryItem->id,
                        'reservation_id' => null,
                        'deducted_quantity' => $remainingToDeduct,
                        'source' => 'warehouse',
                    ]);
                }
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
            'customers' => Customer::select('id', 'name', 'company')->get(),
        ]);
    }

    public function update(Request $request, DeliveryOrder $deliveryOrder)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'buyer_id' => ['required', 'integer'],
            'warehouse_id' => ['required', 'exists:warehouses,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', Rule::in(['pending', 'approved', 'delivered', 'canceled'])],
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
                'buyer_id' => $validated['buyer_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'status' => $validated['status'],
            ]);

            // Remove old items
            $deliveryOrder->items()->delete();

            // Insert new items & deduct stock
            foreach ($validated['items'] as $item) {
                $deliveryOrder->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['unit_price'] * $item['quantity'],
                ]);

                // Deduct stock from the correct warehouse
                Stock::where('product_id', $item['product_id'])
                    ->where('warehouse_id', $validated['warehouse_id'])
                    ->decrement('quantity', $item['quantity']);
            }
        });

        return redirect()->route('delivery-orders.index')->with('success', 'Delivery Order updated successfully!');
    }


    public function approve(DeliveryOrder $deliveryOrder)
    {
        if ($deliveryOrder->status !== 'pending') {
            return back()->withErrors(['error' => 'Only pending delivery orders can be approved.']);
        }

        DB::transaction(function () use ($deliveryOrder) {
            foreach ($deliveryOrder->items as $item) {
                $remainingQty = $item->quantity;

                // 🔁 Process reservation-based deliveries first (if any)
                foreach ($item->reservationDeliveries as $resDel) {
                    $reservation = $resDel->reservation;

                    if (!$reservation) continue;

                    $warehouseStock = Stock::where('warehouse_id', $deliveryOrder->warehouse_id)
                        ->where('product_id', $item->product_id)
                        ->lockForUpdate()
                        ->first();

                    $deductQty = min($remainingQty, $resDel->deducted_quantity);

                    if ($deductQty > 0 && $warehouseStock) {
                        $warehouseStock->decrement('quantity', $deductQty);
                        $remainingQty -= $deductQty;

                        // Update or delete reservation
                        $reservation->reserved_quantity -= $deductQty;
                        if ($reservation->reserved_quantity <= 0) {
                            $reservation->delete();
                        } else {
                            $reservation->save();
                        }
                    }
                }

                // 🧾 Fallback: deduct remaining quantity directly if needed
                if ($remainingQty > 0) {
                    $warehouseStock = Stock::where('warehouse_id', $deliveryOrder->warehouse_id)
                        ->where('product_id', $item->product_id)
                        ->lockForUpdate()
                        ->first();

                    if ($warehouseStock && $warehouseStock->quantity >= $remainingQty) {
                        $warehouseStock->decrement('quantity', $remainingQty);
                    } else {
                        throw new \Exception("Not enough stock for product {$item->product->name}.");
                    }
                }
            }

            $deliveryOrder->update(['status' => 'approved']);
        });

        return redirect()->route('delivery-orders.index')->with('success', 'Delivery Order approved and stock deducted!');
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
    public function destroy(DeliveryOrder $deliveryOrder)
    {
        try {
            $deliveryOrder->delete();
            return redirect()->route('delivery-orders.index')->with('success', 'Delivery Order deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete Delivery Order: ' . $e->getMessage()]);
        }
    }
    public function cancel(DeliveryOrder $deliveryOrder)
    {
        if ($deliveryOrder->status === 'canceled') {
            return redirect()->back()->with('info', 'Order already canceled.');
        }

        DB::transaction(function () use ($deliveryOrder) {
            foreach ($deliveryOrder->items as $item) {
                // Revert warehouse stock only if quantity was directly deducted
                $directDeducted = $item->reservationDeliveries()
                    ->where('source', 'warehouse')
                    ->sum('deducted_quantity');

                if ($directDeducted > 0) {
                    $item->product->stocks()->increment('quantity', $directDeducted);
                }

                // Delete all reservation usage logs
                $item->reservationDeliveries()->delete();
            }
            Reservation::where('delivery_order_id', $deliveryOrder->id)->update([
                'delivery_order_id' => null,
            ]);
            $deliveryOrder->status = 'canceled';
            $deliveryOrder->save();
        });

        return redirect()->route('delivery-orders.index')->with('success', 'Delivery order canceled and stock reverted.');
    }
}
