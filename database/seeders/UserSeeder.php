<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Sales Person',
            'email' => 'sales@example.com',
            'password' => Hash::make('password'),
            'role' => 'sales_person',
            'is_active' => true,
        ]);

        User::factory(10)->create(); // Generate 10 random users
    }
}
