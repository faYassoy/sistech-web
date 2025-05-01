<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservation_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_item_id')->constrained()->onDelete('cascade');
            $table->foreignId('reservation_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('deducted_quantity');
            $table->enum('source', ['reservation', 'warehouse'])->default('reservation');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_delivery');
    }
};
