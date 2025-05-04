<?php

namespace App\Http\Controllers;

use App\Models\DeliveryOrder;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryOrderReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $query = DeliveryOrder::with(['buyer', 'creator'])
        ->when(!auth()->user()->hasRole('admin'), function ($q) {
            $q->where('created_by', auth()->id());
        })
        ->when($request->search, function ($q, $search) {
            $q->where(function ($query) use ($search) {
                $query->where('order_number', 'like', "%{$search}%")
                      ->orWhereHas('buyer', fn($q) => $q->where('name', 'like', "%{$search}%"));
            });
        })
        ->when($request->status, fn($q, $status) => $q->where('status', $status))
        ->when($request->salesperson_id, fn($q, $id) => $q->where('created_by', $id))
        ->when($request->date_filter_type && $request->date_value, function ($q) use ($request) {
            $type = $request->date_filter_type;
            $value = $request->date_value;

            switch ($type) {
                case 'daily':
                    $q->whereDate('date', $value);
                    break;
                case 'weekly':
                    [$start, $end] = explode(',', $value); // assume frontend sends "2025-05-01,2025-05-07"
                    $q->whereBetween('date', [$start, $end]);
                    break;
                case 'monthly':
                    $q->whereMonth('date', Carbon::parse($value)->month)
                      ->whereYear('date', Carbon::parse($value)->year);
                    break;
                case 'range':
                    [$start, $end] = explode(',', $value);
                    $q->whereBetween('date', [$start, $end]);
                    break;
            }
        });

    $deliveryOrders = $query->latest()->paginate(15);

    return Inertia::render('Reports/DeliveryOrderReport', [
        'deliveryOrders' => $deliveryOrders,
        'filters' => $request->only('search', 'status', 'salesperson_id', 'date_filter_type', 'date_value'),
        'salespersons' => User::role('sales_person')->select('id', 'name')->get(),
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
