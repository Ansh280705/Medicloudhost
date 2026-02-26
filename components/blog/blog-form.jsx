"use client";

import { useActionState, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { CloudinaryUpload } from "@/components/cloudinary-upload";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "./rich-text-editor";

const initialState = {
  success: false,
  error: null,
};

export function BlogForm({ action, defaultValues }) {
  const [state, formAction] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl || "");
  const [content, setContent] = useState(defaultValues?.content || "");
  const [uploaded, setUploaded] = useState(!!defaultValues?.imageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success("Blog saved successfully");
      setIsSubmitting(false);
      router.push("/admin?tab=blogs");
    }

    if (state?.error) {
      toast.error(state.error);
      setIsSubmitting(false);
    }
  }, [state]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    await formAction(formData);
  };

  const handleUpload = (url) => {
    setImageUrl(url);
    setUploaded(true);
    toast.success("Image uploaded successfully!");
  };

  return (
    <form action={handleSubmit}>
      {defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      <input type="hidden" name="imageUrl" value={imageUrl} />
      <input type="hidden" name="content" value={content} />

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Title</label>
            <Input
              name="title"
              placeholder="Blog title"
              defaultValue={defaultValues?.title}
              required
              className="border-emerald-900/10 focus:ring-client/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Short Excerpt</label>
            <Textarea
              name="excerpt"
              placeholder="Brief summary of the blog..."
              defaultValue={defaultValues?.excerpt}
              className="border-emerald-900/10 focus:ring-client/20 resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Content</label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your amazing blog content here..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Featured Image</label>
            <div className="flex items-center gap-2">
              <CloudinaryUpload onUpload={handleUpload} />
              {uploaded && (
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs font-semibold">
                  <Check size={14} /> Uploaded
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 py-2">
            <Switch
              name="isPublished"
              defaultChecked={defaultValues?.isPublished ?? true}
            />
            <span className="text-sm font-medium text-slate-700">Published</span>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-client hover:bg-client/90 text-white font-bold px-8">
            {isSubmitting ? "Saving..." : "Save Blog Post"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
