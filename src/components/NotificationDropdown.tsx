"use client";
import { BellRing, Wrench, X } from "lucide-react";
export type AppNotification = {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  read: boolean;
};
export default function NotificationDropdown({
  items,
  onClose,
  onRead,
}: {
  items: AppNotification[];
  onClose: () => void;
  onRead: () => void;
}) {
  // รายการแจ้งเตือนรับข้อมูลจาก state กลาง ทำให้การแจ้งเครื่องเสียแสดงทันทีโดยไม่ต้องมี backend
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        aria-label="ปิดการแจ้งเตือน"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/20"
      />
      <section className="absolute right-3 top-16 w-[calc(100%-1.5rem)] max-w-sm rounded-3xl border border-indigo-100 bg-white p-5 shadow-2xl dark:border-indigo-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="text-indigo-500" size={19} />
            <h2 className="font-bold dark:text-white">การแจ้งเตือน</h2>
          </div>
          <button onClick={onClose} className="text-slate-400">
            <X size={19} />
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {items.length ? (
            items.map((item) => (
              <button
                key={item.id}
                onClick={onRead}
                className="w-full rounded-2xl border border-rose-100 bg-rose-50 p-3 text-left dark:border-rose-900 dark:bg-rose-950/60"
              >
                <span className="flex gap-2">
                  <Wrench className="shrink-0 text-rose-500" size={17} />
                  <span>
                    <b className="block text-sm text-rose-900 dark:text-rose-100">
                      {item.title}
                    </b>
                    <span className="mt-1 block text-xs text-rose-700 dark:text-rose-200">
                      {item.detail}
                    </span>
                    <small className="mt-1 block text-rose-500">
                      {item.createdAt}
                    </small>
                  </span>
                </span>
              </button>
            ))
          ) : (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400 dark:bg-slate-800">
              ยังไม่มีการแจ้งเตือน
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
