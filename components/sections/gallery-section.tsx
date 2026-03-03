"use client";

import Image from "next/image";

const images = [
  { src: "https://almadenomada.com/cdn/shop/t/5/assets/thailandia.jpeg?v=131009810260977809441769101746", alt: "Thailand" },
  { src: "https://almadenomada.com/cdn/shop/t/5/assets/sir%20lanka.jpeg?v=60339183477933206391769101746", alt: "Sri Lanka" },
  { src: "https://almadenomada.com/cdn/shop/t/5/assets/japon.jpeg?v=69856797805187058121769101746", alt: "Japan" },
  { src: "https://almadenomada.com/cdn/shop/t/5/assets/autralia.jpeg?v=95094110439352087451769101751", alt: "Australia" },
  { src: "https://almadenomada.com/cdn/shop/t/5/assets/new%20zealand.jpeg?v=23240636594380725261769101745", alt: "New Zealand" },
  { src: "https://almadenomada.com/cdn/shop/t/5/assets/maldivas.jpeg?v=48811264592296444881769101747", alt: "Maldives" },
  { src: "https://almadenomada.com/cdn/shop/t/5/assets/vietnam.jpeg?v=35700450405453791711769101746", alt: "Vietnam" },
  { src: "/IMG_1343.jpg", alt: "Philippines" },
];

export function GallerySection() {
  // Duplicate images for seamless infinite loop
  const track = [...images, ...images];

  return (
    <section id="gallery" className="overflow-hidden bg-background py-10 md:py-16">
      <div
        className="flex gap-4 md:gap-6"
        style={{
          width: "max-content",
          animation: "gallery-scroll 40s linear infinite",
        }}
      >
        {track.map((image, index) => (
          <div
            key={index}
            className="relative h-[45svh] w-[72vw] flex-shrink-0 overflow-hidden rounded-2xl md:h-[60vh] md:w-[36vw] lg:w-[28vw]"
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index < 4}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes gallery-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
