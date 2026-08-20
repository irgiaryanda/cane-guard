import Link from "next/link";
import { Shield, LayoutDashboard } from "lucide-react";
import IncidentForm from "@/components/reports/incident-form";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-emerald-400">
            <Shield className="h-5 w-5" />
            Cane Guard
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <IncidentForm />
      </main>
    </div>
  );
}
