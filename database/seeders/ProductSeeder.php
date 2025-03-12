<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $suppliers = Supplier::pluck('id')->toArray();

        Product::factory(20)->create([
            'supplier_id' => fn () => fake()->randomElement($suppliers) ?? null,
        ]);
    }
}
