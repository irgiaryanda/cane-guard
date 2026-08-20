"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Shield, LayoutDashboard, Map, FilePlus, Menu, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Lapor Insiden", icon: FilePlus },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/map", label: "Peta Monitoring", icon: Map },
];

function NavLink({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />}
    </Link>
  );
}

function SidebarInner() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-300">
      <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
          <Shield className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <div className="text-sm font-bold text-white tracking-tight">Cane Guard</div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Online
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Menu
        </div>
        {NAV.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </nav>
      <div className="border-t border-zinc-800 px-5 py-4">
        <div className="rounded-lg bg-zinc-900 px-3 py-2.5 text-xs text-zinc-500">
          <div className="font-medium text-zinc-400">Cane Guard v1.0 MVP</div>
          <div className="mt-1">Sistem Pemantauan Insiden</div>
          <div className="mt-1">Perkebunan Tebu</div>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 shadow-lg border border-zinc-800 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 md:hidden transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-full">
          <SidebarInner />
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 z-10 rounded-md p-1 text-zinc-400 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-zinc-800">
      <SidebarInner />
    </aside>
  );
}
