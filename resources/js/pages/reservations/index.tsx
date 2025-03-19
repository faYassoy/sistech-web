/* eslint-disable @typescript-eslint/ban-ts-comment */
import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

import CommonDataTable from '@/components/commonDataTable.component';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { extractBreadcrumbs } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import FormReservation from './formReservation';

interface SalespersonInventory {
    id: number;
    salesperson: { name: string };
    product: { name: string; stocks_sum_quantity: string };
    total_stock: number;
    reserved_quantity: number;
    created_at: string;
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
    const { reservations, products, salespersons, warehouses } = props;
    const [selected, setSelected] = useState<SalespersonInventory | null>(null);
    const [reservationModal, setReservationModal] = useState(false);
    console.log(reservations);

    const columns = [
        {
            name: '#',
            selector: (row: SalespersonInventory, index: number) => (props.reservations.current_page - 1) * props.reservations.per_page + index + 1,
            width: '50px',
        },
        { name: 'Salesperson', selector: (row: SalespersonInventory) => row.salesperson.name, sortable: true },
        { name: 'Product', selector: (row: SalespersonInventory) => row.product.name, sortable: true },
        { name: 'Reserved Quantity', selector: (row: SalespersonInventory) => row.reserved_quantity, sortable: true },
        { name: 'Total Stock', selector: (row: SalespersonInventory) => row.product.stocks_sum_quantity, sortable: true },
        {
            name: 'Created At',
            selector: (row: SalespersonInventory) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: '',
            cell: (row: SalespersonInventory) => (
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        size={'sm'}
                        onClick={() => {
                            setSelected(row);
                            setReservationModal(true);
                        }}
                    >
                        Edit
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
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Salesperson Inventory</h1>
                    <Button onClick={() => setReservationModal(true)}>New Reservation</Button>
                </div>

                <CommonDataTable
                    // @ts-ignore
                    columns={columns}
                    data={reservations.data}
                    searchRoute="reservations.index"
                    totalRow={reservations.total}
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
        </AppLayout>
    );
};

export default SalespersonInventoryIndex;
