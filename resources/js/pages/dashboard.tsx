import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth, isAdmin, reservations, deliveryOrders, products } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div
                        onClick={() => deliveryOrders.length && router.visit('delivery-orders')}
                        title="Lihat Semua data"
                        className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video cursor-pointer overflow-hidden rounded-xl border"
                    >
                        <h1 className="my-4 px-4 text-xl font-semibold">
                            {isAdmin ? 'Delivery Order Terbaru' : 'Delivery Oerder ' + auth.user.name}
                        </h1>
                        <div className="h-[90%] w-full overflow-hidden">
                            {deliveryOrders.length == 0 ? (
                                <div className="grid h-full items-center px-4">
                                    <p className="mb-8 w-full text-center">Belum Ada Delivery Order</p>
                                    <Button
                                        type="button"
                                        className="w-full cursor-pointer"
                                        title="buat baru"
                                        onClick={() => router.visit('delivery-orders/create')}
                                    >
                                        Buat Baru
                                    </Button>
                                </div>
                            ) : (
                                deliveryOrders.map((item) => {
                                    return (
                                        <div className="relative mx-4 grid w-[90%] grid-cols-12 border-b bg-slate-100 p-4">
                                            <div className="col-span-8">
                                                <p className="font-semibold">{item.order_number}</p>
                                                <p className="text-sm">Customer: {item.buyer.name}</p>
                                            </div>
                                            <p className="col-span-4 text-center">{item.status}</p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="absolute bottom-0 h-20 w-full bg-linear-to-b from-transparent to-white"></div>
                    </div>
                    <div
                        onClick={() => products.length && router.visit('reservations')}
                        title="Lihat Semua data"
                        className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video cursor-pointer overflow-hidden rounded-xl border"
                    >
                        <h1 className="my-4 px-4 text-xl font-semibold">{isAdmin ? 'Reservasi Terbaru' : 'Reservasi ' + auth.user.name}</h1>
                        <div className="h-[90%] w-full space-y-2 overflow-hidden">
                            {reservations.length == 0 ? (
                                <div className="grid h-full items-center px-4">
                                    <p className="mb-8 w-full text-center">Belum Ada Reservasi</p>
                                    <Button
                                        type="button"
                                        className="w-full cursor-pointer"
                                        title="buat baru"
                                        onClick={() => router.visit('reservations')}
                                    >
                                        Buat Baru
                                    </Button>
                                </div>
                            ) : (
                                reservations.map((item) => {
                                    return (
                                        <div className="relative mx-4 grid w-[90%] grid-cols-12 items-center border-b bg-slate-100 p-2">
                                            <div className="col-span-8">
                                                <p className="truncate font-semibold">{item.product.name}</p>
                                                <p className="text-sm">A/N: {item.salesperson.name}</p>
                                            </div>
                                            <div className="col-span-4">
                                                <p className="text-center text-xs">stock</p>
                                                <p className="text-center font-semibold">{Number(item.reserved_quantity)}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="absolute bottom-0 h-20 w-full bg-linear-to-b from-transparent to-white"></div>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <h1 className="my-4 px-4 text-xl font-semibold">Produk Terbaru</h1>
                    <div className="h-[90%] w-full space-y-2 overflow-hidden">
                        {products.length == 0 ? (
                            <div className="grid h-full items-center px-4">
                                <p className="mb-8 w-full text-center">Belum Ada Produk</p>
                                <Button
                                    type="button"
                                    className="w-full cursor-pointer"
                                    title="buat baru"
                                    onClick={() => router.visit('reservations')}
                                >
                                    Buat Baru
                                </Button>
                            </div>
                        ) : (
                            products.map((item) => {
                                return (
                                    <div className="relative mx-4 grid w-[90%] grid-cols-12 items-center border-b bg-slate-100 p-2">
                                        <div className="col-span-8">
                                            <p className="truncate font-semibold">{item.name}</p>
                                            <p className="text-sm">Brand: {item.brand}</p>
                                        </div>
                                        <div className="col-span-4">
                                            <p className="text-center text-xs">stock</p>
                                            <p className="text-center font-semibold">{Number(item.stocks_sum_quantity)-Number(item.reservations_sum_reserved_quantity)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="absolute bottom-0 h-20 w-full bg-linear-to-b from-transparent to-white"></div>
                </div>
            </div>
        </AppLayout>
    );
}
