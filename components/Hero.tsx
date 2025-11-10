"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero() {
  // Background locks to viewport height (100vh) and uses center-based offsets
  // computed from the Figma frame (1440x780) to preserve the exact crop across widths.
  const bgWidthVh = 194.7436; // 1519/780 * 100
  const bgHeightVh = 129.8718; // 1013/780 * 100
  const posCenterDxVh = 3.7821; // ( -10 + (1519-1440)/2 ) / 780 * 100
  const posCenterDyVh = 11.4744; // ( -27 + (1013-780)/2 ) / 780 * 100

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0 });
    const show = () => gsap.to(el, { opacity: 1, duration: 0.35, delay: 0.1, ease: "power2.out" });
    const handler = () => show();
    window.addEventListener("preloader:done", handler);
    const id = setTimeout(show, 1200);
    return () => {
      window.removeEventListener("preloader:done", handler);
      clearTimeout(id);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-screen h-screen [--xshift:-3vh] md:[--xshift:0vh]"
      style={{
        backgroundImage: "url('/hero_img/Aeterna_hero_img.webp')",
        backgroundSize: `${bgWidthVh}vh ${bgHeightVh}vh`,
        backgroundPosition: `calc(50% + ${posCenterDxVh}vh + var(--xshift)) calc(50% + ${posCenterDyVh}vh)`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 px-3 md:px-8">
        <div className="grid h-full grid-cols-12 grid-rows-12 gap-x-6 text-white md:text-black">
          <header className="col-span-12 flex items-center justify-between pt-6">
            <div className="font-boska font-medium leading-none text-[22px] md:text-[22px]">
              Aeterna
            </div>
            <nav className="font-satoshi font-medium leading-none text-[16px] md:text-[18px] flex items-center gap-6 md:gap-8">
              <NavLink text="MENU" />
              <NavLink text="LETS TALK" withArrow />
            </nav>
          </header>

          <div className="hidden md:block col-span-12 row-start-5 mt-[56px] font-satoshi italic uppercase text-[14px]">
            <div className="grid grid-cols-12 gap-x-6">
              <span className="col-start-1 col-span-2 justify-self-start whitespace-nowrap">DIGITAL IDENTITY</span>
              <span className="col-start-3 col-span-2 justify-self-start whitespace-nowrap">EXPERIENCE DESIGN</span>
              <span className="col-start-10 col-span-1 justify-self-end whitespace-nowrap">BRAND DYNAMICS</span>
              <span className="col-start-12 col-span-1 justify-self-end whitespace-nowrap">VERBAL IDENTITY</span>
            </div>
          </div>

          <div className="md:hidden col-span-12 row-start-2 mt-20 font-satoshi italic uppercase text-[14px] space-y-1.5">
            <div className="whitespace-nowrap">DIGITAL IDENTITY</div>
            <div className="whitespace-nowrap">EXPERIENCE DESIGN</div>
            <div className="whitespace-nowrap">BRAND DYNAMICS</div>
            <div className="whitespace-nowrap">VERBAL IDENTITY</div>
          </div>

          <div className="col-span-12 row-start-5 md:row-start-6 md:col-start-11 md:col-span-2 mt-20 md:mt-[72px] justify-self-start md:justify-self-end">
            <SlideshowBox />
          </div>

          <div className="col-span-12 row-start-6 md:col-start-1 md:col-span-6 md:row-start-7 mt-56 md:mt-[40px] z-10">
            <h1 className="font-boska italic font-medium leading-[1.1] text-white md:text-inherit text-[40px] md:text-[50px]">
              Shaping Identities
              <br />
              That Resonate
            </h1>
            <p className="hidden md:block mt-4 md:mt-6 font-satoshi text-[16px] leading-relaxed tracking-[0.04em] max-w-[34ch]">
              We believe a brand is the complete experience people have with you. Our studio designs every part of that journey, from the digital platform to the core story. We build cohesive brands that feel memorable at every touchpoint and earn lasting loyalty.
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-6">
        <div className="font-satoshi text-[14px] text-white md:text-black">Vol. 01 / JETI 2025</div>
      </div>
    </section>
  );
}

function SlideshowBox() {
  const slides = [
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
  const imgRefs = useRef<HTMLImageElement[]>([]);
  const current = useRef(0);

  useEffect(() => {
    // initialize
    imgRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { opacity: i === 0 ? 1 : 0 });
    });
    const id = setInterval(() => {
      const next = (current.current + 1) % slides.length;
      const currEl = imgRefs.current[current.current];
      const nextEl = imgRefs.current[next];
      if (currEl && nextEl) {
        gsap.to(currEl, { opacity: 0, duration: 0.5, ease: "power2.in" });
        gsap.to(nextEl, { opacity: 1, duration: 0.5, ease: "power2.out" });
      }
      current.current = next;
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div data-hero-slideshow className="relative aspect-square w-[180px] md:w-[220px] overflow-hidden bg-black/10">
      {slides.map((src, i) => (
        <img
          key={src}
          ref={(el) => {
            if (el) imgRefs.current[i] = el;
          }}
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}
    </div>
  );
}

function NavLink({ text, withArrow = false }: { text: string; withArrow?: boolean }) {
  const wrapperRef = useRef<HTMLAnchorElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    // ensure initial arrow angle is 45deg (slightly up-right)
    if (withArrow && arrowRef.current) {
      gsap.set(arrowRef.current, { rotate: -45 });
    }
    const enter = () => {
      if (underlineRef.current) {
        gsap.fromTo(
          underlineRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.3, ease: "power3.out" }
        );
      }
      if (withArrow && arrowRef.current) {
        gsap.to(arrowRef.current, { rotate: 0, duration: 0.2, ease: "power2.out" });
      }
    };
    const leave = () => {
      if (underlineRef.current) {
        gsap.to(underlineRef.current, { scaleX: 0, transformOrigin: "right center", duration: 0.25, ease: "power2.in" });
      }
      if (withArrow && arrowRef.current) {
        gsap.to(arrowRef.current, { rotate: -45, duration: 0.2, ease: "power2.inOut" });
      }
    };
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [withArrow]);

  return (
    <a ref={wrapperRef} href="#" className="relative inline-flex items-center gap-1 no-underline">
      <span>{text}</span>
      {withArrow && (
        <span ref={arrowRef} aria-hidden className="inline-block origin-center align-middle">
          →
        </span>
      )}
      <span ref={underlineRef} className="pointer-events-none absolute -bottom-[2px] left-0 h-[1px] w-full scale-x-0 bg-current" />
    </a>
  );
}
