import Header from "@/components/shared/header";
import IncidentForm from "@/components/reports/incident-form";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <IncidentForm />
      </main>
    </div>
  );
}
