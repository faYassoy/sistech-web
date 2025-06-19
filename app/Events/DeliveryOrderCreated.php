<?php

namespace App\Events;

use App\Models\DeliveryOrder;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeliveryOrderCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    public DeliveryOrder $order;

    /**
     * Create a new event instance.
     */
    public function __construct(DeliveryOrder $order)
    {
        $this->order = $order;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin.notifications'),
        ];
    }
    public function broadcastWith(): array
    {
        return [
            'id'     => $this->order->id,
            'number' => $this->order->order_number,
            'date'   => $this->order->date,
            // …any other payload…
        ];
    }
}
