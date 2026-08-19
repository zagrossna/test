"use client";

import { useRef, useState, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "سلام! من دستیار فروشگاه کفش لوکس هستم. هر سوالی درباره محصولات یا سایت داری بپرس.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error || "مشکلی پیش اومد، دوباره امتحان کن." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "ارتباط برقرار نشد، لطفاً دوباره امتحان کن." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-white/10 bg-neutral-900 px-4 py-3">
            <span className="text-sm font-bold text-white">پشتیبانی کفش لوکس</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="بستن چت"
              className="text-white/60 transition-colors hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                    m.role === "user"
                      ? "bg-white/10 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-red-600/70 px-3 py-2 text-sm text-white">
                  در حال تایپ...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 p-3">
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-50"
            >
              ارسال
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="سوالت رو بنویس..."
              dir="rtl"
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="باز کردن چت پشتیبانی"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transition-transform hover:scale-110"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
