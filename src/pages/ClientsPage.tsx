import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Wallet, Car, CalendarClock, UserPlus } from 'lucide-react';

type ServiceRecord = {
  id: string;
  date: string;
  serviceType: string;
  vehicle: string;
  amount: number;
  paid: number;
  status: 'payé' | 'partiel' | 'dette';
  notes: string;
};

type ClientRow = {
  id: number;
  full_name: string;
  phone: string;
  plate_number: string;
  company_name: string;
  notes: string;
  created_at: string;
  serviceHistory: ServiceRecord[];
};

const storageKey = 'siara_clients_store_v1';

const fallbackClients: ClientRow[] = [
  {
    id: 1,
    full_name: 'Karim J.',
    phone: '+213 555 12 34 56',
    plate_number: '1234-DZ',
    company_name: 'Particulier',
    notes: 'Client premium',
    created_at: '2025-01-15T00:00:00Z',
    serviceHistory: [
      {
        id: 'svc-1',
        date: '2026-08-15',
        serviceType: 'Vidange + filtre',
        vehicle: 'BMW X5',
        amount: 52000,
        paid: 45000,
        status: 'partiel',
        notes: 'Reste 7000 DA',
      },
      {
        id: 'svc-2',
        date: '2026-05-11',
        serviceType: 'Contrôle général',
        vehicle: 'BMW X5',
        amount: 28000,
        paid: 28000,
        status: 'payé',
        notes: 'Service complet',
      },
    ],
  },
  {
    id: 2,
    full_name: 'Nadia P.',
    phone: '+213 550 77 88 99',
    plate_number: '9876-WA',
    company_name: 'Particulier',
    notes: 'Vidanges régulières',
    created_at: '2025-02-21T00:00:00Z',
    serviceHistory: [
      {
        id: 'svc-3',
        date: '2026-08-10',
        serviceType: 'Vidange standard',
        vehicle: 'Renault Clio',
        amount: 16500,
        paid: 16500,
        status: 'payé',
        notes: 'Entretien normal',
      },
    ],
  },
  {
    id: 3,
    full_name: 'Hassan A.',
    phone: '+213 561 90 11 22',
    plate_number: '5500-AB',
    company_name: 'Entreprise',
    notes: 'Client fiable',
    created_at: '2025-03-07T00:00:00Z',
    serviceHistory: [
      {
        id: 'svc-4',
        date: '2026-07-20',
        serviceType: 'Vidange + clim',
        vehicle: 'Peugeot 308',
        amount: 24000,
        paid: 18000,
        status: 'partiel',
        notes: 'À régulariser',
      },
      {
        id: 'svc-5',
        date: '2025-12-01',
        serviceType: 'Contrôle général',
        vehicle: 'Peugeot 308',
        amount: 26000,
        paid: 26000,
        status: 'payé',
        notes: 'Contrôle complet',
      },
    ],
  },
];

const formatCurrency = (value: number) => `${value.toLocaleString('fr-DZ')} DA`;

const defaultNewClient = {
  full_name: '',
  phone: '',
  plate_number: '',
  company_name: 'Particulier',
  notes: '',
};

const defaultNewService = {
  vehicle: '',
  serviceType: 'Vidange',
  amount: '0',
  paid: '0',
  notes: '',
  date: new Date().toISOString().slice(0, 10),
};

export function ClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [customerForm, setCustomerForm] = useState(defaultNewClient);
  const [serviceForm, setServiceForm] = useState(defaultNewService);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ClientRow[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClients(parsed);
          setSelectedId(parsed[0].id);
          return;
        }
      } catch {
        // fallback to default list
      }
    }

    setClients(fallbackClients);
    setSelectedId(fallbackClients[0].id);
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      window.localStorage.setItem(storageKey, JSON.stringify(clients));
    }
  }, [clients]);

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    const source = clients.length > 0 ? clients : fallbackClients;

    if (!q) return source;

    return source.filter((client) => {
      const haystack = [
        client.full_name,
        client.phone,
        client.plate_number,
        client.company_name,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [clients, search]);

  const selectedClient =
    filteredClients.find((client) => client.id === selectedId) ??
    filteredClients[0] ??
    clients[0] ??
    fallbackClients[0];

  useEffect(() => {
    if (!selectedClient && filteredClients[0]) {
      setSelectedId(filteredClients[0].id);
    }
  }, [filteredClients, selectedClient]);

  const totalPaid = selectedClient?.serviceHistory.reduce((sum, item) => sum + item.paid, 0) ?? 0;
  const totalDue = selectedClient?.serviceHistory.reduce((sum, item) => sum + (item.amount - item.paid), 0) ?? 0;
  const countVisits = selectedClient?.serviceHistory.length ?? 0;

  const handleCreateNewClient = () => {
    const cleanedPhone = customerForm.phone.trim();
    const cleanedName = customerForm.full_name.trim();
    const cleanedPlate = customerForm.plate_number.trim();

    if (!cleanedPhone && !cleanedName && !cleanedPlate) return;

    const newClient: ClientRow = {
      id: Date.now(),
      full_name: cleanedName || 'Client nouveau',
      phone: cleanedPhone || 'N/A',
      plate_number: cleanedPlate || 'N/A',
      company_name: customerForm.company_name || 'Particulier',
      notes: customerForm.notes || 'Client ajouté depuis recherche',
      created_at: new Date().toISOString(),
      serviceHistory: [],
    };

    setClients((current) => [newClient, ...current]);
    setSelectedId(newClient.id);
    setCustomerForm(defaultNewClient);
    setShowNewClientForm(false);
    setSearch('');
  };

  const handleAddService = () => {
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
      notes: serviceForm.notes || 'Service ajouté',
    };

    setClients((current) =>
      current.map((client) =>
        client.id === selectedClient.id
          ? { ...client, serviceHistory: [record, ...client.serviceHistory] }
          : client,
      ),
    );

    setServiceForm(defaultNewService);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Clients</p>
          <h2 className="mt-2 text-3xl font-black text-white">Base clients</h2>
        </div>
        <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
          <Search size={18} className="text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Recherche par téléphone ou plaque"
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            aria-label="Recherche client"
          />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_1.5fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
            <span className="text-sm text-slate-300">{filteredClients.length} clients</span>
            <button
              type="button"
              onClick={() => setShowNewClientForm((value) => !value)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-200 hover:bg-amber-500/15"
            >
              <UserPlus size={15} />
              Nouveau client
            </button>
          </div>

          {showNewClientForm && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <input value={customerForm.full_name} onChange={(e) => setCustomerForm({ ...customerForm, full_name: e.target.value })} placeholder="Nom complet" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white" />
                <input value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} placeholder="Téléphone" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white" />
                <input value={customerForm.plate_number} onChange={(e) => setCustomerForm({ ...customerForm, plate_number: e.target.value })} placeholder="Plaque / immatriculation" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white" />
                <select value={customerForm.company_name} onChange={(e) => setCustomerForm({ ...customerForm, company_name: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white">
                  <option>Particulier</option>
                  <option>Entreprise</option>
                  <option>Foyer</option>
                </select>
              </div>
              <textarea value={customerForm.notes} onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })} placeholder="Note client" className="mt-3 min-h-[70px] w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white" />
              <div className="mt-3 flex justify-end">
                <button type="button" onClick={handleCreateNewClient} className="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-400">
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {filteredClients.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-400">
              Aucun client trouvé. Ajoutez un nouveau client avec le numéro de téléphone ou la plaque.
            </div>
          )}

          <div className="space-y-3">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => setSelectedId(client.id)}
                className={[
                  'w-full rounded-2xl border p-4 text-left transition',
                  selectedClient?.id === client.id
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{client.full_name}</p>
                    <p className="mt-1 text-sm text-slate-400">{client.company_name}</p>
                  </div>
                  <span className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                    {client.serviceHistory.length} visites
                  </span>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                  <span>📞 {client.phone}</span>
                  <span>🚗 {client.plate_number}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          {selectedClient ? (
            <>
              <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Client sélectionné</p>
                  <h3 className="mt-2 text-2xl font-black text-white">{selectedClient.full_name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{selectedClient.phone} • {selectedClient.plate_number}</p>
                </div>
                <div className="flex gap-2 text-xs text-slate-300">
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-200">{countVisits} services</span>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-amber-200">{formatCurrency(totalPaid)}</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total payé</p>
                  <p className="mt-2 text-xl font-bold text-white">{formatCurrency(totalPaid)}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total dû</p>
                  <p className="mt-2 text-xl font-bold text-amber-300">{formatCurrency(totalDue)}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dernière visite</p>
                  <p className="mt-2 text-xl font-bold text-white">
                    {selectedClient.serviceHistory[0]?.date ? new Date(selectedClient.serviceHistory[0].date).toLocaleDateString('fr-DZ') : '—'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-white">
                  <CalendarClock size={16} className="text-amber-300" />
                  <h4 className="text-lg font-bold">Historique de services</h4>
                </div>

                <div className="space-y-3">
                  {selectedClient.serviceHistory.map((service) => (
                    <div key={service.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-white">{service.serviceType}</p>
                          <p className="text-xs text-slate-400">{new Date(service.date).toLocaleDateString('fr-DZ')} • {service.vehicle}</p>
                        </div>
                        <span className={[
                          'rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.2em]',
                          service.status === 'payé' ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/30' :
                          service.status === 'partiel' ? 'bg-amber-500/10 text-amber-200 border border-amber-500/30' :
                          'bg-red-500/10 text-red-200 border border-red-500/30'
                        ].join(' ')}>
                          {service.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-300">
                        <span>{formatCurrency(service.amount)}</span>
                        <span>Payé: {formatCurrency(service.paid)}</span>
                        <span>Reste: {formatCurrency(service.amount - service.paid)}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">{service.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-white">
                  <Plus size={16} className="text-amber-300" />
                  <h4 className="text-lg font-bold">Ajouter une nouvelle service</h4>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <input value={serviceForm.date} type="date" onChange={(e) => setServiceForm({ ...serviceForm, date: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
                  <input value={serviceForm.vehicle} onChange={(e) => setServiceForm({ ...serviceForm, vehicle: e.target.value })} placeholder="Véhicule / plaque" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
                  <input value={serviceForm.serviceType} onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })} placeholder="Type de service" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
                  <input type="number" value={serviceForm.amount} onChange={(e) => setServiceForm({ ...serviceForm, amount: e.target.value })} placeholder="Montant total" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
                  <input type="number" value={serviceForm.paid} onChange={(e) => setServiceForm({ ...serviceForm, paid: e.target.value })} placeholder="Montant payé" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
                  <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
                    <Wallet size={16} className="text-amber-300" />
                    {formatCurrency(Number(serviceForm.amount || 0) - Number(serviceForm.paid || 0))} restant
                  </div>
                </div>
                <textarea value={serviceForm.notes} onChange={(e) => setServiceForm({ ...serviceForm, notes: e.target.value })} placeholder="Notes / observation" className="mt-3 min-h-[80px] w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
                <div className="mt-3 flex justify-end">
                  <button type="button" onClick={handleAddService} className="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-400">
                    Ajouter service
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">Sélectionnez un client</div>
          )}
        </div>
      </div>
    </div>
  );
}