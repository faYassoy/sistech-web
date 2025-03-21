import AppLayout from "@/layouts/app-layout";
import { router, usePage } from "@inertiajs/react";
import { useEffect } from "react";

export default function PrintDeliveryOrder() {
    const { deliveryOrder } = usePage().props;

    useEffect(() => {
        const handleAfterPrint = () => {
            router.visit(route('delivery-orders.index')); // Redirect after printing or canceling
        };

        window.addEventListener('afterprint', handleAfterPrint);
        window.print();

        return () => {
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, []);

    // Calculate totals
    const subTotal = deliveryOrder.items.reduce(
        (total, item) => total + item.quantity * item.unit_price,
        0
    );
    const vat = Math.round(subTotal * 0.11); // 11% VAT
    const totalInvoice = subTotal + vat;

    return (
        // <AppLayout>

        <div className="h-fit w-fit border mx-auto">
            {/* Invoice Number */}
            <p className="text-center font-bold">
                NO INVOICE: {deliveryOrder.order_number}
            </p>

            {/* Sold to & Ship to Section */}
            <div className="grid w-[620px] grid-cols-3 gap-2 p-4 text-xs">
                <div>
                    <p className="w-full border-b font-bold">SOLD TO:</p>
                    <div className="h-16 overflow-hidden p-1">
                        <p>{deliveryOrder.buyer}</p>
                        <p>Ponorogo Jawa Timur</p>
                    </div>
                </div>
                <div>
                    <p className="w-full border-b font-bold">SHIP TO:</p>
                    <div className="h-16 overflow-hidden p-1">
                        <p>{deliveryOrder.buyer}</p>
                        <p>Ponorogo Jawa Timur</p>
                    </div>
                </div>
                <div>
                    <div className="grid grid-cols-3">
                        <div className="col-span-1">DATE</div>
                        <div className="col-span-2">
                            : {new Date(deliveryOrder.date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                        </div>
                    </div>
                    <div className="grid grid-cols-3">
                        <div className="col-span-1">SALES</div>
                        <div className="col-span-2">: Ayunda Risu</div>
                    </div>
                </div>
            </div>

            {/* Table Header */}
            <header className="grid w-[620px] grid-cols-12 gap-2 border p-1 text-xs">
                <b className="font-semibold">QTY</b>
                <b className="col-span-3 font-semibold">PART NO</b>
                <b className="col-span-4 font-semibold">DESCRIPTION</b>
                <b className="col-span-2 font-semibold">UNIT PRICE</b>
                <b className="col-span-2 font-semibold">TOTAL PRICE</b>
            </header>

            {/* Table Content */}
            <main className="grid w-[620px] text-xs">
                {deliveryOrder.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 p-1 border-b">
                        <p>{item.quantity}</p>
                        <p className="col-span-3">{item.product.part_number || "-"}</p>
                        <p className="col-span-4">{item.product.name}</p>
                        <p className="col-span-2">Rp. {item.unit_price.toLocaleString("id-ID")}</p>
                        <p className="col-span-2">Rp. {(item.quantity * item.unit_price).toLocaleString("id-ID")}</p>
                    </div>
                ))}
            </main>

            {/* Footer Section */}
            <footer className="mt-4 grid w-[620px] grid-cols-2 gap-2 border-t-2 p-1 text-xs">
                <div>
                    <p>Note</p>
                    <p className="m-2 max-h-16 overflow-hidden border p-1">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. In, corporis odit quas voluptate reiciendis facilis? Doloribus
                        ducimus impedit, fuga iste reprehenderit vel nobis soluta amet neque, dolorem, repudiandae delectus facere.
                    </p>
                </div>
                <div className="pt-10">
                    <div className="grid grid-cols-3">
                        <div className="col-start-2 col-span-1">SUB TOTAL</div>
                        <div className="col-span-1">: Rp {subTotal.toLocaleString("id-ID")}</div>
                    </div>
                    <div className="grid grid-cols-3">
                        <div className="col-start-2 col-span-1">VAT 11%</div>
                        <div className="col-span-1">: Rp {vat.toLocaleString("id-ID")}</div>
                    </div>
                    <div className="grid grid-cols-3">
                        <div className="col-start-2 col-span-1">TOTAL INVOICE</div>
                        <div className="col-span-1">: Rp {totalInvoice.toLocaleString("id-ID")}</div>
                    </div>
                </div>
                <div className="px-10">
                    <div>
                        <p className="text-center">Received</p>
                        <p className="h-10 border-b"></p>
                    </div>
                </div>
                <div className="px-10">
                    <div>
                        <p className="text-center">Approved By</p>
                        <p className="h-10 border-b"></p>
                    </div>
                </div>
            </footer>
        </div>
        // </AppLayout>
    );
}
