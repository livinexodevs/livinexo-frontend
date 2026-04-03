"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Receipt,
  Users,
  ShoppingCart,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Shield,
  Zap,
  BarChart3,
  Split,
  Search,
  Bell,
  MousePointer2,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: ShoppingCart,
    title: "Smart Expense Entry",
    description:
      "Autocomplete powered by 100+ curated Indian household items. Smart search with tags, categories, and history-based learning.",
    gradient: "from-haveli-500 to-orange-500",
    iconBg: "bg-gradient-to-br from-haveli-100 to-orange-50",
    iconColor: "text-haveli-600",
    delay: 0,
  },
  {
    icon: Split,
    title: "Automatic Splitting",
    description:
      "Select members, split automatically. Track who's settled and who still owes — tap to toggle settlement status instantly.",
    gradient: "from-emerald-500 to-teal-500",
    iconBg: "bg-gradient-to-br from-emerald-100 to-teal-50",
    iconColor: "text-emerald-600",
    delay: 0.08,
  },
  {
    icon: BarChart3,
    title: "Rich Analytics",
    description:
      "Interactive charts for monthly trends, category breakdowns, and member spending comparisons. Know where every rupee goes.",
    gradient: "from-blue-500 to-indigo-500",
    iconBg: "bg-gradient-to-br from-blue-100 to-indigo-50",
    iconColor: "text-blue-600",
    delay: 0.16,
  },
  {
    icon: Users,
    title: "Member Management",
    description:
      "Add unlimited household members. Everyone can track contributions, view splits, and stay on the same page.",
    gradient: "from-violet-500 to-purple-500",
    iconBg: "bg-gradient-to-br from-violet-100 to-purple-50",
    iconColor: "text-violet-600",
    delay: 0.24,
  },
  {
    icon: Search,
    title: "Intelligent Search",
    description:
      "Type 'dal' and see all lentils. Type 'clean' and get detergent, soap, broom. Tag-based fuzzy matching learns your vocabulary.",
    gradient: "from-amber-500 to-yellow-500",
    iconBg: "bg-gradient-to-br from-amber-100 to-yellow-50",
    iconColor: "text-amber-600",
    delay: 0.32,
  },
  {
    icon: Zap,
    title: "Quantity Flexibility",
    description:
      "Pieces, kilograms, grams, litres, millilitres, packs, or dozens — auto-detects the right unit when you pick an item.",
    gradient: "from-rose-500 to-pink-500",
    iconBg: "bg-gradient-to-br from-rose-100 to-pink-50",
    iconColor: "text-rose-600",
    delay: 0.4,
  },
];

const steps = [
  {
    num: "01",
    title: "Add Your Members",
    description:
      "Set up your household in seconds — add family, roommates, or anyone sharing expenses.",
    icon: Users,
  },
  {
    num: "02",
    title: "Log Every Expense",
    description:
      "Search items, pick quantities and units, set the price. Smart autocomplete does the heavy lifting.",
    icon: Receipt,
  },
  {
    num: "03",
    title: "Track & Settle Up",
    description:
      "See real-time splits, tap to settle, and check analytics to know exactly where your money flows.",
    icon: CheckCircle2,
  },
];

const testimonials = [
  {
    quote:
      "We used to fight over who paid what. Now we just check Livinexo. The auto-splitting is honestly life-changing for our flatshare.",
    name: "Rohit & Flatmates",
    detail: "4-person household, Bangalore",
    initial: "R",
    gradient: "from-haveli-400 to-haveli-600",
  },
  {
    quote:
      "Tracking kharcha was always messy with screenshots and notes. Livinexo made it so clean — the analytics alone saved us from overspending every month.",
    name: "Sayan & Flatmates",
    detail: "3-person household, Kolkata",
    initial: "S",
    gradient: "from-blue-400 to-indigo-600",
  },
  {
    quote:
      "The smart item search is insane — I type 'atta' and it fills everything. We onboarded in literally 2 minutes and haven't looked back since.",
    name: "Tanmay & Flatmates",
    detail: "5-person household, Pune",
    initial: "T",
    gradient: "from-emerald-400 to-teal-600",
  },
];

const stats = [
  { value: 100, suffix: "+", label: "Curated Items" },
  { value: 7, suffix: "", label: "Unit Types" },
  { value: 12, suffix: "", label: "Categories" },
  { value: 0, suffix: "₹", label: "Always Free", prefix: true },
];

function AnimatedCounter({ value, suffix, prefix }: { value: number; suffix: string; prefix?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: value,
          duration: 2,
          ease: "power2.out",
          onUpdate: function () {
            setDisplay(Math.round(this.targets()[0].val));
          },
        });
      },
    });

    return () => trigger.kill();
  }, [value]);

  return (
    <span ref={ref} className="counter-value">
      {prefix ? suffix : ""}
      {display}
      {!prefix ? suffix : ""}
    </span>
  );
}

function TestimonialsSlider() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const activeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressKey = useRef(0);

  const slideTo = useCallback((next: number) => {
    if (fading) return;
    setFading(true);

    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          activeRef.current = next;
          progressKey.current += 1;
          setActive(next);
          setFading(false);
        },
      });
    } else {
      activeRef.current = next;
      progressKey.current += 1;
      setActive(next);
      setFading(false);
    }
  }, [fading]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
      );
    }
  }, [active]);

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = (activeRef.current + 1) % testimonials.length;
      slideTo(next);
    }, 5000);
  }, [slideTo]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoPlay]);

  const handleDotClick = (index: number) => {
    if (index === active || fading) return;
    if (timerRef.current) clearInterval(timerRef.current);
    slideTo(index);
    setTimeout(() => startAutoPlay(), 400);
  };

  const t = testimonials[active];

  return (
    <section data-testimonials className="py-16 sm:py-24 px-4 bg-sand-50 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-haveli-50 border border-haveli-200/60 text-xs font-semibold text-haveli-700 uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Loved by households
          </div>
          <h2 className="text-3xl sm:text-[2.75rem] md:text-5xl font-bold text-sand-950 tracking-tight leading-tight">
            What people are
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-haveli-600 to-orange-500 bg-clip-text text-transparent">
              saying about us
            </span>
          </h2>
        </div>

        <div className="relative min-h-[260px] sm:min-h-[240px] flex items-center justify-center">
          <div ref={contentRef} className="text-center w-full">
            {/* Stars */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg sm:text-2xl md:text-[1.65rem] font-medium text-sand-800 leading-relaxed max-w-3xl mx-auto mb-7 sm:mb-8 px-2">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-center gap-3">
              <div
                className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
              >
                {t.initial}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-sand-800">
                  {t.name}
                </p>
                <p className="text-xs text-sand-400">{t.detail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dots with progress indicator */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 ${
                i === active ? "w-10 bg-sand-200" : "w-2 bg-sand-300 hover:bg-sand-400"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            >
              {i === active && (
                <div
                  key={progressKey.current}
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-haveli-500 to-haveli-600 rounded-full"
                  style={{
                    animation: "testimonial-progress 5s linear forwards",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const navRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [navScrolled, setNavScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setNavScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // --- Nav entrance (target inner <nav>, not the positioning wrapper) ---
      const navInner = navRef.current?.querySelector("nav");
      if (navInner) {
        gsap.fromTo(
          navInner,
          { y: -40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out",
            delay: 0.1,
            clearProps: "transform,opacity",
          }
        );
      }

      // --- Hero ---
      const heroTl = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      heroTl
        .from("[data-hero-overline]", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          delay: 0.3,
        })
        .from(
          "[data-hero-title] .hw",
          {
            y: 120,
            rotateX: -90,
            opacity: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power4.out",
          },
          "-=0.4"
        )
        .from(
          "[data-hero-subtitle]",
          { y: 40, opacity: 0, duration: 0.9 },
          "-=0.4"
        )
        .from(
          "[data-hero-actions] > *",
          {
            y: 30,
            opacity: 0,
            scale: 0.9,
            duration: 0.7,
            stagger: 0.12,
          },
          "-=0.3"
        )
        .from(
          "[data-scroll-hint]",
          { opacity: 0, duration: 1 },
          "-=0.2"
        );

      // Hero visual — perspective tilt entrance
      gsap.from("[data-hero-mockup]", {
        y: 120,
        opacity: 0,
        rotateX: 15,
        scale: 0.85,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.8,
      });

      // Gentle float on mockup
      gsap.to("[data-hero-mockup]", {
        y: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.2,
      });

      // Float cards staggered
      gsap.utils.toArray<HTMLElement>("[data-float-card]").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          scale: 0.5,
          y: 40,
          duration: 0.8,
          delay: 1.5 + i * 0.2,
          ease: "back.out(1.7)",
        });
        gsap.to(el, {
          y: gsap.utils.random(-6, -14),
          rotation: gsap.utils.random(-1, 1),
          duration: gsap.utils.random(3, 4.5),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2.5 + i * 0.3,
        });
      });

      // Hero background parallax orbs
      gsap.utils.toArray<HTMLElement>("[data-parallax-orb]").forEach((orb) => {
        const speed = parseFloat(orb.dataset.speed || "0.3");
        gsap.to(orb, {
          yPercent: -30 * speed,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

      // Mockup bars animate in
      gsap.from("[data-mock-bar]", {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 0.6,
        stagger: 0.08,
        delay: 1.8,
        ease: "power2.out",
      });

      // --- Features ---
      gsap.from("[data-features-header]", {
        scrollTrigger: {
          trigger: "[data-features-header]",
          start: "top 82%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>("[data-feature-card]").forEach((card) => {
        const d = parseFloat(card.dataset.delay || "0");
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
          },
          y: 80,
          opacity: 0,
          duration: 0.9,
          delay: d,
          ease: "power3.out",
        });

        // Shine sweep on scroll enter
        const shine = card.querySelector("[data-shine]");
        if (shine) {
          gsap.to(shine, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
            backgroundPosition: "-200% 0",
            duration: 1.2,
            delay: d + 0.3,
            ease: "power2.inOut",
          });
        }
      });

      // --- Steps ---
      gsap.from("[data-steps-header]", {
        scrollTrigger: {
          trigger: "[data-steps-header]",
          start: "top 82%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Progress line draws down
      gsap.from("[data-steps-progress]", {
        scrollTrigger: {
          trigger: "[data-steps-progress]",
          start: "top 80%",
          end: "bottom 60%",
          scrub: 1,
        },
        scaleY: 0,
        transformOrigin: "top center",
      });

      gsap.utils.toArray<HTMLElement>("[data-step-card]").forEach((step, i) => {
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: "top 88%",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: "power3.out",
        });

        const num = step.querySelector("[data-step-num]");
        if (num) {
          gsap.from(num, {
            scrollTrigger: {
              trigger: step,
              start: "top 88%",
            },
            scale: 0,
            rotation: -180,
            duration: 0.8,
            delay: i * 0.15 + 0.2,
            ease: "back.out(1.7)",
          });
        }
      });

      // --- Stats counters triggered via AnimatedCounter component ---

      // --- Testimonials ---
      gsap.from("[data-testimonials]", {
        scrollTrigger: {
          trigger: "[data-testimonials]",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // --- CTA ---
      mm.add("(min-width: 640px)", () => {
        gsap.from("[data-cta-block]", {
          scrollTrigger: {
            trigger: "[data-cta-block]",
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
          y: 100,
          opacity: 0,
          scale: 0.92,
        });
      });

      mm.add("(max-width: 639px)", () => {
        gsap.from("[data-cta-block]", {
          scrollTrigger: {
            trigger: "[data-cta-block]",
            start: "top 90%",
          },
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      });

      // --- Highlight pills in CTA ---
      gsap.from("[data-cta-pill]", {
        scrollTrigger: {
          trigger: "[data-cta-block]",
          start: "top 75%",
        },
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        delay: 0.4,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-sand-50 overflow-hidden relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Nav */}
      <div
        ref={navRef}
        className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          navScrolled
            ? "top-3 sm:top-4 left-3 right-3 sm:left-[max(1rem,calc(50%-32rem))] sm:right-[max(1rem,calc(50%-32rem))]"
            : "top-0 left-0 right-0"
        }`}
      >
        <nav
          className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            navScrolled
              ? "bg-white/80 backdrop-blur-2xl shadow-lg shadow-black/[0.06] border border-sand-200/70 rounded-2xl"
              : "bg-transparent"
          }`}
        >
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              navScrolled
                ? "h-12 sm:h-14 px-4 sm:px-6"
                : "h-16 sm:h-[72px] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`rounded-xl bg-gradient-to-br from-haveli-400 to-haveli-700 flex items-center justify-center shadow-lg shadow-haveli-600/25 transition-all duration-500 ${
                  navScrolled ? "w-7 h-7 rounded-lg" : "w-9 h-9"
                }`}
              >
                <span
                  className={`text-white font-bold tracking-tight transition-all duration-500 ${
                    navScrolled ? "text-[8px]" : "text-[10px]"
                  }`}
                >
                  LX
                </span>
              </div>
              <span
                className={`font-bold text-sand-900 tracking-tight transition-all duration-500 ${
                  navScrolled ? "text-base" : "text-lg"
                }`}
              >
                Livinexo
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="#features"
                className={`hidden sm:inline-flex text-sm font-medium text-sand-600 hover:text-sand-900 transition-all px-3 py-1.5 rounded-lg hover:bg-sand-100/60 ${
                  navScrolled ? "text-xs sm:text-sm" : ""
                }`}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className={`hidden sm:inline-flex text-sm font-medium text-sand-600 hover:text-sand-900 transition-all px-3 py-1.5 rounded-lg hover:bg-sand-100/60 ${
                  navScrolled ? "text-xs sm:text-sm" : ""
                }`}
              >
                How it Works
              </a>
              <Link
                href="/dashboard"
                className={`inline-flex items-center gap-1.5 font-medium text-white transition-all active:scale-[0.97] shadow-lg shadow-sand-900/10 ${
                  navScrolled
                    ? "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-sand-900 text-xs sm:text-sm hover:bg-sand-800"
                    : "px-5 py-2.5 rounded-xl bg-sand-900 text-sm hover:bg-sand-800"
                }`}
              >
                Open App
                <ArrowRight className={`transition-all duration-500 ${navScrolled ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* ======= HERO ======= */}
      <section
        ref={heroRef}
        className="relative pt-28 sm:pt-36 md:pt-44 pb-8 sm:pb-12 px-4 hero-gradient-mesh min-h-screen flex flex-col"
      >
        {/* Parallax orbs */}
        <div
          data-parallax-orb
          data-speed="0.5"
          className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-haveli-300/20 rounded-full blur-[100px] pointer-events-none"
        />
        <div
          data-parallax-orb
          data-speed="0.3"
          className="absolute top-40 right-[5%] w-[350px] h-[350px] bg-blue-300/10 rounded-full blur-[120px] pointer-events-none"
        />
        <div
          data-parallax-orb
          data-speed="0.7"
          className="absolute bottom-20 left-[30%] w-[300px] h-[300px] bg-violet-300/10 rounded-full blur-[100px] pointer-events-none"
        />

        {/* Grid pattern behind */}
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative flex-1 flex flex-col justify-center">
          {/* Overline badge */}
          <div
            data-hero-overline
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-sand-200/80 shadow-sm text-sm text-sand-700 mx-auto mb-6 sm:mb-8"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Next-gen household management
          </div>

          {/* Title */}
          <h1
            data-hero-title
            className="text-[2.5rem] leading-[1.08] sm:text-6xl md:text-[5.5rem] font-bold text-sand-950 tracking-tight mb-5 sm:mb-7"
            style={{ perspective: "1000px" }}
          >
            <span className="hw inline-block">Your&nbsp;</span>
            <span className="hw inline-block">Home&apos;s&nbsp;</span>
            <br className="hidden sm:block" />
            <span className="hw inline-block bg-gradient-to-r from-haveli-600 via-haveli-500 to-orange-500 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-shift">
              Finance Copilot
            </span>
          </h1>

          {/* Subtitle */}
          <p
            data-hero-subtitle
            className="text-base sm:text-xl md:text-[1.35rem] text-sand-500 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
          >
            Track shared expenses, split costs in one tap,
            and get crystal-clear insights into where every rupee goes.
          </p>

          {/* Actions */}
          <div
            data-hero-actions
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-haveli-600 to-haveli-700 text-white font-semibold text-base overflow-hidden shadow-2xl shadow-haveli-600/25 hover:shadow-haveli-600/40 active:scale-[0.97] transition-all duration-200"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Managing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-haveli-700 to-haveli-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-sand-700 font-medium text-base hover:bg-white/60 backdrop-blur-sm transition-all border border-transparent hover:border-sand-200"
            >
              <MousePointer2 className="w-4 h-4" />
              See what&apos;s inside
            </a>
          </div>

          {/* ─── Hero Mockup ─── */}
          <div
            data-hero-mockup
            className="relative mt-14 sm:mt-20 max-w-5xl mx-auto"
            style={{ perspective: "1200px" }}
          >
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-[1.5rem] border border-sand-200/80 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] p-3 sm:p-5">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4 px-1">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="h-5 w-44 sm:w-64 bg-sand-100 rounded-md flex items-center justify-center gap-1.5 px-3">
                    <Shield className="w-2.5 h-2.5 text-emerald-500" />
                    <span className="text-[9px] sm:text-[10px] text-sand-400 font-medium">
                      livinexo.app/dashboard
                    </span>
                  </div>
                </div>
                <div className="w-12" />
              </div>

              {/* Mock dashboard */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {[
                  { label: "Total Spending", val: "₹24,580", c: "text-haveli-700", bg: "from-haveli-50 to-orange-50" },
                  { label: "This Month", val: "₹8,320", c: "text-emerald-700", bg: "from-emerald-50 to-teal-50" },
                  { label: "Members", val: "4", c: "text-blue-700", bg: "from-blue-50 to-indigo-50" },
                  { label: "Items Logged", val: "47", c: "text-violet-700", bg: "from-violet-50 to-purple-50" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`bg-gradient-to-br ${s.bg} rounded-lg sm:rounded-xl p-2 sm:p-3.5 border border-white/60`}
                  >
                    <p className="text-[8px] sm:text-[10px] text-sand-400 font-medium mb-0.5 sm:mb-1 truncate">
                      {s.label}
                    </p>
                    <p className={`text-xs sm:text-lg font-bold ${s.c}`}>
                      {s.val}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chart + list */}
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-1 bg-gradient-to-br from-sand-50 to-white rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-sand-100 h-24 sm:h-44 flex items-end gap-[3px] sm:gap-1.5 overflow-hidden">
                  {[35, 55, 42, 72, 48, 65, 85, 58, 78, 45, 68, 90].map((h, i) => (
                    <div
                      key={i}
                      data-mock-bar
                      className="flex-1 rounded-t-[2px] sm:rounded-t-md"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(to top, hsl(${25 + i * 3}, 75%, ${45 + i * 2}%), hsl(${25 + i * 3}, 80%, ${60 + i * 2}%))`,
                        opacity: 0.85,
                      }}
                    />
                  ))}
                </div>
                <div className="hidden sm:flex flex-col gap-2 w-44">
                  {[
                    { n: "Groceries", pct: 72, c: "bg-haveli-500" },
                    { n: "Kitchen", pct: 54, c: "bg-blue-500" },
                    { n: "Utilities", pct: 38, c: "bg-emerald-500" },
                    { n: "Personal", pct: 25, c: "bg-violet-500" },
                  ].map((cat) => (
                    <div
                      key={cat.n}
                      className="bg-sand-50 rounded-lg p-2.5 border border-sand-100"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-medium text-sand-600">{cat.n}</p>
                        <p className="text-[9px] text-sand-400">{cat.pct}%</p>
                      </div>
                      <div className="h-1 bg-sand-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cat.c} rounded-full`}
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── Floating notification cards ─── */}
            <div
              data-float-card
              className="hidden md:flex absolute -left-10 lg:-left-16 top-[30%] bg-white rounded-2xl shadow-2xl shadow-sand-300/30 border border-sand-100 p-3.5 items-center gap-3 z-10"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-sand-900">
                  Split Settled
                </p>
                <p className="text-[11px] text-sand-400">
                  Priya paid ₹340
                </p>
              </div>
            </div>

            <div
              data-float-card
              className="hidden md:flex absolute -right-8 lg:-right-14 top-[22%] bg-white rounded-2xl shadow-2xl shadow-sand-300/30 border border-sand-100 p-3.5 items-center gap-3 z-10"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-haveli-100 to-orange-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-haveli-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-sand-900">
                  Spending ↓ 12%
                </p>
                <p className="text-[11px] text-sand-400">
                  vs last month
                </p>
              </div>
            </div>

            <div
              data-float-card
              className="hidden md:flex absolute -right-6 lg:-right-10 bottom-[15%] bg-white rounded-2xl shadow-2xl shadow-sand-300/30 border border-sand-100 p-3.5 items-center gap-3 z-10"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-sand-900">
                  New Expense
                </p>
                <p className="text-[11px] text-sand-400">
                  Arjun added Milk ₹68
                </p>
              </div>
            </div>

            {/* Glow behind mockup */}
            <div className="absolute -inset-8 bg-gradient-to-b from-haveli-200/20 via-transparent to-blue-200/10 rounded-full blur-3xl pointer-events-none -z-10" />
          </div>
        </div>

        {/* Scroll hint */}
        <div
          data-scroll-hint
          className="flex flex-col items-center pt-10 sm:pt-16 pb-4"
        >
          <span className="text-[11px] text-sand-400 font-medium tracking-wide uppercase mb-2">
            Scroll to explore
          </span>
          <ChevronDown className="w-4 h-4 text-sand-400 animate-scroll-hint" />
        </div>
      </section>

      {/* ======= FEATURES ======= */}
      <section id="features" className="py-20 sm:py-32 px-4 bg-white relative">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div data-features-header className="text-center mb-14 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-haveli-50 border border-haveli-200/60 text-xs font-semibold text-haveli-700 uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Features
            </div>
            <h2 className="text-3xl sm:text-[2.75rem] md:text-5xl font-bold text-sand-950 tracking-tight leading-tight">
              Everything your household
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-haveli-600 to-orange-500 bg-clip-text text-transparent">
                needs in one place
              </span>
            </h2>
            <p className="text-sand-500 text-base sm:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
              From daily groceries to monthly rent — Livinexo gives your
              household a shared financial brain.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                data-feature-card
                data-delay={f.delay}
                className="group relative bg-sand-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-sand-100 hover:border-sand-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                {/* Shine sweep */}
                <div
                  data-shine
                  className="absolute inset-0 feature-card-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Gradient line top */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full`}
                />

                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${f.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  <f.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${f.iconColor}`} />
                </div>
                <h3 className="relative text-lg sm:text-xl font-semibold text-sand-900 mb-2">
                  {f.title}
                </h3>
                <p className="relative text-sand-500 text-sm sm:text-[0.94rem] leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= HOW IT WORKS ======= */}
      <section
        id="how-it-works"
        className="py-20 sm:py-32 px-4 bg-sand-50 relative"
      >
        <div className="max-w-4xl mx-auto">
          <div data-steps-header className="text-center mb-14 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-haveli-50 border border-haveli-200/60 text-xs font-semibold text-haveli-700 uppercase tracking-wider mb-5">
              <Zap className="w-3.5 h-3.5" />
              How it Works
            </div>
            <h2 className="text-3xl sm:text-[2.75rem] md:text-5xl font-bold text-sand-950 tracking-tight leading-tight">
              Three steps.
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-haveli-600 to-orange-500 bg-clip-text text-transparent">
                Zero complexity.
              </span>
            </h2>
            <p className="text-sand-500 text-base sm:text-lg mt-5 max-w-lg mx-auto">
              Get your household organized in under a minute.
            </p>
          </div>

          <div className="relative">
            {/* Animated progress line */}
            <div className="absolute left-[27px] sm:left-[35px] top-4 bottom-4 w-[3px] bg-sand-200 rounded-full overflow-hidden hidden sm:block">
              <div
                data-steps-progress
                className="w-full h-full bg-gradient-to-b from-haveli-500 to-haveli-300 rounded-full"
              />
            </div>

            <div className="space-y-4 sm:space-y-6">
              {steps.map((step) => (
                <div
                  key={step.num}
                  data-step-card
                  className="relative flex gap-5 sm:gap-8"
                >
                  {/* Step number */}
                  <div
                    data-step-num
                    className="relative z-10 flex-shrink-0 w-[56px] h-[56px] sm:w-[72px] sm:h-[72px] rounded-2xl bg-gradient-to-br from-haveli-500 to-haveli-700 flex items-center justify-center shadow-xl shadow-haveli-600/20"
                  >
                    <span className="text-white font-bold text-base sm:text-xl">
                      {step.num}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl border border-sand-100 p-5 sm:p-7 hover:shadow-lg hover:border-sand-200 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="hidden sm:flex w-11 h-11 rounded-xl bg-haveli-50 items-center justify-center flex-shrink-0 mt-0.5">
                        <step.icon className="w-5 h-5 text-haveli-600" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-sand-900 mb-1.5">
                          {step.title}
                        </h3>
                        <p className="text-sand-500 text-sm sm:text-base leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======= STATS ======= */}
      <section className="py-16 sm:py-20 px-4 bg-white relative border-y border-sand-100">
        <div className="absolute inset-0 bg-gradient-to-b from-sand-50/50 to-white pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-5xl font-bold bg-gradient-to-br from-haveli-600 to-haveli-800 bg-clip-text text-transparent mb-1.5">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                </p>
                <p className="text-xs sm:text-sm text-sand-500 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= TESTIMONIALS SLIDER ======= */}
      <TestimonialsSlider />

      {/* ======= FINAL CTA ======= */}
      <section className="py-20 sm:py-28 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div
            data-cta-block
            className="relative bg-gradient-to-br from-sand-950 via-sand-900 to-sand-950 rounded-[1.5rem] sm:rounded-[2.5rem] p-8 sm:p-14 md:p-20 overflow-hidden text-center"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-haveli-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-haveli-400/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-haveli-600/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Grid lines */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />

            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-haveli-400 to-haveli-700 flex items-center justify-center mx-auto mb-7 sm:mb-9 shadow-2xl shadow-haveli-600/30">
                <span className="text-white font-bold text-lg sm:text-2xl tracking-tight">LX</span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 sm:mb-5 leading-tight">
                Ready to take control of
                <br className="hidden sm:block" />
                your household finances?
              </h2>

              <p className="text-sand-400 text-sm sm:text-lg max-w-lg mx-auto mb-8 sm:mb-10 leading-relaxed">
                No signup required. No payment ever.
                Just open and start tracking.
              </p>

              {/* Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
                {["100% Free", "No Sign Up", "Works Offline", "Indian Items"].map(
                  (pill) => (
                    <span
                      key={pill}
                      data-cta-pill
                      className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs sm:text-sm font-medium text-sand-300 backdrop-blur-sm"
                    >
                      {pill}
                    </span>
                  )
                )}
              </div>

              <Link
                href="/dashboard"
                className="group relative inline-flex items-center gap-3 px-9 py-4 sm:px-10 sm:py-5 rounded-2xl bg-gradient-to-r from-haveli-500 to-haveli-600 text-white font-semibold text-base sm:text-lg overflow-hidden shadow-2xl shadow-haveli-600/40 hover:shadow-haveli-600/60 active:scale-[0.97] transition-all duration-200"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Managing Your Household
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-haveli-600 to-haveli-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
