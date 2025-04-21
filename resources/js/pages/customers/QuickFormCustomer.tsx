import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface FormCusomerProps {
    isOpen: boolean;
    onClose: () => void;
    customer?: { id: number; name: string; phone: string; address: string; company: string } | null;
}

const QuickFormCustomer: React.FC<FormCusomerProps> = ({ isOpen, onClose, customer }) => {
    const {
        data: cust_data,
        setData: cust_setData,
        post: cust_post,
        processing: cust_processing,
        reset: cust_reset,
    } = useForm({
        name: '',
        address: '',
        company: '',
        phone: '',
    });

    useEffect(() => {
        if (customer) {
            cust_setData({
                name: customer.name || '',
                address: customer.address || '',
                company: customer.company || '',
                phone: customer.phone || '',
            });
        } else {
            cust_reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer]);

    const quickcustomer = (e: React.FormEvent) => {
        e.preventDefault();
console.log('quickCustomer called');
        cust_post(route('customers.quick'), { onSuccess: onClose });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{customer ? 'Edit Customer' : 'Create Customer'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={quickcustomer} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={cust_data.name} onChange={(e) => cust_setData('name', e.target.value)} required />
                    </div>

                    <div>
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" value={cust_data.company} onChange={(e) => cust_setData('company', e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={cust_data.address} onChange={(e) => cust_setData('address', e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={cust_data.phone} onChange={(e) => cust_setData('phone', e.target.value)} />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button name="quick_store" type="submit" disabled={cust_processing}>
                            {customer ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default QuickFormCustomer;
