"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLImageElement | null>(null);
  const sideRefs = useRef<HTMLImageElement[]>([]);

  const sideSlides = [
    "/slideshow/1.webp",
    "/slideshow/2.webp",
    "/slideshow/3.webp",
    "/slideshow/4.webp",
    "/slideshow/5.webp",
    "/slideshow/6.webp",
    "/slideshow/7.webp",
    "/slideshow/8.webp",
    "/slideshow/9.webp",
  ];
  const heroSrc = "/hero_img/Aeterna_hero_img.webp";

  useEffect(() => {
    const updateViewportHeight = () => {
      const el = containerRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      el.style.setProperty("--preloader-vh", `${vh}px`);
      document.documentElement.style.setProperty("--app-vh", `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    window.addEventListener("orientationchange", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
    };
  }, []);

  useEffect(() => {
    const containerEl = containerRef.current;
    const boxEl = boxRef.current;
    const heroImgEl = heroRef.current;
    if (!containerEl || !boxEl || !heroImgEl) return;

    const ctx = gsap.context(() => {
      const isMd = window.matchMedia("(min-width: 768px)").matches;
      const initialWidth = isMd ? 180 : 140;
      const initialHeight = isMd ? 200 : 140;

      const heroSlot = document.querySelector<HTMLElement>("[data-hero-slideshow]");
      const heroRect = heroSlot?.getBoundingClientRect();
      const fallbackWidth = heroRect?.width ?? (isMd ? 220 : 160);
      const fallbackHeight = heroRect?.height ?? (isMd ? 220 : 160);
      const fallbackCenterX = heroRect ? heroRect.left + heroRect.width / 2 : window.innerWidth * (isMd ? 0.82 : 0.5);
      const fallbackCenterY = heroRect ? heroRect.top + heroRect.height / 2 : window.innerHeight * (isMd ? 0.72 : 0.7);

      const sideImages = sideRefs.current.filter(Boolean);

      gsap.set(containerEl, {
        opacity: 1,
        backgroundColor: "#FFF6E7",
        width: window.innerWidth,
        height: window.innerHeight,
      });
      gsap.set(boxEl, {
        position: "fixed",
        left: window.innerWidth / 2,
        top: window.innerHeight / 2,
        xPercent: -50,
        yPercent: -50,
        width: initialWidth,
        height: initialHeight,
        zIndex: 20,
      });
      gsap.set(heroImgEl, { width: "100%", height: "100%", opacity: 1, objectFit: "cover" });
      sideImages.forEach((el, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        gsap.set(el, { x: dir * window.innerWidth, zIndex: 10, opacity: 1 });
      });

      const tl = gsap.timeline({
        onComplete: () => {
          window.dispatchEvent(new Event("preloader:done"));
          setHidden(true);
        },
      });

      tl.to(sideImages, {
        x: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
      })
        .to({}, { duration: 0.25 })
        .to(sideImages, { opacity: 0, duration: 0.45, stagger: 0.06, ease: "power1.in" }, "-=0.2")
        .to(
          boxEl,
          {
            width: fallbackWidth,
            height: fallbackHeight,
            left: fallbackCenterX,
            top: fallbackCenterY,
            duration: 1.4,
            ease: "power3.inOut",
          }
        )
        .to(heroImgEl, { opacity: 0, duration: 0.6, ease: "power1.inOut" }, "-=0.5")
        .to(containerEl, { backgroundColor: "rgba(255,246,231,0)", duration: 0.6, ease: "power1.inOut" }, "-=0.5")
        .to(containerEl, { opacity: 0, duration: 0.5, ease: "power1.in" }, "-=0.3");

      return () => tl.kill();
    }, containerRef);

    return () => ctx.revert();
  }, [sideSlides.length]);

  if (hidden) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#FFF6E7] overflow-hidden"
      style={{
        height: "var(--preloader-vh, var(--app-vh, 100dvh))",
        minHeight: "var(--app-vh, 100dvh)",
      }}
      aria-hidden
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={boxRef} className="relative w-[140px] h-[140px] md:w-[180px] md:h-[200px]">
          <img ref={heroRef} src={heroSrc} alt="" className="absolute inset-0 w-full h-full object-cover z-20" />
          {sideSlides.map((src, i) => (
            <img
              key={`side-${i}`}
              ref={(el) => {
                if (el) sideRefs.current[i] = el;
              }}
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover z-10"
              draggable={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
