/* eslint-disable @typescript-eslint/ban-ts-comment */
import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

import CommonDataTable from '@/components/commonDataTable.component';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { extractBreadcrumbs } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import ProductForm from './formProduct';

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
    const { products, suppliers, auth } = props;
    const [productModal, setProductModal] = useState(false);
    const [selected, setSelected] = useState<Product | null>(null);

    // Define columns
    const columns = [
        {
            name: '#',
            selector: (row: Product, index: number) => (props.products.current_page - 1) * props.products.per_page + index + 1,
            width: '50px',
        },
        { name: 'Name', selector: (row: Product) => row.name, sortable: true },
        { name: 'Part Number', selector: (row: Product) => row.part_number, sortable: true },
        {
            name: 'Brand',
            selector: (row: Product) => row.brand || 'N/A',
            sortable: true,
        },
        { name: 'Stock', selector: (row: Product) => `${Number(row.stocks_sum_quantity)-Number(row.reservations_sum_reserved_quantity)}`, sortable: true },
        { name: 'Reserved', selector: (row: Product) => ` ${Number(row.reservations_sum_reserved_quantity)}`, sortable: true },
        {
            name: 'Created At',
            selector: (row: Product) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: '',
            cell: (row: Product) =>
                auth?.user?.roles[0] == 'admin' ? (
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            size={'sm'}
                            onClick={() => {
                                setSelected(row);
                                setProductModal(true);
                            }}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="destructive"
                            size={'sm'}
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this product?')) {
                                    router.delete(route('products.destroy', row.id), {
                                        // onSuccess: () => alert('Product deleted successfully!'),
                                        onError: (err) => alert(err.message),
                                    });
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                ) : null,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products</h1>
                    { auth?.user?.roles[0] == 'admin' &&<Button onClick={() => setProductModal(true)}>Create New Product</Button>}
                </div>

                <CommonDataTable
                    // @ts-ignore
                    columns={columns}
                    data={products.data}
                    searchRoute="products.index"
                    totalRow={products.total}
                />
            </div>
            <ProductForm
                isOpen={productModal}
                onClose={() => {
                    setProductModal(false);
                    setSelected(null);
                }}
                suppliers={suppliers}
                product={selected}
            />
        </AppLayout>
    );
};

export default ProductsIndex;
