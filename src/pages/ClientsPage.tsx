import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Car, CheckCircle2, Phone, Plus, Search, UserPlus, Wallet } from 'lucide-react';
import { fetchSupabaseTable, insertSupabaseRow } from '../lib/supabase';
import { useUiStore } from '../store/store';

export type ServiceRecord = {
  id: string;
  date: string;
  serviceType: string;
  vehicle: string;
  amount: number;
  paid: number;
  status: 'payé' | 'partiel' | 'dette';
  notes: string;
};

export type ClientRow = {
  id: number;
  full_name: string;
  phone: string;
  plate_number: string;
  company_name: string;
  notes: string;
  created_at: string;
  serviceHistory: ServiceRecord[];
};

const storageKey = 'siara_clients_store_v2';

const fallbackClients: ClientRow[] = [
  {
    id: 1,
    full_name: 'Karim Djerbi',
    phone: '+213 555 12 34 56',
    plate_number: '123-AB-456',
    company_name: 'Particulier / خاص',
    notes: 'زبون دائم - تغيير زيت دوري كل 10,000 كم',
    created_at: '2025-01-15T00:00:00Z',
    serviceHistory: [
      {
        id: 'svc-1',
        date: '2026-08-15',
        serviceType: 'Vidange 5W-30 + Filtre huile',
        vehicle: 'BMW X5',
        amount: 12400,
        paid: 12400,
        status: 'payé',
        notes: 'Entretien complet',
      },
      {
        id: 'svc-2',
        date: '2026-05-11',
        serviceType: 'Contrôle général + Filtres',
        vehicle: 'BMW X5',
        amount: 8500,
        paid: 8500,
        status: 'payé',
        notes: 'Filtre habitacle et air',
      },
    ],
  },
  {
    id: 2,
    full_name: 'Nadia Benali',
    phone: '+213 770 90 11 22',
    plate_number: '456-EF-789',
    company_name: 'Particulier / خاص',
    notes: 'Mercedes C-Class W204',
    created_at: '2025-02-21T00:00:00Z',
    serviceHistory: [
      {
        id: 'svc-3',
        date: '2026-08-10',
        serviceType: 'Vidange 5W-40',
        vehicle: 'Mercedes C-Class',
        amount: 9800,
        paid: 9800,
        status: 'payé',
        notes: 'Remplacement huile',
      },
    ],
  },
  {
    id: 3,
    full_name: 'Samir Hamdi',
    phone: '+213 699 11 22 33',
    plate_number: '321-GH-654',
    company_name: 'Entreprise / شركة',
    notes: 'Toyota Corolla - فاتورة شهرية',
    created_at: '2025-03-07T00:00:00Z',
    serviceHistory: [
      {
        id: 'svc-4',
        date: '2026-07-20',
        serviceType: 'Vidange + 4 Filtres',
        vehicle: 'Toyota Corolla',
        amount: 14500,
        paid: 10000,
        status: 'partiel',
        notes: 'باقي مستحق 4,500 دج',
      },
    ],
  },
];

export function ClientsPage() {
  const { language, theme } = useUiStore();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';

  const [clients, setClients] = useState<ClientRow[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return fallbackClients;
  });

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(clients[0]?.id || 1);
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  const [customerForm, setCustomerForm] = useState({
    full_name: '',
    phone: '',
    plate_number: '',
    company_name: 'Particulier',
    notes: '',
  });

  const [serviceForm, setServiceForm] = useState({
    vehicle: '',
    serviceType: 'Vidange + Filtre',
    amount: '8000',
    paid: '8000',
    notes: '',
    date: new Date().toISOString().slice(0, 10),
  });

  // Load from Supabase on mount
  useEffect(() => {
    fetchSupabaseTable<any>('clients', '*').then((rows) => {
      if (rows && rows.length > 0) {
        setClients((prev) => {
          const merged = rows.map((r: any) => {
            const existing = prev.find((c) => c.id === Number(r.id) || c.phone === r.phone);
            return {
              id: Number(r.id) || Date.now(),
              full_name: r.full_name || 'Client',
              phone: r.phone || '',
              plate_number: r.plate_number || '',
              company_name: r.company_name || 'Particulier',
              notes: r.notes || '',
              created_at: r.created_at || new Date().toISOString(),
              serviceHistory: existing?.serviceHistory || [],
            };
          });
          return merged;
        });
      }
    });
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(clients));
    } catch {}
  }, [clients]);

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;

    return clients.filter((c) => {
      const haystack = `${c.full_name} ${c.phone} ${c.plate_number} ${c.company_name}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [clients, search]);

  const selectedClient =
    filteredClients.find((c) => c.id === selectedId) ??
    filteredClients[0] ??
    clients[0] ??
    fallbackClients[0];

  const totalPaid = selectedClient?.serviceHistory.reduce((sum, item) => sum + item.paid, 0) ?? 0;
  const totalDue = selectedClient?.serviceHistory.reduce((sum, item) => sum + (item.amount - item.paid), 0) ?? 0;
  const countVisits = selectedClient?.serviceHistory.length ?? 0;

  const formatCurrency = (value: number) => `DA ${new Intl.NumberFormat('fr-DZ').format(value)}`;

  const handleCreateNewClient = async () => {
    const cleanedName = customerForm.full_name.trim();
    const cleanedPhone = customerForm.phone.trim();
    const cleanedPlate = customerForm.plate_number.trim();

    if (!cleanedName || !cleanedPhone) return;

    const newClient: ClientRow = {
      id: Date.now(),
      full_name: cleanedName,
      phone: cleanedPhone,
      plate_number: cleanedPlate || '—',
      company_name: customerForm.company_name || 'Particulier',
      notes: customerForm.notes || (isArabic ? 'زبون مسجل جديد' : 'Nouveau client'),
      created_at: new Date().toISOString(),
      serviceHistory: [],
    };

    setClients((prev) => [newClient, ...prev]);
    setSelectedId(newClient.id);
    setCustomerForm({ full_name: '', phone: '', plate_number: '', company_name: 'Particulier', notes: '' });
    setShowNewClientForm(false);

    // Sync with Supabase
    try {
      await insertSupabaseRow('clients', {
        garage_id: 1,
        full_name: newClient.full_name,
        phone: newClient.phone,
        plate_number: newClient.plate_number,
        company_name: newClient.company_name,
        notes: newClient.notes,
      });
    } catch {}
  };

  const handleAddService = async () => {
    if (!selectedClient) return;

    const amount = Number(serviceForm.amount) || 0;
    const paid = Number(serviceForm.paid) || 0;

    const record: ServiceRecord = {
      id: `svc-${Date.now()}`,
      date: serviceForm.date,
      serviceType: serviceForm.serviceType,
      vehicle: serviceForm.vehicle || selectedClient.plate_number,
      amount,
      paid,
      status: paid >= amount ? 'payé' : paid > 0 ? 'partiel' : 'dette',
      notes: serviceForm.notes || 'Vidange enregistrée',
    };

    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id ? { ...c, serviceHistory: [record, ...c.serviceHistory] } : c
      )
    );

    setServiceForm({
      vehicle: '',
      serviceType: 'Vidange + Filtre',
      amount: '8000',
      paid: '8000',
      notes: '',
      date: new Date().toISOString().slice(0, 10),
    });

    // Sync to Supabase
    try {
      await insertSupabaseRow('services', {
        garage_id: 1,
        customer_name: selectedClient.full_name,
        customer_phone: selectedClient.phone,
        plate_number: selectedClient.plate_number,
        vehicle_model: record.vehicle,
        service_type: record.serviceType,
        total_amount: amount,
        paid_amount: paid,
        payment_status: record.status,
        notes: record.notes,
        service_date: record.date,
      });
    } catch {}
  };

  const cardSurface = isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-sm';
  const subCard = isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50';
  const baseText = isDark ? 'text-white' : 'text-slate-900';
  const inputClass = isDark
    ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:border-amber-500'
    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500';

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">
            {isArabic ? 'إدارة العملاء والولاء' : 'Gestion des clients'}
          </p>
          <h2 className={`text-2xl font-black sm:text-3xl ${baseText}`}>
            {isArabic ? 'قاعدة بيانات العملاء' : 'Répertoire des clients'}
          </h2>
        </div>

        <div className="relative w-full max-w-sm">
          <Search size={16} className={`pointer-events-none absolute top-3 text-slate-400 ${isArabic ? 'right-3' : 'left-3'}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isArabic ? 'بحث بالاسم، الهاتف، أو اللوحة...' : 'Recherche nom, téléphone, plaque...'}
            className={`w-full rounded-xl border py-2 text-xs focus:outline-none ${isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'} ${inputClass}`}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1.5fr]">
        {/* Left List of Clients */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between rounded-2xl border p-3.5 ${cardSurface}`}>
            <span className="text-xs font-semibold text-slate-400">
              {filteredClients.length} {isArabic ? 'عميل مسجل' : 'clients trouvés'}
            </span>
            <button
              type="button"
              onClick={() => setShowNewClientForm(!showNewClientForm)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 active:scale-95"
            >
              <UserPlus size={14} />
              {isArabic ? 'عميل جديد' : 'Nouveau client'}
            </button>
          </div>

          {showNewClientForm && (
            <div className={`rounded-2xl border p-4 space-y-3 ${cardSurface}`}>
              <h4 className={`text-sm font-bold text-amber-500`}>{isArabic ? 'إضافة عميل جديد' : 'Nouveau client'}</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={customerForm.full_name}
                  onChange={(e) => setCustomerForm({ ...customerForm, full_name: e.target.value })}
                  placeholder={isArabic ? 'الاسم الكامل *' : 'Nom complet *'}
                  className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
                />
                <input
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  placeholder={isArabic ? 'رقم الهاتف *' : 'Téléphone *'}
                  className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
                />
                <input
                  value={customerForm.plate_number}
                  onChange={(e) => setCustomerForm({ ...customerForm, plate_number: e.target.value })}
                  placeholder={isArabic ? 'رقم اللوحة' : 'Immatriculation'}
                  className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
                />
                <select
                  value={customerForm.company_name}
                  onChange={(e) => setCustomerForm({ ...customerForm, company_name: e.target.value })}
                  className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
                >
                  <option value="Particulier">Particulier / خاص</option>
                  <option value="Entreprise">Entreprise / شركة</option>
                  <option value="Flotte">Flotte / أسطول</option>
                </select>
              </div>
              <textarea
                value={customerForm.notes}
                onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                placeholder={isArabic ? 'ملاحظات عن العميل أو سيارته...' : 'Notes et observations...'}
                className={`w-full rounded-xl border p-2 text-xs focus:outline-none ${inputClass}`}
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewClientForm(false)}
                  className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800"
                >
                  {isArabic ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewClient}
                  className="rounded-xl bg-amber-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
                >
                  {isArabic ? 'حفظ العميل' : 'Enregistrer'}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {filteredClients.map((client) => {
              const isSelected = selectedClient?.id === client.id;
              return (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => setSelectedId(client.id)}
                  className={`w-full rounded-2xl border p-3.5 text-start transition ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                      : isDark ? 'border-slate-800 bg-slate-900/80 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`font-bold text-sm ${baseText}`}>{client.full_name}</div>
                      <div className="mt-0.5 text-xs text-slate-400">{client.company_name}</div>
                    </div>
                    <span className="rounded-full bg-slate-800/80 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                      {client.serviceHistory.length} {isArabic ? 'خدمات' : 'services'}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-slate-300"><Phone size={12} /> {client.phone}</span>
                    <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 font-bold text-amber-400">{client.plate_number}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Details Panel */}
        <div className={`space-y-5 rounded-2xl border p-5 ${cardSurface}`}>
          {selectedClient ? (
            <>
              {/* Client Profile Overview */}
              <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                    {isArabic ? 'الملف الشخصي' : 'Fiche client'}
                  </span>
                  <h3 className={`text-xl font-black sm:text-2xl ${baseText}`}>{selectedClient.full_name}</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {selectedClient.phone} • {selectedClient.plate_number} • {selectedClient.company_name}
                  </p>
                </div>
                <div className="flex gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-400">
                    {countVisits} {isArabic ? 'زيارات' : 'visites'}
                  </span>
                  <span className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-400">
                    {formatCurrency(totalPaid)}
                  </span>
                </div>
              </div>

              {/* Financial KPI stats for this client */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className={`rounded-xl border p-3 ${subCard}`}>
                  <p className="text-[11px] text-slate-400">{isArabic ? 'إجمالي المدفوعات' : 'Total payé'}</p>
                  <p className="mt-1 text-base font-black text-emerald-400">{formatCurrency(totalPaid)}</p>
                </div>
                <div className={`rounded-xl border p-3 ${subCard}`}>
                  <p className="text-[11px] text-slate-400">{isArabic ? 'المبالغ المتبقية (ديون)' : 'Solde restant'}</p>
                  <p className={`mt-1 text-base font-black ${totalDue > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {formatCurrency(totalDue)}
                  </p>
                </div>
                <div className={`col-span-2 rounded-xl border p-3 sm:col-span-1 ${subCard}`}>
                  <p className="text-[11px] text-slate-400">{isArabic ? 'آخر زيارة' : 'Dernière visite'}</p>
                  <p className={`mt-1 text-base font-bold ${baseText}`}>
                    {selectedClient.serviceHistory[0]?.date
                      ? new Date(selectedClient.serviceHistory[0].date).toLocaleDateString('fr-DZ')
                      : '—'}
                  </p>
                </div>
              </div>

              {/* Service History Timeline */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-500">
                  <CalendarClock size={16} />
                  <h4 className={`text-sm font-bold ${baseText}`}>{isArabic ? 'سجل الصيانات والخدمات السابقة' : 'Historique des vidanges'}</h4>
                </div>

                <div className="space-y-2.5">
                  {selectedClient.serviceHistory.map((service) => (
                    <div key={service.id} className={`rounded-xl border p-3 text-xs ${subCard}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className={baseText}>{service.serviceType}</strong>
                          <div className="mt-0.5 text-slate-400">{service.date} • {service.vehicle}</div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 font-bold uppercase text-[10px] ${
                            service.status === 'payé'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-amber-500/15 text-amber-400'
                          }`}
                        >
                          {service.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-slate-800/50 pt-2 text-slate-300">
                        <span>{isArabic ? 'المبلغ الإجمالي:' : 'Montant:'} <strong className="text-amber-400">{formatCurrency(service.amount)}</strong></span>
                        <span>{isArabic ? 'المدفوع:' : 'Payé:'} {formatCurrency(service.paid)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast Add Service for this client */}
              <div className={`rounded-xl border p-4 space-y-3 ${subCard}`}>
                <div className="flex items-center gap-2 text-amber-500">
                  <Plus size={16} />
                  <h4 className={`text-sm font-bold ${baseText}`}>{isArabic ? 'إضافة خدمة سريعة لهذا العميل' : 'Ajouter un service rapide'}</h4>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  <input
                    type="date"
                    value={serviceForm.date}
                    onChange={(e) => setServiceForm({ ...serviceForm, date: e.target.value })}
                    className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
                  />
                  <input
                    value={serviceForm.vehicle}
                    onChange={(e) => setServiceForm({ ...serviceForm, vehicle: e.target.value })}
                    placeholder={selectedClient.plate_number || 'Véhicule'}
                    className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
                  />
                  <input
                    value={serviceForm.serviceType}
                    onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
                    placeholder="Vidange 5W-30"
                    className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
                  />
                  <input
                    type="number"
                    value={serviceForm.amount}
                    onChange={(e) => setServiceForm({ ...serviceForm, amount: e.target.value, paid: e.target.value })}
                    placeholder="Montant (DA)"
                    className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddService}
                  className="w-full rounded-xl bg-amber-500 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 active:scale-95"
                >
                  {isArabic ? 'تسجيل وحفظ الخدمة' : 'Enregistrer le service'}
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              {isArabic ? 'اختر عميلاً من القائمة لعرض بياناته' : 'Sélectionnez un client dans la liste'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
