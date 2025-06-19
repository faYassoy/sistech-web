<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeliveryOrderController;
use App\Http\Controllers\DeliveryOrderReportController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\SalespersonInventoryController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\StockPeekController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::group(['middleware' => ['auth']],function () {

    Route::get('dashboard', [DashboardController::class,'index'])->name('dashboard');

    Route::resource('products', ProductController::class)->only([
        'index', 'show'
    ]);
    
    Route::get('price-list', [ProductController::class,'list'])->name('list');

    Route::resource('reservations', ReservationController::class)->only([
        'index', 'create', 'store','destroy'
    ]);
    Route::resource('delivery-orders', DeliveryOrderController::class)->only([
        'index', 'create', 'store', 'update'
    ]);

    Route::get('/delivery-orders/{deliveryOrder}/print', [DeliveryOrderController::class, 'print'])->name('delivery-orders.print');

    Route::get('salesperson-inventory', [ReservationController::class,'getMyInventory'])->name('salesperson-inventory');

});

Route::group(['middleware' => ['role:admin','auth']],function () {

    // Route::get('users', function () {
    //     return Inertia::render('users/index');
    // })->name('users');

    Route::resource('users', UserController::class);
    Route::resource('products', ProductController::class)->only([
        'create', 'store', 'update','destroy'
    ]);

    Route::resource('warehouses', WarehouseController::class);

    Route::resource('suppliers', SupplierController::class);

    Route::resource('customers', CustomerController::class);
    Route::resource('stocks', StockController::class);
    Route::post('customers/quick', [CustomerController::class, 'quick_store'])->name('customers.quick');

    Route::resource('delivery-orders', DeliveryOrderController::class)->only([
      'edit','update','destroy'
    ]);

    Route::post('/delivery-orders/{deliveryOrder}/cancel', [DeliveryOrderController::class, 'cancel'])
    ->name('delivery-orders.cancel');

    Route::patch('/delivery-orders/{deliveryOrder}/approve', [DeliveryOrderController::class, 'approve'])
    ->name('delivery-orders.approve');

    Route::patch('/delivery-orders/{deliveryOrder}/deliver', [DeliveryOrderController::class, 'deliver'])
    ->name('delivery-orders.deliver');

    Route::get('/delivery-orders/{deliveryOrder}/print', [DeliveryOrderController::class, 'print'])->name('delivery-orders.print');

    Route::prefix('warehouses/{warehouse}')->group(function () {
        Route::get('stocks/peek', [StockPeekController::class, 'index'])->name('warehouses.stocks.peek');
        Route::post('stocks/adjust', [StockPeekController::class, 'adjust'])->name('warehouses.stocks.adjust');
    });
    Route::get('reports/', [DeliveryOrderReportController::class, 'index'])->name('reports.index');
    // Route::resource('reports/', DeliveryOrderReportController::class);

    
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/users.php';
