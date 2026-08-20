import Header from "@/components/shared/header";
import IncidentForm from "@/components/reports/incident-form";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto max-w-lg px-4 py-6">
          <IncidentForm />
        </div>
      </main>
    </>
  );
}
