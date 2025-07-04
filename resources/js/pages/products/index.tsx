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
        { name: 'Nama', selector: (row: Product) => row.name, sortable: true },
        { name: 'Part Number', selector: (row: Product) => row.part_number, sortable: true,hide:'sm' },
        {
            name: 'Brand',
            selector: (row: Product) => row.brand || 'N/A',
            sortable: true,
            hide:'sm'
        },
        // { name: 'Stok', selector: (row: Product) => ``, sortable: true,hide:'sm' },
        { name: 'Reservasi', selector: (row: Product) => ` ${Number(row.reservations_sum_reserved_quantity)} (stok: ${Number(row.stocks_sum_quantity)-Number(row.reservations_sum_reserved_quantity)})`, sortable: true },
        {
            name: 'Dibuat',
            selector: (row: Product) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
            hide:'sm'
        },
        {
            name: '',
            hide:'sm',
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
                            Ubah
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
                            Hapus
                        </Button>
                    </div>
                ) : null,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Produk</h1>
                    { auth?.user?.roles[0] == 'admin' &&<Button onClick={() => setProductModal(true)}>Tambahkan Produk</Button>}
                </div>

                <CommonDataTable
                    // @ts-ignore
                    columns={columns}
                    data={products.data}
                    searchRoute="products.index"
                    totalRow={products.total}
                    expandableRows
                    expandableRowsComponent={({ data }) => (
                        <div className="flex flex-col gap-2 bg-slate-100 p-4">
                             {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Produk : </p>
                                <p>{data?.name}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">No. Seri : </p>
                                <p>{data?.serial_number}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Part : </p>
                                <p>{data?.part_number}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Brand : </p>
                                <p>{data?.brand}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Harga : </p>
                                <p>{`Rp ${Number(data?.price).toLocaleString('id-ID')}`}</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <p className="font-semibold">Deskripsi </p>
                                <p className="max-w-64 wrap-break-word">{data?.description}</p>
                            </div>
                        </div>
                    )}
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
