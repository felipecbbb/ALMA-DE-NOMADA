"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const rotatingPhrases = [
  "TU PRÓXIMA AVENTURA",
  "DESCUBRE NUEVOS DESTINOS",
  "EXPERIENCIAS INOLVIDABLES",
];

const sideImages = [
  {
    src: "https://almadenomada.com/cdn/shop/t/5/assets/thailandia.jpeg?v=131009810260977809441769101746",
    alt: "Thailand",
    position: "left",
    span: 1,
  },
  {
    src: "https://almadenomada.com/cdn/shop/t/5/assets/bali.jpeg?v=81726093188308884481769101751",
    alt: "Indonesia",
    position: "left",
    span: 1,
  },
  {
    src: "https://almadenomada.com/cdn/shop/t/5/assets/autralia.jpeg?v=95094110439352087451769101751",
    alt: "Australia",
    position: "right",
    span: 1,
  },
  {
    src: "https://almadenomada.com/cdn/shop/t/5/assets/lombok.jpeg?v=173855469035230574911769101747",
    alt: "Lombok",
    position: "right",
    span: 1,
  },
];

export function HeroSection() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePhrase, setActivePhrase] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * (isMobile ? 0.9 : 2);
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActivePhrase((prev) => (prev + 1) % rotatingPhrases.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    const startSecond = 2;

    const playFromSecond = () => {
      const safeStart = Number.isFinite(video.duration)
        ? Math.min(startSecond, Math.max(0, video.duration - 0.1))
        : startSecond;
      video.currentTime = safeStart;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Ignore autoplay rejections from some browsers.
        });
      }
    };

    const handleLoadedMetadata = () => {
      playFromSecond();
    };

    const handleEnded = () => {
      playFromSecond();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    if (video.readyState >= 1) {
      playFromSecond();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Keep title readable for longer before transitioning into the grid.
  const textFadeEnd = isMobile ? 0.05 : 0.32;
  const textOpacity = isMobile ? 0 : Math.max(0, 1 - (scrollProgress / textFadeEnd));
  
  // Image transforms start after the text has mostly faded.
  const imageProgress = isMobile
    ? 1
    : Math.max(0, Math.min(1, (scrollProgress - textFadeEnd) / (1 - textFadeEnd)));
  
  // Smooth interpolations
  const centerWidth = 100 - (imageProgress * 58); // 100% to 42%
  const centerHeight = 100 - (imageProgress * 30); // 100% to 70%
  const sideWidth = imageProgress * 22; // 0% to 22%
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100); // -100% to 0%
  const sideTranslateRight = 100 - (imageProgress * 100); // 100% to 0%
  const borderRadius = imageProgress * 24; // 0px to 24px
  const gap = imageProgress * 16; // 0px to 16px
  
  // Vertical offset for side columns to move them up on mobile
  const sideTranslateY = -(imageProgress * (isMobile ? 8 : 15)); // Move up when expanded

  return (
    <section ref={sectionRef} id="inicio" className="relative bg-background">
      {/* Sticky container for scroll animation */}
      <div className="sticky top-0 z-20 h-[88svh] overflow-hidden md:h-screen">
        <div className="flex h-full w-full items-center justify-center">
          {/* Bento Grid Container */}
          <div 
            className="relative flex h-full w-full items-stretch justify-center"
            style={{
              gap: `${gap}px`,
              padding: `${imageProgress * 16}px`,
              paddingBottom: `${(isMobile ? 28 : 60) + (imageProgress * (isMobile ? 20 : 40))}px`,
            }}
          >
            
            {/* Left Column */}
            <div 
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateLeft}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages.filter(img => img.position === "left").map((img, idx) => (
                <div 
                  key={idx} 
                  className="relative overflow-hidden will-change-transform"
                  style={{
                    flex: img.span,
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <Image
                    src={img.src || "/placeholder.svg"}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Hero Image - Center */}
            <div 
              className="relative overflow-hidden will-change-transform"
              style={{
                width: `${centerWidth}%`,
                height: `${centerHeight}%`,
                flex: "0 0 auto",
                borderRadius: `${borderRadius}px`,
              }}
            >
              <video
                ref={heroVideoRef}
                autoPlay
                muted
                playsInline
                preload="auto"
                poster="/IMG_1343.jpg"
                className="absolute inset-0 h-full w-full object-cover"
                src="https://almadenomada.com/cdn/shop/videos/c/vp/b04b9e96f33a42878b3d61ea1e7ec3d0/b04b9e96f33a42878b3d61ea1e7ec3d0.HD-1080p-7.2Mbps-67097679.mp4?v=0"
              />
              <div className="absolute inset-0 bg-secondary/35" />
              
              {/* Overlay Text - Fades out first */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
                style={{ opacity: textOpacity }}
              >
                <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center">
                  <h1 className="mb-4 text-center text-[clamp(2.8rem,8.4vw,8rem)] font-semibold uppercase leading-[0.9] tracking-tight text-primary drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
                    ALMA DE
                    <br />
                    NÓMADA
                  </h1>
                  <div className="relative mx-auto flex h-[clamp(2.8rem,4.6vw,4.2rem)] w-full max-w-[min(92vw,1200px)] items-center justify-center overflow-hidden">
                    {rotatingPhrases.map((phrase, index) => (
                      <p
                        key={phrase}
                        className="absolute inset-0 flex items-center justify-center whitespace-nowrap px-4 text-center text-[clamp(1rem,2.4vw,2.2rem)] font-semibold uppercase leading-none tracking-wide text-white transition-all duration-500"
                        style={{
                          opacity: index === activePhrase ? 1 : 0,
                          transform: index === activePhrase ? "translateY(0)" : "translateY(12px)",
                        }}
                      >
                        {phrase}
                      </p>
                    ))}
                  </div>
                  <a
                    href="https://calendly.com/ainhhgarcia"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex self-center rounded-full bg-primary px-8 py-3 text-base font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#bf5733]"
                  >
                    RESERVA AHORA
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div 
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateRight}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages.filter(img => img.position === "right").map((img, idx) => (
                <div 
                  key={idx} 
                  className="relative overflow-hidden will-change-transform"
                  style={{
                    flex: img.span,
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <Image
                    src={img.src || "/placeholder.svg"}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Scroll space to enable animation */}
      <div style={{ height: isMobile ? "92vh" : "200vh" }} />

      {/* Tagline Section */}
      <div className="relative z-0 -mt-24 px-6 pt-10 pb-24 md:-mt-32 md:px-12 md:pt-16 md:pb-32 lg:-mt-40 lg:px-20 lg:pt-20 lg:pb-40">
        <p className="mx-auto max-w-2xl text-center text-xl leading-relaxed text-muted-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug">
          Asesoría personalizada para organizar tu viaje o tu cambio de vida con claridad, confianza y tranquilidad.
        </p>
      </div>
    </section>
  );
}
