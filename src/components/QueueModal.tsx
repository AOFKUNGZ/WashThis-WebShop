"use client";
import { Clock3, Users, X } from "lucide-react";
import type { Machine } from "../lib/types";
import { formatRemainingTime } from "../lib/time";

export default function QueueModal({
  machine,
  onClose,
}: {
  machine: Machine;
  onClose: () => void;
}) {
  const estimatedWait =
    machine.status === "in-use" ? machine.remaining * (machine.queue + 1) : 0;
  // Queue Modal คำนวณเวลารอจากเวลาที่เหลือของรอบปัจจุบันและจำนวนคิวที่มีอยู่
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="รายละเอียดคิว"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              Queue details
            </p>
            <h2 className="mt-1 text-xl font-bold">คิวของ {machine.id}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิด"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
          >
            <X />
          </button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-amber-50 p-4">
            <Users className="text-amber-600" size={20} />
            <p className="mt-2 text-2xl font-extrabold">{machine.queue} คน</p>
            <p className="text-xs text-amber-700">กำลังรอคิว</p>
          </div>
          <div className="rounded-2xl bg-indigo-50 p-4">
            <Clock3 className="text-indigo-600" size={20} />
            <p className="mt-2 text-lg font-extrabold">
              {estimatedWait ? formatRemainingTime(estimatedWait) : "พร้อมใช้"}
            </p>
            <p className="text-xs text-indigo-700">เวลารอโดยประมาณ</p>
          </div>
        </div>
        <p className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
          การประเมินเป็นการจำลองจากรอบที่กำลังทำงานและคิวปัจจุบัน
          เวลาจริงอาจเปลี่ยนแปลงได้
        </p>
      </div>
    </div>
  );
}
