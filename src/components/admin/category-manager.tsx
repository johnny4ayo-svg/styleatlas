"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCategory, toggleCategoryStatus } from "@/lib/actions/admin-categories";
import type { Category } from "@/types";

interface FormValues {
  name: string;
  description: string;
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    const result = await createCategory(values);
    if (result.error) toast.error("Something went wrong.");
    else {
      toast.success("Category created.");
      reset();
    }
  };

  const handleToggle = (id: string, currentStatus: string) => {
    startTransition(async () => {
      const result = await toggleCategoryStatus(id, currentStatus === "active" ? "inactive" : "active");
      if (result.error) toast.error("Couldn't update category.");
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Add Category</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
            <div className="flex-1">
              <Input placeholder="Category name" {...register("name", { required: true })} />
            </div>
            <div className="flex-1">
              <Input placeholder="Description (optional)" {...register("description")} />
            </div>
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-lg border border-charcoal-100 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50 text-left text-xs uppercase tracking-wide text-charcoal-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-4 py-3 font-medium text-charcoal-900">{cat.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                <td className="px-4 py-3">
                  <Switch checked={cat.status === "active"} disabled={isPending} onCheckedChange={() => handleToggle(cat.id, cat.status)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
