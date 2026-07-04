import { createClient } from "@/lib/supabase/server";
import { CategoryManager } from "@/components/admin/category-manager";
import type { Category } from "@/types";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return <CategoryManager categories={(categories ?? []) as unknown as Category[]} />;
}
