export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-neutral-950 px-6 text-center text-white">
      <h1 className="text-3xl font-bold">پرداخت با موفقیت انجام شد</h1>
      <p className="max-w-md text-white/70">
        از خرید شما متشکریم. سفارش شما در حال پردازش است.
      </p>
      <a
        href="/"
        className="mt-4 rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
      >
        بازگشت به فروشگاه
      </a>
    </div>
  );
}
