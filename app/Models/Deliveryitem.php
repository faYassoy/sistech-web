<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'delivery_order_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price',
    ];

    public function deliveryOrder()
    {
        return $this->belongsTo(DeliveryOrder::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function reservationDeliveries()
    {
        return $this->hasMany(ReservationDelivery::class);
    }
}
