export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-neutral-950 px-6 text-center text-white">
      <h1 className="text-3xl font-bold">پرداخت لغو شد</h1>
      <p className="max-w-md text-white/70">
        هیچ مبلغی از شما دریافت نشد. می‌توانید دوباره تلاش کنید.
      </p>
      <a
        href="/#products"
        className="mt-4 rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
      >
        بازگشت به فروشگاه
      </a>
    </div>
  );
}
