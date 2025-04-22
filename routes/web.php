<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DeliveryOrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\SalespersonInventoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::group(['middleware' => ['auth']],function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::group(['middleware' => ['role:admin','auth']],function () {

    // Route::get('users', function () {
    //     return Inertia::render('users/index');
    // })->name('users');

    Route::resource('users', UserController::class);
    Route::resource('products', ProductController::class);

    Route::resource('warehouses', WarehouseController::class);

    Route::resource('suppliers', SupplierController::class);

    Route::resource('customers', CustomerController::class);
    Route::post('customers/quick', [CustomerController::class, 'quick_store'])->name('customers.quick');

    Route::resource('reservations', ReservationController::class);

    Route::resource('delivery-orders', DeliveryOrderController::class);
    Route::get('/delivery-orders/{deliveryOrder}/print', [DeliveryOrderController::class, 'print'])->name('delivery-orders.print');
});

Route::group(['middleware' => ['role:sales_person', 'auth']], function () {

    Route::resource('products', ProductController::class)->only([
        'index', 'show'
    ]);

    Route::resource('reservations', ReservationController::class)->only([
        'index', 'create', 'store'
    ]);

    Route::resource('delivery-orders', DeliveryOrderController::class)->only([
        'index', 'create', 'store', 'show'
    ]);

    Route::get('/delivery-orders/{deliveryOrder}/print', [DeliveryOrderController::class, 'print'])->name('delivery-orders.print');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/users.php';
