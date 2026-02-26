"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { X, Megaphone, ZoomIn } from "lucide-react";
import { getActiveNews } from "@/actions/news";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export function NewsCarousel() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      const res = await getActiveNews();
      if (res.success) {
        setNews(res.data);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading || news.length === 0) return null;

  return (
    <>
      <div className="w-full mb-6 md:mb-8 rounded-xl md:rounded-2xl overflow-hidden shadow-md md:shadow-lg border border-client/10 bg-white">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
          }}
          speed={600}
          className="w-full h-[280px] sm:h-[350px] md:h-[500px]"
        >
          {news.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
                {item.imageUrl ? (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover cursor-pointer active:scale-[0.98] transition-transform touch-manipulation"
                      onClick={() => setLightboxImage(item.imageUrl)}
                    />
                    {/* Tap to zoom hint for mobile */}
                    <div className="absolute bottom-3 right-3 md:hidden bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <ZoomIn className="w-3 h-3" />
                      <span>Tap to view</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-client">
                    <Megaphone className="w-24 h-24 md:w-32 md:h-32 text-white/20" />
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <style jsx global>{`
          .swiper-pagination {
            bottom: 12px !important;
          }
          .swiper-pagination-bullet {
            background: white !important;
            opacity: 0.6;
            width: 8px;
            height: 8px;
            margin: 0 4px !important;
          }
          .swiper-pagination-bullet-active {
            background: white !important;
            opacity: 1;
            width: 24px;
            border-radius: 4px;
          }
          @media (max-width: 768px) {
            .swiper-pagination-bullet {
              width: 6px;
              height: 6px;
            }
            .swiper-pagination-bullet-active {
              width: 18px;
            }
          }
        `}</style>
      </div>

      {/* Lightbox Modal - Mobile Optimized */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all touch-manipulation"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Full view"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full md:hidden">
            Tap outside to close
          </div>
        </div>
      )}
    </>
  );
}
