/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface SupplierFormProps {
    isOpen: boolean;
    onClose: () => void;
    supplier?: {
        id?: number;
        name: string;
        address?: string;
        brand?: string;
        contact_number?: string;
        email?: string;
    };
}

const FormSupplier: React.FC<SupplierFormProps> = ({ isOpen, onClose, supplier }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: supplier?.name || '',
        address: supplier?.address || '',
        brand: supplier?.brand || '',
        contact_number: supplier?.contact_number || '',
        email: supplier?.email || '',
    });
    useEffect(() => {
        if (supplier) {
            Object.entries(supplier).forEach(([key, value]) => {
                // @ts-ignore
                setData(key as keyof typeof data, value || '');
            });
        } else {
            setData({
                name: '',
                address: '',
                brand:'',
                contact_number: '',
                email:'',
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supplier]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (supplier?.id) {
            put(route('suppliers.update', supplier.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('suppliers.store'), {
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
                    <DialogTitle>{supplier ? 'Ubah' : 'Tambahkan'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Nama</Label>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama Pemasok..." />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <Label>Alamat</Label>
                        <Input value={data.address} onChange={(e) => setData('address', e.target.value)} placeholder="Alamat Pemasok..." />
                    </div>
                    <div>
                        <Label>Kontak</Label>
                        <Input
                            value={data.contact_number}
                            onChange={(e) => setData('contact_number', e.target.value)}
                            placeholder="Kontak Pemasok..."
                        />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="Email Pemasok" />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batalkan
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {supplier ? 'Ubah' : 'Tambahkan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormSupplier;
