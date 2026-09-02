import { NextRequest, NextResponse } from "next/server";
import { postProductToFacebook } from "@/lib/facebook";
import { mapProductRow, type ProductRow } from "@/lib/products";

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  const providedSecret = request.headers.get("x-webhook-secret");
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "دسترسی مجاز نیست." }, { status: 401 });
  }

  let record: ProductRow;
  try {
    const body = await request.json();
    if (body.type !== "INSERT" || body.table !== "products" || !body.record) {
      throw new Error("invalid payload");
    }
    record = body.record;
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  try {
    const product = mapProductRow(record);
    await postProductToFacebook(product);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Facebook post error:", err);
    return NextResponse.json(
      { error: "خطا در ارسال پست به فیسبوک." },
      { status: 502 }
    );
  }
}
