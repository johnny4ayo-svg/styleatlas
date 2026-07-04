import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const STATUS_VARIANT: Record<string, "outline" | "success" | "warning" | "default"> = {
  draft: "outline",
  scheduled: "warning",
  published: "success",
  archived: "default",
};

export default async function AdminBlogListPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, status, published_at, updated_at, reading_time")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage every article, from draft to published.</p>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-charcoal-100 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50 text-left text-xs uppercase tracking-wide text-charcoal-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {(posts ?? []).map((post) => (
              <tr key={post.id} className="hover:bg-charcoal-50/50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{post.title}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[post.status] ?? "outline"} className="capitalize">
                    {post.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(post.updated_at)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/blog/${post.id}`} className="text-gold-600 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(posts ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  No posts yet — create your first article.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
