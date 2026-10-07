"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { bookingSchema, type BookingValues } from "../lib/schemas";
import type { Machine } from "../lib/types";
export default function BookingModal({
  machine,
  balance,
  points,
  onClose,
  onBook,
}: {
  machine: Machine;
  balance: number;
  points: number;
  onClose: () => void;
  onBook: (v: BookingValues, total: number, usedPoints: number) => void;
}) {
  // RHF + Zod เป็นด่านตรวจข้อมูลทุกช่องก่อนส่งยอดจองกลับสู่ state กลาง
  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: machine.type,
      machineId: machine.id,
      extraMinutes: 0,
      detergent: false,
      softener: false,
      pointsToUse: 0,
      usePoints: false,
    },
  });
  const service = form.watch("service"),
    extra = form.watch("extraMinutes"),
    detergent = form.watch("detergent"),
    softener = form.watch("softener"),
    requestedPoints = form.watch("pointsToUse");
  const validPoints = Math.min(Math.max(0, requestedPoints || 0), points);
  // แต้มใช้เป็นชุดละ 1,000 แต้มต่อส่วนลด 10 บาท จึงคำนวณด้วย floor ได้เหมือนกันทั้งซักและอบ
  const usedPoints = Math.floor(validPoints / 1000) * 1000;
  const discount = (usedPoints / 1000) * 10;
  const base = service === "washer" ? 30 : 45;
  const dryerExtra = service === "dryer" ? (extra / 5) * 10 : 0;
  // Add-ons ใช้ได้เฉพาะซักผ้า และถูกตัดออกจากยอดทันทีเมื่อเลือกอบแห้ง
  const addOns =
    service === "washer" ? (detergent ? 5 : 0) + (softener ? 5 : 0) : 0;
  const total = Math.max(0, base + dryerExtra + addOns - discount);
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              New booking
            </p>
            <h2 className="mt-1 text-xl font-bold dark:text-white">
              จอง {machine.id}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400">
            <X />
          </button>
        </div>
        <form
          onSubmit={form.handleSubmit((values) => {
            if (validPoints !== requestedPoints)
              form.setError("pointsToUse", {
                message: "แต้มที่ใช้เกินยอดที่มี",
              });
            else if (total <= balance) onBook(values, total, usedPoints);
          })}
          className="mt-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`rounded-xl border p-3 ${service === "washer" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950" : "border-slate-200 dark:border-slate-700"}`}
            >
              <input
                className="sr-only"
                type="radio"
                value="washer"
                {...form.register("service")}
              />
              <b className="text-sm dark:text-white">ซักผ้า</b>
              <small className="mt-1 block text-slate-500">60 นาที · ฿30</small>
            </label>
            <label
              className={`rounded-xl border p-3 ${service === "dryer" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950" : "border-slate-200 dark:border-slate-700"}`}
            >
              <input
                className="sr-only"
                type="radio"
                value="dryer"
                {...form.register("service")}
              />
              <b className="text-sm dark:text-white">อบแห้ง</b>
              <small className="mt-1 block text-slate-500">45 นาที · ฿45</small>
            </label>
          </div>
          {service === "washer" && (
            <div className="space-y-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm font-bold dark:text-white">ตัวเลือกเพิ่ม</p>
              <label className="flex justify-between text-sm dark:text-slate-200">
                <span>น้ำยาซักผ้า +฿5</span>
                <input type="checkbox" {...form.register("detergent")} />
              </label>
              <label className="flex justify-between text-sm dark:text-slate-200">
                <span>น้ำยาปรับผ้านุ่ม +฿5</span>
                <input type="checkbox" {...form.register("softener")} />
              </label>
            </div>
          )}
          {service === "dryer" && (
            <div>
              <div className="flex justify-between text-sm dark:text-white">
                <b>เพิ่มเวลาอบ</b>
                <span>+{extra} นาที</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                className="mt-3 w-full accent-indigo-600"
                {...form.register("extraMinutes", { valueAsNumber: true })}
              />
            </div>
          )}
          <label className="block text-sm font-bold dark:text-white">
            ใช้แต้มลดราคา
            <input
              type="number"
              min="0"
              step="1000"
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              {...form.register("pointsToUse", { valueAsNumber: true })}
            />
            <small className="mt-1 block font-normal text-slate-500">
              มี {points.toLocaleString()} แต้ม · ทุก 1,000 แต้ม ลด ฿10
            </small>
          </label>
          {form.formState.errors.pointsToUse && (
            <p className="text-xs text-rose-500">
              {form.formState.errors.pointsToUse.message}
            </p>
          )}
          <div className="rounded-2xl bg-slate-900 p-4 text-white">
            <div className="flex justify-between text-sm text-slate-300">
              <span>ยอดก่อนลด</span>
              <span>฿{base + dryerExtra + addOns}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm text-emerald-300">
              <span>ลดจากแต้ม</span>
              <span>-฿{discount}</span>
            </div>
            <div className="mt-3 flex justify-between text-lg font-bold">
              <span>รวมสุทธิ</span>
              <span>฿{total}</span>
            </div>
          </div>
          {total > balance && (
            <p className="text-xs text-rose-500">
              Wallet ไม่เพียงพอ กรุณาเติมเงินก่อน
            </p>
          )}
          <button
            disabled={total > balance}
            className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white disabled:opacity-40"
          >
            ยืนยันการจอง · ฿{total}
          </button>
        </form>
      </div>
    </div>
  );
}
