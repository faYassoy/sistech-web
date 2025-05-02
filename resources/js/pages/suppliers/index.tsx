/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import CommonDataTable from "@/components/commonDataTable.component";
import FormSupplier from "./formSupplier";

export interface Supplier {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    // brand: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
interface PageProps {
    suppliers: {
        data: Supplier[];
        current_page: number;
        per_page: number;
        total: number;
    };
}
const SupplierIndex: React.FC = () => {
    // @ts-ignore
    const { suppliers } = usePage<PageProps>().props;
    const [supplierModal, setSupplierModal] = useState(false);
    const [selected, setSelected] = useState<Supplier | null>(null);

    // Define table columns
    const columns = [
        {
            name: "#",
            selector: (_: Supplier, index: number) => (suppliers.current_page - 1) * suppliers.per_page + index + 1,
            width: "50px",
        },
        { name: "Nama", selector: (row: Supplier) => row.name, sortable: true },
        { name: "Kontak", selector: (row: Supplier) => row.contact_number || "N/A", sortable: true },
        {
            name: "Created At",
            selector: (row: Supplier) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: "",
            cell: (row: Supplier) => (
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSelected(row);
                            setSupplierModal(true);
                        }}
                    >
                        Ubah
                    </Button>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this supplier?")) {
                                router.delete(route("suppliers.destroy", row.id), {
                                    onError: (err) => alert(err.message),
                                });
                            }
                        }}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AppLayout>
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Pemasok</h1>
                    <Button onClick={() => setSupplierModal(true)}>Tambahkan Pemasok</Button>
                </div>

                <CommonDataTable
                    // @ts-ignore
                    columns={columns}
                    data={suppliers.data}
                    searchRoute="suppliers.index"
                    totalRow={suppliers.total}
                />
            </div>

            <FormSupplier
                isOpen={supplierModal}
                onClose={() => {
                    setSupplierModal(false);
                    setSelected(null);
                }}
                // @ts-ignore
                supplier={selected}
            />
        </AppLayout>
    );
};

export default SupplierIndex;