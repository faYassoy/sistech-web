/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { CustomerCombobox } from '../delivery-orders/formDeliveryOrder';
interface props {
    isOpen: boolean;
    onClose: () => void;
}

interface ReservationData {
    id: string | number;
    salesperson_id: string | number;
    product_id: string | number;
    warehouse_id: string | number;
    reserved_quantity: string | number;
    product: {
        id: string | number;
        name: string;
        part_number: string;
        brand: string;
        serial_number: string;
        price: string | number;
        description: string;
    };
}
const FormOrderConversion = ({ isOpen, onClose,customers }: props) => {
    const [items, setItems] = useState<ReservationData[]>([]);
    const [shipTo, setShipTo] = useState('');

    const fetchReservation = async () => {
        try {
            const response = await axios.get(route('salesperson-inventory'));
            setItems(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchReservation()
    }, []);

    const removeRow = (id: string | number) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const prepItems = items.map((i) => {
        return {
            id: crypto.randomUUID(),
            product_id: i.product_id,
            quantity: Number(i.reserved_quantity),
            unit_price: Number(i.product.price),
        };
    });
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Order Conversion</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="buyer_id">Konsumen (Opsional)</Label>
                    {/* @ts-ignore */}
                    <CustomerCombobox customers={customers} onChange={(e) => setShipTo(e)} value={shipTo} />
                    </div>

                <div className="max-h-[250px] overflow-y-auto">
                    
                    <DataTable
                        columns={[
                            {
                                name: 'Product',
                                width: '280px',
                                selector: (row: ReservationData) => row.product.name,
                                cell: (row: ReservationData) => (
                                    <div className="w-full truncate" title={row.product.name}>
                                        {row.product.name}
                                    </div>
                                ),
                            },
                            {
                                name: 'Jumlah',
                                width: '80px',
                                selector: (row) => row.reserved_quantity,
                            },

                            {
                                name: '',
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

                <DialogFooter>
                    <Button
                        onClick={() =>
                            router.get('/delivery-orders/create', {

                                ship_to: shipTo,
                                items: JSON.stringify(prepItems),
                            })
                        }
                    >
                        Create Order
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FormOrderConversion;
