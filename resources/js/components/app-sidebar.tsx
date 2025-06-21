/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NavFooter } from '@/components/nav-footer';
import {  NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {  BookUser, Boxes, Container, LayoutGrid, ScrollText, Users2, Warehouse } from 'lucide-react';
import AppLogo from './app-logo';


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
    const { auth,pendingCount } = usePage().props;

    const mainNavItems = {
    admin: [
      {
        colapsableGroup: "Beranda",
        items: [
          { title: "Dashboard", url: "/dashboard", icon: LayoutGrid },
          { title: "Surat Jalan", url: "/delivery-orders", icon: Warehouse, numBadge:pendingCount },
          { title: "Daftar Harga", url: "/price-list", icon: ScrollText }
        ],
      },
      {
        colapsableGroup: "Data Master",
        items: [
          { title: "Pengguna", url: "/users", icon: Users2 },
          { title: "Konsumen", url: "/customers", icon: BookUser },
          { title: "Data Barang", url: "/products", icon: Boxes },
          { title: "Pemasok", url: "/suppliers", icon: Container },
        ],
      },
      {
        colapsableGroup: "Stok",
        items: [
          // { title: "Gudang", url: "/warehouses", icon: Warehouse },
          { title: "Kelola Stok", url: "/stocks", icon: Boxes },
          { title: "Reservasi", url: "/reservations", icon: Warehouse },
        ],
      },
      {
        colapsableGroup: "Laporan",
        items: [
          // { title: "Gudang", url: "/warehouses", icon: Warehouse },
          { title: "Laporan", url: "/reports", icon: Boxes },
          // { title: "Reservasi", url: "/reservations", icon: Warehouse },
        ],
      },
    ],
  
    sales_person: [
      {
        colapsableGroup: "Beranda",
        items: [
          { title: "Dashboard", url: "/dashboard", icon: LayoutGrid },
          { title: "Surat Jalan", url: "/delivery-orders", icon: Warehouse },
          { title: "Daftar Harga", url: "/price-list", icon: ScrollText },
        ],
      },
      {
        colapsableGroup: "Stok",
        items: [
          { title: "Data Barang", url: "/products", icon: Boxes },
          { title: "Reservasi", url: "/reservations", icon: Warehouse },
        ],
      },
    ],
  };
    // @ts-ignore
    const role = auth?.user?.roles[0];
    // @ts-ignore
    const navItems = mainNavItems[role] ?? [];
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
                <NavMain groups={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
