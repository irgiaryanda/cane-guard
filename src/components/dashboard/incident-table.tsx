"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import type { Incident } from "@/lib/types";
import { CATEGORIES, STATUSES, type StatusValue } from "@/lib/constants";
import { updateIncidentStatus } from "@/hooks/use-incidents";

interface IncidentTableProps {
  incidents: Incident[];
  onStatusChange?: () => void;
}

export default function IncidentTable({ incidents, onStatusChange }: IncidentTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleStatusChange(id: string, newStatus: StatusValue) {
    setUpdatingId(id);
    const { error } = await updateIncidentStatus(id, newStatus);
    if (!error) onStatusChange?.();
    setUpdatingId(null);
  }

  function goToMap(incident: Incident) {
    router.push(`/dashboard/map?id=${incident.id}&lat=${incident.latitude}&lng=${incident.longitude}`);
  }

  function statusLabel(status: StatusValue): string {
    return STATUSES.find((s) => s.value === status)?.label ?? status;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kategori</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => {
            const category = CATEGORIES.find((c) => c.value === incident.category);
            return (
              <TableRow key={incident.id}>
                <TableCell className="whitespace-nowrap">
                  {category?.emoji} {category?.label}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{incident.description}</TableCell>
                <TableCell>
                  <Select
                    value={incident.status}
                    disabled={updatingId === incident.id}
                    onValueChange={(val) => handleStatusChange(incident.id, val as StatusValue)}
                  >
                    <SelectTrigger className="h-8 w-[150px] text-xs">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              incident.status === "OPEN" ? "#ef4444" :
                              incident.status === "ON_PROGRESS" ? "#f59e0b" : "#22c55e",
                          }}
                        />
                        {statusLabel(incident.status)}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(incident.created_at).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Lihat di peta"
                    onClick={() => goToMap(incident)}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {incidents.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">Belum ada data insiden</div>
      )}
    </div>
  );
}
