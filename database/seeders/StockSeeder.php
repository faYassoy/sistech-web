<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Stock;
use App\Models\Warehouse;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $products = Product::pluck('id')->toArray();
        $warehouses = Warehouse::pluck('id')->toArray();

        Stock::factory(50)->create([
            'product_id' => fn () => fake()->randomElement($products),
            'warehouse_id' => fn () => fake()->randomElement($warehouses) ?? null,
            'quantity' => fn () => fake()->numberBetween(10, 500),
        ]);
    }
}
