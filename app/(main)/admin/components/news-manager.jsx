"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, ExternalLink, Image as ImageIcon, Check, X, Loader2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { CloudinaryUpload } from "@/components/cloudinary-upload";
import { createNews, updateNews, deleteNews, toggleNewsStatus } from "@/actions/news";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function NewsManager({ news: initialNews = [] }) {
  const [newsList, setNewsList] = useState(initialNews);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageUrl("");
    setLink("");
    setIsActive(true);
    setEditingNews(null);
  };

  const handleOpenDialog = (newsItem = null) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setTitle(newsItem.title);
      setContent(newsItem.content || "");
      setImageUrl(newsItem.imageUrl || "");
      setLink(newsItem.link || "");
      setIsActive(newsItem.isActive);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Banner image is required");
      return;
    }

    setIsLoading(true);
    const data = {
      title: "Banner", // Default title since we removed the field
      imageUrl,
      isActive
    };

    try {
      let res;
      if (editingNews) {
        res = await updateNews(editingNews.id, data);
      } else {
        res = await createNews(data);
      }

      if (res.success) {
        toast.success(editingNews ? "Banner updated" : "Banner created");
        // Update local state is not strictly necessary due to revalidatePath, 
        // but it helps for immediate UI feedback.
        if (editingNews) {
          setNewsList(newsList.map(n => n.id === editingNews.id ? res.data : n));
        } else {
          setNewsList([res.data, ...newsList]);
        }
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    toast.promise(
      deleteNews(id),
      {
        loading: 'Deleting banner...',
        success: (res) => {
          if (res.success) {
            setNewsList(newsList.filter(n => n.id !== id));
            return 'Banner deleted successfully';
          }
          throw new Error(res.error || 'Failed to delete');
        },
        error: (err) => err.message || 'Failed to delete banner',
      }
    );
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await toggleNewsStatus(id, currentStatus);
      if (res.success) {
        setNewsList(newsList.map(n => n.id === id ? { ...n, isActive: !currentStatus } : n));
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-client">News & Banners</h2>
          <p className="text-muted-foreground text-sm">Manage advertisements and news updates for your users.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-client hover:bg-client/90">
          <Plus className="w-4 h-4 mr-2" /> Add News/Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsList.map((item) => (
          <Card key={item.id} className={`overflow-hidden border-2 transition-all ${item.isActive ? 'border-client/20' : 'opacity-60 border-gray-200'}`}>
            {item.imageUrl && (
              <div className="relative h-56 w-full bg-muted">
                <img src={item.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                {!item.isActive && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-xs uppercase tracking-widest px-2 py-1 border border-white rounded">Inactive</span>
                  </div>
                )}
              </div>
            )}
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={() => handleToggleStatus(item.id, item.isActive)}
                  />
                  <span className="text-sm font-medium">{item.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item)} className="h-8 w-8 p-0">
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Added on {format(new Date(item.createdAt), "MMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
        ))}

        {newsList.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Megaphone className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-600">No news or banners yet</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">Create your first news update or advertisement to show it on user dashboards.</p>
            <Button onClick={() => handleOpenDialog()} className="bg-client">Create Banner Now</Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingNews ? "Edit News/Banner" : "Add New News/Banner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label>Banner Image <span className="text-red-500">*</span></Label>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
                <CloudinaryUpload onUpload={setImageUrl} />
              </div>
              {imageUrl && (
                <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                  <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" />
                </div>
              )}
              {imageUrl && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 rounded border border-green-100 text-sm text-green-700">
                  <Check className="w-4 h-4" /> Image uploaded successfully
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="is-active" className="cursor-pointer">Show this banner immediately</Label>
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading || !imageUrl} className="bg-client">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingNews ? "Update Banner" : "Create Banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
