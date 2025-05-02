/* eslint-disable @typescript-eslint/ban-ts-comment */
import CommonDataTable from '@/components/commonDataTable.component';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import FormCustomer from './formCustomer';

export interface Customer {
    id: number;
    name: string;
    phone: string;
    address: string;
    company: string;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    customers: {
        data: Customer[];
        current_page: number;
        per_page: number;
        total: number;
    };
}

const CustomerIndex: React.FC = () => {
    // @ts-ignore
    const props = usePage<PageProps>().props;
    const { customers } = props;
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState<Customer | null>(null);

    // Define columns
    const columns = [
        {
            name: '#',
            selector: (row: Customer, index: number) => (customers.current_page - 1) * customers.per_page + index + 1,
            width: '50px',
        },
        { name: 'Nama', selector: (row: Customer) => row.name, sortable: true },
        { name: 'Telepon', selector: (row: Customer) => row.phone, sortable: true },
        {
            name: 'Dibuat',
            selector: (row: Customer) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: '',
            cell: (row: Customer) => (
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setModalOpen(true);
                            setSelected(row);
                        }}
                    >
                        Ubah
                    </Button>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this customer?')) {
                                router.delete(route('customers.destroy', row.id), {
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

    return (
        <AppLayout>
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Konsumen</h1>
                    <Button onClick={() => setModalOpen(true)}>Tambahkan Konsumen</Button>
                </div>

                <CommonDataTable
                    // @ts-ignore
                    columns={columns}
                    data={customers?.data}
                    searchRoute="customers.index"
                    totalRow={customers?.total}
                />
            </div>
            <FormCustomer
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelected(null);
                }}
                customer={selected}
            />
        </AppLayout>
    );
};

export default CustomerIndex;
