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

  function statusDotColor(status: StatusValue): string {
    return status === "OPEN" ? "#ef4444" : status === "ON_PROGRESS" ? "#f59e0b" : "#22c55e";
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-500">Kategori</TableHead>
            <TableHead className="text-zinc-500">Deskripsi</TableHead>
            <TableHead className="text-zinc-500">Status</TableHead>
            <TableHead className="text-zinc-500">Tanggal</TableHead>
            <TableHead className="text-zinc-500">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => {
            const category = CATEGORIES.find((c) => c.value === incident.category);
            return (
              <TableRow key={incident.id} className="border-zinc-800/50">
                <TableCell className="whitespace-nowrap text-zinc-300">
                  {category?.emoji} {category?.label}
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-zinc-400">{incident.description}</TableCell>
                <TableCell>
                  <Select
                    value={incident.status}
                    disabled={updatingId === incident.id}
                    onValueChange={(val) => handleStatusChange(incident.id, val as StatusValue)}
                  >
                    <SelectTrigger className="h-8 w-[150px] border-zinc-700 bg-zinc-800 text-xs text-zinc-300">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: statusDotColor(incident.status) }}
                        />
                        {statusLabel(incident.status)}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      {STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-zinc-500">
                  {new Date(incident.created_at).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-emerald-400"
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
        <div className="py-12 text-center text-zinc-600">Belum ada data insiden</div>
      )}
    </div>
  );
}
