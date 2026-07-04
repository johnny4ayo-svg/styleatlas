import { createClient } from "@/lib/supabase/server";
import { BlogPostEditor } from "@/components/cms/blog-post-editor";

export default async function NewBlogPostPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("blog_categories").select("id, name").order("name");

  return <BlogPostEditor categories={categories ?? []} />;
}
