import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { mapProductRow, type ProductRow } from "@/lib/products";

export async function POST(request: NextRequest) {
  let productId: string;
  try {
    const body = await request.json();
    productId = body.productId;
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const { data, error: dbError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (dbError || !data) {
    return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });
  }

  const product = mapProductRow(data as ProductRow);

  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: product.priceUsdCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { productId: product.id },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe payment intent error:", err);
    return NextResponse.json(
      { error: "خطا در ایجاد جلسه پرداخت." },
      { status: 502 }
    );
  }
}
