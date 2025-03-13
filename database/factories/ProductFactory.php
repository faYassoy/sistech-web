<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Product::class;

    public function definition(): array
{
    return [
        'name' => $this->faker->word(),
        'part_number' => 'PN-' . $this->faker->unique()->bothify('###??'),
        'serial_number' => 'SN-' . $this->faker->unique()->bothify('###???'),
        'price' => $this->faker->randomFloat(2, 50, 500),
        'description' => $this->faker->sentence(),
        'supplier_id' => Supplier::inRandomOrder()->value('id') ?? null,
    ];
}

}
