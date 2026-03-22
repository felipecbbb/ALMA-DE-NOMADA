"use client";

import Image from "next/image";

const images = [
  { src: "/destinations/tailandia.jpg", alt: "Tailandia" },
  { src: "/destinations/sri-lanka.jpg", alt: "Sri Lanka" },
  { src: "/destinations/japon.jpg", alt: "Japón" },
  { src: "/destinations/australia.jpg", alt: "Australia" },
  { src: "/destinations/new-zealand.jpg", alt: "Nueva Zelanda" },
  { src: "/destinations/maldives.jpg", alt: "Maldivas" },
  { src: "/destinations/vietnam.jpg", alt: "Vietnam" },
  { src: "/IMG_1343.jpg", alt: "Filipinas" },
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
