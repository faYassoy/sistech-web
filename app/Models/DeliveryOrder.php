<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'date',
        'buyer_id',
        'warehouse_id',
        'created_by',
        'status',
    ];

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function buyer()
    {
        return $this->belongsTo(Customer::class, 'buyer_id');
    }

    public function items()
    {
        return $this->hasMany(DeliveryItem::class);
    }
}
