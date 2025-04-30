/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import { CommandSeparator } from 'cmdk';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { toast } from 'sonner';
import QuickFormCustomer from '../customers/QuickFormCustomer';

export default function FormDeliveryOrder() {
    const [formOpen, setFormOpen] = useState(false);
    const { warehouses, products, deliveryOrder, customers, auth } = usePage().props;
    const { data, setData, post, put, processing, errors } = useForm({
        date: deliveryOrder?.date || new Date().toISOString().split('T')[0],
        buyer_id: deliveryOrder?.buyer_id || '',
        warehouse_id: deliveryOrder?.warehouse_id || 1,
        status: deliveryOrder?.status || 'pending',
        items: deliveryOrder?.items || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.items.length === 0) {
            toast.error('At least one product must be added.');
            return;
        }

        if (deliveryOrder) {
            put(route('delivery-orders.update', deliveryOrder.id), {
                onSuccess: () => toast.success('Delivery Order Updated!'),
            });
        } else {
            post(route('delivery-orders.store'), {
                onSuccess: () => toast.success('Delivery Order Created!'),
            });
        }
    };

    return (
        <AppLayout backTo="delivery-orders.index">
            <form onSubmit={handleSubmit} className="mx-auto max-w-[80%] space-y-4 bg-white pt-4">
                <h1 className="mb-4 text-2xl font-bold">{deliveryOrder ? 'Edit' : 'Create'} Delivery Order</h1>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="date">Tanggal</Label>
                        <Input id="date" type="date" name="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
                        {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                    </div>

                    <div>
                        <Label htmlFor="buyer_id">Customer</Label>
                        <CustomerCombobox
                            setFormOpen={setFormOpen}
                            customers={customers}
                            data={data}
                            auth={auth}
                            onChange={(e) => setData('buyer_id', e)}
                            value={data.buyer_id}
                        />
                        {errors.buyer_id && <p className="text-sm text-red-500">{errors.buyer_id}</p>}
                    </div>

                    <div>
                        <Label>Gudang</Label>
                        <Select onValueChange={(value) => setData('warehouse_id', value)} value={data.warehouse_id.toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map((warehouse) => (
                                    <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                        {warehouse.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.warehouse_id && <p className="text-sm text-red-500">{errors.warehouse_id}</p>}
                    </div>
                    {
                        // @ts-ignore
                        auth?.user?.roles[0] == 'admin' && (
                            <div>
                                <Label className="pb-1" htmlFor="supplier">
                                    Status
                                </Label>
                                <Select onValueChange={(value) => setData('status', value)} value={data.status ? String(data.status) : ''}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['pending', 'in_progress', 'delivered', 'canceled'].map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status.toLocaleUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>
                        )
                    }
                </div>

                {/* Delivery Items Table */}

                <Label>Delivery Items</Label>
                <InlineDeliveryTable products={products} form={data} errors={errors} onChange={(items) => setData('items', items)} />

                {/* Submit Button */}
                <Button type="submit" disabled={processing} className="mt-4 w-full">
                    {processing ? 'Processing...' : deliveryOrder ? 'Update Delivery Order' : 'Create Delivery Order'}
                </Button>
            </form>
            <QuickFormCustomer isOpen={formOpen} onClose={() => setFormOpen(false)} />
        </AppLayout>
    );
}

export function InlineDeliveryTable({ products, form, errors, onChange }) {
    const [items, setItems] = useState(form.items.length ? form.items : [{ id: Date.now(), product_id: '', quantity: 1, unit_price: 0 }]);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);

        if (urlSearchParams.has('items')) {
            setItems(JSON.parse(urlSearchParams.get('items') || ''));
        }
    }, []);

    useEffect(() => {
        onChange(items);
    }, [items]);

    const addRow = () => {
        setItems([{ id: Date.now(), product_id: '', quantity: 1, unit_price: 0 }, ...items]);
    };

    const updateItem = (id, key, value) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
    };

    const removeRow = (id) => {
        setItems(items.filter((item) => item.id !== id));
    };

    return (
        <div>
            <Button onClick={addRow} className="m-2" variant={'outline'} size={'sm'}>
                + Tambahkan
            </Button>
            <div className="max-h-[250px] overflow-y-auto">
                <DataTable
                    columns={[
                        {
                            name: 'Product',
                            width: '300px',
                            cell: (row) => (
                                <ProductCombobox
                                    products={products}
                                    value={row.product_id}
                                    onChange={({ id, price }) => {
                                        updateItem(row.id, 'product_id', id);
                                        updateItem(row.id, 'unit_price', price);
                                    }}
                                />
                            ),
                        },
                        {
                            name: 'Quantity',
                            cell: (row, index) =>
                                row.product_id ? (
                                    <Input
                                        name={`items.${index}.quantity`}
                                        type="number"
                                        value={row.quantity}
                                        onChange={(e) => updateItem(row.id, 'quantity', e.target.value)}
                                        required
                                    />
                                ) : (
                                    <span className="text-red-500">Product Belum Di Pilih!</span>
                                ),
                        },
                        {
                            name: 'Unit Price',
                            cell: (row) =>
                                row.product_id && (
                                    <Input
                                        type="number"
                                        value={row.unit_price}
                                        onChange={(e) => updateItem(row.id, 'unit_price', e.target.value)}
                                        required
                                    />
                                ),
                        },
                        {
                            name: 'total Price',
                            cell: (row) => row.product_id && <Input type="number" value={row.unit_price * row.quantity} disabled />,
                        },
                        {
                            name: 'Actions',
                            width: '80px',
                            cell: (row, index) => (
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeRow(row.id)}
                                    disabled={items.length < 2 && index === 0}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            ),
                        },
                    ]}
                    data={items}
                    noHeader
                />
            </div>
        </div>
    );
}

export function ProductCombobox({ products, value, onChange }) {
    const [open, setOpen] = useState(false);
    const selectedProduct = products?.find((p) => p.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    {selectedProduct ? selectedProduct.name : 'Select product'}
                    {/* <Check className="ml-2 h-4 w-4 opacity-50" /> */}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder="Search product..." />
                    <CommandList>
                        <CommandEmpty>No products found.</CommandEmpty>
                        {products?.map((product) => (
                            <CommandItem
                                key={product.id}
                                onSelect={() => {
                                    onChange({ id: product.id, price: product.price });
                                    setOpen(false);
                                }}
                            >
                                {product.name}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
export function CustomerCombobox({ customers, value, onChange, setFormOpen, auth }) {
    const [open, setOpen] = useState(false);
    const selectedProduct = customers?.find((c) => c.id === value);

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        {selectedProduct ? selectedProduct.name : 'Select product'}
                        {/* <Check className="ml-2 h-4 w-4 opacity-50" /> */}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                        <CommandInput placeholder="Search product..." />
                        <CommandList>
                            <CommandEmpty>No customers found.</CommandEmpty>
                            {customers.map((customer) => (
                                <CommandItem
                                    key={customer.id}
                                    onSelect={() => {
                                        onChange(customer.id);
                                        setOpen(false);
                                    }}
                                >
                                    {customer.name}
                                </CommandItem>
                            ))}
                            <CommandSeparator />
                            <CommandItem>
                                {auth?.user?.roles[0] == 'admin' && (
                                    <Button onClick={() => setFormOpen(true)} variant={'outline'} size={'sm'}>
                                        <Plus />
                                        New Buyer/Customer
                                    </Button>
                                )}
                            </CommandItem>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}
