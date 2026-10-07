"use client";

import { Bell, LogIn, Menu, Trophy, UserRound, WalletCards, WashingMachine } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import type { CurrentUser } from "../lib/types";

export default function Header({ user, unreadCount, onMenu, onProfile, onNotifications }: {
  user: CurrentUser | null;
  unreadCount: number;
  onMenu: () => void;
  onProfile: () => void;
  onNotifications: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-2 border-b border-indigo-100 bg-white px-4 py-3 dark:border-indigo-900 dark:bg-slate-900 sm:px-7">
      {user && <button onClick={onMenu} className="rounded-xl p-2 text-slate-600 dark:text-indigo-200 lg:hidden" aria-label="Open menu"><Menu size={22} /></button>}
      <div className="flex items-center gap-2">
        <WashingMachine className="text-indigo-600 dark:text-cyan-300" size={25} />
        <div><p className="font-black tracking-tight text-slate-900 dark:text-white">Wash<span className="text-fuchsia-600 dark:text-fuchsia-400">This!</span></p><p className="hidden text-[10px] text-slate-400 sm:block">สะอาดง่าย ในทุกวัน</p></div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {user ? <>
          <button onClick={onNotifications} aria-label="Notifications" className="relative rounded-xl bg-fuchsia-50 p-2.5 text-fuchsia-600 dark:bg-fuchsia-950 dark:text-fuchsia-300"><Bell size={17} />{unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{unreadCount}</span>}</button>
          <div className="hidden rounded-xl bg-violet-50 px-3 py-2 dark:bg-violet-950 sm:block"><span className="flex items-center gap-1 text-[10px] font-bold text-violet-500"><Trophy size={12} /> POINTS</span><p className="text-sm font-bold text-violet-700 dark:text-violet-200">{user.points.toLocaleString()}</p></div>
          <div className="hidden rounded-xl bg-cyan-50 px-3 py-2 dark:bg-cyan-950 sm:block"><span className="flex items-center gap-1 text-[10px] font-bold text-cyan-600"><WalletCards size={12} /> WALLET</span><p className="text-sm font-bold text-cyan-700 dark:text-cyan-200">฿{user.balance}</p></div>
          <button onClick={onProfile} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3 py-2.5 text-sm font-bold text-white"><UserRound size={16} /><span className="hidden sm:inline">{user.displayName}</span></button>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-xl px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Logout</button>
        </> : <button onClick={() => signIn("google", { callbackUrl: "/" })} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3 py-2.5 text-sm font-bold text-white"><LogIn size={16} /> Login with Google</button>}
      </div>
    </header>
  );
}
