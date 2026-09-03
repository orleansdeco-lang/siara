import { fetchSupabaseTable } from './supabase';

export const CUSTOMER_VEHICLES_KEY = 'siara_customer_vehicles_v1';
export const WORKSHOP_SERVICES_KEY = 'siara_workshop_services_v1';

export type PersonalVehicle = {
  id: string;
  clientId?: number;
  plate: string;
  brand: string;
  model: string;
  year?: number;
  mileage: number;
  lastServiceAt?: string;
};

export type PersonalService = {
  id: string;
  clientId?: number;
  vehicleId?: string;
  plate: string;
  vehicle: string;
  date: string;
  service: string;
  oil?: string;
  filters?: string;
  mileage: number;
  price: number;
  garage?: string;
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export function readPersonalVehicles(): PersonalVehicle[] {
  return readJson<PersonalVehicle[]>(CUSTOMER_VEHICLES_KEY, []);
}

export function savePersonalVehicles(vehicles: PersonalVehicle[]) {
  localStorage.setItem(CUSTOMER_VEHICLES_KEY, JSON.stringify(vehicles));
}

export function readWorkshopServices(): PersonalService[] {
  return readJson<PersonalService[]>(WORKSHOP_SERVICES_KEY, []);
}

export function saveWorkshopService(service: PersonalService) {
  const services = readWorkshopServices().filter((item) => item.id !== service.id);
  localStorage.setItem(WORKSHOP_SERVICES_KEY, JSON.stringify([service, ...services]));
}

export async function fetchCustomerServices(clientId?: number, plates: string[] = []) {
  const local = readWorkshopServices().filter((service) =>
    (clientId !== undefined && service.clientId === clientId) ||
    plates.includes(service.plate.toUpperCase()),
  );
  const rows = await fetchSupabaseTable<{
    id: number;
    client_id?: number;
    vehicle_id?: number;
    plate_number?: string;
    vehicle_model?: string;
    service_date?: string;
    service_type?: string;
    oil_type?: string;
    filters_used?: string;
    mileage?: number;
    total_amount?: number;
  }>('services', '*', clientId !== undefined ? [`client_id=eq.${clientId}`] : []);
  const remote = rows.map((row) => ({
    id: String(row.id),
    clientId: row.client_id,
    vehicleId: row.vehicle_id ? String(row.vehicle_id) : undefined,
    plate: row.plate_number || '',
    vehicle: row.vehicle_model || 'Vehicle',
    date: row.service_date?.slice(0, 10) || '',
    service: row.service_type || 'Service',
    oil: row.oil_type,
    filters: row.filters_used,
    mileage: Number(row.mileage || 0),
    price: Number(row.total_amount || 0),
  }));
  const merged = [...remote, ...local];
  return merged.filter((service, index, all) => all.findIndex((item) => item.id === service.id) === index);
}
