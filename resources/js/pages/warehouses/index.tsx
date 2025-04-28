/* eslint-disable @typescript-eslint/ban-ts-comment */
import CommonDataTable from '@/components/commonDataTable.component';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import FormWarehouse from './formWarehouse';
import ComplementaryDrawer from '@/components/Drawer';
import StockModal from '@/components/StockModal';


export interface Warehouse {
    id: number;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    warehouses: {
        data: Warehouse[];
        current_page: number;
        per_page: number;
        total: number;
    };
}

const WarehouseIndex: React.FC = () => {
    // @ts-ignore
    const props = usePage<PageProps>().props;
    const { warehouses } = props;
    const [modalOpen, setModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

    // Define columns
    const columns = [
        {
            name: '#',
            selector: (row: Warehouse, index: number) => (warehouses.current_page - 1) * warehouses.per_page + index + 1,
            width: '50px',
        },
        { name: 'Name', selector: (row: Warehouse) => row.name, sortable: true },
        { name: 'Location', selector: (row: Warehouse) => row.location, sortable: true },
        {
            name: 'Created At',
            selector: (row: Warehouse) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: 'Actions',
            width:'400px',
            cell: (row: Warehouse) => (
                <div className="grid grid-cols-3 gap-2">
                    <Button
                        // variant="outline"
                        size="sm"
                        onClick={() => {
                            setDrawerOpen(true);
                            setSelectedWarehouse(row);
                        }}
                    >
                        Kelola Stok
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setModalOpen(true);
                            setSelectedWarehouse(row);
                        }}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this warehouse?')) {
                                router.delete(route('warehouses.destroy', row.id), {
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
        <AppLayout>
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Warehouses</h1>
                    {/* <Button onClick={() => setModalOpen(true)}>Create New Warehouse</Button> */}
                </div>

                <CommonDataTable
                    // @ts-ignore
                    columns={columns}
                    data={warehouses.data}
                    searchRoute="warehouses.index"
                    totalRow={warehouses.total}
                />
            </div>
            <FormWarehouse
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedWarehouse(null);
                }}
                warehouse={selectedWarehouse}
            />
            <ComplementaryDrawer isOpen={drawerOpen} onClose={()=>setDrawerOpen(false)}>
            <div className="max-h-[80vh] overflow-y-scroll">
               <StockModal isOpen={drawerOpen} warehouseId={selectedWarehouse?.id||''}/>
            </div>
            </ComplementaryDrawer>
        </AppLayout>
    );
};

export default WarehouseIndex;
