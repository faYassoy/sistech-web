<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\Product;

class ProductsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // \Log::info('Importing row:', $row); // see logs in storage/logs/laravel.log
        return new Product([
            'name'          => $row['name'] ?? null,
            'part_number'   => $row['part_number'] ?? null,
            'brand'         => $row['brand'] ?? null,
            'serial_number' => $row['serial_number'] ?? null,
            'price'         => $row['price'] ?? null,
            'description'   => $row['description'] ?? null,
            'supplier_id'   => $row['supplier_id'] ?? null,
        ]);
    }
}

