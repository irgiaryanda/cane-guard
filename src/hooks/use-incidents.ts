"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Incident } from "@/lib/types";
import type { CategoryValue, StatusValue } from "@/lib/constants";

interface IncidentFilters {
  category?: CategoryValue;
  status?: StatusValue;
  from?: string;
  to?: string;
}

export function useIncidents(filters?: IncidentFilters) {
  const [data, setData] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    let query = supabase
      .from("incidents")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.from) {
      query = query.gte("created_at", filters.from);
    }
    if (filters?.to) {
      query = query.lte("created_at", filters.to);
    }

    const { data: incidents, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setData(incidents || []);
    }
    setLoading(false);
  }, [filters?.category, filters?.status, filters?.from, filters?.to]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("incidents-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "incidents" },
        () => {
          fetchIncidents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchIncidents]);

  return { data, loading, error, refetch: fetchIncidents };
}

export async function updateIncidentStatus(
  id: string,
  status: StatusValue
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("incidents")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  return { error: error?.message ?? null };
}
