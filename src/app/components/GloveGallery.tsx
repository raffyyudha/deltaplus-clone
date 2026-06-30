"use client";

import { useState } from "react";
import Image from "next/image";

export default function GloveGallery() {
  const images = [
    { src: "/images/gloves1.jpeg", alt: "Heavy-Duty Leather Gloves" },
    { src: "/images/gloves2.jpeg", alt: "Chemical & Cut Resistant Gloves" },
    { src: "/images/gloves3.jpeg", alt: "High-Dexterity Grip Gloves" },
  ];
  
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="flex flex-col gap-2 w-full h-full p-3 justify-between bg-gray-50">
      {/* Main Active Image */}
      <div className="relative flex-1 min-h-[140px] rounded-lg overflow-hidden bg-white border border-gray-200/60 shadow-xs flex items-center justify-center group">
        <Image
          src={images[activeIdx].src}
          alt={images[activeIdx].alt}
          fill
          className="object-contain p-3 transition-all duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, 33vw"
          priority
        />
        {/* Subtle Pill Indicator */}
        <span className="absolute bottom-2 right-2 bg-[#1e2a32]/85 text-[#f5c80c] text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wide backdrop-blur-xs select-none shadow-sm">
          Style {activeIdx + 1}
        </span>
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-3 gap-2 h-14 sm:h-16 shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIdx(idx)}
            onMouseEnter={() => setActiveIdx(idx)}
            className={`relative rounded-md overflow-hidden bg-white border-2 transition-all cursor-pointer ${
              activeIdx === idx
                ? "border-[#f5c80c] shadow-xs scale-[1.02]"
                : "border-gray-200 hover:border-gray-300"
            }`}
            aria-label={`View glove style ${idx + 1}`}
          >
            <Image
              src={img.src}
              alt={`Glove Thumbnail ${idx + 1}`}
              fill
              className="object-contain p-1"
              sizes="100px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
