import { useEffect, useMemo, useState } from 'react';
import { CarFront, CheckCircle2, CircleDollarSign, Fuel, Search, UserPlus, Wrench } from 'lucide-react';
import { useUiStore } from '../store/store';

type CustomerRecord = {
  id: string;
  name: string;
  phone: string;
  plate: string;
  mileage: number;
  make: string;
  model: string;
  engine: string;
  lastService: string;
  recommendedOil: string;
  oilSpec: string;
  recommendedFilters: {
    oil: string;
    air: string;
    fuel: string;
    cabin: string;
  };
};

const mockCustomers: CustomerRecord[] = [
  {
    id: 'c-1',
    name: 'Karim Djerbi',
    phone: '+213555123456',
    plate: '123-AB-456',
    mileage: 42000,
    make: 'Renault',
    model: 'Clio IV',
    engine: 'K9K 1.5 dCi 90',
    lastService: '2026-07-20',
    recommendedOil: '5W-30',
    oilSpec: 'RN0720',
    recommendedFilters: {
      oil: 'MANN-HU719/7x',
      air: 'MANN-CU2812',
      fuel: 'MANN-W712/2',
      cabin: 'MANN-CU24',
    },
  },
  {
    id: 'c-2',
    name: 'Nadia Benali',
    phone: '+213770901122',
    plate: '456-EF-789',
    mileage: 94500,
    make: 'Mercedes',
    model: 'C-Class W204',
    engine: 'OM651 2.1 CDI 170',
    lastService: '2026-08-02',
    recommendedOil: '5W-40',
    oilSpec: 'MB 229.51',
    recommendedFilters: {
      oil: 'MANN-HU719/7x',
      air: 'MANN-EA1998',
      fuel: 'MANN-W712/2',
      cabin: 'MANN-CU24',
    },
  },
  {
    id: 'c-3',
    name: 'Samir Hamdi',
    phone: '+213699112233',
    plate: '321-GH-654',
    mileage: 51800,
    make: 'Toyota',
    model: 'Corolla E170',
    engine: '1ZR-FE 1.6 122',
    lastService: '2026-07-12',
    recommendedOil: '5W-30',
    oilSpec: 'API SN',
    recommendedFilters: {
      oil: 'MANN-HU719/7x',
      air: 'MANN-CU2812',
      fuel: 'MANN-W712/2',
      cabin: 'MANN-CU24',
    },
  },
  {
    id: 'c-4',
    name: 'Leila Merabet',
    phone: '+213540001122',
    plate: '789-CD-123',
    mileage: 68000,
    make: 'Audi',
    model: 'A3 8V',
    engine: 'EA288 2.0 TDI 150',
    lastService: '2026-06-11',
    recommendedOil: '5W-30',
    oilSpec: 'VW 507 00',
    recommendedFilters: {
      oil: 'MANN-HU719/7x',
      air: 'MANN-CU3003',
      fuel: 'Bosch 0986AG',
      cabin: 'MANN-CU2210',
    },
  },
];

const oilOptions = ['5W-30', '5W-40', '10W-40', '0W-20', '5W-20', '5W-50'];

const filterOptions = {
  oil: ['MANN-HU719/7x', 'PUR-LS489A', 'Bosch 0986AG', 'Mahle KX-063'],
  air: ['MANN-CU2812', 'MANN-EA1998', 'MANN-CU3003', 'Mahle LA 239'],
  fuel: ['MANN-W712/2', 'Bosch 0986AG', 'Mahle KL191', 'Purflux TP 352'],
  cabin: ['MANN-CU24', 'MANN-CU2210', 'Mahle LK735', 'Filtron K 1383'],
};

const productPricing = {
  oil: 5400,
  oilFilter: 2600,
  airFilter: 2100,
  fuelFilter: 3200,
  cabinFilter: 1800,
};

<<<<<<< HEAD
=======
const SERVICE_STORAGE_KEY = 'siara_service_labels_v1';

type ServiceTicket = {
  id: string;
  customerName: string;
  phone: string;
  plate: string;
  vehicle: string;
  date: string;
  serviceType: string;
  amount: number;
  notes: string;
};

>>>>>>> 36b65e1 (Initial commit)
function formatPrice(value: number) {
  return `DA ${new Intl.NumberFormat('fr-DZ').format(value)}`;
}

export function ServicesPage() {
  const { language } = useUiStore();
  const isArabic = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CustomerRecord[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerPlate, setCustomerPlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleEngine, setVehicleEngine] = useState('');
  const [mileage, setMileage] = useState('');
  const [selectedOil, setSelectedOil] = useState('5W-30');
  const [selectedFilters, setSelectedFilters] = useState({
    oil: 'MANN-HU719/7x',
    air: 'MANN-CU2812',
    fuel: 'MANN-W712/2',
    cabin: 'MANN-CU24',
  });
  const [enabledFilters, setEnabledFilters] = useState({
    oil: true,
    air: true,
    fuel: true,
    cabin: true,
  });
  const [laborCost, setLaborCost] = useState('300');
  const [successMessage, setSuccessMessage] = useState('');
<<<<<<< HEAD
=======
  const [serviceTicket, setServiceTicket] = useState<ServiceTicket | null>(null);
>>>>>>> 36b65e1 (Initial commit)

  useEffect(() => {
    const raw = searchQuery.trim();
    if (!raw) {
      setSearchResults([]);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const normalized = raw.toLowerCase();
      const matches = mockCustomers.filter((customer) => {
        const haystack = `${customer.name} ${customer.phone} ${customer.plate}`.toLowerCase();
        return haystack.includes(normalized);
      });
      setSearchResults(matches);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const selectedCustomer = useMemo(
    () => mockCustomers.find((customer) => customer.id === selectedCustomerId) ?? null,
    [selectedCustomerId],
  );

  const recommendationText = selectedCustomer
    ? `${selectedCustomer.recommendedOil} – ${selectedCustomer.oilSpec}`
    : `${selectedOil} – ${selectedFilters.oil}`;

  const subtotal =
    (enabledFilters.oil ? productPricing.oil : 0) +
    (enabledFilters.oil ? productPricing.oilFilter : 0) +
    (enabledFilters.air ? productPricing.airFilter : 0) +
    (enabledFilters.fuel ? productPricing.fuelFilter : 0) +
    (enabledFilters.cabin ? productPricing.cabinFilter : 0) +
    Number(laborCost || 0);

  const handleSelectCustomer = (customer: CustomerRecord) => {
    setSelectedCustomerId(customer.id);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setCustomerPlate(customer.plate);
    setVehicleModel(customer.model);
    setVehicleEngine(customer.engine);
    setMileage(String(customer.mileage));
    setSelectedOil(customer.recommendedOil);
    setSelectedFilters({
      oil: customer.recommendedFilters.oil,
      air: customer.recommendedFilters.air,
      fuel: customer.recommendedFilters.fuel,
      cabin: customer.recommendedFilters.cabin,
    });
    setEnabledFilters({
      oil: true,
      air: true,
      fuel: true,
      cabin: true,
    });
    setSearchQuery(`${customer.name} ${customer.phone}`);
    setSearchResults([]);
    setIsAddingNewCustomer(false);
    setSuccessMessage('');
  };

  const handleAddNewCustomer = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      return;
    }

    const nextCustomer: CustomerRecord = {
      id: `c-${Date.now()}`,
      name: customerName.trim(),
      phone: customerPhone.trim(),
      plate: customerPlate.trim() || '—',
      mileage: Number(mileage || 0),
      make: 'Nouvelle',
      model: vehicleModel || 'Véhicule',
      engine: vehicleEngine || 'À renseigner',
      lastService: '—',
      recommendedOil: selectedOil,
      oilSpec: selectedFilters.oil,
      recommendedFilters: selectedFilters,
    };

    mockCustomers.unshift(nextCustomer);
    setSelectedCustomerId(nextCustomer.id);
    setVehicleModel(nextCustomer.model);
    setVehicleEngine(nextCustomer.engine);
    setEnabledFilters({
      oil: true,
      air: true,
      fuel: true,
      cabin: true,
    });
    setSearchQuery('');
    setSearchResults([]);
    setIsAddingNewCustomer(false);
    setSuccessMessage('');
  };

  const handleValidate = () => {
    if (!mileage || Number(mileage) <= 0) {
      setSuccessMessage(isArabic ? 'الكمبيوتر: الكيلوميتراج مطلوب.' : 'Kilométrage requis pour valider.');
      return;
    }

<<<<<<< HEAD
=======
    const ticket: ServiceTicket = {
      id: `svc-${Date.now()}`,
      customerName: customerName.trim() || selectedCustomer?.name || 'Client',
      phone: customerPhone.trim() || selectedCustomer?.phone || '—',
      plate: customerPlate.trim() || selectedCustomer?.plate || '—',
      vehicle: vehicleModel.trim() || selectedCustomer?.model || 'Véhicule',
      date: new Date().toISOString(),
      serviceType: isArabic ? 'تغيير زيت وفلاتر' : 'Vidange + filtres',
      amount: subtotal,
      notes: `${selectedOil} • ${Object.entries(enabledFilters)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key)
        .join(', ') || 'Aucun filtre'}`,
    };

    setServiceTicket(ticket);

    try {
      const raw = window.localStorage.getItem(SERVICE_STORAGE_KEY);
      const existing = raw ? (JSON.parse(raw) as ServiceTicket[]) : [];
      window.localStorage.setItem(SERVICE_STORAGE_KEY, JSON.stringify([ticket, ...existing]));
    } catch {
      // ignore storage errors in browser-only mode
    }

>>>>>>> 36b65e1 (Initial commit)
    setSuccessMessage(
      isArabic ? 'تم تسجيل الخدمة بنجاح.' : 'Service enregistré avec succès.',
    );
  };

<<<<<<< HEAD
=======
  const ticketQrUrl = serviceTicket
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${window.location.origin}/feedback/${serviceTicket.id}`)}`
    : '';

>>>>>>> 36b65e1 (Initial commit)
  const translation = {
    title: isArabic ? 'إضافة خدمة' : 'Ajouter une service',
    searchPlaceholder: isArabic ? 'رقم الهاتف أو رقم اللوحة' : 'Téléphone ou immatriculation',
    noMatch: isArabic ? 'لا يوجد عميل' : 'Aucun client trouvé',
    addCustomer: isArabic ? 'إضافة عميل جديد' : 'Ajouter un nouveau client',
    customerName: isArabic ? 'اسم العميل' : 'Nom du client',
    phone: isArabic ? 'الهاتف' : 'Téléphone',
    plate: isArabic ? 'رقم اللوحة' : 'Immatriculation',
    vehicle: isArabic ? 'المركبة' : 'Véhicule',
    mileage: isArabic ? 'الكيلومتر' : 'Kilométrage',
    oil: isArabic ? 'نوع الزيت' : 'Type d’huile',
    recommended: isArabic ? 'موصى به' : 'Recommandé',
    filters: isArabic ? 'الفلاتر' : 'Filtres',
    labor: isArabic ? 'العمل اليدوي' : 'Main d’œuvre',
    total: isArabic ? 'المجموع' : 'Total',
    validate: isArabic ? 'تأكيد' : 'Valider',
  };

  return (
<<<<<<< HEAD
    <div className="min-h-[calc(100vh-130px)] min-[1024px]:overflow-hidden">
      <div className="mx-auto max-w-7xl space-y-4 p-3 min-[1024px]:p-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl shadow-slate-950/50">
=======
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-ticket, .print-ticket * { visibility: visible; }
          .print-ticket { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-[calc(100vh-130px)] min-[1024px]:overflow-hidden">
        <div className="mx-auto max-w-7xl space-y-4 p-3 min-[1024px]:p-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl shadow-slate-950/50">
>>>>>>> 36b65e1 (Initial commit)
          <div className="mb-3 flex items-center gap-2 text-amber-400">
            <Search size={18} />
            <span className="text-xs font-semibold uppercase tracking-[0.25em]">{translation.title}</span>
          </div>

          <div className="grid gap-4 min-[1024px]:grid-cols-[1.45fr_0.55fr]">
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={translation.searchPlaceholder}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                />

                {searchResults.length > 0 && (
                  <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-xl">
                    {searchResults.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => handleSelectCustomer(customer)}
                        className="flex w-full items-center justify-between gap-3 border-b border-slate-800 px-3 py-2 text-left transition hover:bg-slate-900 last:border-b-0"
                      >
                        <div>
                          <div className="text-sm font-medium text-white">{customer.name}</div>
                          <div className="text-xs text-slate-400">{customer.phone}</div>
                        </div>
                        <div className="text-xs text-amber-300">{customer.plate}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {searchQuery.trim() && searchResults.length === 0 && !selectedCustomer && !isAddingNewCustomer && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNewCustomer(true);
                    setCustomerPhone(searchQuery.trim());
                    setCustomerPlate(searchQuery.trim());
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-300"
                >
                  <UserPlus size={16} />
                  {translation.addCustomer}
                </button>
              )}

              {(isAddingNewCustomer || selectedCustomer) && (
                <div className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 md:grid-cols-2">
                  <input
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder={translation.customerName}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    placeholder={translation.phone}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    value={customerPlate}
                    onChange={(event) => setCustomerPlate(event.target.value)}
                    placeholder={translation.plate}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none md:col-span-2"
                  />
                  {isAddingNewCustomer && (
                    <button
                      type="button"
                      onClick={handleAddNewCustomer}
                      className="md:col-span-2 rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
                    >
                      {isArabic ? 'تأكيد العميل' : 'Valider client'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
              <div className="mb-2 flex items-center gap-2 text-amber-300">
                <CarFront size={16} />
                <span className="text-sm font-semibold">{translation.vehicle}</span>
              </div>
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500">Modèle</label>
                <input
                  value={vehicleModel}
                  onChange={(event) => setVehicleModel(event.target.value)}
                  placeholder="Modèle"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500">Moteur</label>
                <input
                  value={vehicleEngine}
                  onChange={(event) => setVehicleEngine(event.target.value)}
                  placeholder="Moteur"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500">{translation.mileage}</label>
                <input
                  type="number"
                  min={0}
                  value={mileage}
                  onChange={(event) => setMileage(event.target.value)}
                  placeholder="0"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 min-[1024px]:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="mb-3 flex items-center gap-2 text-amber-300">
              <Fuel size={18} />
              <span className="text-sm font-semibold">{translation.oil}</span>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">{translation.oil}</label>
                <select
                  value={selectedOil}
                  onChange={(event) => setSelectedOil(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                >
                  {oilOptions.map((oil) => (
                    <option key={oil} value={oil}>{oil}</option>
                  ))}
                </select>
                <div className="mt-2 text-[11px] text-slate-400">
                  {translation.recommended}: <span className="text-amber-300">{recommendationText}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <Wrench size={14} />
                  {translation.filters}
                </div>

                {Object.entries(filterOptions).map(([key, options]) => {
                  const typedKey = key as keyof typeof selectedFilters;
                  const isChecked = enabledFilters[typedKey];

                  return (
                    <div key={key} className={`rounded-xl border p-3 transition ${isChecked ? 'border-slate-800 bg-slate-950/70' : 'border-slate-800 bg-slate-900/40 opacity-60'}`}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <label className="block text-xs uppercase tracking-[0.2em] text-slate-500">
                          {key === 'oil' ? (isArabic ? 'فلتر الزيت' : 'Filtre à huile') : key === 'air' ? (isArabic ? 'فلتر الهواء' : 'Filtre à air') : key === 'fuel' ? (isArabic ? 'فلتر الوقود' : 'Filtre carburant') : (isArabic ? 'فلتر المقصورة' : 'Filtre habitacle')}
                        </label>
                        <label className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              setEnabledFilters((current) => ({
                                ...current,
                                [key]: !current[typedKey],
                              }))
                            }
                            className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-amber-500"
                          />
                          {isArabic ? 'مُستخدم' : 'Actif'}
                        </label>
                      </div>

                      <select
                        value={selectedFilters[typedKey]}
                        disabled={!isChecked}
                        onChange={(event) =>
                          setSelectedFilters((current) => ({
                            ...current,
                            [key]: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <div className="mt-2 text-[11px] text-slate-400">
                        {translation.recommended}: <span className="text-amber-300">{selectedCustomer ? selectedCustomer.recommendedFilters[typedKey] : options[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="flex items-center gap-2 text-amber-300">
              <CircleDollarSign size={18} />
              <span className="text-sm font-semibold">{translation.total}</span>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>{isArabic ? 'زيت موتور' : 'Huile moteur'}</span>
                <span>{formatPrice(enabledFilters.oil ? productPricing.oil : 0)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>{isArabic ? 'فلتر الزيت' : 'Filtre à huile'}</span>
                <span>{formatPrice(enabledFilters.oil ? productPricing.oilFilter : 0)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>{isArabic ? 'فلتر الهواء' : 'Filtre à air'}</span>
                <span>{formatPrice(enabledFilters.air ? productPricing.airFilter : 0)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>{isArabic ? 'فلتر الوقود' : 'Filtre carburant'}</span>
                <span>{formatPrice(enabledFilters.fuel ? productPricing.fuelFilter : 0)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>{isArabic ? 'فلتر المقصورة' : 'Filtre habitacle'}</span>
                <span>{formatPrice(enabledFilters.cabin ? productPricing.cabinFilter : 0)}</span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">{translation.labor}</label>
                <input
                  type="number"
                  min={0}
                  value={laborCost}
                  onChange={(event) => setLaborCost(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-base font-semibold text-white">
                <span>{isArabic ? 'المجموع' : 'Total'}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleValidate}
<<<<<<< HEAD
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-3 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:opacity-95"
=======
              className="no-print w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-3 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:opacity-95"
>>>>>>> 36b65e1 (Initial commit)
            >
              {translation.validate}
            </button>

            {successMessage && (
<<<<<<< HEAD
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
=======
              <div className="no-print flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
>>>>>>> 36b65e1 (Initial commit)
                <CheckCircle2 size={16} />
                {successMessage}
              </div>
            )}
<<<<<<< HEAD
=======

            {serviceTicket && (
              <div className="print-ticket mt-4 rounded-2xl border border-amber-500/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-slate-200">
                <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-amber-300">Bon d’entretien</p>
                    <h3 className="mt-1 text-lg font-black text-white">SIARA Workshop</h3>
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-300">
                    {serviceTicket.id}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4"><span className="text-slate-400">Client</span><span className="font-medium text-white">{serviceTicket.customerName}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-slate-400">Téléphone</span><span className="font-medium text-white">{serviceTicket.phone}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-slate-400">Immatriculation</span><span className="font-medium text-white">{serviceTicket.plate}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-slate-400">Véhicule</span><span className="font-medium text-white">{serviceTicket.vehicle}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-slate-400">Date</span><span className="font-medium text-white">{new Date(serviceTicket.date).toLocaleDateString('fr-DZ')}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-slate-400">Service</span><span className="font-medium text-white">{serviceTicket.serviceType}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-slate-400">Total</span><span className="font-medium text-amber-300">{formatPrice(serviceTicket.amount)}</span></div>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-center">
                    <img src={ticketQrUrl} alt="QR code service" className="h-28 w-28 rounded-lg border border-slate-700 bg-white p-1" />
                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">Avis client</p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
                  {serviceTicket.notes}
                </div>

                <div className="no-print mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 rounded-xl border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-300"
                  >
                    Imprimer bon
                  </button>
                  <a
                    href={`/feedback/${serviceTicket.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-3 py-2 text-center text-sm font-semibold text-slate-950"
                  >
                    Ouvrir avis client
                  </a>
                </div>
              </div>
            )}
>>>>>>> 36b65e1 (Initial commit)
          </div>
        </div>
      </div>
    </div>
<<<<<<< HEAD
  );
}
=======
    </>
  );
}
>>>>>>> 36b65e1 (Initial commit)
