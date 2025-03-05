import React from "react";
import { usePage, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id?: number;
  name: string;
  email: string;
  role: "admin" | "sales_person";
  is_active: boolean;
}

interface PageProps {
  user?: User;
}

const FormUsers: React.FC = () => {
  const { user } = usePage<PageProps>().props;
  const isEditing = !!user;

  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "sales_person",
    is_active: user?.is_active ?? false, // Ensure boolean value
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      put(route("users.update", user?.id));
    } else {
      post(route("users.store"));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit User" : "Create User"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={data.role}
                onChange={(e) => setData("role", e.target.value as User["role"])}
                className="border p-2 w-full rounded-md"
              >
                <option value="admin">Admin</option>
                <option value="sales_person">Sales Person</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>

            <div>
              <Label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.is_active}
                  onChange={(e) => setData("is_active", e.target.checked)}
                />
                <span>Active</span>
              </Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Link href={route("users.index")} className="border px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                Cancel
              </Link>
              <Button type="submit" disabled={processing}>
                {isEditing ? "Update User" : "Create User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormUsers;
