"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, ArrowRight } from "lucide-react";
import StatusBadge from "./status-badge";
import type { Incident } from "@/lib/types";
import { CATEGORIES, STATUSES, type StatusValue } from "@/lib/constants";
import { updateIncidentStatus } from "@/hooks/use-incidents";

interface IncidentTableProps {
  incidents: Incident[];
  onStatusChange?: () => void;
}

export default function IncidentTable({ incidents, onStatusChange }: IncidentTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, newStatus: StatusValue) {
    setUpdatingId(id);
    await updateIncidentStatus(id, newStatus);
    onStatusChange?.();
    setUpdatingId(null);
  }

  function nextStatus(current: StatusValue): StatusValue | null {
    if (current === "OPEN") return "ON_PROGRESS";
    if (current === "ON_PROGRESS") return "CLOSED";
    return null;
  }

  function nextStatusLabel(current: StatusValue): string {
    const next = nextStatus(current);
    if (!next) return "";
    return STATUSES.find((s) => s.value === next)?.label ?? "";
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
            const next = nextStatus(incident.status);
            return (
              <TableRow key={incident.id}>
                <TableCell className="whitespace-nowrap">
                  {category?.emoji} {category?.label}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{incident.description}</TableCell>
                <TableCell><StatusBadge status={incident.status} /></TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(incident.created_at).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Lihat koordinat">
                      <MapPin className="h-3.5 w-3.5" />
                    </Button>
                    {next && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        disabled={updatingId === incident.id}
                        onClick={() => handleStatusChange(incident.id, next)}
                      >
                        {nextStatusLabel(incident.status)}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
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
