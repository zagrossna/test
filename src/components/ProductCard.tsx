"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import CheckoutModal from "./CheckoutModal";

export default function ProductCard({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

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
      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error || "خطا در شروع پرداخت.");
      }
      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در شروع پرداخت.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="relative aspect-[4/3] w-full bg-neutral-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-6"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          {product.name}
        </h3>
        <p className="flex-1 text-sm leading-6 text-white/60">{product.description}</p>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white">
            {product.priceTomanDisplay}
          </span>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "در حال آماده‌سازی..." : "خرید آنلاین"}
          </button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {clientSecret && (
        <CheckoutModal
          clientSecret={clientSecret}
          onClose={() => setClientSecret(null)}
        />
      )}
    </div>
  );
}
