<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToModel;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\Product;
use App\Models\Stock;


class ProductsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // \Log::info('Importing row:', $row); // see logs in storage/logs/laravel.log
        DB::transaction(function () use ($row) {
            // 1. Create and save the Product model
            $product = new Product([
                'name'          => $row['name'] ?? null,
                'part_number'   => $row['part_number'] ?? null,
                'brand'         => $row['brand'] ?? null,
                'serial_number' => $row['serial_number'] ?? null,
                'price'         => $row['price'] ?? null,
                'description'   => $row['description'] ?? null,
                'supplier_id'   => $row['supplier_id'] ?? null,
            ]);
            $product->save(); // Manually save the product to get its ID

            // 2. Create the Stock model using the newly created product's ID
            Stock::create([
                'product_id' => $product->id, // Use the ID of the product just saved
                'quantity'   => 12,           // Default quantity
                'warehouse_id' => null,       // Default to null as per your schema, or set a specific default warehouse ID
            ]);
        });
    }
}

