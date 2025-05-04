<?php

namespace App\Http\Controllers;

use App\Models\DeliveryItem;
use App\Models\DeliveryOrder;
use App\Models\Product;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //#### Brand PIE CHART ####//
        $totalProducts = Product::count();

        // Get the count of products for each brand
        $brandCounts = Product::select('brand', DB::raw('count(*) as total'))
            ->groupBy('brand')
            ->get();

        // Calculate the percentage for each brand and store it
        $brandPercentages = $brandCounts->map(function ($brand) use ($totalProducts) {
            return [
                'brand' => $brand->brand,
                'count' => $brand->total,
            ];
        });

        // Sort the brands by percentage in descending order and take the top 5
        $top5Brands['data'] = $brandPercentages->sortByDesc('count')->take(5)->values();
        $top5Brands['total_count'] = $totalProducts;

        //#### Most Order CHART ####//
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // Query for delivery items within the current month's orders
        // Group by product_id and sum the quantities
        $topProducts = DeliveryItem::select(
                'delivery_items.product_id',
                DB::raw('SUM(delivery_items.quantity) as total_ordered_quantity')
            )
            ->join('delivery_orders', 'delivery_items.delivery_order_id', '=', 'delivery_orders.id')
            ->whereBetween('delivery_orders.date', [$startOfMonth, $endOfMonth])
            ->groupBy('delivery_items.product_id')
            ->orderByDesc('total_ordered_quantity')
            ->limit(5)
            ->with('product') // Eager load the product relationship to get product details
            ->get();

        // Format the results to include product name and other details if needed
        $mostOrder = $topProducts->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product ? $item->product->name : 'Unknown Product', // Get product name
                // Add other product details if needed, e.g., 'brand' => $item->product->brand,
                'total_ordered_quantity' => (int) $item->total_ordered_quantity, // Cast to integer if needed
            ];
        });


        $user = Auth::user();


        $isAdmin = $user->hasRole('admin');


        $reservations = Reservation::with(['product', 'salesperson'])
            ->when(!$isAdmin, function ($query) use ($user) {
                $query->where('salesperson_id', $user->id);
            })
            ->latest()
            ->take(5)
            ->get();


        $deliveryOrders = DeliveryOrder::with(['warehouse', 'buyer'])
            ->when(!$isAdmin, function ($query) use ($user) {
                $query->where('created_by', $user->id);
            })
            ->latest()
            ->take(5)
            ->get();

        // Ambil produk terbaru
        $products = Product::select('id', 'name', 'brand')
            ->latest()
            ->take(5)
            ->withSum('stocks', 'quantity') // Get total stock quantity
            ->withSum('reservations', 'reserved_quantity') // Get total reserved quantity
            ->get();

        return inertia('dashboard', [
            'reservations' => $reservations,
            'deliveryOrders' => $deliveryOrders,
            'products' => $products,
            'isAdmin' => $isAdmin,
            'top5Brands' => $top5Brands,
            'mostOrder'=> $mostOrder
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
        //
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
