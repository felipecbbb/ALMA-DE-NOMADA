"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function GallerySection() {
  const isMobile = useIsMobile();
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState("100vh");
  const [translateX, setTranslateX] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const rafRef = useRef<number | null>(null);

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

  // Calculate section height based on content width
  useEffect(() => {
    if (isMobile) {
      setSectionHeight("auto");
      return;
    }

    const calculateHeight = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      // Height = viewport height + the extra scroll needed to reveal all content
      const totalHeight = viewportHeight + (containerWidth - viewportWidth);
      setSectionHeight(`${totalHeight}px`);
    };

    // Small delay to ensure container is rendered
    const timer = setTimeout(calculateHeight, 100);
    window.addEventListener("resize", calculateHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateHeight);
    };
  }, [isMobile]);

  const updateTransform = useCallback(() => {
    if (isMobile) return;
    if (!galleryRef.current || !containerRef.current) return;
    
    const rect = galleryRef.current.getBoundingClientRect();
    const containerWidth = containerRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    
    // Total scroll distance needed to reveal all images
    const totalScrollDistance = containerWidth - viewportWidth;
    
    // Current scroll position within this section
    const scrolled = Math.max(0, -rect.top);
    
    // Progress from 0 to 1
    const progress = Math.min(1, scrolled / totalScrollDistance);
    
    // Calculate new translateX
    const newTranslateX = progress * -totalScrollDistance;
    
    setTranslateX(newTranslateX);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame(updateTransform);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransform();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isMobile, updateTransform]);

  const handleMobileScroll = useCallback(() => {
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;

    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let nextIndex = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    Array.from(scroller.children).forEach((child, index) => {
      const card = child as HTMLElement;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < minDistance) {
        minDistance = distance;
        nextIndex = index;
      }
    });

    setActiveMobileIndex(nextIndex);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const interval = window.setInterval(() => {
      setActiveMobileIndex((current) => (current + 1) % images.length);
    }, 3400);

    return () => window.clearInterval(interval);
  }, [isMobile, images.length]);

  useEffect(() => {
    if (!isMobile) return;
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;

    const target = scroller.children.item(activeMobileIndex) as HTMLElement | null;
    target?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [isMobile, activeMobileIndex]);

  if (isMobile) {
    return (
      <section id="gallery" className="bg-background px-6 py-12">
        <div
          ref={mobileScrollerRef}
          onScroll={handleMobileScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-[48svh] w-[78vw] flex-shrink-0 snap-center overflow-hidden rounded-2xl"
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index < 3}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section 
      id="gallery"
      ref={galleryRef}
      className="relative bg-background"
      style={{ height: sectionHeight }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full items-center">
          {/* Horizontal scrolling container */}
          <div 
            ref={containerRef}
            className="flex gap-6 px-6"
            style={{
              transform: `translate3d(${translateX}px, 0, 0)`,
              WebkitTransform: `translate3d(${translateX}px, 0, 0)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitPerspective: 1000,
              touchAction: 'pan-y',
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-[70vh] w-[85vw] flex-shrink-0 overflow-hidden rounded-2xl md:w-[60vw] lg:w-[45vw]"
                style={{
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)',
                }}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index < 3}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
