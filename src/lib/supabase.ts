import { useEffect, useState } from "react";
import axios from "axios";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL ?? "https://tslxdwiliddwkexjvspo.supabase.co";const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY ?? "";

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
  const queryParts = [`select=${encodeURIComponent(select)}`];

  filters.forEach((filter) => {
    if (filter && filter.trim()) {
      queryParts.push(filter.trim());
    }
  });

  if (order) {
    queryParts.push(`order=${encodeURIComponent(order)}`);
  }

  return `/${table}?${queryParts.join("&")}`;}

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

}