/* eslint-disable @typescript-eslint/ban-ts-comment */
import CommonDataTable from '@/components/commonDataTable.component';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';
// import { useState } from 'react';

const DeliveryOrdersIndex: React.FC = () => {
    const { auth, deliveryOrders, warehouses } = usePage().props as any;
    // const [selected, setSelected] = useState(null);

    // Define columns
    const columns = [
        {
            name: '#',
            selector: (_: any, index: number) => (deliveryOrders.current_page - 1) * deliveryOrders.per_page + index + 1,
            width: '50px',
        },
        {
            name: 'No. Surat Jalan',
            width:'200px',
            selector: (row: any) => row.status,
            cell: (row) => (
                <div>
                    <p>{row.order_number}</p>
                    <p>{row.status}</p>
                </div>
            ),
            sortable: true,
        },
        { name: 'Konsumen',width:'150px', selector: (row: any) => row.buyer.name, sortable: true },
        {
            name: 'Gudang',
            width:'150px',
            selector: (row: any) => warehouses.find((w: any) => w.id === row.warehouse_id)?.name || 'N/A',
            sortable: true,
        },
        {
            name: 'Di Buat',
            width: '150px',
            selector: (row: any) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: '',
            width: '100px',

            cell: (row: any) => (
                <div className="w-full">
                    {row.status != 'pending' && (
                        <Button className="float-right" variant="secondary" onClick={() => router.get(route('delivery-orders.print', row.id))}>
                            <Printer />
                        </Button>
                    )}
                </div>
            ),
        },
        {
            name: '',
            cell: (row: any) =>
                auth?.user?.roles[0] == 'admin' && row.status =='pending' &&(
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size={'sm'}
                            onClick={() => {
                                router.get(route('delivery-orders.edit', row.id));
                            }}
                        >
                            Edit
                        </Button>

                        {/* <Button
                            variant="destructive"
                            size={'sm'}
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this order?')) {
                                    router.delete(route('delivery-orders.destroy', row.id), {
                                        onError: (err) => alert(err.message),
                                    });
                                }
                            }}
                        >
                            Delete
                        </Button> */}
                        <Button
                            variant="destructive"
                            size={'sm'}
                            onClick={() => {
                                if (confirm('Are you sure you want to cancle this order?')) {
                                    router.post(route('delivery-orders.cancel', row.id));
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            size={'sm'}
                            onClick={() => {
                                if (confirm('Are you sure you want to approve this order?')) {
                                    router.patch(route('delivery-orders.approve', row.id));
                                }
                            }}
                        >
                            Approve
                        </Button>
                    </div>
                ),
        },
    ];
    // console.log(warehouses);
    return (
        <AppLayout>
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Surat Jalan</h1>
                    {auth?.user?.roles[0] == 'admin' && <Button onClick={() => router.get(route('delivery-orders.create'))}>Tambahkan Surat Jalan</Button>}
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
