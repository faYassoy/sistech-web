<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Supplier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Supplier::insert([
            [
                'name' => 'Tech Components Ltd',
                'address' => '123 Silicon Valley, CA',
                // 'brand' => 'GadgetPro',
                'contact_number' => '123-456-7890',
                'email' => 'contact@techcomponents.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Global Parts Inc',
                'address' => '456 Industrial Road, NY',
                // 'brand' => 'TechMax',
                'contact_number' => '987-654-3210',
                'email' => 'info@globalparts.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
        Customer::insert([
            [
                'name' => 'Theo dot gg',
                'address' => '123 Silicon Valley, CA',
                'company' => 'GadgetPro',
                'phone' => '123-456-7890',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Primegen',
                'address' => '456 Industrial Road, NY',
                'company' => 'TechMax',
                'phone' => '987-654-3210',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
