"use client";
import {
  AlertTriangle,
  Clock3,
  Flame,
  ListOrdered,
  SquareX,
  WashingMachine,
} from "lucide-react";
import type { Machine } from "../lib/types";
import { formatRemainingTime } from "../lib/time";
// กำหนดสีธีมมืดแยกตามสถานะ เพื่อคงคอนทราสต์ของข้อความ ปุ่ม และข้อมูลเวลา
const styling = {
  available:
    "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/70",
  "in-use":
    "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/70",
  broken: "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/70",
};
const labels = { available: "ว่าง", "in-use": "กำลังทำงาน", broken: "เสีย" };
export default function MachineCard({
  machine,
  onBook,
  onReport,
  onCancel,
  onQueue,
  isAuthenticated,
}: {
  machine: Machine;
  onBook: () => void;
  onReport: () => void;
  onCancel: () => void;
  onQueue: () => void;
  isAuthenticated: boolean;
}) {
  // ใช้ตัวช่วย formatRemainingTime เพื่อให้ทุกการ์ดแสดงเวลาเป็นชั่วโมง/นาทีตามกติกาเดียวกัน
  return (
    <article
      className={`relative rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${styling[machine.status]} ${isAuthenticated ? "" : "[&>button]:hidden [&>div:last-child]:hidden"}`}
    >
      <button
        onClick={onReport}
        aria-label={`แจ้งเครื่อง ${machine.id} เสีย`}
        className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-rose-600 shadow-sm hover:bg-white dark:bg-slate-800 dark:text-rose-300"
      >
        <AlertTriangle size={15} />
      </button>
      <button
        disabled={machine.status === "broken"}
        onClick={onBook}
        className="w-full text-left disabled:cursor-not-allowed"
      >
        <div className="flex items-start justify-between pr-9">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
            {machine.type === "washer" ? (
              <WashingMachine size={21} />
            ) : (
              <Flame size={21} />
            )}
          </span>
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-bold ${machine.status === "available" ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100" : machine.status === "in-use" ? "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-100" : "bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-100"}`}
          >
            {labels[machine.status]}
          </span>
        </div>
        <p className="mt-4 text-[11px] font-medium text-slate-500 dark:text-slate-300">
          {machine.type === "washer" ? "เครื่องซักผ้า" : "เครื่องอบผ้า"}
        </p>
        <p className="text-lg font-extrabold dark:text-white">{machine.id}</p>
        {machine.status === "in-use" ? (
          <div className="mt-3 flex items-center gap-1.5 text-sm font-bold text-amber-800 dark:text-amber-100">
            <Clock3 size={15} /> เหลือ {formatRemainingTime(machine.remaining)}
          </div>
        ) : (
          <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-100">
            {machine.status === "available"
              ? "กดเพื่อเริ่มจอง"
              : "รอการตรวจสอบ"}
          </p>
        )}
      </button>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={onQueue}
          className="flex items-center justify-center gap-1 rounded-lg bg-white/90 py-2 text-[11px] font-bold text-slate-700 hover:bg-white dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          <ListOrdered size={13} /> ดูคิว
        </button>
        {machine.activeByMe && machine.status === "in-use" ? (
          <button
            onClick={onCancel}
            className="flex items-center justify-center gap-1 rounded-lg bg-rose-600 py-2 text-[11px] font-bold text-white hover:bg-rose-700"
          >
            <SquareX size={13} /> ยกเลิก
          </button>
        ) : (
          <span />
        )}
      </div>
    </article>
  );
}
