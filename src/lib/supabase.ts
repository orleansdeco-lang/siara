import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

export const supabaseUrl = process.env.REACT_APP_SUPABASE_URL ?? "https://tslxdwiliddwkexjvspo.supabase.co";
export const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY ?? "";

export type SupabaseTableName =
  | "garages"
  | "users"
  | "clients"
  | "vehicles"
  | "vehicle_models"
  | "services"
  | "service_items"
  | "inventory"
  | "transactions"
  | "reviews"
  | "appointments"
  | "bays"
  | "daily_stats"
  | "notifications";

export const buildAuthHeaders = () => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (supabaseAnonKey) {
    headers.apikey = supabaseAnonKey;
    headers.Authorization = `Bearer ${supabaseAnonKey}`;
  }

  return headers;
};

export const supabaseClient = axios.create({
  baseURL: `${supabaseUrl}/rest/v1`,
  headers: buildAuthHeaders(),
  timeout: 15000,
});

export function buildSupabaseQuery(table: string, select = "*", filters: string[] = [], order?: string) {
  const queryParts = [`select=${encodeURIComponent(select)}`];

  filters.forEach((filter) => {
    if (filter && filter.trim()) {
      queryParts.push(filter.trim());
    }
  });

  if (order) {
    queryParts.push(`order=${encodeURIComponent(order)}`);
  }

  return `/${table}?${queryParts.join("&")}`;
}

export async function checkSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  if (!supabaseAnonKey) {
    return {
      ok: false,
      message: "Supabase Anon Key is not set in environment (REACT_APP_SUPABASE_ANON_KEY). Running in Local/Demo mode.",
    };
  }

  try {
    const res = await supabaseClient.get("/garages?select=id&limit=1");
    if (res.status >= 200 && res.status < 300) {
      return { ok: true, message: "Connected to Supabase live database." };
    }
    return { ok: false, message: `Connected with status ${res.status}` };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.response?.data?.message || error.message || "Failed to reach Supabase API",
    };
  }
}

export async function fetchSupabaseTable<T>(
  table: SupabaseTableName | string,
  select = "*",
  filters: string[] = [],
  order?: string
): Promise<T[]> {
  try {
    const url = buildSupabaseQuery(table, select, filters, order);
    const { data } = await supabaseClient.get<T[]>(url);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`[Supabase] Table '${table}' fetch failed, falling back to local data.`, error);
    return [];
  }
}

export async function insertSupabaseRow<T>(table: SupabaseTableName | string, payload: T): Promise<T | null> {
  try {
    const { data } = await supabaseClient.post<T[]>(`/${table}`, payload, {
      headers: {
        ...buildAuthHeaders(),
        Prefer: "return=representation",
      },
    });
    return Array.isArray(data) && data.length > 0 ? data[0] : (data as unknown as T) ?? null;
  } catch (error) {
    console.warn(`[Supabase] Insert into '${table}' failed.`, error);
    return null;
  }
}

export async function updateSupabaseRow<T>(
  table: SupabaseTableName | string,
  filterQuery: string,
  payload: Partial<T>
): Promise<T | null> {
  try {
    const { data } = await supabaseClient.patch<T[]>(`/${table}?${filterQuery}`, payload, {
      headers: {
        ...buildAuthHeaders(),
        Prefer: "return=representation",
      },
    });
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.warn(`[Supabase] Update on '${table}' failed.`, error);
    return null;
  }
}

export async function deleteSupabaseRow(table: SupabaseTableName | string, filterQuery: string): Promise<boolean> {
  try {
    await supabaseClient.delete(`/${table}?${filterQuery}`);
    return true;
  } catch (error) {
    console.warn(`[Supabase] Delete on '${table}' failed.`, error);
    return false;
  }
}

export function useSupabaseTable<T>(
  table: SupabaseTableName | string,
  fallback: T[],
  select = "*",
  filters: string[] = [],
  order?: string
) {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);

  const filterKey = useMemo(() => filters.join("&"), [filters]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const rows = await fetchSupabaseTable<T>(table, select, filters, order);
    if (rows && rows.length > 0) {
      setData(rows);
      setIsLive(true);
    } else {
      setData(fallback);
      setIsLive(false);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, select, filterKey, order]);

  useEffect(() => {
    let active = true;

    fetchSupabaseTable<T>(table, select, filters, order).then((rows) => {
      if (active) {
        if (rows && rows.length > 0) {
          setData(rows);
          setIsLive(true);
        } else {
          setData(fallback);
          setIsLive(false);
        }
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, select, filterKey, order]);

  return Object.assign(data, {
    loading,
    isLive,
    refetch: loadData,
  });
}
