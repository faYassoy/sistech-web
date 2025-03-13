import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormWarehouseProps {
    isOpen: boolean;
    onClose: () => void;
    warehouse?: { id: number; name: string; location: string } | null;
}

const FormWarehouse: React.FC<FormWarehouseProps> = ({ isOpen, onClose, warehouse }) => {
    const { data, setData, post, put, processing, reset } = useForm({
        name: "",
        location: "",
    });

    useEffect(() => {
        if (warehouse) {
            setData({
                name: warehouse.name || "",
                location: warehouse.location || "",
            });
        } else {
            reset();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warehouse]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (warehouse) {
            put(route("warehouses.update", warehouse.id), { onSuccess: onClose });
        } else {
            post(route("warehouses.store"), { onSuccess: onClose });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{warehouse ? "Edit Warehouse" : "Create Warehouse"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={data.location}
                            onChange={(e) => setData("location", e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {warehouse ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormWarehouse;
