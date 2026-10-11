"use client";

import {
  AlertTriangle,
  Bell,
  Clock3,
  Flame,
  LayoutGrid,
  ListOrdered,
  LogIn,
  Menu,
  RotateCcw,
  SquareX,
  Trophy,
  UserRound,
  WalletCards,
  WashingMachine,
} from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import type { ReactNode } from "react";
import { formatRemainingTime, totalWaitTime } from "../lib/time";
import type { CurrentUser, Machine } from "../lib/types";

// ==========================================
// 1. HEADER (แถบข้อมูลผู้ใช้และการควบคุม)
// ==========================================
type HeaderProps = {
  user: CurrentUser | null;
  unreadCount: number;
  onMenu: () => void;
  onProfile: () => void;
  onNotifications: () => void;
};
export function Header({
  user,
  unreadCount,
  onMenu,
  onProfile,
  onNotifications,
}: HeaderProps) {
  // แสดงข้อมูลจาก state กลาง จึงเปลี่ยนยอดเงิน แต้ม และชื่อทันทีโดยไม่เก็บ state ซ้ำ
  return (
    <header className="flex items-center justify-between gap-2 border-b border-indigo-100 bg-white px-4 py-3 dark:border-indigo-900 dark:bg-slate-900 sm:px-7">
      {user && (
        <button
          onClick={onMenu}
          className="rounded-xl p-2 text-slate-600 dark:text-indigo-200 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      )}
      <div className="flex items-center gap-2">
        <WashingMachine
          className="text-indigo-600 dark:text-cyan-300"
          size={25}
        />
        <div>
          <p className="font-black tracking-tight text-slate-900 dark:text-white">
            Wash
            <span className="text-fuchsia-600 dark:text-fuchsia-400">
              This!
            </span>
          </p>
          <p className="hidden text-[10px] text-slate-400 sm:block">
            สะอาดง่าย ในทุกวัน
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {false && <button
          onClick={() => undefined}
          aria-label="สลับโหมดสี"
          className="rounded-xl bg-slate-100 p-2.5 text-slate-600 dark:bg-slate-800 dark:text-amber-300"
        >
          {null}
        </button>}
        {user ? (
          <>
            <button
              onClick={onNotifications}
              aria-label="Notifications"
              className="relative rounded-xl bg-fuchsia-50 p-2.5 text-fuchsia-600 dark:bg-fuchsia-950 dark:text-fuchsia-300"
            >
              <Bell size={17} />
              {!!unreadCount && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <Stat
              icon={<Trophy size={12} />}
              label="POINTS"
              value={user.points.toLocaleString()}
              color="violet"
            />
            <Stat
              icon={<WalletCards size={12} />}
              label="WALLET"
              value={`฿${user.balance}`}
              color="cyan"
            />
            <button
              onClick={onProfile}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3 py-2.5 text-sm font-bold text-white"
            >
              <UserRound size={16} />
              <span className="hidden sm:inline">{user.displayName}</span>
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-xl px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3 py-2.5 text-sm font-bold text-white"
          >
            <LogIn size={16} /> Login with Google
          </button>
        )}
      </div>
    </header>
  );
}
const statStyle = {
  violet: {
    box: "bg-violet-50 dark:bg-violet-950",
    label: "text-violet-500",
    value: "text-violet-700 dark:text-violet-200",
  },
  cyan: {
    box: "bg-cyan-50 dark:bg-cyan-950",
    label: "text-cyan-600",
    value: "text-cyan-700 dark:text-cyan-200",
  },
};
function Stat({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  color: "violet" | "cyan";
}) {
  const style = statStyle[color];
  return (
    <div className={`hidden rounded-xl px-3 py-2 sm:block ${style.box}`}>
      <span
        className={`flex items-center gap-1 text-[10px] font-bold ${style.label}`}
      >
        {icon} {label}
      </span>
      <p className={`text-sm font-bold ${style.value}`}>{value}</p>
    </div>
  );
}

// ==========================================
// 2. SIDEBAR (เมนูและเครื่องของผู้ใช้)
// ==========================================
type SidebarProps = {
  activeMachines: Machine[];
  mobileOpen: boolean;
  close: () => void;
  onProfile: () => void;
  onResetAll: () => void;
  onCancel: (machine: Machine) => void;
};
export function Sidebar({
  activeMachines,
  mobileOpen,
  close,
  onProfile,
  onResetAll,
  onCancel,
}: SidebarProps) {
  // เครื่องที่ใช้งานอยู่ส่งมาจาก page เพื่อให้ sidebar และ card แสดงข้อมูลชุดเดียวกัน
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white p-5 transition-transform dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
    >
      <div className="flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-xl text-white">
          ◉
        </div>
        <div>
          <p className="font-extrabold">
            Wash<span className="text-indigo-400">This!</span>
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
          เครื่องที่ฉันกำลังใช้งานอยู่
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
        {!!activeMachines.length && (
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

// ==========================================
// 3. MACHINE CARD (การ์ดเครื่องและสถานะคิว)
// ==========================================
const statusStyle = {
  available:
    "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/70",
  "in-use":
    "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/70",
  broken: "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/70",
};
const statusLabel = {
  available: "ว่าง",
  "in-use": "กำลังทำงาน",
  broken: "เสีย",
};
type CardProps = {
  machine: Machine;
  onBook: () => void;
  onReport: () => void;
  onCancel: () => void;
  onQueue: () => void;
  isAuthenticated: boolean;
};
export function MachineCard({
  machine: m,
  onBook,
  onReport,
  onCancel,
  onQueue,
  isAuthenticated,
}: CardProps) {
  // totalWaitTime รวมเวลาของเครื่องปัจจุบันและทุกคนที่จองล่วงหน้าอย่างแม่นยำ
  const active = m.status === "in-use",
    available = m.status === "available";
  return (
    <article
      className={`relative rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${statusStyle[m.status]} ${isAuthenticated ? "" : "[&>button]:hidden [&>div:last-child]:hidden"}`}
    >
      <button
        onClick={onReport}
        aria-label={`แจ้งเครื่อง ${m.id} เสีย`}
        className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-rose-600 shadow-sm hover:bg-white dark:bg-slate-800 dark:text-rose-300"
      >
        <AlertTriangle size={15} />
      </button>
      <button
        disabled={m.status === "broken"}
        onClick={onBook}
        className="w-full text-left disabled:cursor-not-allowed"
      >
        <div className="flex items-start justify-between pr-9">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
            {m.type === "washer" ? (
              <WashingMachine size={21} />
            ) : (
              <Flame size={21} />
            )}
          </span>
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-bold ${available ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100" : active ? "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-100" : "bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-100"}`}
          >
            {statusLabel[m.status]}
          </span>
        </div>
        <p className="mt-4 text-[11px] font-medium text-slate-500 dark:text-slate-300">
          {m.type === "washer" ? "เครื่องซักผ้า" : "เครื่องอบผ้า"}
        </p>
        <p className="text-lg font-extrabold dark:text-white">{m.id}</p>
        {active ? (
          <div className="mt-3 flex items-center gap-1.5 text-sm font-bold text-amber-800 dark:text-amber-100">
            <Clock3 size={15} /> เหลือ {formatRemainingTime(m.remaining)}
          </div>
        ) : (
          <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-100">
            {available ? "กดเพื่อเริ่มจอง" : "รอการตรวจสอบ"}
          </p>
        )}
        {active && m.queue > 0 && (
          <div className="mt-2 rounded-xl bg-amber-100/80 px-2.5 py-2 text-[11px] font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-100">
            คิว {m.queue} คน · รอรวม {formatRemainingTime(totalWaitTime(m))}
          </div>
        )}
      </button>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={onQueue}
          className="flex items-center justify-center gap-1 rounded-lg bg-white/90 py-2 text-[11px] font-bold text-slate-700 hover:bg-white dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          <ListOrdered size={13} /> ดูคิว
        </button>
        {m.activeByMe && active ? (
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
