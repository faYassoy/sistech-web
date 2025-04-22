<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $permissions = [
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view customers',
            'create customers',
            'edit customers',
            'delete customers',
            'view suppliers',
            'create suppliers',
            'edit suppliers',
            'delete suppliers',
            'view warehouses',
            'create warehouses',
            'edit warehouses',
            'delete warehouses',
            'view products',
            'create products',
            'edit products',
            'delete products',
            'view reservations',
            'create reservations',
            'edit reservations',
            'delete reservations',
            'view delivery orders',
            'create delivery orders',
            'edit delivery orders',
            'delete delivery orders',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }


        $admin = Role::firstOrCreate(['name' => 'admin']);
        $sales = Role::firstOrCreate(['name' => 'sales_person']);

        // Give all permissions to admin
        $admin->syncPermissions(Permission::all());

        // Sales person gets limited permissions
        $sales->syncPermissions([
            'view products',
            'view reservations',
            'create reservations',
            'edit reservations',
            'delete reservations',
            'view delivery orders',
            'create delivery orders',
        ]);
        $this->call([
            SupplierSeeder::class,
            WarehouseSeeder::class,
            UserSeeder::class,
            ProductSeeder::class,
            StockSeeder::class

        ]);
    }
}
