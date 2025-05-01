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

        // Cek apakah user admin (asumsi pakai Spatie Role)
        $isAdmin = $user->hasRole('admin');

        // Ambil reservasi
        $reservations = Reservation::with(['product', 'warehouse'])
            ->when(!$isAdmin, function ($query) use ($user) {
                $query->where('salesperson_id', $user->id);
            })
            ->latest()
            ->take(5)
            ->get();

        // Ambil surat jalan
        $deliveryOrders = DeliveryOrder::with(['warehouse', 'buyer'])
            ->when(!$isAdmin, function ($query) use ($user) {
                $query->where('created_by', $user->id);
            })
            ->latest()
            ->take(5)
            ->get();

        // Ambil produk terbaru
        $products = Product::select('id', 'name', 'price')
            ->latest()
            ->take(10)
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
