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
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ])->assignRole('admin');;

        User::create([
            'name' => 'Salma Putri',
            'email' => 'sales@gmail.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ])->assignRole('sales_person');

        User::create([
            'name' => 'Gunaryoko',
            'email' => 'gunaryoko@gmail.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ])->assignRole('sales_person');

        // User::factory(10)->create(); // Generate 10 random users
       
    }
}
