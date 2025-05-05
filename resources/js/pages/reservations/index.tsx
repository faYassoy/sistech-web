/* eslint-disable @typescript-eslint/ban-ts-comment */
import { router, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import CommonDataTable from '@/components/commonDataTable.component';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { extractBreadcrumbs } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import FormOrderConversion from './formOrderConversion';
import FormReservation from './formReservation';

interface SalespersonInventory {
    id: number;
    salesperson: { name: string };
    product: { name: string; stocks_sum_quantity: string; reservations_sum_reserved_quantity: string };
    total_stock: number;
    reserved_quantity: number;
    created_at: string;
    salesperson_id: string | number;
}

interface PageProps {
    reservations: {
        per_page: number;
        current_page: number;
        data: SalespersonInventory[];
        links: string;
        total: number;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const SalespersonInventoryIndex: React.FC = () => {
    const props = usePage<PageProps>().props;
    const breadcrumbs: BreadcrumbItem[] = extractBreadcrumbs(window.location.pathname);
    const { auth, customers, reservations, products, salespersons, warehouses } = props;
    const [selected, setSelected] = useState<SalespersonInventory | null>(null);
    const [reservationModal, setReservationModal] = useState(false);
    const [convertModal, setConvertModal] = useState(false);
    // console.log(reservations);

    const columns = [
        {
            name: '#',
            selector: (row: SalespersonInventory, index: number) => (props.reservations.current_page - 1) * props.reservations.per_page + index + 1,
            width: '50px',
        },
        { name: 'Sales', selector: (row: SalespersonInventory) => row.salesperson.name,
            sortable: true,
            cell: (row: SalespersonInventory) => (
                <div className="w-full truncate" title={row.product.name}>
                    <p>

                    {row.salesperson.name}
                    </p>
                    <p>

                    {row.product.name}
                    </p>
                </div>
                )
        },
            
        // {
        //     name: 'Product',
        //     selector: (row: SalespersonInventory) => row.product.name,
        //     sortable: true,
        //     cell: (row: SalespersonInventory) => (
        //         <div className="w-full truncate" title={row.product.name}>
        //             {row.product.name}
        //         </div>
        //     ),
        // },
        { name: 'Dipesan', selector: (row: SalespersonInventory) => `${row.reserved_quantity} (stock:${Number(row.product.stocks_sum_quantity) - Number(row.product.reservations_sum_reserved_quantity)})`, sortable: true },
        // {
        //     name: 'Total Stok',
        //     selector: (row: SalespersonInventory) =>
        //         `${Number(row.product.stocks_sum_quantity) - Number(row.product.reservations_sum_reserved_quantity)}`,
        //     sortable: true,
        // },
        {
            name: 'Dibuat',
            selector: (row: SalespersonInventory) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
            hide:'sm'
        },
        {
            name: '',
            cell: (row: SalespersonInventory) =>
                (auth?.user?.id == row.salesperson_id || auth?.user?.roles[0] == 'admin') && (
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            size={'sm'}
                            onClick={() => {
                                setSelected(row);
                                setReservationModal(true);
                            }}
                        >
                            Ubah
                        </Button>

                        <Button
                            variant="destructive"
                            size={'sm'}
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this reservation?')) {
                                    router.delete(route('reservations.destroy', row.id), {
                                        onError: (err) => alert(err.message),
                                    });
                                }
                            }}
                        >
                            Hapus
                        </Button>
                    </div>
                ),
        },
    ];

     useEffect(() => {
            const urlSearchParams = new URLSearchParams(window.location.search);
    
            if (urlSearchParams.has('is_creating')) {
                setReservationModal(urlSearchParams.get('is_creating'))
            }
        }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Reservasi</h1>

                    <div className="flex gap-4">
                        <Button onClick={() => setReservationModal(true)}>Buat Rervasi Baru</Button>
                        {auth?.user?.roles[0] == 'sales_person' && <Button onClick={() => setConvertModal(true)}>Order Conversion</Button>}
                    </div>
                </div>

                <CommonDataTable
                    // @ts-ignore
                    columns={columns}
                    data={reservations.data}
                    searchRoute="reservations.index"
                    totalRow={reservations.total}
                    expandableRows
                    expandableRowsComponent={({ data }) => (
                        <div className="flex flex-col gap-2 bg-slate-100 p-4">
                             {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Produk : </p>
                                <p>{data?.product?.name}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Sales : </p>
                                <p>{data?.salesperson?.name}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Dipesan : </p>
                                <p>{`${data.reserved_quantity} (stock:${Number(data.product.stocks_sum_quantity) - Number(data.product.reservations_sum_reserved_quantity)})`}</p>
                                {/* <p>{data?.creator?.name}</p> */}
                            </div>
                            
                        </div>
                    )}
                />
            </div>
            <FormReservation
                isOpen={reservationModal}
                onClose={() => {
                    setSelected(null);
                    setReservationModal(false);
                }}
                // @ts-ignore
                reservation={selected}
                products={products}
                salespersons={salespersons}
                warehouses={warehouses}
            />
            <FormOrderConversion isOpen={convertModal} onClose={() => setConvertModal(false)} customers={customers} />
        </AppLayout>
    );
};

export default SalespersonInventoryIndex;
