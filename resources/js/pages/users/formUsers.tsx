/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { extractBreadcrumbs, generatePassword } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface User {
    id?: number;
    name: string;
    email: string;
    role: 'admin' | 'sales_person';
    is_active: boolean;
    password?: string;
    password_confirmation?: string;
}

interface PageProps {
    user?: User;
}

const FormUsers: React.FC = () => {
    // @ts-ignore
    const { user } = usePage<PageProps>().props;
    const breadcrumbs: BreadcrumbItem[] = extractBreadcrumbs(window.location.pathname);

    const isEditing = !!user;
    const [autoGenerate, setAutoGenerate] = useState(false);
    const [genPass, setGenPass] = useState('');

    // Define initial form values using Inertia's useForm.

    const initialValues: Partial<User> = {
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'sales_person',
        is_active: user?.is_active ?? false,
    };

    // For new users, if auto-generation is disabled, include password fields.
    if (!isEditing && !autoGenerate) {
        initialValues.password = '';
        initialValues.password_confirmation = '';
    }

    const { data, setData, post, put, processing, errors } = useForm(initialValues);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('users.update', user?.id));
        } else {
            post(route('users.store'));
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', user?.id));
        }
    };
    console.log(autoGenerate);

    useEffect(() => {
        if (autoGenerate) {
          const newPass =generatePassword()
            setData('password', newPass);
            setGenPass(newPass);
        } else {
            setGenPass('');
        }

        return () => {
            setGenPass('');
        };
    }, [autoGenerate, setData]);

    return (
        <AppLayout backTo='users.index'>
            <div className="container mx-auto max-w-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <Label htmlFor="name" className="mb-1 block">
                            Nama
                        </Label>
                        <Input id="name" placeholder='masukan nama pengguna...' value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <Label htmlFor="email" className="mb-1 block">
                            Email
                        </Label>
                        <Input id="email" placeholder='masukan email...' type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* Role Field */}
                    <div>
                        <Label htmlFor="role" className="mb-1 block">
                            Role
                        </Label>
                        <Select value={data.role as string} onValueChange={(value) => setData('role', value as User['role'])}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="sales_person">Sales Person</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                    </div>

                    {/* Active Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox checked={data.is_active} onCheckedChange={(checked) => setData('is_active', !!checked)} />
                        <Label>Aktif</Label>
                    </div>

                    {/* Auto Generate Password Toggle */}

                    <div className="flex items-center space-x-2">
                        {/* @ts-ignore */}
                        <Checkbox checked={autoGenerate} onCheckedChange={setAutoGenerate} />
                        <Label>Rekomendasi Password</Label>
                    </div>

                    {/* Password Fields (only when not auto-generating) */}

                    <div>
                        <Label htmlFor="password" className="mb-1 block">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type={autoGenerate ? 'text' : 'password'}
                            value={data.password || genPass}
                            onChange={(e) => setData('password', e.target.value)}
                            required = {isEditing?false:true}
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>
                    <div>
                        <Label htmlFor="password_confirmation" className="mb-1 block">
                            Konfirmasi Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation || ''}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required = {isEditing?false:true}

                        />
                        {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between">
                        <Link href={route('users.index')} className="rounded-md border px-4 py-2 text-gray-600 hover:bg-gray-100">
                            Batal
                        </Link>
                        <div className="space-x-2">
                            {isEditing && (
                                <Button type="button" variant="destructive" onClick={handleDelete}>
                                    Hapus
                                </Button>
                            )}
                            <Button type="submit" disabled={processing}>
                                {isEditing ? 'Ubah Pengguna' : 'Tambahkan Pengguna'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default FormUsers;
