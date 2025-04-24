/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import { Product } from '@/pages/products';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button } from './ui/button';
// import { Button } from '@/components/ui/button';

interface StockItem {
    id: number;
    name: string;
    part_number: string;
    stocks_sum_quantity: number;
    created_at: string;
    [key: string]: any;
}

interface StockModalProps {
    isOpen: boolean;
    warehouseId: number | string;
    // onClose: () => void;
}

const StockModal: React.FC<StockModalProps> = ({ isOpen, warehouseId }) => {
    const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const perPage = 10;

    const fetchStock = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('warehouses.stocks.peek', warehouseId), {
                params: {
                    search,
                    page,
                },
            });
            setStocks(response.data.data);
            setTotalRows(response.data.total);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchStock();
        }
    }, [isOpen, search, page]);

    const columns = [
        {
            name: '#',
            cell: (_: unknown, index: number) => (page - 1) * perPage + index + 1,
            width: '50px',
        },
        { name: 'Product Name', selector: (row: StockItem) => row.name, sortable: true },
        { name: 'Part Number', selector: (row: StockItem) => row.part_number, sortable: true },
        { name: 'Stock Qty', selector: (row: StockItem) => row.stocks_sum_quantity ?? 0, sortable: true },
        { name: 'Created At', selector: (row: StockItem) => new Date(row.created_at).toLocaleDateString() },
        {
            name: 'Adjust',
            cell: (row: Product) => (
                <StockAdjustmentForm
                    //   @ts-ignore
                    warehouseId={warehouseId}
                    productId={row.id}
                    onSuccess={() => fetchStock()} // optional: re-fetch stock list
                />
            ),
        },
    ];

    return (
        <>
            <div className="mb-4 flex items-center gap-2">
                <Input
                    placeholder="Search product..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            <DataTable
                // @ts-ignore
                columns={columns}
                data={stocks}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={(pageNum) => setPage(pageNum)}
                highlightOnHover
                responsive
                progressComponent={
                    
                        <div className="relative w-full grid">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((_, key) => {
                                return (
                                    <div key={key} className="grid h-12 w-full grid-cols-12 gap-4 border-b">
                                        <div className="col-span-1 mx-2 my-auto h-3 rounded-full bg-gray-200"></div>
                                        <div className="col-span-2 mx-2 my-auto h-3 rounded-full bg-gray-200"></div>
                                        <div className="col-span-2 mx-2 my-auto h-3 rounded-full bg-gray-200"></div>
                                        <div className="col-span-2 mx-2 my-auto h-3 rounded-full bg-gray-200"></div>
                                        <div className="col-span-2 mx-2 my-auto h-3 rounded-full bg-gray-200"></div>
                                        <div className="col-span-2 mx-2 my-auto h-3 rounded-full bg-gray-200"></div>
                                    </div>
                                );
                            })}
                        </div>

                }
            />
        </>
    );
};

export default StockModal;

interface StockAdjustmentFormProps {
    warehouseId: number;
    productId: number;
    onSuccess?: () => void;
}

const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({ warehouseId, productId, onSuccess }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: productId,
        quantity: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('warehouses.stocks.adjust', warehouseId), {
            preserveScroll: true,
            onSuccess: () => {
                if (onSuccess) onSuccess();
                reset();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
                type="number"
                placeholder="Quantity"
                value={data.quantity}
                onChange={(e) => setData('quantity', e.target.value)}
                className="w-32"
            />
            <Button type="submit" disabled={processing}>
                Adjust
            </Button>
            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
        </form>
    );
};
