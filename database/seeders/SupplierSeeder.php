<?php

namespace Database\Seeders;

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
                'contact_number' => '123-456-7890',
                'email' => 'contact@techcomponents.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Global Parts Inc',
                'address' => '456 Industrial Road, NY',
                'contact_number' => '987-654-3210',
                'email' => 'info@globalparts.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
