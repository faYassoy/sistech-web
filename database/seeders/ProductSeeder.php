<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Supplier;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create('id_ID'); // Use Indonesian locale for Faker
        $suppliers = Supplier::pluck('id')->toArray();
        $electronicGoods = [
            [
                'name' => 'Smart TV 4K 55 Inch',
                'part_number' => 'TV-4K-55',
                'part_number' => 'SAMSUNG',
                'description' => 'Immersive 4K Ultra HD Smart TV with vibrant colors and smart features.',
                'price' => 7999000, // Example price in IDR
            ],
            [
                'name' => 'Wireless Noise-Cancelling Headphones',
                'part_number' => 'HP-NC-001',
                'part_number' => 'SAMSUNG',
                'description' => 'Premium wireless headphones with active noise cancellation for immersive audio.',
                'price' => 2499000,
            ],
            [
                'name' => 'Gaming Laptop Intel Core i7',
                'part_number' => 'LAP-GAM-I7',
                'part_number' => 'SAMSUNG',
                'description' => 'High-performance gaming laptop with Intel Core i7 processor and dedicated graphics.',
                'price' => 14999000,
            ],
            [
                'name' => 'Smartphone 128GB',
                'part_number' => 'SM-128GB-BLK',
                'part_number' => 'SAMSUNG',
                'description' => 'Latest generation smartphone with 128GB storage and advanced camera system.',
                'price' => 9499000,
            ],
            [
                'name' => 'Bluetooth Speaker Portable',
                'part_number' => 'SPK-BT-PRT',
                'part_number' => 'SAMSUNG',
                'description' => 'Portable Bluetooth speaker with rich sound and long battery life.',
                'price' => 899000,
            ],
            [
                'name' => 'Mirrorless Camera with Kit Lens',
                'part_number' => 'CAM-ML-KIT',
                'part_number' => 'SAMSUNG',
                'description' => 'High-quality mirrorless camera with versatile kit lens for photography enthusiasts.',
                'price' => 11999000,
            ],
            [
                'name' => 'Smartwatch Fitness Tracker',
                'part_number' => 'SW-FIT-001',
                'part_number' => 'SAMSUNG',
                'description' => 'Smartwatch with comprehensive fitness tracking features and heart rate monitoring.',
                'price' => 1299000,
            ],
            [
                'name' => 'Solid State Drive (SSD) 1TB',
                'part_number' => 'SSD-1TB-INT',
                'part_number' => 'SAMSUNG',
                'description' => 'Internal 1TB Solid State Drive for faster data access and improved performance.',
                'price' => 1799000,
            ],
            [
                'name' => 'External Hard Drive 2TB',
                'part_number' => 'HDD-EXT-2TB',
                'part_number' => 'SAMSUNG',
                'description' => 'Portable 2TB external hard drive for data backup and storage.',
                'price' => 999000,
            ],
            [
                'name' => 'Wireless Mouse Ergonomic',
                'part_number' => 'MOU-WL-ERG',
                'part_number' => 'SAMSUNG',
                'description' => 'Ergonomic wireless mouse designed for comfortable and efficient use.',
                'price' => 399000,
            ],
        ];

        foreach ($electronicGoods as $goods) {
            Product::create([
                'name' => $goods['name'],
                'part_number' => $goods['part_number'],
                'serial_number' => strtoupper(uniqid('SN-')), // Generate a unique serial number
                'price' => $goods['price'],
                'description' => $goods['description'],
                'supplier_id' => $suppliers ? $suppliers[array_rand($suppliers)] : null,
            ]);
        }

        // You can add more products with Faker for more realistic data
        for ($i = 0; $i < 50; $i++) {
            $productName = $faker->word . ' ' . $faker->word . ' Electronic';
            Product::create([
                'name' => $productName,
                'part_number' => strtoupper('PN-' . $faker->unique()->randomNumber(5)),
                'serial_number' => strtoupper('SN-' . $faker->unique()->bothify('???-###')),
                'price' => $faker->numberBetween(500000, 20000000),
                'description' => $faker->sentence(10),
                'supplier_id' => $suppliers ? $faker->randomElement($suppliers) : null,
            ]);
        }
    }
}
