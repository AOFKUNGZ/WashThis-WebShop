"use client";
import { LayoutGrid, RotateCcw, UserRound, WashingMachine } from "lucide-react";
import type { Machine } from "../lib/types";
import { formatRemainingTime } from "../lib/time";
export default function Sidebar({
  activeMachines,
  mobileOpen,
  close,
  onProfile,
  onResetAll,
  onCancel,
}: {
  activeMachines: Machine[];
  mobileOpen: boolean;
  close: () => void;
  onProfile: () => void;
  onResetAll: () => void;
  onCancel: (machine: Machine) => void;
}) {
  // แสดงเครื่องของผู้ใช้จาก state กลาง เพื่อให้การยกเลิกและคืนยอดสะท้อนทุกส่วนของหน้าจอทันที
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white p-5 transition-transform dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
    >
      <div className="flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-xl text-white">
          ✦
        </div>
        <div>
          <p className="font-extrabold">
            SUDSAP<span className="text-indigo-400">Laundry</span>
          </p>
          <p className="text-[11px] text-slate-400">สะอาด · สะดวก · สบาย</p>
        </div>
      </div>
      <nav className="mt-9 space-y-1">
        <a
          href="#machines"
          onClick={close}
          className="flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 text-sm font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200"
        >
          <LayoutGrid size={18} /> สถานะเครื่อง
        </a>
        <button
          onClick={() => {
            close();
            onProfile();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <UserRound size={18} /> โปรไฟล์ของฉัน
        </button>
      </nav>
      <div className="mt-8">
        <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          My Active Machines
        </p>
        <p className="mt-1 px-2 text-xs text-slate-400">
          เครื่องซักผ้าที่ฉันกำลังใช้งานอยู่
        </p>
        <div className="mt-3 space-y-2">
          {activeMachines.length ? (
            activeMachines.map((machine) => (
              <div
                key={machine.id}
                className="rounded-xl border border-amber-100 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950"
              >
                <div className="flex justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <WashingMachine size={15} /> {machine.id}
                  </span>
                  <button
                    onClick={() => onCancel(machine)}
                    className="rounded-md bg-rose-600 px-2 py-1 text-[10px] font-bold text-white"
                  >
                    ยกเลิก
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">
                  เหลือ {formatRemainingTime(machine.remaining)} ·
                  คืนเงินเต็มจำนวน
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-400 dark:bg-slate-800">
              ยังไม่มีเครื่องที่ใช้งานอยู่
            </div>
          )}
        </div>
        {activeMachines.length > 0 && (
          <button
            onClick={onResetAll}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300"
          >
            <RotateCcw size={14} /> รีเซ็ตเครื่องทั้งหมดของฉัน
          </button>
        )}
      </div>
    </aside>
  );
}
