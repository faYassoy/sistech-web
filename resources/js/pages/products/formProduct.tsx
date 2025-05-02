/* eslint-disable @typescript-eslint/ban-ts-comment */
import InputCurrency from '@/components/inputCurrency';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface ProductFormProps {
    product?: {
        id: number;
        name: string;
        description?: string | null;
        price: string;
        part_number: string | null;
        serial_number: string;
        supplier_id: number | null;
        initial_stock: number;
    } | null;
    suppliers: { id: number; name: string }[];
    isOpen: boolean;
    onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, suppliers, isOpen, onClose }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        brand: '',
        description: '',
        price: '',
        part_number: '',
        serial_number: '',
        supplier_id: '',
        initial_stock: '',
        warehouse_id: 1,
    });

    useEffect(() => {
        if (product) {
            Object.entries(product).forEach(([key, value]) => {
                // @ts-ignore
                setData(key as keyof typeof data, value || '');
            });
        } else {
            setData({
                name: '',
                brand: '',
                description: '',
                price: '',
                part_number: '',
                serial_number: '',
                supplier_id: '',
                initial_stock: '',
                warehouse_id: 1,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product,isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            put(route('products.update', product.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('products.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };
console.log(data);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{product ? 'Ubah Produk' : 'Tambahkan Produk'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="h-[400px] space-y-3 overflow-y-scroll">
                    <div>
                        <Label className="pb-1" htmlFor="name">
                            Nama Produk
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Nama Produk..."
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            defaultValue={data.name}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <Label className="pb-1" htmlFor="brand">
                            Brand
                        </Label>
                        <Input
                            id="name"
                            name="brand"
                            placeholder="Brand..."
                            value={data.brand}
                            onChange={(e) => setData('brand', e.target.value)}
                            required
                            defaultValue={data.brand}
                        />
                        {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
                    </div>

                    <div>
                        <Label className="pb-1" htmlFor="description">
                            Deskripsi
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Deskripsi Produk..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            defaultValue={data.description}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div>
                        <Label className="pb-1" htmlFor="price">
                            Harga
                        </Label>
                        <InputCurrency
                            id="price"
                            name="price"
                            placeholder="Harga Produk..."
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            required
                        />
                        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                    </div>

                    <div>
                        <Label className="pb-1" htmlFor="serial_number">
                            Serial Number
                        </Label>
                        <Input
                            id="serial_number"
                            name="serial_number"
                            placeholder="Serial Number..."
                            value={data.serial_number}
                            onChange={(e) => setData('serial_number', e.target.value)}
                            required
                            defaultValue={data.serial_number}
                        />
                        {errors.serial_number && <p className="text-sm text-red-500">{errors.serial_number}</p>}
                    </div>

                    <div>
                        <Label className="pb-1" htmlFor="part_number">
                            Part Number
                        </Label>
                        <Input
                            id="part_number"
                            name="part_number"
                            placeholder="Part Number..."
                            value={data.part_number}
                            onChange={(e) => setData('part_number', e.target.value)}
                            defaultValue={data.part_number}
                        />
                        {errors.part_number && <p className="text-sm text-red-500">{errors.part_number}</p>}
                    </div>

                    <div>
                        <Label className="pb-1" htmlFor="supplier">
                            Pemasok
                        </Label>
                        <Select onValueChange={(value) => setData('supplier_id', value)} value={data.supplier_id ? String(data.supplier_id) : ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Pemasok" />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers.map((supplier) => (
                                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                        {supplier.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.supplier_id && <p className="text-sm text-red-500">{errors.supplier_id}</p>}
                    </div>

                   {!product && <div>
                        <Label className="pb-1" htmlFor="initial_stock">
                            Stock Awal
                        </Label>
                        <Input
                            id="initial_stock"
                            name="initial_stock"
                            placeholder="Stock Awal..."
                            type="number"
                            value={data.initial_stock}
                            onChange={(e) => setData('initial_stock', e.target.value)}
                        />
                        {errors.initial_stock && <p className="text-sm text-red-500">{errors.initial_stock}</p>}
                    </div>}

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {product ? 'Ubah' : 'Tambahkan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProductForm;
