<?php

namespace Database\Factories;

use App\Models\Stock;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stock>
 */
class StockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Stock::class;

    public function definition()
    {
        return [
            'product_id' => null, // Handled by seeder
            'warehouse_id' => null, // Handled by seeder
            'quantity' => fake()->numberBetween(10, 500),
        ];
    }
}
