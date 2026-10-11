"use client";
import { BellRing, CheckCircle2, Wrench, X } from "lucide-react";
export type AppNotification = {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  read: boolean;
  tone?: "success" | "alert";
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
            items.map((item) => {
              // tone ระบุชนิดของเหตุการณ์ จึงแยกสีเติมเงินสำเร็จออกจากการแจ้งปัญหาเครื่องได้
              const success = item.tone === "success";
              return (
              <button
                key={item.id}
                onClick={onRead}
                className={`w-full rounded-2xl border p-3 text-left ${success ? "border-emerald-100 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/60" : "border-rose-100 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/60"}`}
              >
                <span className="flex gap-2">
                  {success ? <CheckCircle2 className="shrink-0 text-emerald-500" size={17} /> : <Wrench className="shrink-0 text-rose-500" size={17} />}
                  <span>
                    <b className={`block text-sm ${success ? "text-emerald-900 dark:text-emerald-100" : "text-rose-900 dark:text-rose-100"}`}>
                      {item.title}
                    </b>
                    <span className={`mt-1 block text-xs ${success ? "text-emerald-700 dark:text-emerald-200" : "text-rose-700 dark:text-rose-200"}`}>
                      {item.detail}
                    </span>
                    <small className={`mt-1 block ${success ? "text-emerald-500" : "text-rose-500"}`}>
                      {item.createdAt}
                    </small>
                  </span>
                </span>
              </button>
              );
            })
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
