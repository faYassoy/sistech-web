/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { Toaster } from '@/components/ui/sonner';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type PropsWithChildren } from 'react';
import { toast } from 'sonner';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { flash } = usePage().props;

    useEffect(() => {
        // @ts-ignore
        if (flash?.success) {
        // @ts-ignore
            toast.success(flash?.success || 'ok');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash, toast]);
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <Toaster
                    toastOptions={{
                        style: {
                            background: 'oklch(0.648 0.2 131.684)',
                            border:'none'
                        },duration:5000
                    }}
                />
                {children}
            </AppContent>
        </AppShell>
    );
}
