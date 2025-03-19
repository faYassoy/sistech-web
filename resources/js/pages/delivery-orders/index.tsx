/* eslint-disable @typescript-eslint/ban-ts-comment */
import CommonDataTable from '@/components/commonDataTable.component';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import {  router, usePage } from '@inertiajs/react';
import { useState } from 'react';


const DeliveryOrdersIndex: React.FC = () => {
    const { deliveryOrders, warehouses } = usePage().props as any;
    const [selected, setSelected] = useState(null);

    // Define columns
    const columns = [
        {
            name: "#",
            selector: (_: any, index: number) =>
                (deliveryOrders.current_page - 1) * deliveryOrders.per_page + index + 1,
            width: "50px",
        },
        { name: "Order Number", selector: (row: any) => row.order_number, sortable: true },
        { name: "Buyer", selector: (row: any) => row.buyer, sortable: true },
        {
            name: "Warehouse",
            selector: (row: any) => warehouses.find((w: any) => w.id === row.warehouse_id)?.name || "N/A",
            sortable: true,
        },
        {
            name: "Created At",
            selector: (row: any) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: "",
            cell: (row: any) => (
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        size={"sm"}
                        onClick={() => {
                            router.get(route("delivery-orders.edit", row.id));
                        }}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="destructive"
                        size={"sm"}
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this order?")) {
                                router.delete(route("delivery-orders.destroy", row.id), {
                                    onError: (err) => alert(err.message),
                                });
                            }
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];
console.log(warehouses);
    return (
        <AppLayout>
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Delivery Orders</h1>
                    <Button onClick={() => router.get(route("delivery-orders.create"))}>
                        Create New Order
                    </Button>
                </div>

                <CommonDataTable
                // @ts-ignore
                    columns={columns}
                    data={deliveryOrders.data}
                    searchRoute="delivery-orders.index"
                    totalRow={deliveryOrders.total}
                />
            </div>
        </AppLayout>
    );
};

export default DeliveryOrdersIndex;