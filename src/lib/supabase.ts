import { useEffect, useState } from "react";
import axios from "axios";

<<<<<<< HEAD
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ?? "https://tslxdwiliddwkexjvspo.supabase.co";
=======
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL ?? "https://tslxdwiliddwkexjvspo.supabase.co";
>>>>>>> 36b65e1 (Initial commit)
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY ?? "";

export type SupabaseTableName =
  | "garages"
  | "users"
  | "clients"
  | "vehicles"
  | "vehicle_models"
  | "services"
  | "inventory"
  | "transactions"
  | "appointments"
  | "bays"
  | "daily_stats"
  | "notifications";

const buildAuthHeaders = () => {
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
<<<<<<< HEAD
  const query = new URLSearchParams();
  query.set("select", select);

  filters.forEach((filter) => {
    query.append("filter", filter);
  });

  if (order) {
    query.set("order", order);
  }

  const params = query.toString();
  return params ? `/${table}?${params}` : `/${table}`;
=======
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
>>>>>>> 36b65e1 (Initial commit)
}

export async function fetchSupabaseTable<T>(table: SupabaseTableName | string, select = "*", filters: string[] = [], order?: string): Promise<T[]> {
  try {
    const url = buildSupabaseQuery(table, select, filters, order);
    const { data } = await supabaseClient.get<T[]>(url);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`Supabase table ${table} is unavailable, falling back to local mock data.`, error);
    return [];
  }
}

<<<<<<< HEAD
=======
export async function insertSupabaseRow<T>(table: SupabaseTableName | string, payload: T) {
  try {
    const { data, status } = await supabaseClient.post(`/${table}`, payload);
    return { data, status };
  } catch (error) {
    console.warn(`Insert into ${table} failed.`, error);
    return null;
  }
}

>>>>>>> 36b65e1 (Initial commit)
export function useSupabaseTable<T>(table: SupabaseTableName | string, fallback: T[], select = "*", filters: string[] = [], order?: string) {
  const [data, setData] = useState<T[]>(fallback);

  useEffect(() => {
    let active = true;

    fetchSupabaseTable<T>(table, select, filters, order).then((rows) => {
      if (active) {
        setData(rows.length > 0 ? rows : fallback);
      }
    });

    return () => {
      active = false;
    };
  }, [fallback, filters, order, select, table]);

  return data;
<<<<<<< HEAD
}
=======
}
>>>>>>> 36b65e1 (Initial commit)
