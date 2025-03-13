<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Supplier;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = Supplier::pluck('id')->toArray();

        Product::create([
            'name' => 'Product A',
            'part_number' => 'PN-001',
            'serial_number' => 'SN-001',
            'price' => '100.00',
            'description' => 'This is Product A',
            'supplier_id' => $suppliers ? $suppliers[array_rand($suppliers)] : null,
        ]);

        Product::create([
            'name' => 'Product B',
            'part_number' => 'PN-002',
            'serial_number' => 'SN-002',
            'price' => '150.00',
            'description' => 'This is Product B',
            'supplier_id' => $suppliers ? $suppliers[array_rand($suppliers)] : null,
        ]);

        // Generate 10 more random products
        Product::factory(10)->create();
    }
}
