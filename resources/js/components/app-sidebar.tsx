import { NavFooter } from '@/components/nav-footer';
import {  NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {  Boxes, Container, LayoutGrid, Users2, Warehouse } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems = [
    {
        colapsableGroup: "Main",
        items: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutGrid,
            },
        ],
    },
    {
        colapsableGroup: "Data Master",
        items: [
            {
                title: "Pengguna",
                url: "/users",
                icon: Users2,
            },
            {
                title: "Data Barang",
                url: "/products",
                icon: Boxes,
            },
            {
                title: "Supplier",
                url: "/suppliers",
                icon: Container,
            },
        ],
    },
    {
        colapsableGroup: "Stock",
        items: [
            {
                title: "Gudang",
                url: "/warehouses",
                icon: Warehouse,
            },
            {
                title: "Reservasi",
                url: "/reservations",
                icon: Warehouse,
            },
        ],
    },
];


const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     url: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     url: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className='bg-red-50 rounded-lg'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className='hover:bg-white' asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
