import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `تو دستیار پشتیبانی آنلاین فروشگاه "کفش لوکس" هستی، یک فروشگاه اینترنتی کفش.
اطلاعات فروشگاه:
- نام فروشگاه: کفش لوکس
- بخش‌های سایت: خانه، محصولات، درباره ما، تماس با ما
- محصول ویژه فعلی: کفش مدل Shadow Strike با قیمت ۲,۹۵۰,۰۰۰ تومان، با طراحی خاص و راحتی بالا
همیشه به زبان فارسی و کوتاه، دوستانه و مفید جواب بده. اگر سوالی خارج از حوزه فروشگاه یا کفش پرسیده شد، مؤدبانه بگو که فقط می‌تونی درباره فروشگاه و محصولاتش کمک کنی. اگر اطلاعات دقیقی از چیزی نداری، صادقانه بگو و پیشنهاد بده از طریق بخش «تماس با ما» بپرسند.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "چت‌بات پیکربندی نشده است." },
      { status: 500 }
    );
  }

  let messages: ChatMessage[];
  try {
    const body = await request.json();
    messages = body.messages;
    if (!Array.isArray(messages)) throw new Error("invalid");
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const recent = messages.slice(-20);
  const firstUserIdx = recent.findIndex((m) => m.role === "user");
  const conversation = firstUserIdx === -1 ? [] : recent.slice(firstUserIdx);

  const contents = conversation.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content ?? "").slice(0, 2000) }],
  }));

  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      }),
    }
  );

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "خطا در ارتباط با سرویس چت." },
      { status: 502 }
    );
  }

  const data = await upstream.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const reply: string = parts.map((p: { text?: string }) => p.text ?? "").join("");

  return NextResponse.json({ reply });
}
