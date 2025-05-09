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

const FormCustomer: React.FC<FormCusomerProps> = ({ isOpen, onClose, customer }) => {
    const { data, setData, post, put, processing, reset } = useForm({
        name: '',
        address: '',
        company: '',
        phone: '',
    });

    useEffect(() => {
        if (customer) {
            setData({
                name: customer.name || '',
                address: customer.address || '',
                company: customer.company || '',
                phone: customer.phone || '',
            });
        } else {
            setData({
                name: '',
                address: '',
                company:  '',
                phone: '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customer) {
            put(route('customers.update', customer.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('customers.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{customer ? 'Ubah' : 'Tambahkan'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                    </div>

                    <div>
                        <Label htmlFor="company">Peusahaan</Label>
                        <Input id="company" value={data.company} onChange={(e) => setData('company', e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="address">Alamat</Label>
                        <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="phone">Telepon</Label>
                        <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {customer ? 'Ubah' : 'Tambahkan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormCustomer;
