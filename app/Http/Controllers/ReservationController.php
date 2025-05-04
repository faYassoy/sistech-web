<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Reservation;
use App\Models\Product;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservationController extends Controller
{
    /**
     * Display a listing of the reservations.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $reservations = Reservation::with(['salesperson', 'product' => function ($query) {
            $query->withSum('stocks', 'quantity') // Total stock across warehouses
                ->withSum('reservations', 'reserved_quantity'); // Total reserved stock
        }])
        // ->when(Auth::check() && Auth::user()->roles[0]->name === 'sales_person', function ($query) {
        //     $query->where('salesperson_id', Auth::id());
        // })
        ->when($search, function ($query) use ($search) {
            $query->whereHas('salesperson', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        })
        ->paginate(10)
        ->withQueryString();

        $salespersons = User::select('id', 'name')->get();
        $products = Product::select('id', 'name')->withSum('stocks', 'quantity')->withSum('reservations', 'reserved_quantity')->get();
        $warehouses = Warehouse::select('id', 'name')->get();
        $customers = Customer::select('id', 'name')->get();

        return Inertia::render('reservations/index', [
            'reservations' => $reservations,
            'search' => $search,
            'salespersons' => $salespersons,
            'products' => $products,
            'warehouses' => $warehouses,
            'customers' => $customers,
            
        ]);
    }

    /**
     * Store a newly created reservation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'salesperson_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'reserved_quantity' => 'required|integer|min:1',
        ]);

        $product = Product::withSum('stocks', 'quantity')->findOrFail($validated['product_id']);
        $reservedStock = Reservation::where('product_id', $validated['product_id'])->sum('reserved_quantity');
        $availableStock = $product->stocks_sum_quantity - $reservedStock;

        if ($validated['reserved_quantity'] > $availableStock) {
            return back()->withErrors(['reserved_quantity' => 'Not enough stock available for reservation.']);
        }

        Reservation::create($validated);

        return redirect()->route('reservations.index')->with('success', 'Stock reserved successfully.');
    }

    /**
     * Update the specified reservation.
     */
    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'reserved_quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        $reservedStock = Reservation::where('product_id', $product->id)
            ->where('id', '!=', $reservation->id)
            ->sum('reserved_quantity');

        $availableStock = $product->stocks()->sum('quantity') - $reservedStock;

        if ($validated['reserved_quantity'] > $availableStock) {
            return back()->withErrors(['error' => 'Not enough stock available for reservation.']);
        }

        $reservation->update($validated);

        return redirect()->route('reservations.index')->with('success', 'Reservation updated successfully.');
    }

    /**
     * Remove the specified reservation.
     */
    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return redirect()->route('reservations.index')->with('success', 'Reservation deleted successfully.');
    }

    function getMyInventory() {
        $reservations = Reservation::where('salesperson_id', Auth::id())->with('product')->get();

        return response()->json([
            'success' => true,
            'data' => $reservations,
        ]);
    }
}
