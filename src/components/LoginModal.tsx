"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginValues } from "../lib/schemas";
export default function LoginModal({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: (name: string) => void;
}) {
  // ฟอร์มเข้าสู่ระบบจำลองใช้ RHF และ Zod เพื่อตรวจชื่อก่อนเริ่ม session ผู้ใช้
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { displayName: "" },
  });
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={form.handleSubmit((values) => onLogin(values.displayName))}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
      >
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-indigo-500">
              Welcome back
            </p>
            <h2 className="mt-1 text-xl font-bold dark:text-white">
              เข้าสู่ระบบ
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400">
            <X />
          </button>
        </div>
        <label className="mt-6 block text-sm font-bold dark:text-slate-200">
          ชื่อที่แสดง
          <input
            autoFocus
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="เช่น ออม"
            {...form.register("displayName")}
          />
        </label>
        {form.formState.errors.displayName && (
          <p className="mt-1 text-xs text-rose-500">
            {form.formState.errors.displayName.message}
          </p>
        )}
        <button className="mt-5 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white">
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}
