import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ReportSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="space-y-4 pt-6">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <h1 className="text-xl font-bold">Laporan Berhasil Dikirim!</h1>
          <p className="text-sm text-muted-foreground">
            Terima kasih atas laporannya. Tim kami akan segera menindaklanjuti.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-md bg-primary px-6 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Kirim Laporan Baru
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
