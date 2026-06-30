"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImage {
  src: string;
  alt: string;
}

interface ProductCarouselProps {
  images: ProductImage[];
}

export default function ProductCarousel({ images }: ProductCarouselProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-full bg-gray-50 flex flex-col justify-between p-3 select-none group">
      {/* Slide Container */}
      <div className="relative flex-1 w-full rounded-lg overflow-hidden bg-white border border-gray-200/60 shadow-xs flex items-center justify-center">
        {/* Main Image */}
        <div className="relative w-full h-full transition-all duration-300">
          <Image
            src={images[currentIdx].src}
            alt={images[currentIdx].alt}
            fill
            className="object-contain p-3 transition-transform duration-500 hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 33vw"
            priority
          />
        </div>

        {/* Left Arrow */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#1e2a32]/85 hover:bg-[#1e2a32] text-white p-2 rounded-full shadow-md transition-all hover:scale-105 focus:outline-hidden cursor-pointer"
          aria-label="Previous image"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1e2a32]/85 hover:bg-[#1e2a32] text-white p-2 rounded-full shadow-md transition-all hover:scale-105 focus:outline-hidden cursor-pointer"
          aria-label="Next image"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Subtle Counter Badge */}
        <span className="absolute bottom-2 right-2 bg-[#1e2a32]/85 text-[#f5c80c] text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wide shadow-sm">
          {currentIdx + 1} / {images.length}
        </span>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex justify-center items-center gap-1.5 pt-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIdx(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIdx === idx 
                ? "w-5 bg-[#f5c80c]" 
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
