<?php

namespace Database\Seeders;

use App\Models\Warehouse;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Warehouse::insert([
            [
                'name' => 'Main Warehouse',
                'location' => 'Downtown Storage Facility',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Backup Warehouse',
                'location' => 'Suburban Industrial Park',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
