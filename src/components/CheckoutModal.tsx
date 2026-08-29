"use client";

import { useState, type FormEvent } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { getStripeClient } from "@/lib/stripe-client";

function PaymentForm({ onClose }: { onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "پرداخت ناموفق بود.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="flex-1 rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "در حال پردازش..." : "پرداخت"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}

export default function CheckoutModal({
  clientSecret,
  onClose,
}: {
  clientSecret: string;
  onClose: () => void;
}) {
  let stripePromise: ReturnType<typeof getStripeClient> | null = null;
  let configError: string | null = null;
  try {
    stripePromise = getStripeClient();
  } catch (err) {
    configError = err instanceof Error ? err.message : "خطا در بارگذاری درگاه پرداخت.";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
        <div className="mb-5 flex shrink-0 items-center justify-between">
          <h3 className="text-lg font-bold text-white">تکمیل پرداخت</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-white/50 transition-colors hover:text-white"
            aria-label="بستن"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto">
          {configError ? (
            <p className="text-sm text-red-400">{configError}</p>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: "night" } }}
            >
              <PaymentForm onClose={onClose} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
