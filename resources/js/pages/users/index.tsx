import { Link, router, usePage } from '@inertiajs/react';
import React from 'react';

import CommonDataTable from '@/components/commonDataTable.component';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn, extractBreadcrumbs } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';


interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'sales_person';
    is_active: boolean;
    created_at: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface PageProps {
    users: {
        per_page: number;
        current_page: number;
        data: User[];
        links: string;
        total:number
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const UsersIndex: React.FC = () => {
    const props = usePage<PageProps>().props;
    const breadcrumbs: BreadcrumbItem[] = extractBreadcrumbs(window.location.pathname);
    const users = props.users
    

    // Define columns following RDTC's pattern
    const columns = [
        { 
            name: '#', 
            selector: (row: User, index: number) => 
                (props.users.current_page - 1) * props.users.per_page + index + 1, 
            width: '50px' 
        },
        {
            name: 'Name',
            sortable: true,
            cell: (row: User) => (
                <div>
                    <p className="font-semibold">{row.name}</p>
                </div>
            ),
        },
        {
            name: 'Status',
            cell: (row: User) => (
                <p className={cn('font-semibold text-red-500', { 'text-green-700': row.is_active })}>{row.is_active ? 'Active' : 'Suspense'}</p>
            ),
            sortable: true,
        },
        { name: 'Email', selector: (row: User) => row.email, sortable: true },
        { name: 'Role', selector: (row: User) => row.role, sortable: true },

        {
            name: 'Created At',
            selector: (row: User) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: '',
            cell: (row: User) => (
                <Link href={route('users.edit', row.id)}>
                    <Button variant="outline">Detail</Button>
                </Link>
            ),
        },
    ];
 
    
  console.log(users);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Button onClick={() => router.visit(route('users.create'))}>Create New User</Button>
                </div>
                
                <CommonDataTable
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    columns={columns}
                    data={users.data}
                    searchRoute='users.index'
                    totalRow={users.total}
                />
            </div>
        </AppLayout>
    );
};

export default UsersIndex;
