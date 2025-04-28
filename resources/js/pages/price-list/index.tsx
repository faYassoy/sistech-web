/* eslint-disable @typescript-eslint/ban-ts-comment */
import { usePage } from '@inertiajs/react';
import React from 'react';

import CommonDataTable from '@/components/commonDataTable.component';

import AppLayout from '@/layouts/app-layout';
import { extractBreadcrumbs } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';


export interface Product {
    id: number;
    name: string;
    description?: string | null;
    price: string;
    part_number: string | null;
    serial_number: string;
    supplier_id: number | null;
    initial_stock: number;
    created_at: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface PageProps {
    products: {
        per_page: number;
        current_page: number;
        data: Product[];
        links: string;
        total: number;
    };
    suppliers: { id: number; name: string }[];
    selectedSupplier?: number | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const ProductsIndex: React.FC = () => {
    const props = usePage<PageProps>().props;
    const breadcrumbs: BreadcrumbItem[] = extractBreadcrumbs(window.location.pathname);
    const { products } = props;
    

    // Define columns
    const columns = [
        {
            name: '#',
            selector: (row: Product, index: number) => (props.products.current_page - 1) * props.products.per_page + index + 1,
            width: '50px',
        },
        { name: 'Name', selector: (row: Product) => row.name, sortable: true },
        {
            name: 'Harga',
            selector: (row: Product) => `Rp ${Number(row.price).toLocaleString('id-ID')}`,
            sortable: true,
        },
        { name: 'Part Number', selector: (row: Product) => row.part_number, sortable: true },
        {
            name: 'Brand',
            selector: (row: Product) => row.brand || 'N/A',
            sortable: true,
        },
        // { name: 'Stock', selector: (row: Product) => row.stocks_sum_quantity || 0, sortable: true },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Price List</h1>
                    
                </div>

                <CommonDataTable
                    // @ts-ignore
                    columns={columns}
                    data={products.data}
                    searchRoute="products.index"
                    totalRow={products.total}
                />
            </div>
        </AppLayout>
    );
};

export default ProductsIndex;
