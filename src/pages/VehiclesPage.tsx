import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import {
  defaultVehicleHistoryForm,
  VEHICLE_HISTORY_STORAGE_KEY,
  vehicleHistoryFilterOptions,
  vehicleHistorySeedEntries,
  type VehicleHistoryEntry,
  type VehicleHistoryForm,
} from '../data/vehicleHistoryData';

type VehicleSummary = {
  immatriculation: string;
  marque: string;
  modele: string;
  totalSpent: number;
  totalLitres: number;
  lastVisit: string;
  entries: VehicleHistoryEntry[];
};

const formatCurrency = (value: number) => `${value.toLocaleString('fr-DZ')} DA`;

export function VehiclesPage() {
  const [entries, setEntries] = useState<VehicleHistoryEntry[]>([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<VehicleHistoryForm>(defaultVehicleHistoryForm);

  useEffect(() => {
    const stored = window.localStorage.getItem(VEHICLE_HISTORY_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as VehicleHistoryEntry[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
          return;
        }
      } catch {
        // ignore parse error and use seed data below
      }
    }
    setEntries(vehicleHistorySeedEntries);
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      window.localStorage.setItem(VEHICLE_HISTORY_STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  const vehicleGroups = useMemo<Record<string, VehicleSummary>>(() => {
    const grouped = new Map<string, VehicleSummary>();

    entries.forEach((entry) => {
      const immatriculation = (entry.immatriculation || 'UNKNOWN').toUpperCase();
      const current = grouped.get(immatriculation) ?? {
        immatriculation,
        marque: entry.marque,
        modele: entry.modele,
        totalSpent: 0,
        totalLitres: 0,
        lastVisit: entry.dateVidange,
        entries: [],
      };

      current.totalSpent += entry.prixTotal;
      if (entry.huileUnite === 'litre') {
        current.totalLitres += Number(entry.huileQuantite || 0);
      }
      current.lastVisit = entry.dateVidange > current.lastVisit ? entry.dateVidange : current.lastVisit;
      current.entries = [...current.entries, entry].sort((a, b) => b.dateVidange.localeCompare(a.dateVidange));
      grouped.set(immatriculation, current);
    });

    return Object.fromEntries(
      Array.from(grouped.entries()).sort(([, a], [, b]) => b.lastVisit.localeCompare(a.lastVisit)),
    );
  }, [entries]);

  const filteredVehicles = useMemo(() => {
    const value = query.trim().toLowerCase();
    const vehicles = Object.values(vehicleGroups);

    if (!value) return vehicles;

    return vehicles.filter((item) => {
      const haystack = [
        item.immatriculation,
        item.marque,
        item.modele,
        item.entries.map((entry) => entry.huileModele).join(' '),
        item.entries.map((entry) => entry.filtres.join(' ')).join(' '),
      ].join(' ').toLowerCase();

      return haystack.includes(value);
    });
  }, [vehicleGroups, query]);

  const toggleFilter = (filter: string) => {
    setForm((current) => {
      const next = current.filtres.includes(filter)
        ? current.filtres.filter((item) => item !== filter)
        : [...current.filtres, filter];

      return {
        ...current,
        filtres: next,
      };
    });
  };

  const addEntry = () => {
    if (!form.immatriculation.trim() || !form.marque.trim() || !form.modele.trim()) return;

    const nextEntry: VehicleHistoryEntry = {
      id: `manual-${Date.now()}`,
      immatriculation: form.immatriculation.trim().toUpperCase(),
      marque: form.marque.trim(),
      modele: form.modele.trim(),
      dateVidange: form.dateVidange,
      huileModele: form.huileModele.trim() || 'Huile non précisée',
      huileQuantite: Number(form.huileQuantite || 0),
      huileUnite: form.huileUnite,
      filtres: form.filtres,
      prixTotal: Number(form.prixTotal || 0),
      notes: form.notes.trim(),
    };

    setEntries((current) => [nextEntry, ...current]);
    setForm({ ...defaultVehicleHistoryForm, dateVidange: new Date().toISOString().slice(0, 10) });
  };

  const removeEntry = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Historical data</p>
          <h2 className="mt-2 text-3xl font-black text-white">Historique de vidange</h2>
        </div>

        <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Recherche plaque, marque, modèle..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            aria-label="Recherche véhicule"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
        <div className="mb-4 flex items-center gap-2 text-white">
          <Plus size={18} className="text-amber-300" />
          <h3 className="text-xl font-bold">Ajouter une vidange / service</h3>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <input
            value={form.immatriculation}
            onChange={(e) => setForm({ ...form, immatriculation: e.target.value })}
            placeholder="Immatriculation"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
          <input
            value={form.marque}
            onChange={(e) => setForm({ ...form, marque: e.target.value })}
            placeholder="Marque"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
          <input
            value={form.modele}
            onChange={(e) => setForm({ ...form, modele: e.target.value })}
            placeholder="Modèle"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
          <input
            type="date"
            value={form.dateVidange}
            onChange={(e) => setForm({ ...form, dateVidange: e.target.value })}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
          <input
            value={form.huileModele}
            onChange={(e) => setForm({ ...form, huileModele: e.target.value })}
            placeholder="Modèle d'huile"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
          <input
            type="number"
            value={form.huileQuantite}
            onChange={(e) => setForm({ ...form, huileQuantite: e.target.value })}
            placeholder="Quantité"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
          <select
            value={form.huileUnite}
            onChange={(e) => setForm({ ...form, huileUnite: e.target.value as 'bidon' | 'litre' })}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          >
            <option value="litre">Litre</option>
            <option value="bidon">Bidon</option>
          </select>
          <input
            type="number"
            value={form.prixTotal}
            onChange={(e) => setForm({ ...form, prixTotal: e.target.value })}
            placeholder="Prix total"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
          <div className="md:col-span-2 xl:col-span-3">
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes / observation"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-slate-300">Filtres :</p>
          <div className="flex flex-wrap gap-2">
            {vehicleHistoryFilterOptions.map((filter) => {
              const active = form.filtres.includes(filter);
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => toggleFilter(filter)}
                  className={[
                    'rounded-full border px-3 py-1.5 text-sm transition',
                    active
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                      : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500',
                  ].join(' ')}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={addEntry}
            className="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            Enregistrer
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.immatriculation} className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xl font-black text-white">{vehicle.marque} {vehicle.modele}</p>
                <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-400">
                  <span>Immatriculation: {vehicle.immatriculation}</span>
                  <span>Dernière vidange: {vehicle.lastVisit}</span>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                  {vehicle.totalLitres} L
                </span>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-200">
                  {formatCurrency(vehicle.totalSpent)}
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-700">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead className="bg-slate-950/80 text-xs uppercase tracking-[0.2em] text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Huile</th>
                    <th className="px-3 py-2">Qté</th>
                    <th className="px-3 py-2">Filtres</th>
                    <th className="px-3 py-2">Prix total</th>
                    <th className="px-3 py-2">Notes</th>
                    <th className="px-3 py-2"> </th>
                  </tr>
                </thead>
                <tbody>
                  {vehicle.entries.map((entry) => (
                    <tr key={entry.id} className="border-t border-slate-800 bg-slate-900/50">
                      <td className="px-3 py-2">{entry.dateVidange}</td>
                      <td className="px-3 py-2 font-semibold text-white">{entry.huileModele}</td>
                      <td className="px-3 py-2">
                        {entry.huileQuantite} {entry.huileUnite}
                      </td>
                      <td className="px-3 py-2">{entry.filtres.length ? entry.filtres.join(', ') : '—'}</td>
                      <td className="px-3 py-2 text-amber-300">{formatCurrency(entry.prixTotal)}</td>
                      <td className="px-3 py-2 text-slate-400">{entry.notes || '—'}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeEntry(entry.id)}
                          className="rounded-lg border border-red-500/40 bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 36b65e1 (Initial commit)
