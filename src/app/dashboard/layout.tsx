import { DesktopSidebar, MobileSidebar } from "@/components/shared/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <DesktopSidebar />
      <MobileSidebar />
      <main className="min-h-screen md:pl-60">{children}</main>
    </div>
  );
}
