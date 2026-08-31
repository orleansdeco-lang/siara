<<<<<<< HEAD
export type VehicleHistoryEntry = {
  id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  dateVidange: string;
  huileModele: string;
  huileQuantite: number;
  huileUnite: 'bidon' | 'litre';
  filtres: string[];
  prixTotal: number;
  notes: string;
};

export type VehicleHistoryForm = {
  immatriculation: string;
  marque: string;
  modele: string;
  dateVidange: string;
  huileModele: string;
  huileQuantite: string;
  huileUnite: 'bidon' | 'litre';
  filtres: string[];
  prixTotal: string;
  notes: string;
};

export const VEHICLE_HISTORY_STORAGE_KEY = 'siara_vehicle_history_v1';

export const vehicleHistoryFilterOptions = ['Huile', 'Air', 'Essence', 'Gasoil', 'Clim'];

export const vehicleHistorySeedEntries: VehicleHistoryEntry[] = [
  {
    id: 'h-1001',
    immatriculation: '1234-DZ',
    marque: 'BMW',
    modele: 'X5 xDrive30d',
    dateVidange: '2026-08-29',
    huileModele: '5W-30',
    huileQuantite: 18,
    huileUnite: 'litre',
    filtres: ['Huile', 'Air'],
    prixTotal: 62000,
    notes: 'Vidange complète + contrôle niveau',
  },
  {
    id: 'h-1002',
    immatriculation: '9876-WA',
    marque: 'Renault',
    modele: 'Clio IV',
    dateVidange: '2026-08-10',
    huileModele: '5W-30',
    huileQuantite: 4.5,
    huileUnite: 'litre',
    filtres: ['Huile'],
    prixTotal: 16500,
    notes: 'Vidange standard',
  },
  {
    id: 'h-1003',
    immatriculation: '5500-AB',
    marque: 'Peugeot',
    modele: '308 SW',
    dateVidange: '2025-12-01',
    huileModele: '5W-40',
    huileQuantite: 4,
    huileUnite: 'litre',
    filtres: ['Huile', 'Air', 'Clim'],
    prixTotal: 24000,
    notes: 'Contrôle général + remplacement de fluides',
  },
];

export const defaultVehicleHistoryForm: VehicleHistoryForm = {
  immatriculation: '',
  marque: '',
  modele: '',
  dateVidange: new Date().toISOString().slice(0, 10),
  huileModele: '',
  huileQuantite: '0',
  huileUnite: 'litre',
  filtres: [],
  prixTotal: '0',
  notes: '',
};
=======
export type VehicleHistoryEntry = {
  id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  dateVidange: string;
  huileModele: string;
  huileQuantite: number;
  huileUnite: 'bidon' | 'litre';
  filtres: string[];
  prixTotal: number;
  notes: string;
};

export type VehicleHistoryForm = {
  immatriculation: string;
  marque: string;
  modele: string;
  dateVidange: string;
  huileModele: string;
  huileQuantite: string;
  huileUnite: 'bidon' | 'litre';
  filtres: string[];
  prixTotal: string;
  notes: string;
};

export const VEHICLE_HISTORY_STORAGE_KEY = 'siara_vehicle_history_v1';

export const vehicleHistoryFilterOptions = ['Huile', 'Air', 'Essence', 'Gasoil', 'Clim'];

export const vehicleHistorySeedEntries: VehicleHistoryEntry[] = [
  {
    id: 'h-1001',
    immatriculation: '1234-DZ',
    marque: 'BMW',
    modele: 'X5 xDrive30d',
    dateVidange: '2026-08-29',
    huileModele: '5W-30',
    huileQuantite: 18,
    huileUnite: 'litre',
    filtres: ['Huile', 'Air'],
    prixTotal: 62000,
    notes: 'Vidange complète + contrôle niveau',
  },
  {
    id: 'h-1002',
    immatriculation: '9876-WA',
    marque: 'Renault',
    modele: 'Clio IV',
    dateVidange: '2026-08-10',
    huileModele: '5W-30',
    huileQuantite: 4.5,
    huileUnite: 'litre',
    filtres: ['Huile'],
    prixTotal: 16500,
    notes: 'Vidange standard',
  },
  {
    id: 'h-1003',
    immatriculation: '5500-AB',
    marque: 'Peugeot',
    modele: '308 SW',
    dateVidange: '2025-12-01',
    huileModele: '5W-40',
    huileQuantite: 4,
    huileUnite: 'litre',
    filtres: ['Huile', 'Air', 'Clim'],
    prixTotal: 24000,
    notes: 'Contrôle général + remplacement de fluides',
  },
];

export const defaultVehicleHistoryForm: VehicleHistoryForm = {
  immatriculation: '',
  marque: '',
  modele: '',
  dateVidange: new Date().toISOString().slice(0, 10),
  huileModele: '',
  huileQuantite: '0',
  huileUnite: 'litre',
  filtres: [],
  prixTotal: '0',
  notes: '',
};
>>>>>>> 36b65e1 (Initial commit)
