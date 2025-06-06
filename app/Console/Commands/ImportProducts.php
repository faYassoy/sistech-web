<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Imports\ProductsImport;
use Maatwebsite\Excel\Facades\Excel;

class ImportProducts extends Command
{
    //  Command signature and description
    protected $signature = 'import:products {file : Path to the Excel file}';
    protected $description = 'Import products from an Excel file into the products table';

    public function handle()
    {
        $filePath = $this->argument('file');

        if (! file_exists($filePath)) {
            $this->error("File not found: {$filePath}");
            return 1;
        }

        try {
            Excel::import(new ProductsImport, $filePath);
            $this->info('✅ Products imported successfully!');
        } catch (\Throwable $e) {
            $this->error('❌ Import failed: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
