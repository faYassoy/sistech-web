/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface SalespersonreservationsFormProps {
    reservation?: {
        id: number;
        salesperson_id: number;
        product_id: number;
        warehouse_id: number;
        reserved_quantity: number;
    } | null;
    salespersons: { id: number; name: string }[];
    products: { id: number; name: string; stocks_sum_quantity: string; reservations_sum_reserved_quantity: string }[];
    warehouses: { id: number; name: string }[];
    isOpen: boolean;
    onClose: () => void;
}

const FormReservation: React.FC<SalespersonreservationsFormProps> = ({ reservation, salespersons, products, warehouses, isOpen, onClose }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        salesperson_id: '',
        product_id: '',
        warehouse_id: '',
        reserved_quantity: '',
    });

    useEffect(() => {
        if (reservation) {
            Object.entries(reservation).forEach(([key, value]) => {
                // @ts-ignore
                setData(key as keyof typeof data, value || '');
            });
        } else {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reservation]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reservation) {
            put(route('reservations.update', reservation.id), { onSuccess: () => onClose() });
        } else {
            post(route('reservations.store'), { onSuccess: () => onClose() });
        }
    };

    console.log(products);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{reservation ? 'Edit Reservation' : 'Create Reservation'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Salesperson Selection */}
                    <div>
                        <Label className="pb-1" htmlFor="salesperson_id">
                            Salesperson
                        </Label>
                        <Select onValueChange={(value) => setData('salesperson_id', value)} value={String(data.salesperson_id) || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Salesperson" />
                            </SelectTrigger>
                            <SelectContent>
                                {salespersons.map((sp) => (
                                    <SelectItem key={sp.id} value={sp.id.toString()}>
                                        {sp.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.salesperson_id && <p className="text-sm text-red-500">{errors.salesperson_id}</p>}
                    </div>

                    {/* Product Selection */}
                    <div>
                        <Label className="pb-1" htmlFor="product_id">
                            Product
                        </Label>
                        <Select onValueChange={(value) => setData('product_id', value)} value={String(data.product_id) || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => {
                                    const available_stock = Number(product.stocks_sum_quantity) - Number(product.reservations_sum_reserved_quantity);

                                    return (
                                        <SelectItem key={product.id} value={product.id.toString()}>
                                            {product.name} (Available: {available_stock})
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        {errors.product_id && <p className="text-sm text-red-500">{errors.product_id}</p>}
                    </div>

                    {/* Warehouse Selection */}
                    <div>
                        <Label className="pb-1" htmlFor="warehouse_id">
                            Warehouse
                        </Label>
                        <Select onValueChange={(value) => setData('warehouse_id', value)} value={String(data.warehouse_id) || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Warehouse" />
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

                    {/* Reserved Quantity Input */}
                    <div>
                        <Label className="pb-1" htmlFor="reserved_quantity">
                            Reserved Quantity
                        </Label>
                        <Input
                            id="reserved_quantity"
                            name="reserved_quantity"
                            type="number"
                            min="1"
                            value={data.reserved_quantity}
                            onChange={(e) => setData('reserved_quantity', e.target.value)}
                        />
                        {errors.reserved_quantity && <p className="text-sm text-red-500">{errors.reserved_quantity}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {reservation ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormReservation;
