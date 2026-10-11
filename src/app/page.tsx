"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { CircleAlert, X } from "lucide-react";
import { Header, MachineCard, Sidebar } from "../components/DashboardUI";
import BookingModal from "../components/BookingModal";
import ConfirmDialog from "../components/ConfirmDialog";
import ProfileModal from "../components/ProfileModal";
import QueueModal from "../components/QueueModal";
import ChatWidget from "../components/ChatWidget";
import NotificationDropdown, {
  type AppNotification,
} from "../components/NotificationDropdown";
import type { BookingHistory, CurrentUser, Machine } from "../lib/types";
import type { BookingValues } from "../lib/schemas";

// ==========================================
// 1. INITIAL DATA (ข้อมูลตั้งต้น)
// ==========================================
const initial: Machine[] = [
  { id: "W-01", type: "washer", status: "available", remaining: 0, queue: 0 },
  { id: "W-02", type: "washer", status: "in-use", remaining: 10, queue: 0 },
  { id: "W-03", type: "washer", status: "available", remaining: 0, queue: 0 },
  { id: "W-04", type: "washer", status: "broken", remaining: 0, queue: 0 },
  { id: "W-05", type: "washer", status: "in-use", remaining: 10, queue: 1, queueDurations: [60] },
  { id: "D-01", type: "dryer", status: "available", remaining: 0, queue: 0 },
  { id: "D-02", type: "dryer", status: "in-use", remaining: 10, queue: 0 },
  { id: "D-03", type: "dryer", status: "available", remaining: 0, queue: 0 },
  { id: "D-04", type: "dryer", status: "available", remaining: 0, queue: 0 },
  { id: "D-05", type: "dryer", status: "in-use", remaining: 10, queue: 2, queueDurations: [45, 45] },
];

// ==========================================
// 2. PAGE-ONLY UI (คอมโพเนนต์ที่ใช้เฉพาะหน้านี้)
// ==========================================
function CancelConfirmation({ machine, onClose, onConfirm }: { machine: Machine; onClose: () => void; onConfirm: () => void }) {
  // รวม dialog ไว้กับหน้าที่ใช้เพียงแห่งเดียว ลดไฟล์ย่อยโดยไม่เปลี่ยนหน้าตา
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-full bg-amber-100 text-amber-600"><CircleAlert size={22} /></span><button onClick={onClose} className="text-slate-400"><X /></button></div><h2 className="mt-4 text-lg font-bold dark:text-white">ยืนยันการยกเลิก?</h2><p className="mt-2 text-sm leading-6 text-slate-500">ต้องการยกเลิก <b>{machine.id}</b> ใช่ไหม? คุณจะได้รับเงินและคะแนนคืนเต็มจำนวน</p><div className="mt-6 flex gap-3"><button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold dark:border-slate-700 dark:text-white">กลับ</button><button onClick={onConfirm} className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white">ยืนยันยกเลิก</button></div></div></div>;
}

export default function Home() {
  // ==========================================
  // 2. STATE MANAGEMENT & HOOKS (การจัดการสถานะ)
  // ==========================================
  const { data: session } = useSession();
  // State กลางรวม Auth, ธีม และการแจ้งเตือน เพื่อให้ทุกโมดัลใช้งานข้อมูลเดียวกัน
  const [machines, setMachines] = useState(initial),
    [user, setUser] = useState<CurrentUser | null>(null),
    [history, setHistory] = useState<BookingHistory[]>([]),
    [booking, setBooking] = useState<Machine | null>(null),
    [reporting, setReporting] = useState<string | null>(null),
    [cancelling, setCancelling] = useState<Machine | null>(null),
    [queueMachine, setQueueMachine] = useState<Machine | null>(null),
    [profileOpen, setProfileOpen] = useState(false),
    [menuOpen, setMenuOpen] = useState(false),
    [dark, setDark] = useState(false),
    [toast, setToast] = useState(""),
    [notifications, setNotifications] = useState<AppNotification[]>([]),
    [notificationOpen, setNotificationOpen] = useState(false);
  useEffect(() => {
    // Session เป็นข้อมูลภายนอก จึง sync เข้าสู่ state ที่แก้ไขยอดเงิน/โปรไฟล์ต่อได้
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(
      session?.user
        ? {
            id: session.user.email ?? "google-user",
            displayName: session.user.name ?? session.user.email ?? "ผู้ใช้งาน",
            balance: 120,
            points: 2500,
          }
        : null,
    );
  }, [session]);
  const active = useMemo(
    () => machines.filter((m) => m.activeByMe && m.status === "in-use"),
    [machines],
  );
  useEffect(() => {
    // setInterval ลดเวลาทีละ 1 นาที และเริ่มคิวถัดไปอัตโนมัติเมื่อรอบปัจจุบันจบ
    const timer = window.setInterval(() => {
      setMachines((all) => all.map((machine) => {
        if (machine.status !== "in-use") return machine;
        if (machine.remaining > 1) return { ...machine, remaining: machine.remaining - 1 };
        const [nextDuration, ...remainingQueue] = machine.queueDurations ?? [];
        return nextDuration
          ? { ...machine, remaining: nextDuration, queue: remainingQueue.length, queueDurations: remainingQueue, activeByMe: false }
          : { ...machine, status: "available", remaining: 0, queue: 0, queueDurations: [], activeByMe: false };
      }));
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  // ==========================================
  // 3. BUSINESS ACTIONS (การทำงานของการจอง)
  // ==========================================
  // คืนเงินและแต้มเต็มจำนวนก่อนรีเซ็ตเครื่องให้กลับเป็นสถานะว่าง
  const cancel = (machine: Machine) => {
    if (!user) return;
    const money = machine.paidAmount ?? 0,
      points = machine.pointsUsed ?? 0;
    setUser(
      (u) =>
        u && { ...u, balance: u.balance + money, points: u.points + points },
    );
    setMachines((all) =>
      all.map((m) =>
        m.id === machine.id
          ? {
              ...m,
              status: "available",
              remaining: 0,
              activeByMe: false,
              paidAmount: undefined,
              pointsUsed: undefined,
            }
          : m,
      ),
    );
    setToast(`คืนเงิน ฿${money} และ ${points} แต้มแล้ว`);
  };
  // กฎหนึ่งเครื่องต่อผู้ใช้ถูกตรวจซ้ำก่อนเปิดฟอร์มและก่อนยืนยันการจอง
  const tryBook = (machine: Machine) => {
    if (!user) {
      setToast("กรุณาเข้าสู่ระบบก่อนจอง");
      return;
    }
    if (active.length) {
      setToast("คุณใช้งานเครื่องอยู่แล้ว");
      return;
    }
    if (machine.status !== "broken") setBooking(machine);
  };
  const book = (v: BookingValues, total: number, usedPoints: number) => {
    if (!user || active.length) return;
    const duration = v.service === "washer" ? 60 : 45 + v.extraMinutes;
    setUser(
      (u) =>
        u && {
          ...u,
          balance: u.balance - total,
          points: u.points - usedPoints,
        },
    );
    setMachines((all) =>
      all.map((m) =>
        m.id === v.machineId
          ? m.status === "in-use"
            // คิวเก็บ duration ของแต่ละคน เพื่อให้ totalWaitTime รวมเวลารอได้ถูกต้อง
            ? { ...m, queue: m.queue + 1, queueDurations: [...(m.queueDurations ?? []), duration] }
            : {
              ...m,
              status: "in-use",
              remaining: duration,
              activeByMe: true,
              paidAmount: total,
              pointsUsed: usedPoints,
              queueDurations: [],
            }
          : m,
      ),
    );
    setHistory((all) => [
      {
        id: String(Date.now()),
        machineId: v.machineId,
        service: v.service,
        total,
        date: new Intl.DateTimeFormat("th-TH", {
          day: "numeric",
          month: "short",
        }).format(new Date()),
      },
      ...all,
    ]);
    setBooking(null);
    setToast(`เริ่มใช้งาน ${v.machineId} แล้ว`);
  };
  // เมื่อยืนยันแจ้งเสีย จะสร้าง notification ให้กดดูรายละเอียดผ่านกระดิ่งบน Header
  const confirmReport = () => {
    if (!reporting) return;
    const id = reporting;
    setMachines((all) =>
      all.map((m) =>
        m.id === id
          ? { ...m, status: "broken", remaining: 0, activeByMe: false }
          : m,
      ),
    );
    setNotifications((all) => [
      {
        id: String(Date.now()),
        title: `เครื่อง ${id} แจ้งเสีย`,
        detail: `มีผู้ใช้งานแจ้งปัญหา กรุณาตรวจสอบเครื่อง ${id}`,
        createdAt: "เมื่อสักครู่",
        read: false,
      },
      ...all,
    ]);
    setReporting(null);
    setToast(`ส่งแจ้งซ่อม ${id} แล้ว`);
  };

  // ==========================================
  // 4. PAGE COMPOSITION (โครงสร้างหน้าจอ)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 lg:flex">
      {user && <Sidebar
        activeMachines={active}
        mobileOpen={menuOpen}
        close={() => setMenuOpen(false)}
        onProfile={() => setProfileOpen(true)}
        onResetAll={() => active.forEach(cancel)}
        onCancel={setCancelling}
      />}
      {user && menuOpen && (
        <button
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
        />
      )}
      <div className="min-w-0 flex-1">
        <Header
          user={user}
          unreadCount={notifications.filter((n) => !n.read).length}
          onMenu={() => setMenuOpen(true)}
          onProfile={() => setProfileOpen(true)}
          onNotifications={() => setNotificationOpen(true)}
          dark={dark}
          onThemeToggle={() => setDark((value) => !value)}
        />
        <main className="p-4 sm:p-7">
          <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-lg shadow-indigo-500/20 sm:p-8">
            <p className="text-sm text-indigo-100">WashThis! · Smart Laundry</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              ซักง่าย สดใส ทุกวัน
            </h1>
            <p className="mt-3 text-sm text-indigo-100">
              {user
                ? `สวัสดี คุณ${user.displayName}`
                : "เข้าสู่ระบบเพื่อเริ่มจองเครื่อง"}
            </p>
          </section>
          <section id="machines" className="mt-7">
            <h2 className="text-xl font-bold">เครื่องทั้งหมด</h2>
            <p className="mt-1 text-sm text-slate-500">
              10 เครื่อง · สถานะอัปเดตแบบเรียลไทม์
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
              {machines.map((m) => (
                <MachineCard
                  key={m.id}
                  machine={m}
                  onBook={() => tryBook(m)}
                  onReport={() => setReporting(m.id)}
                  onCancel={() => setCancelling(m)}
                  onQueue={() => setQueueMachine(m)}
                  isAuthenticated={Boolean(user)}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
      {booking && user && (
        <BookingModal
          machine={booking}
          balance={user.balance}
          points={user.points}
          onClose={() => setBooking(null)}
          onBook={book}
        />
      )}{" "}
      {reporting && (
        <ConfirmDialog
          machineId={reporting}
          onClose={() => setReporting(null)}
          onConfirm={confirmReport}
        />
      )}{" "}
      {cancelling && <CancelConfirmation machine={cancelling} onClose={() => setCancelling(null)} onConfirm={() => { cancel(cancelling); setCancelling(null); }} />}{" "}
      {queueMachine && (
        <QueueModal
          machine={queueMachine}
          onClose={() => setQueueMachine(null)}
        />
      )}{" "}
      {profileOpen && user && (
        <ProfileModal
          user={user}
          history={history}
          onClose={() => setProfileOpen(false)}
          onTopUp={(amount) =>
            setUser((u) => u && { ...u, balance: u.balance + amount })
          }
          onClearHistory={() => setHistory([])}
          onUpdateName={(displayName) => setUser((current) => current && { ...current, displayName })}
        />
      )}{" "}
      {notificationOpen && (
        <NotificationDropdown
          items={notifications}
          onClose={() => setNotificationOpen(false)}
          onRead={() =>
            setNotifications((all) => all.map((n) => ({ ...n, read: true })))
          }
        />
      )}{" "}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-5 z-[60] rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white shadow-2xl"
        >
          ✓ {toast}
        </div>
      )}
      <ChatWidget />
    </div>
  );
}
