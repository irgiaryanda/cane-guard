"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const loadingRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filtersRef = useRef(filters);
  const fetchCountRef = useRef(0);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchIncidents = useCallback(async (showLoading = true) => {
    if (loadingRef.current && showLoading) return;
    loadingRef.current = true;
    if (showLoading) setLoading(true);
    setError(null);

    const supabase = createClient();
    const f = filtersRef.current;
    const myFetch = ++fetchCountRef.current;

    let query = supabase
      .from("incidents")
      .select("*")
      .order("created_at", { ascending: false });

    if (f?.category) query = query.eq("category", f.category);
    if (f?.status) query = query.eq("status", f.status);
    if (f?.from) query = query.gte("created_at", f.from);
    if (f?.to) query = query.lte("created_at", f.to);

    const { data: incidents, error: fetchError } = await query;

    // Stale check — skip if a newer fetch was started
    if (myFetch < fetchCountRef.current) {
      loadingRef.current = false;
      return;
    }

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setData(incidents || []);
    }
    if (showLoading) setLoading(false);
    loadingRef.current = false;
  }, []);

  useEffect(() => {
    fetchIncidents(true);
  }, [fetchIncidents, filters?.category, filters?.status, filters?.from, filters?.to]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("incidents-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "incidents" },
        () => {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => fetchIncidents(false), 1000);
        }
      )
      .subscribe();

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [fetchIncidents]);

  // Stable refetch using ref — won't change between renders
  const stableRefetch = useCallback(() => {
    fetchIncidents(true);
  }, [fetchIncidents]);

  return { data, loading, error, refetch: stableRefetch };
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
