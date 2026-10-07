"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { bookingSchema, type BookingValues } from "../lib/schemas";

type Machine = {
  id: string;
  type: "washer" | "dryer";
  status: "available" | "in-use" | "broken";
  remaining: number;
  queue: number;
};

export default function BookingForm({
  machines,
  balance,
  points,
  selectedMachine,
  setSelectedMachine,
  onBook,
}: {
  machines: Machine[];
  balance: number;
  points: number;
  selectedMachine: string;
  setSelectedMachine: (id: string) => void;
  onBook: (values: BookingValues, total: number, discount: number) => void;
}) {
  // RHF เชื่อม Zod เพื่อให้กฎของฟอร์มอยู่รวมกันและแสดง error ใกล้ช่องกรอก
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: "washer",
      machineId: selectedMachine,
      extraMinutes: 0,
      usePoints: false,
    },
  });
  const service = watch("service");
  const extra = watch("extraMinutes");
  const usePoints = watch("usePoints");
  useEffect(() => {
    setValue("machineId", selectedMachine);
  }, [selectedMachine, setValue]);
  useEffect(() => {
    setSelectedMachine("");
    setValue("machineId", "");
    setValue("extraMinutes", 0);
  }, [service, setSelectedMachine, setValue]);
  // ซักราคา 30 บาทคงที่ ส่วนอบเริ่ม 45 บาท แล้วเพิ่มทุก 5 นาทีเป็น 10 บาท
  const base = service === "washer" ? 30 : 45;
  const extraCost = service === "dryer" ? Math.ceil(extra / 5) * 10 : 0;
  const discount = usePoints && points >= 1000 ? 10 : 0;
  const total = Math.max(0, base + extraCost - discount);
  const available = machines.filter(
    (m) => m.type === service && m.status !== "broken",
  );
  const submit = (values: BookingValues) => {
    if (total > balance) {
      alert("ยอดเงินใน Wallet ไม่เพียงพอ กรุณาเติมเงินก่อน");
      return;
    }
    onBook(values, total, discount);
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <label
          className={`cursor-pointer rounded-2xl border p-3 ${service === "washer" ? "border-[#161b2f] bg-[#f1f3ff]" : "border-slate-100"}`}
        >
          <input
            className="sr-only"
            type="radio"
            value="washer"
            {...register("service")}
          />
          <span className="text-lg">◌</span>
          <span className="ml-2 text-sm font-bold">ซักผ้า</span>
          <small className="mt-1 block text-slate-500">60 นาที · ฿30</small>
        </label>
        <label
          className={`cursor-pointer rounded-2xl border p-3 ${service === "dryer" ? "border-[#161b2f] bg-[#f1f3ff]" : "border-slate-100"}`}
        >
          <input
            className="sr-only"
            type="radio"
            value="dryer"
            {...register("service")}
          />
          <span className="text-lg">♨</span>
          <span className="ml-2 text-sm font-bold">อบแห้ง</span>
          <small className="mt-1 block text-slate-500">45 นาที · ฿45</small>
        </label>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-bold">เลือกเครื่อง</p>
          <span className="text-xs text-slate-400">
            เลือกได้ทั้งคิวปัจจุบัน/ล่วงหน้า
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {available.map((m) => (
            <button
              type="button"
              key={m.id}
              onClick={() => setSelectedMachine(m.id)}
              className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-bold ${selectedMachine === m.id ? "border-[#161b2f] bg-[#161b2f] text-white" : "border-slate-200"}`}
            >
              {m.id}{" "}
              {m.status === "in-use" && (
                <span className="ml-1 text-xs">({m.remaining}น.)</span>
              )}
            </button>
          ))}
        </div>
        {errors.machineId && (
          <p className="mt-1 text-xs text-rose-500">
            {errors.machineId.message}
          </p>
        )}
      </div>
      {service === "dryer" && (
        <div>
          <div className="flex justify-between text-sm">
            <label className="font-bold">เพิ่มเวลาอบ</label>
            <span className="font-bold text-[#4b55ca]">+{extra} นาที</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="5"
            className="mt-3 w-full accent-[#4b55ca]"
            {...register("extraMinutes", { valueAsNumber: true })}
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>45 นาที</span>
            <span>75 นาที</span>
          </div>
        </div>
      )}
      <label
        className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3 ${points >= 1000 ? "border-violet-100 bg-violet-50" : "border-slate-100 bg-slate-50 opacity-60"}`}
      >
        <span>
          <span className="text-sm font-bold">ใช้ 1,000 คะแนน</span>
          <small className="block text-xs text-slate-500">
            รับส่วนลด 10 บาท
          </small>
        </span>
        <input
          type="checkbox"
          disabled={points < 1000}
          className="h-4 w-4 accent-[#4b55ca]"
          {...register("usePoints")}
        />
      </label>
      <div className="rounded-2xl bg-[#161b2f] p-4 text-white">
        <div className="flex justify-between text-sm text-slate-300">
          <span>ยอดชำระ</span>
          <span>{base + extraCost} บาท</span>
        </div>
        {discount > 0 && (
          <div className="mt-1 flex justify-between text-sm text-emerald-300">
            <span>ส่วนลดคะแนน</span>
            <span>-{discount} บาท</span>
          </div>
        )}
        <div className="mt-3 flex items-end justify-between">
          <span className="text-sm font-medium">รวมสุทธิ</span>
          <span className="text-2xl font-bold">฿{total}</span>
        </div>
      </div>
      <button className="w-full rounded-2xl bg-[#5761d8] py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#454fca]">
        ยืนยันการจอง · Wallet ฿{balance}
      </button>
    </form>
  );
}
