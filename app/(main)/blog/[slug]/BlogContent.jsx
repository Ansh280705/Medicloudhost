// app/(main)/blog/[slug]/BlogContent.jsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { HeartIcon, ChevronLeft } from "lucide-react";
import { likeBlog } from "@/actions/blog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function BlogContent({ blog }) {
  const router = useRouter();
  const [likes, setLikes] = useState(blog.likes || 0);

  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    // Optimistically update UI
    setLikes((prev) => prev + 1);

    try {
      await likeBlog(blog.id);
    } catch (err) {
      console.error("Failed to like blog:", err);
      // Revert if server call fail
      setLikes((prev) => prev - 1);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <button
        onClick={() => router.push("/blog")}
        className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-client transition-colors group"
      >
        <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        Back to Blogs
      </button>

      <Card className="bg-card border-none overflow-hidden shadow-xl rounded-2xl border-emerald-900/5">
        {blog.imageUrl && (
          <div className="w-full relative overflow-hidden bg-client/5 border-b border-emerald-900/5 top-[-24]">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              width={1200}
              height={800}
              className="w-full h-auto object-contain max-h-[75vh] mx-auto hover:scale-[1.01] transition-transform duration-500"
              priority
            />
          </div>
        )}

        <CardHeader className="space-y-4 pt-6 md:pt-8 px-4 md:px-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
                Article
              </span>
              <span className="text-muted-foreground text-xs md:text-sm">•</span>
              <span className="text-muted-foreground text-xs md:text-sm font-medium">
                {new Date(blog.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            <CardTitle className="text-2xl md:text-4xl font-black text-client tracking-tight leading-[1.2] md:leading-[1.15]">
              {blog.title}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className=" pb-8 md:pb-10">
          <div
            className="prose prose-slate max-w-none 
              prose-p:text-slate-700 prose-p:leading-[1.8] md:prose-p:leading-[1.9]
              prose-headings:text-client prose-headings:font-black
              prose-strong:text-slate-900
              prose-img:rounded-2xl prose-img:shadow-lg
              prose-a:text-client prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-ul:list-disc prose-ul:pl-6
              prose-ol:list-decimal prose-ol:pl-6
              text-base md:text-lg whitespace-pre-wrap break-normal [word-break:normal] [overflow-wrap:break-word] selection:bg-emerald-100"
            dangerouslySetInnerHTML={{ __html: blog.content.trim() }}
          />

          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-emerald-900/5 flex items-center justify-between">
            <button
              onClick={handleLike}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-client text-white rounded-full hover:bg-client/90 transition-all flex items-center gap-2 md:gap-2.5 shadow-lg shadow-emerald-900/10 active:scale-95 group"
            >
              <HeartIcon className={`w-4 h-4 md:w-5 md:h-5 transition-colors group-hover:fill-white ${likes > 0 ? "fill-white" : ""}`} />
              <span className="font-bold text-sm md:text-base">{likes} Likes</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}