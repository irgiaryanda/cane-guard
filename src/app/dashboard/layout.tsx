import Link from "next/link";
import { Shield } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-emerald-700">
            <Shield className="h-6 w-6" />
            Cane Guard
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/map" className="text-sm text-muted-foreground hover:text-foreground">
              Peta
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Lapor
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
