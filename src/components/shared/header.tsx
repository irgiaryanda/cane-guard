import Link from "next/link";
import { Shield } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-emerald-700">
          <Shield className="h-6 w-6" />
          Cane Guard
        </Link>
        <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Dashboard
        </Link>
      </div>
    </header>
  );
}
