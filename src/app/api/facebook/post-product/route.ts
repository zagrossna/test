import { NextRequest, NextResponse } from "next/server";
import { postProductToFacebook, postProductToInstagram } from "@/lib/facebook";
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

  const product = mapProductRow(record);

  const [facebookResult, instagramResult] = await Promise.allSettled([
    postProductToFacebook(product),
    postProductToInstagram(product),
  ]);

  if (facebookResult.status === "rejected") {
    console.error("Facebook post error:", facebookResult.reason);
  }
  if (instagramResult.status === "rejected") {
    console.error("Instagram post error:", instagramResult.reason);
  }

  if (facebookResult.status === "rejected" && instagramResult.status === "rejected") {
    return NextResponse.json(
      { error: "خطا در ارسال پست به فیسبوک و اینستاگرام." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    facebook: facebookResult.status === "fulfilled",
    instagram: instagramResult.status === "fulfilled",
  });
}
