"use client";
import { AlertTriangle, X } from "lucide-react";
export default function ConfirmDialog({
  machineId,
  onClose,
  onConfirm,
}: {
  machineId: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-rose-100 text-rose-600">
            <AlertTriangle size={22} />
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400">
            <X size={20} />
          </button>
        </div>
        <h2 className="mt-4 text-lg font-bold">ยืนยันการแจ้งเครื่องเสีย</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          ต้องการแจ้งว่า <b className="text-slate-800">{machineId}</b>{" "}
          มีปัญหาใช่ไหม? เครื่องนี้จะถูกปิดใช้งานชั่วคราว
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white"
          >
            ยืนยันแจ้งเสีย
          </button>
        </div>
      </div>
    </div>
  );
}
