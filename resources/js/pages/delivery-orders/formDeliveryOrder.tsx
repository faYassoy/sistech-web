/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { toast } from 'sonner';

export default function FormDeliveryOrder() {
    const { warehouses, products } = usePage().props; // Get warehouses & products from Inertia props

    const { data, setData, post, processing, errors } = useForm({
        date: new Date().toISOString().split('T')[0], // Default to today
        buyer: '',
        warehouse_id: '',
        items: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('delivery-orders.store'), {
            onSuccess: () => toast.success('Delivery Order Created!'),
            onError: (err) => console.error(err),
        });
    };
    console.log(data);
    return (
        <AppLayout>
            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4 bg-white pt-4">
                <h1 className="mb-4 text-2xl font-bold">Create Delivery Order</h1>
                <div className="grid grid-cols-3 gap-4">
                    {/* Order Date */}
                    <div>
                        <Label className="pb-1" htmlFor="date">
                            Order Date
                        </Label>
                        <Input id="date" type="date" name="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
                        {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                    </div>

                    {/* Buyer */}
                    <div>
                        <Label className="pb-1" htmlFor="buyer">
                            Buyer
                        </Label>
                        <Input id="buyer" name="buyer" value={data.buyer} onChange={(e) => setData('buyer', e.target.value)} required />
                        {errors.buyer && <p className="text-sm text-red-500">{errors.buyer}</p>}
                    </div>
                    {/* Warehouse Selection (Using ShadCN Select) */}
                    <div>
                        <Label className="pb-1">Warehouse</Label>
                        <Select onValueChange={(value) => setData('warehouse_id', value)} value={data.warehouse_id}>
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
                </div>

                {/* Inline Table for Delivery Items */}
                <div>
                    <Label className="pb-1">Delivery Items</Label>
                    <InlineDeliveryTable products={products} form={data} errors={errors} onChange={(items) => setData('items', items)} />
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={processing} className="w-full">
                    {processing ? 'Processing...' : 'Create Delivery Order'}
                </Button>
            </form>
        </AppLayout>
    );
}

export function InlineDeliveryTable({ products, form, errors, onChange }) {
    const [items, setItems] = useState([{ id: Date.now(), product_id: '', quantity: 1, unit_price: 0 }]);

    useEffect(() => {
        onChange(items);
    }, [items]);

    const addRow = () => {
        setItems([...items, { id: Date.now(), product_id: '', quantity: 1, unit_price: 0 }]);
    };

    const updateItem = (id, key, value) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
    };

    const removeRow = (id) => {
        setItems(items.filter((item) => item.id !== id));
    };
    const columns = [
        {
            name: 'Product',
            width: '300px',
            cell: (row) => (
                <div className="w-full">
                    {/* <Label className="pb-1">Product</Label> */}
                    <ProductCombobox
                        products={products}
                        value={row.product_id}
                        onChange={({ id, price }) => {
                            updateItem(row.id, 'product_id', id);
                            updateItem(row.id, 'unit_price', price);
                        }}
                    />
                    {errors?.[`items.${row.id}.product_id`] && <p className="text-sm text-red-500">{errors[`items.${row.id}.product_id`]}</p>}
                </div>
            ),
        },
        {
            name: 'Quantity',
            cell: (row) => (
                <div>
                    {/* <Label className="pb-1">Quantity</Label> */}
                    <Input type="number" value={row.quantity} onChange={(e) => updateItem(row.id, 'quantity', e.target.value)} required />
                    {errors?.[`items.${row.id}.quantity`] && <p className="text-sm text-red-500">{errors[`items.${row.id}.quantity`]}</p>}
                </div>
            ),
        },
        {
            name: 'Unit Price',
            cell: (row) => (
                <div>
                    {/* <Label className="pb-1">Unit Price</Label> */}
                    <Input type="number" value={row.unit_price} onChange={(e) => updateItem(row.id, 'unit_price', e.target.value)} required />
                    {errors?.[`items.${row.id}.unit_price`] && <p className="text-sm text-red-500">{errors[`items.${row.id}.unit_price`]}</p>}
                </div>
            ),
        },
        {
            name: 'Actions',
            cell: (row, index) => (
                <Button variant="destructive" size="icon" onClick={() => removeRow(row.id)} disabled={index == 0}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            ),
        },
    ];

    return (
        <div>
            <div className="h-[300px] overflow-y-scroll">
                <DataTable columns={columns} data={items} noHeader />
            </div>
            <Button onClick={addRow} className="float-right m-2">
                + Add Product
            </Button>
        </div>
    );
}

export function ProductCombobox({ products, value, onChange }) {
    const [open, setOpen] = useState(false);
    const selectedProduct = products.find((p) => p.id === value);

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
                        {products.map((product) => (
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
