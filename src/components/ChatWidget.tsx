"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { chatSchema, type ChatValues } from "../lib/schemas";
type Message = { id: number; from: "admin" | "user"; text: string };
export default function ChatWidget() {
  const [open, setOpen] = useState(false),
    [messages, setMessages] = useState<Message[]>([
      {
        id: 1,
        from: "admin",
        text: "สวัสดีครับ มีอะไรให้ WashThis! ช่วยไหมครับ?",
      },
    ]);
  const form = useForm<ChatValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" },
  });
  // Chat UI ใช้ state ฝั่งหน้าเว็บจำลองบทสนทนา และใช้ RHF + Zod ป้องกันข้อความว่าง
  const send = ({ message }: ChatValues) => {
    setMessages((all) => [
      ...all,
      { id: Date.now(), from: "user", text: message },
    ]);
    form.reset();
  };
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/40 transition hover:scale-105"
        aria-label="แชตกับผู้ดูแล"
      >
        {open ? <X /> : <MessageCircle />}
      </button>
      {open && (
        <section className="mt-3 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-3xl border border-indigo-200 bg-white shadow-2xl dark:border-indigo-700 dark:bg-slate-900">
          <header className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-4 text-white">
            <b>แชตกับผู้ดูแล</b>
            <p className="text-xs text-indigo-100">
              ปกติตอบกลับภายในไม่กี่นาที
            </p>
          </header>
          <div className="h-64 space-y-3 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
            {messages.map((message) => (
              <p
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.from === "user" ? "ml-auto bg-indigo-600 text-white" : "bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-100"}`}
              >
                {message.text}
              </p>
            ))}
          </div>
          <form
            onSubmit={form.handleSubmit(send)}
            className="flex gap-2 border-t border-slate-100 p-3 dark:border-slate-800"
          >
            <input
              aria-label="ข้อความแชต"
              className="min-w-0 flex-1 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:text-white"
              placeholder="พิมพ์ข้อความ..."
              {...form.register("message")}
            />
            <button className="rounded-xl bg-indigo-600 p-2 text-white">
              <Send size={17} />
            </button>
          </form>
          {form.formState.errors.message && (
            <p className="px-3 pb-2 text-xs text-rose-500">
              {form.formState.errors.message.message}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
