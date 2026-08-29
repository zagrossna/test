import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { products } from "@/lib/products";

export async function POST(request: NextRequest) {
  let productId: string;
  try {
    const body = await request.json();
    productId = body.productId;
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const product = products[productId];
  if (!product) {
    return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });
  }

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
