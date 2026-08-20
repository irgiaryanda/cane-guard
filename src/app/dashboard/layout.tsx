import Header from "@/components/shared/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
