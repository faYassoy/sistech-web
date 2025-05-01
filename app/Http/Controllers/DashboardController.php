<?php

namespace App\Http\Controllers;

use App\Models\DeliveryOrder;
use App\Models\Product;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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
