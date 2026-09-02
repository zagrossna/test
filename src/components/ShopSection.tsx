import { supabase } from "@/lib/supabase";
import { mapProductRow, type ProductRow } from "@/lib/products";
import ProductCard from "./ProductCard";

export default async function ShopSection() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  const products =
    error || !data ? [] : data.map((row) => mapProductRow(row as ProductRow));

  return (
    <section
      id="products"
      className="relative overflow-hidden bg-neutral-950 px-6 py-20 sm:py-28"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-medium text-white/70 backdrop-blur-md">
            پیشنهاد ویژه
          </span>
          <h2
            className="mt-5 text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            محصولات ما
          </h2>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-white/60">
            در حال حاضر محصولی موجود نیست.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
