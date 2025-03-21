<?php

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
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Route::get('users', function () {
    //     return Inertia::render('users/index');
    // })->name('users');

    Route::resource('users', UserController::class);
    Route::resource('products', ProductController::class);
    Route::resource('warehouses', WarehouseController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('reservations', ReservationController::class);

    Route::resource('delivery-orders', DeliveryOrderController::class);
    Route::get('/delivery-orders/{deliveryOrder}/print', [DeliveryOrderController::class, 'print'])->name('delivery-orders.print');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/users.php';
