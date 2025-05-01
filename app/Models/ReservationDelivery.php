<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationDelivery extends Model
{
    protected $fillable = [
        'delivery_item_id',
        'reservation_id',
        'deducted_quantity',
        'source',
    ];

    public function deliveryItem()
    {
        return $this->belongsTo(DeliveryItem::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}

