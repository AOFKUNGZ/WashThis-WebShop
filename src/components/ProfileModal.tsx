"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trophy, WalletCards, X } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  topUpSchema,
  type TopUpValues,
} from "../lib/schemas";
import type { BookingHistory, CurrentUser } from "../lib/types";
export default function ProfileModal({
  user,
  history,
  onClose,
  onTopUp,
  onClearHistory,
}: {
  user: CurrentUser;
  history: BookingHistory[];
  onClose: () => void;
  onTopUp: (amount: number) => void;
  onClearHistory: () => void;
}) {
  // ทั้งฟอร์มชื่อและเติมเงินตรวจด้วย RHF + Zod ก่อนแก้ state ผู้ใช้
  const topUpForm = useForm<TopUpValues>({
    resolver: zodResolver(topUpSchema),
  });
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              My account
            </p>
            <h2 className="mt-1 text-2xl font-extrabold dark:text-white">
              โปรไฟล์ของฉัน
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400">
            <X />
          </button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-950">
            <WalletCards size={16} className="text-indigo-500" />
            <p className="mt-2 text-2xl font-bold text-indigo-950 dark:text-indigo-100">
              ฿{user.balance}
            </p>
            <small className="text-indigo-500">Wallet</small>
          </div>
          <div className="rounded-2xl bg-violet-50 p-4 dark:bg-violet-950">
            <Trophy size={16} className="text-violet-500" />
            <p className="mt-2 text-2xl font-bold text-violet-950 dark:text-violet-100">
              {user.points.toLocaleString()} pts
            </p>
            <small className="text-violet-500">Points</small>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-bold dark:text-white">
              ชื่อที่แสดง
            </label>
            <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              {user.displayName}
            </p>
            <p className="mt-1 text-xs text-slate-400">ชื่อนี้มาจากบัญชี Google ของคุณ</p>
          </div>
          <form
            onSubmit={topUpForm.handleSubmit((value) => {
              onTopUp(value.amount);
              topUpForm.reset();
            })}
          >
            <label className="text-sm font-bold dark:text-white">
              เติมเงิน Wallet
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="ขั้นต่ำ ฿20"
                {...topUpForm.register("amount", { valueAsNumber: true })}
              />
              <button className="rounded-xl bg-indigo-600 px-3 text-white">
                <Plus size={15} />
              </button>
            </div>
            {topUpForm.formState.errors.amount && (
              <p className="mt-1 text-xs text-rose-500">
                {topUpForm.formState.errors.amount.message}
              </p>
            )}
          </form>
        </div>
        <section className="mt-7 border-t border-slate-100 pt-5 dark:border-slate-800">
          <div className="flex justify-between">
            <h3 className="font-bold dark:text-white">ประวัติการจอง</h3>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs font-bold text-rose-600"
              >
                ล้างประวัติ
              </button>
            )}
          </div>
          <div className="mt-3 space-y-2">
            {history.length ? (
              history.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800 dark:text-slate-200"
                >
                  <span>
                    <b>{item.machineId}</b> ·{" "}
                    {item.service === "washer" ? "ซักผ้า" : "อบผ้า"}
                  </span>
                  <span>
                    ฿{item.total}{" "}
                    <small className="text-slate-400">{item.date}</small>
                  </span>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400 dark:bg-slate-800">
                ยังไม่มีประวัติการจอง
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
