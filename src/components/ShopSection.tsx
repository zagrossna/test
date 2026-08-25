"use client";

import { useState } from "react";
import Image from "next/image";
import { products } from "@/lib/products";

export default function ShopSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const product = products["shadow-strike"];

  const handleBuy = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "خطا در شروع پرداخت.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در شروع پرداخت.");
      setLoading(false);
    }
  };

  return (
    <section
      id="products"
      className="relative overflow-hidden bg-neutral-950 px-6 py-20 sm:py-28"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-[120px]" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        {/* Text side */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-right">
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-medium text-white/70 backdrop-blur-md">
            پیشنهاد ویژه
          </span>

          <h2
            className="mt-5 text-5xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-7xl"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Shadow
            <br />
            Strike
          </h2>

          <p className="mt-5 max-w-sm text-sm leading-7 text-white/60 sm:text-base">
            طراحی خاص، راحتی بی‌نظیر. این مدل رو برای کسایی ساختیم که سبک خودشون رو دنبال می‌کنن.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-md">
                <span className="text-lg font-bold text-white">{product.priceTomanDisplay}</span>
              </div>
              <button
                onClick={handleBuy}
                disabled={loading}
                className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "در حال انتقال..." : "خرید آنلاین"}
              </button>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </div>

        {/* Image side */}
        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative aspect-[430/400] w-full max-w-md">
            <Image
              src="/images/featured-shoe.png"
              alt="Shadow Strike sneaker"
              fill
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
