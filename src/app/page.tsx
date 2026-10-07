"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MachineCard from "../components/MachineCard";
import BookingModal from "../components/BookingModal";
import ConfirmDialog from "../components/ConfirmDialog";
import ProfileModal from "../components/ProfileModal";
import QueueModal from "../components/QueueModal";
import NotificationDropdown, {
  type AppNotification,
} from "../components/NotificationDropdown";
import type { BookingHistory, CurrentUser, Machine } from "../lib/types";
import type { BookingValues } from "../lib/schemas";

const initial: Machine[] = [
  { id: "W-01", type: "washer", status: "available", remaining: 0, queue: 0 },
  { id: "W-02", type: "washer", status: "in-use", remaining: 10, queue: 0 },
  { id: "W-03", type: "washer", status: "available", remaining: 0, queue: 0 },
  { id: "W-04", type: "washer", status: "broken", remaining: 0, queue: 0 },
  { id: "W-05", type: "washer", status: "in-use", remaining: 10, queue: 1 },
  { id: "D-01", type: "dryer", status: "available", remaining: 0, queue: 0 },
  { id: "D-02", type: "dryer", status: "in-use", remaining: 10, queue: 0 },
  { id: "D-03", type: "dryer", status: "available", remaining: 0, queue: 0 },
  { id: "D-04", type: "dryer", status: "available", remaining: 0, queue: 0 },
  { id: "D-05", type: "dryer", status: "in-use", remaining: 10, queue: 2 },
];
export default function Home() {
  const { data: session } = useSession();
  // State กลางรวม Auth, ธีม และการแจ้งเตือน เพื่อให้ทุกโมดัลใช้งานข้อมูลเดียวกัน
  const [machines, setMachines] = useState(initial),
    [user, setUser] = useState<CurrentUser | null>(null),
    [history, setHistory] = useState<BookingHistory[]>([]),
    [booking, setBooking] = useState<Machine | null>(null),
    [reporting, setReporting] = useState<string | null>(null),
    [queueMachine, setQueueMachine] = useState<Machine | null>(null),
    [profileOpen, setProfileOpen] = useState(false),
    [menuOpen, setMenuOpen] = useState(false),
    [dark, setDark] = useState(false),
    [toast, setToast] = useState(""),
    [notifications, setNotifications] = useState<AppNotification[]>([]),
    [notificationOpen, setNotificationOpen] = useState(false);
  useEffect(() => {
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
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(id);
  }, [toast]);
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
          ? {
              ...m,
              status: "in-use",
              remaining: duration,
              activeByMe: true,
              paidAmount: total,
              pointsUsed: usedPoints,
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
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 lg:flex">
      {user && <Sidebar
        activeMachines={active}
        mobileOpen={menuOpen}
        close={() => setMenuOpen(false)}
        onProfile={() => setProfileOpen(true)}
        onResetAll={() => active.forEach(cancel)}
        onCancel={cancel}
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
                  onCancel={() => cancel(m)}
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
    </div>
  );
}
