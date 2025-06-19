/* eslint-disable @typescript-eslint/ban-ts-comment */
import CommonDataTable from '@/components/commonDataTable.component';
import DeliveryOrderPDF from '@/components/DeliveryOrderPdf';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useState } from 'react';

const DeliveryOrdersIndex: React.FC = () => {
    const { auth, deliveryOrders, warehouses } = usePage().props as any;
    const [selected, setSelected] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // Define columns
    const columns = [
        {
            name: '#',
            selector: (_: any, index: number) => (deliveryOrders.current_page - 1) * deliveryOrders.per_page + index + 1,
            width: '50px',
        },
        {
            name: 'No. Surat Jalan',
            width: '200px',
            selector: (row: any) => row.status,
            cell: (row) => (
                <div>
                    <p>{row.order_number}</p>
                    <p>{row.status}</p>
                </div>
            ),
            sortable: true,
        },
        { name: 'Konsumen', width: '150px', selector: (row: any) => row.buyer.name, sortable: true, hide: 'sm' },
        {
            name: 'Gudang',
            width: '150px',
            selector: (row: any) => warehouses.find((w: any) => w.id === row.warehouse_id)?.name || 'N/A',
            sortable: true,
            hide: 'sm',
        },
        {
            name: 'Di Buat',
            width: '150px',
            selector: (row: any) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
            hide: 'sm',
        },
        {
            name: 'Di kirim',
            width: '150px',
            selector: (row: any) => row.status=='delivered'&&new Date(row.updated_at).toLocaleDateString(),
            sortable: true,
            hide: 'sm',
        },
        {
            name: '',
            width: '100px',

            cell: (row: any) => (
                <div className="w-full">
                    {row.status != 'canceled' && row.status != 'pending' && (
                        // JSON.stringify(row)
                        <Button className="float-right" variant="secondary" onClick={() => { setIsOpen(true); setSelected(row) }}>
                            <Printer />
                        </Button>
                    )}
                </div>
            ),
            hide: 'sm',
        },
        {
            name: '',
            cell: (row: any) =>
                auth?.user?.roles[0] == 'admin' ?
                    row.status == 'pending' ? (
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
                    ) : row.status == 'approved' ? (
                        <Button
                            variant="default"
                            size={'sm'}
                            onClick={() => {
                                if (confirm('Are you sure you want to deliver this order?')) {
                                    router.patch(route('delivery-orders.deliver', row.id));
                                }
                            }}
                        >
                            Deliver
                        </Button>
                    ) : null : null,
        },
    ];
    // console.log(warehouses);
    return (
        <AppLayout>
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Surat Jalan</h1>
                    {auth?.user?.roles[0] == 'admin' && (
                        <Button onClick={() => router.get(route('delivery-orders.create'))}>Tambahkan Surat Jalan</Button>
                    )}
                </div>

                <CommonDataTable
                    // @ts-ignore
                    columns={columns}
                    data={deliveryOrders.data}
                    searchRoute="delivery-orders.index"
                    totalRow={deliveryOrders.total}
                    expandableRows
                    expandableRowsComponent={({ data }) => (
                        <div className="flex flex-col gap-2 bg-slate-100 p-4">
                            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">No Surat Jalan : </p>
                                <p>{data?.order_number}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Status : </p>
                                <p>{data?.status}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Sales : </p>
                                <p>{data?.creator?.name}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Tanggal : </p>
                                <p>{new Date(data?.date).toLocaleDateString('id')}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Di Kirim : </p>
                                <p>{data?.status=='delivered'&&new Date(data?.updated_at).toLocaleDateString('id')}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Konsumen : </p>
                                <p>{data?.buyer?.name}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Gudang : </p>
                                <p>{data?.warehouse?.name}</p>
                            </div>
                        </div>
                    )}
                />
            </div>
            <DeliveryOrderPDF isOpen={isOpen} onClose={() => setIsOpen(false)} data={selected} />
        </AppLayout>
    );
};

export default DeliveryOrdersIndex;
