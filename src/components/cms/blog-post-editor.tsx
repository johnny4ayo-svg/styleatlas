"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/cms/rich-text-editor";
import { blogPostSchema, type BlogPostFormValues } from "@/lib/validations/blog-post";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog-posts";
import { slugify, readingTime } from "@/lib/utils";

interface BlogCategoryOption {
  id: string;
  name: string;
}

export function BlogPostEditor({
  postId,
  categories,
  defaultValues,
}: {
  postId?: string;
  categories: BlogCategoryOption[];
  defaultValues?: Partial<BlogPostFormValues>;
}) {
  const [slugTouched, setSlugTouched] = useState(!!defaultValues?.slug);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      status: "draft",
      schemaType: "BlogPosting",
      categoryIds: [],
      tagNames: [],
      faqs: [],
      noindex: false,
      isSponsored: false,
      ...defaultValues,
    },
  });

  const title = watch("title");
  const content = watch("content") || "";
  const seoTitle = watch("seoTitle") || "";
  const metaDescription = watch("metaDescription") || "";

  const onSubmit = async (values: BlogPostFormValues) => {
    const result = postId ? await updateBlogPost(postId, values) : await createBlogPost(values);
    if (result?.error) {
      toast.error("Please check the form for errors.");
      return;
    }
    if (postId) toast.success("Post updated.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div>
          <Input
            {...register("title", {
              onChange: (e) => {
                if (!slugTouched) setValue("slug", slugify(e.target.value));
              },
            })}
            placeholder="Post title"
            className="h-14 border-none px-0 font-serif text-3xl font-semibold shadow-none focus-visible:ring-0"
          />
          {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>styleatlas.ng/blog/</span>
          <Input
            {...register("slug", { onChange: () => setSlugTouched(true) })}
            className="h-8 max-w-xs text-sm"
          />
        </div>

        <Textarea {...register("excerpt")} placeholder="Excerpt (shown in previews and search results)" rows={2} />

        <Controller
          control={control}
          name="content"
          render={({ field }) => <RichTextEditor content={field.value ?? ""} onChange={field.onChange} />}
        />
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">FAQ Block (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <FaqBuilder control={control} />
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {watch("status") === "scheduled" && (
              <div>
                <Label htmlFor="scheduledAt">Publish date</Label>
                <Input id="scheduledAt" type="datetime-local" {...register("scheduledAt")} className="mt-1.5" />
              </div>
            )}
            <div>
              <Label htmlFor="schemaType">Schema Type</Label>
              <Controller
                control={control}
                name="schemaType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BlogPosting">BlogPosting</SelectItem>
                      <SelectItem value="Article">Article</SelectItem>
                      <SelectItem value="NewsArticle">NewsArticle</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <label className="flex items-center justify-between">
              <span className="text-sm text-charcoal-700">Sponsored post</span>
              <Controller control={control} name="isSponsored" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-charcoal-700">Noindex</span>
              <Controller control={control} name="noindex" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
            </label>
            <p className="text-xs text-muted-foreground">Reading time: ~{readingTime(content.replace(/<[^>]+>/g, " "))} min</p>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : postId ? "Save Changes" : "Create Post"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Featured Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Image URL" {...register("featuredImageUrl")} />
            <Input placeholder="Alt text (required for SEO)" {...register("featuredImageAlt")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="categoryIds"
              render={({ field }) => (
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2.5">
                      <Checkbox
                        checked={field.value.includes(cat.id)}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? [...field.value, cat.id] : field.value.filter((id) => id !== cat.id))
                        }
                      />
                      <span className="text-sm text-charcoal-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="tagNames"
              render={({ field }) => (
                <Input
                  placeholder="aso-ebi, bridal, lagos (comma separated)"
                  defaultValue={field.value.join(", ")}
                  onBlur={(e) => field.onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input id="seoTitle" {...register("seoTitle")} className="mt-1.5" />
              <p className="mt-1 text-xs text-muted-foreground">{seoTitle.length}/70</p>
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea id="metaDescription" rows={3} {...register("metaDescription")} className="mt-1.5" />
              <p className="mt-1 text-xs text-muted-foreground">{metaDescription.length}/160</p>
            </div>
            <div>
              <Label htmlFor="focusKeyword">Focus Keyword</Label>
              <Input id="focusKeyword" {...register("focusKeyword")} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input id="canonicalUrl" {...register("canonicalUrl")} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="ogTitle">OG Title</Label>
              <Input id="ogTitle" {...register("ogTitle")} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="ogDescription">OG Description</Label>
              <Textarea id="ogDescription" rows={2} {...register("ogDescription")} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="ogImageUrl">OG Image URL</Label>
              <Input id="ogImageUrl" {...register("ogImageUrl")} className="mt-1.5" />
            </div>
          </CardContent>
        </Card>
      </aside>
    </form>
  );
}

function FaqBuilder({ control }: { control: ReturnType<typeof useForm<BlogPostFormValues>>["control"] }) {
  return (
    <Controller
      control={control}
      name="faqs"
      render={({ field }) => (
        <div className="space-y-3">
          {field.value.map((faq, i) => (
            <div key={i} className="space-y-2 rounded-md border border-charcoal-100 p-3">
              <Input
                placeholder="Question"
                value={faq.question}
                onChange={(e) => {
                  const next = [...field.value];
                  next[i] = { question: e.target.value, answer: faq.answer };
                  field.onChange(next);
                }}
              />
              <Textarea
                placeholder="Answer"
                rows={2}
                value={faq.answer}
                onChange={(e) => {
                  const next = [...field.value];
                  next[i] = { question: faq.question, answer: e.target.value };
                  field.onChange(next);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => field.onChange(field.value.filter((_, idx) => idx !== i))}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => field.onChange([...field.value, { question: "", answer: "" }])}>
            Add FAQ Item
          </Button>
        </div>
      )}
    />
  );
}
