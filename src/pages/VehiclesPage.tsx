import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, ChevronRight, Droplets, Info, Plus, Search, Trash2 } from 'lucide-react';
import {
  defaultVehicleHistoryForm,
  VEHICLE_HISTORY_STORAGE_KEY,
  vehicleHistoryFilterOptions,
  vehicleHistorySeedEntries,
  type VehicleHistoryEntry,
  type VehicleHistoryForm,
} from '../data/vehicleHistoryData';
import { fetchSupabaseTable, insertSupabaseRow } from '../lib/supabase';
import { useUiStore } from '../store/store';

export type VehicleSummary = {
  immatriculation: string;
  marque: string;
  modele: string;
  totalSpent: number;
  totalLitres: number;
  lastVisit: string;
  entries: VehicleHistoryEntry[];
};

export function VehiclesPage() {
  const { language, theme } = useUiStore();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';

  const [entries, setEntries] = useState<VehicleHistoryEntry[]>([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<VehicleHistoryForm>(defaultVehicleHistoryForm);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(VEHICLE_HISTORY_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
          return;
        }
      } catch {}
    }
    setEntries(vehicleHistorySeedEntries);
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      try {
        localStorage.setItem(VEHICLE_HISTORY_STORAGE_KEY, JSON.stringify(entries));
      } catch {}
    }
  }, [entries]);

  // Try fetching vehicle models from Supabase
  useEffect(() => {
    fetchSupabaseTable<any>('vehicles', '*').then((rows) => {
      if (rows && rows.length > 0) {
        // sync with local list if any
      }
    });
  }, []);

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

      current.totalSpent += Number(entry.prixTotal || 0);
      if (entry.huileUnite === 'litre') {
        current.totalLitres += Number(entry.huileQuantite || 0);
      }
      current.lastVisit = entry.dateVidange > current.lastVisit ? entry.dateVidange : current.lastVisit;
      current.entries = [...current.entries, entry].sort((a, b) => b.dateVidange.localeCompare(a.dateVidange));
      grouped.set(immatriculation, current);
    });

    return Object.fromEntries(
      Array.from(grouped.entries()).sort(([, a], [, b]) => b.lastVisit.localeCompare(a.lastVisit))
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
        item.entries.map((e) => e.huileModele).join(' '),
        item.entries.map((e) => e.filtres.join(' ')).join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(value);
    });
  }, [vehicleGroups, query]);

  const toggleFilter = (filter: string) => {
    setForm((current) => {
      const next = current.filtres.includes(filter)
        ? current.filtres.filter((item) => item !== filter)
        : [...current.filtres, filter];

      return { ...current, filtres: next };
    });
  };

  const addEntry = async () => {
    if (!form.immatriculation.trim() || !form.marque.trim() || !form.modele.trim()) return;

    const nextEntry: VehicleHistoryEntry = {
      id: `vh-${Date.now()}`,
      immatriculation: form.immatriculation.trim().toUpperCase(),
      marque: form.marque.trim(),
      modele: form.modele.trim(),
      dateVidange: form.dateVidange,
      huileModele: form.huileModele.trim() || '5W-30',
      huileQuantite: Number(form.huileQuantite || 4.5),
      huileUnite: form.huileUnite,
      filtres: form.filtres,
      prixTotal: Number(form.prixTotal || 0),
      notes: form.notes.trim(),
    };

    setEntries((current) => [nextEntry, ...current]);
    setForm({ ...defaultVehicleHistoryForm, dateVidange: new Date().toISOString().slice(0, 10) });
    setShowAddForm(false);

    // Sync with Supabase
    try {
      await insertSupabaseRow('services', {
        garage_id: 1,
        plate_number: nextEntry.immatriculation,
        vehicle_model: `${nextEntry.marque} ${nextEntry.modele}`,
        oil_type: nextEntry.huileModele,
        filters_used: nextEntry.filtres.join(', '),
        total_amount: nextEntry.prixTotal,
        notes: nextEntry.notes,
        service_date: nextEntry.dateVidange,
      });
    } catch {}
  };

  const removeEntry = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  const formatCurrency = (value: number) => `DA ${new Intl.NumberFormat('fr-DZ').format(value)}`;

  const cardSurface = isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-sm';
  const baseText = isDark ? 'text-white' : 'text-slate-900';
  const inputClass = isDark
    ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:border-amber-500'
    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">
            {isArabic ? 'سجل السيارات والصيانات' : 'Parc automobile'}
          </p>
          <h2 className={`text-2xl font-black sm:text-3xl ${baseText}`}>
            {isArabic ? 'سجل المركبات وتاريخ تغيير الزيت' : 'Historique des vidanges & Véhicules'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search size={16} className={`pointer-events-none absolute top-3 text-slate-400 ${isArabic ? 'right-3' : 'left-3'}`} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isArabic ? 'بحث برقم اللوحة، الماركة...' : 'Recherche plaque, marque...'}
              className={`w-full rounded-xl border py-2 text-xs focus:outline-none ${isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'} ${inputClass}`}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
          >
            <Plus size={15} />
            <span>{isArabic ? 'إضافة صيانة' : 'Ajouter vidange'}</span>
          </button>
        </div>
      </div>

      {/* Add Entry Form Modal / Collapsible */}
      {showAddForm && (
        <div className={`rounded-2xl border p-5 space-y-4 ${cardSurface}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold text-amber-500`}>
              {isArabic ? 'تسجيل صيانة أو تغيير زيت جديد' : 'Enregistrer une nouvelle vidange'}
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              value={form.immatriculation}
              onChange={(e) => setForm({ ...form, immatriculation: e.target.value })}
              placeholder={isArabic ? 'رقم اللوحة (مثال: 123-AB-456)' : 'Immatriculation'}
              className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
            />
            <input
              value={form.marque}
              onChange={(e) => setForm({ ...form, marque: e.target.value })}
              placeholder={isArabic ? 'الماركة (Renault, BMW...)' : 'Marque'}
              className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
            />
            <input
              value={form.modele}
              onChange={(e) => setForm({ ...form, modele: e.target.value })}
              placeholder={isArabic ? 'الموديل (Clio IV, X5...)' : 'Modèle'}
              className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
            />
            <input
              type="date"
              value={form.dateVidange}
              onChange={(e) => setForm({ ...form, dateVidange: e.target.value })}
              className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
            />
            <input
              value={form.huileModele}
              onChange={(e) => setForm({ ...form, huileModele: e.target.value })}
              placeholder={isArabic ? 'نوع الزيت (5W-30 Synthétique)' : 'Modèle d’huile'}
              className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
            />
            <input
              type="number"
              step={0.5}
              value={form.huileQuantite}
              onChange={(e) => setForm({ ...form, huileQuantite: e.target.value })}
              placeholder={isArabic ? 'الكمية' : 'Quantité'}
              className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
            />
            <select
              value={form.huileUnite}
              onChange={(e) => setForm({ ...form, huileUnite: e.target.value as 'bidon' | 'litre' })}
              className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
            >
              <option value="litre">{isArabic ? 'لتر' : 'Litre'}</option>
              <option value="bidon">{isArabic ? 'عبوة / برميل' : 'Bidon'}</option>
            </select>
            <input
              type="number"
              value={form.prixTotal}
              onChange={(e) => setForm({ ...form, prixTotal: e.target.value })}
              placeholder={isArabic ? 'المبلغ الإجمالي (دج)' : 'Prix total (DA)'}
              className={`rounded-xl border px-3 py-2 text-xs font-bold text-amber-500 focus:outline-none ${inputClass}`}
            />
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-semibold text-slate-400">{isArabic ? 'الفلاتر المستبدلة:' : 'Filtres remplacés :'}</span>
            <div className="flex flex-wrap gap-2">
              {vehicleHistoryFilterOptions.map((filter) => {
                const active = form.filtres.includes(filter);
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => toggleFilter(filter)}
                    className={`rounded-xl border px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? 'border-amber-500 bg-amber-500 text-slate-950'
                        : isDark ? 'border-slate-700 bg-slate-950 text-slate-300' : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-400 hover:bg-slate-800"
            >
              {isArabic ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              type="button"
              onClick={addEntry}
              className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
            >
              {isArabic ? 'حفظ الصيانة' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {/* Vehicle Cards List */}
      <div className="space-y-4">
        {filteredVehicles.map((vehicle) => {
          // Model slug for vehicle specs link
          const modelSlug = vehicle.modele.toLowerCase().includes('clio')
            ? 'clio-sample'
            : vehicle.modele.toLowerCase().includes('duster')
            ? 'duster-sample'
            : vehicle.modele.toLowerCase().includes('megane')
            ? 'megane-sample'
            : 'clio-sample';

          return (
            <div key={vehicle.immatriculation} className={`rounded-2xl border p-4 sm:p-5 ${cardSurface}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/60 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${isDark ? 'bg-slate-950 text-amber-400' : 'bg-slate-100 text-amber-600'}`}>
                    <Car size={22} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-black ${baseText}`}>
                      {vehicle.marque} {vehicle.modele}
                    </h3>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="rounded-md bg-amber-500/15 px-2 py-0.5 font-mono font-bold text-amber-400">
                        {vehicle.immatriculation}
                      </span>
                      <span>• {isArabic ? 'آخر صيانة:' : 'Dernière vidange:'} {vehicle.lastVisit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-xl bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-400">
                    <Droplets size={13} className="inline me-1" />
                    {vehicle.totalLitres} L
                  </span>
                  <span className="rounded-xl bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-400">
                    {formatCurrency(vehicle.totalSpent)}
                  </span>
                  <Link
                    to={`/vehicles/${modelSlug}`}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-amber-500 hover:text-amber-400"
                  >
                    <Info size={13} />
                    <span>{isArabic ? 'مواصفات المحرك' : 'Fiche technique'}</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Entries Table */}
              <div className="mt-3.5 overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                      <th className="py-2 px-3 font-semibold">{isArabic ? 'التاريخ' : 'Date'}</th>
                      <th className="py-2 px-3 font-semibold">{isArabic ? 'نوع ولزوجة الزيت' : 'Huile moteur'}</th>
                      <th className="py-2 px-3 font-semibold">{isArabic ? 'الكمية' : 'Qté'}</th>
                      <th className="py-2 px-3 font-semibold">{isArabic ? 'الفلاتر المستبدلة' : 'Filtres'}</th>
                      <th className="py-2 px-3 font-semibold">{isArabic ? 'المبلغ' : 'Montant'}</th>
                      <th className="py-2 px-3 font-semibold">{isArabic ? 'ملاحظات' : 'Notes'}</th>
                      <th className="py-2 px-3 text-end"> </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                    {vehicle.entries.map((entry) => (
                      <tr key={entry.id} className={isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{entry.dateVidange}</td>
                        <td className={`py-2.5 px-3 font-bold ${baseText}`}>{entry.huileModele}</td>
                        <td className="py-2.5 px-3 text-slate-300">{entry.huileQuantite} {entry.huileUnite}</td>
                        <td className="py-2.5 px-3">
                          {entry.filtres && entry.filtres.length > 0 ? (
                            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-amber-300">
                              {entry.filtres.join(', ')}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-amber-400">{formatCurrency(entry.prixTotal)}</td>
                        <td className="py-2.5 px-3 text-slate-400">{entry.notes || '—'}</td>
                        <td className="py-2.5 px-3 text-end">
                          <button
                            type="button"
                            onClick={() => removeEntry(entry.id)}
                            className="rounded-lg p-1 text-slate-500 hover:bg-red-500/15 hover:text-red-400"
                            title={isArabic ? 'حذف السجل' : 'Supprimer'}
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
          );
        })}
      </div>
    </div>
  );
}
