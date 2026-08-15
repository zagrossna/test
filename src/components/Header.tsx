"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#home", label: "خانه" },
  { href: "#products", label: "محصولات" },
  { href: "#about", label: "درباره ما" },
  { href: "#contact", label: "تماس با ما" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="home"
      className="relative flex min-h-[92vh] w-full flex-col overflow-hidden"
    >
      {/* Video background */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/header-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55" />

      {/* Glass navbar */}
      <div
        className={`sticky top-0 z-30 mx-auto mt-4 w-[92%] max-w-6xl rounded-2xl border border-white/20 px-5 py-3 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "bg-white/15 shadow-lg shadow-black/10" : "bg-white/10"
        }`}
      >
        <nav className="flex items-center justify-between">
          <Link href="#home" className="text-xl font-bold tracking-tight text-white">
            کفش<span className="text-white/70">لوکس</span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-white/90 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <button className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20">
              ورود
            </button>
            <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90">
              فروشگاه
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="باز کردن منو"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md md:hidden"
          >
            <span className="sr-only">منو</span>
            <div className="flex flex-col gap-1.5">
              <span
                className={`h-0.5 w-5 bg-white transition-transform ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 bg-white transition-opacity ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-5 bg-white transition-transform ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mt-3 flex flex-col gap-3 border-t border-white/20 pt-3 md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex gap-3">
              <button className="flex-1 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                ورود
              </button>
              <button className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
                فروشگاه
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md rounded-2xl border border-white/20 bg-white/10 px-6 py-6 backdrop-blur-2xl sm:px-8 sm:py-7">
          <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            جدیدترین مدل‌های <span className="text-white/80">کفش</span>
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-white/80 sm:text-base">
            کیفیت، راحتی و استایل؛ همه در یک جا. کالکشن جدید ما رو ببین.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <button className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105">
              مشاهده محصولات
            </button>
            <button className="rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20">
              بیشتر بدانید
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
