import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  CircleDollarSign,
  Fuel,
  Printer,
  QrCode,
  Search,
  UserPlus,
  Wrench,
} from 'lucide-react';
import { insertSupabaseRow } from '../lib/supabase';
import { useGarageStore, useUiStore } from '../store/store';
import { recordActivity } from '../store/authStore';
import { saveWorkshopService } from '../lib/personalData';

export type CustomerRecord = {
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

const initialCustomers: CustomerRecord[] = [
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

const oilOptions = ['5W-30', '5W-40', '10W-40', '0W-20', '5W-20', '5W-50', '15W-40'];

const filterOptions = {
  oil: ['MANN-HU719/7x', 'PUR-LS489A', 'Bosch 0986AG', 'Mahle KX-063'],
  air: ['MANN-CU2812', 'MANN-EA1998', 'MANN-CU3003', 'Mahle LA 239'],
  fuel: ['MANN-W712/2', 'Bosch 0986AG', 'Mahle KL191', 'Purflux TP 352'],
  cabin: ['MANN-CU24', 'MANN-CU2210', 'Mahle LK735', 'Filtron K 1383'],
};

const productPricing = {
  oilPerLitre: 1200,
  oilFilter: 2600,
  airFilter: 2100,
  fuelFilter: 3200,
  cabinFilter: 1800,
};

const SERVICE_STORAGE_KEY = 'siara_service_labels_v1';
const CLIENTS_STORAGE_KEY = 'siara_customers_list_v1';

export type ServiceTicket = {
  id: string;
  customerName: string;
  phone: string;
  plate: string;
  vehicle: string;
  mileage: number;
  date: string;
  serviceType: string;
  amount: number;
  oilQuantity: number;
  oilType: string;
  filtersUsed: string[];
  notes: string;
};

export function ServicesPage() {
  const { language, theme } = useUiStore();
  const { name: garageName } = useGarageStore();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';

  const [customers, setCustomers] = useState<CustomerRecord[]>(() => {
    try {
      const saved = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialCustomers;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CustomerRecord[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerPlate, setCustomerPlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleEngine, setVehicleEngine] = useState('');
  const [mileage, setMileage] = useState('');

  // Oil configuration
  const [isOilEnabled, setIsOilEnabled] = useState(true);
  const [selectedOil, setSelectedOil] = useState('5W-30');
  const [oilLiters, setOilLiters] = useState<number>(4.5);

  // Filters configuration
  const [selectedFilters, setSelectedFilters] = useState({
    oil: 'MANN-HU719/7x',
    air: 'MANN-CU2812',
    fuel: 'MANN-W712/2',
    cabin: 'MANN-CU24',
  });
  const [enabledFilters, setEnabledFilters] = useState({
    oil: true,
    air: true,
    fuel: false,
    cabin: true,
  });

  const [laborCost, setLaborCost] = useState('500');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceTicket, setServiceTicket] = useState<ServiceTicket | null>(null);

  // Search logic
  useEffect(() => {
    const raw = searchQuery.trim().toLowerCase();
    if (!raw) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const matches = customers.filter((customer) => {
        const haystack = `${customer.name} ${customer.phone} ${customer.plate}`.toLowerCase();
        return haystack.includes(raw);
      });
      setSearchResults(matches);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, customers]);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId]
  );

  const oilTotal = isOilEnabled ? Math.round(oilLiters * productPricing.oilPerLitre) : 0;
  const filterTotal =
    (enabledFilters.oil ? productPricing.oilFilter : 0) +
    (enabledFilters.air ? productPricing.airFilter : 0) +
    (enabledFilters.fuel ? productPricing.fuelFilter : 0) +
    (enabledFilters.cabin ? productPricing.cabinFilter : 0);

  const subtotal = oilTotal + filterTotal + Number(laborCost || 0);

  const formatPrice = (val: number) => `DA ${new Intl.NumberFormat('fr-DZ').format(val)}`;

  const handleSelectCustomer = (customer: CustomerRecord) => {
    setSelectedCustomerId(customer.id);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setCustomerPlate(customer.plate);
    setVehicleModel(customer.model);
    setVehicleEngine(customer.engine);
    setMileage(String(customer.mileage || ''));
    setSelectedOil(customer.recommendedOil || '5W-30');
    setSelectedFilters({
      oil: customer.recommendedFilters?.oil || 'MANN-HU719/7x',
      air: customer.recommendedFilters?.air || 'MANN-CU2812',
      fuel: customer.recommendedFilters?.fuel || 'MANN-W712/2',
      cabin: customer.recommendedFilters?.cabin || 'MANN-CU24',
    });
    setSearchQuery(`${customer.name} - ${customer.plate}`);
    setSearchResults([]);
    setIsAddingNewCustomer(false);
    setSuccessMessage('');
  };

  const handleAddNewCustomer = () => {
    if (!customerName.trim() || !customerPhone.trim()) return;

    const nextCustomer: CustomerRecord = {
      id: `c-${Date.now()}`,
      name: customerName.trim(),
      phone: customerPhone.trim(),
      plate: customerPlate.trim() || '—',
      mileage: Number(mileage || 0),
      make: 'Véhicule',
      model: vehicleModel.trim() || 'Modèle',
      engine: vehicleEngine.trim() || 'Standard',
      lastService: new Date().toISOString().slice(0, 10),
      recommendedOil: selectedOil,
      oilSpec: 'API SN',
      recommendedFilters: selectedFilters,
    };

    const updated = [nextCustomer, ...customers];
    setCustomers(updated);
    try {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    setSelectedCustomerId(nextCustomer.id);
    setIsAddingNewCustomer(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleValidate = async () => {
    if (!mileage || Number(mileage) <= 0) {
      setSuccessMessage(isArabic ? 'تنبيه: يرجى إدخال الكيلوميتراج لتأكيد الخدمة.' : 'Veuillez saisir le kilométrage.');
      return;
    }

    setIsSubmitting(true);
    const filtersList = Object.entries(enabledFilters)
      .filter(([, enabled]) => enabled)
      .map(([k]) => {
        if (k === 'oil') return isArabic ? 'فلتر زيت' : 'Filtre huile';
        if (k === 'air') return isArabic ? 'فلتر هواء' : 'Filtre air';
        if (k === 'fuel') return isArabic ? 'فلتر وقود' : 'Filtre carburant';
        return isArabic ? 'فلتر مقصورة' : 'Filtre habitacle';
      });

    const ticketId = `svc-${Date.now()}`;
    const ticket: ServiceTicket = {
      id: ticketId,
      customerName: customerName.trim() || selectedCustomer?.name || (isArabic ? 'زبون' : 'Client'),
      phone: customerPhone.trim() || selectedCustomer?.phone || '—',
      plate: customerPlate.trim() || selectedCustomer?.plate || '—',
      vehicle: vehicleModel.trim() || selectedCustomer?.model || (isArabic ? 'مركبة' : 'Véhicule'),
      mileage: Number(mileage),
      date: new Date().toISOString(),
      serviceType: isArabic ? 'تغيير زيت وفلاتر' : 'Vidange + filtres',
      amount: subtotal,
      oilQuantity: isOilEnabled ? oilLiters : 0,
      oilType: isOilEnabled ? selectedOil : '—',
      filtersUsed: filtersList,
      notes: `${isOilEnabled ? `${selectedOil} (${oilLiters}L)` : ''} ${filtersList.length > 0 ? `• ${filtersList.join(', ')}` : ''}`,
    };

    setServiceTicket(ticket);
    recordActivity('Enregistrement d’une prestation', `${ticket.serviceType} • ${ticket.plate} • ${formatPrice(ticket.amount)}`);

    // Save to LocalStorage
    try {
      const raw = localStorage.getItem(SERVICE_STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      localStorage.setItem(SERVICE_STORAGE_KEY, JSON.stringify([ticket, ...existing]));
    } catch {}
    saveWorkshopService({
      id: ticket.id,
      plate: ticket.plate.toUpperCase(),
      vehicle: ticket.vehicle,
      date: ticket.date.slice(0, 10),
      service: ticket.serviceType,
      oil: ticket.oilType,
      filters: filtersList.join(', '),
      mileage: ticket.mileage,
      price: ticket.amount,
      garage: garageName,
    });

    // Save to Supabase
    try {
      await insertSupabaseRow('services', {
        garage_id: 1,
        customer_name: ticket.customerName,
        customer_phone: ticket.phone,
        plate_number: ticket.plate,
        vehicle_model: ticket.vehicle,
        mileage: ticket.mileage,
        oil_type: ticket.oilType,
        filters_used: filtersList.join(', '),
        labor_cost: Number(laborCost || 0),
        total_amount: subtotal,
        paid_amount: subtotal,
        payment_status: 'payé',
        notes: ticket.notes,
        service_date: ticket.date,
      });
    } catch (e) {
      console.warn('Supabase sync note:', e);
    }

    setIsSubmitting(false);
    setSuccessMessage(isArabic ? 'تم تسجيل وتأكيد الخدمة بنجاح!' : 'Service enregistré avec succès !');
  };

  const feedbackUrl = serviceTicket
    ? `${window.location.origin}/feedback/${serviceTicket.id}`
    : '';

  const ticketQrUrl = feedbackUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(feedbackUrl)}`
    : '';

  const t = {
    title: isArabic ? 'تسجيل خدمة جديدة' : 'Nouveau service & Vidange',
    search: isArabic ? 'ابحث برقم الهاتف، الاسم أو رقم اللوحة...' : 'Recherche téléphone, nom, immatriculation...',
    newCustomer: isArabic ? '+ زبون جديد' : '+ Nouveau client',
    customerName: isArabic ? 'اسم الزبون' : 'Nom du client',
    phone: isArabic ? 'رقم الهاتف' : 'Téléphone',
    plate: isArabic ? 'رقم اللوحة' : 'Immatriculation',
    model: isArabic ? 'موديل السيارة' : 'Modèle véhicule',
    engine: isArabic ? 'المحرك' : 'Moteur',
    mileage: isArabic ? 'الكيلوميتراج (كم)' : 'Kilométrage actuel (km)',
    oil: isArabic ? 'زيت المحرك' : 'Huile moteur',
    quantity: isArabic ? 'الكمية (لتر)' : 'Quantité (Litres)',
    filters: isArabic ? 'الفلاتر والقطع' : 'Filtres & Pièces',
    labor: isArabic ? 'اليد العاملة' : 'Main d’œuvre',
    total: isArabic ? 'الإجمالي' : 'Total à payer',
    confirm: isArabic ? 'تأكيد وحفظ الخدمة' : 'Valider le service',
    print: isArabic ? 'طباعة الوصل' : 'Imprimer bon',
    openFeedback: isArabic ? 'فتح صفحة التقييم' : 'Ouvrir avis client',
  };

  const cardSurface = isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-sm';
  const subCard = isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50';
  const inputClass = isDark
    ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:border-amber-500'
    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500';

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">SIARA Workshop</p>
          <h2 className={`text-2xl font-black sm:text-3xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.title}</h2>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Left Column: Client & Technical Specs */}
        <div className="space-y-5">
          {/* Customer Search & Select Card */}
          <div className={`rounded-2xl border p-4 sm:p-5 ${cardSurface}`}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">1. {isArabic ? 'بيانات الزبون' : 'Client & Véhicule'}</span>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNewCustomer(!isAddingNewCustomer);
                  setSelectedCustomerId(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20"
              >
                <UserPlus size={14} />
                {t.newCustomer}
              </button>
            </div>

            <div className="relative">
              <div className={`pointer-events-none absolute top-3 flex items-center ${isArabic ? 'right-3.5' : 'left-3.5'}`}>
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className={`w-full rounded-xl border py-2.5 text-sm focus:outline-none ${
                  isArabic ? 'pr-10 pl-3' : 'pl-10 pr-3'
                } ${inputClass}`}
              />

              {searchResults.length > 0 && (
                <div
                  className={`absolute z-30 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border shadow-xl backdrop-blur ${
                    isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  {searchResults.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCustomer(c)}
                      className={`flex w-full items-center justify-between border-b p-3 text-start transition last:border-b-0 ${
                        isDark ? 'border-slate-800 hover:bg-slate-800/70' : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.name}</div>
                        <div className="text-xs text-slate-400">{c.phone} • {c.model}</div>
                      </div>
                      <span className="rounded-lg bg-amber-500/15 px-2 py-1 text-xs font-bold text-amber-400">
                        {c.plate}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Inputs */}
            <div className={`mt-4 grid gap-3 rounded-xl border p-3.5 sm:grid-cols-2 ${subCard}`}>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-400">{t.customerName}</label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Karim Benali"
                  className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none ${inputClass}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-400">{t.phone}</label>
                <input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ex: 0550123456"
                  className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none ${inputClass}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-400">{t.plate}</label>
                <input
                  value={customerPlate}
                  onChange={(e) => setCustomerPlate(e.target.value)}
                  placeholder="Ex: 123-AB-456"
                  className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none ${inputClass}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-400">{t.model}</label>
                <input
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="Ex: Renault Clio IV"
                  className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none ${inputClass}`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-semibold text-slate-400">{t.mileage} *</label>
                <input
                  type="number"
                  min={0}
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="Ex: 45000"
                  className={`w-full rounded-xl border px-3 py-2 text-sm font-bold text-amber-500 focus:outline-none ${inputClass}`}
                />
              </div>

              {isAddingNewCustomer && (
                <button
                  type="button"
                  onClick={handleAddNewCustomer}
                  className="rounded-xl bg-amber-500 py-2 text-xs font-bold text-slate-950 sm:col-span-2 hover:bg-amber-400"
                >
                  {isArabic ? 'حفظ الزبون في القاعدة' : 'Enregistrer le nouveau client'}
                </button>
              )}
            </div>
          </div>

          {/* Oil & Viscosity Card */}
          <div className={`rounded-2xl border p-4 sm:p-5 ${cardSurface}`}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-500">
                <Fuel size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">2. {t.oil}</span>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={isOilEnabled}
                  onChange={(e) => setIsOilEnabled(e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-500"
                />
                <span>{isArabic ? 'تغيير الزيت' : 'Vidange d’huile'}</span>
              </label>
            </div>

            {isOilEnabled && (
              <div className={`space-y-3 rounded-xl border p-3.5 ${subCard}`}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">{isArabic ? 'نوع ولزوجة الزيت' : 'Viscosité d’huile'}</label>
                    <select
                      value={selectedOil}
                      onChange={(e) => setSelectedOil(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none ${inputClass}`}
                    >
                      {oilOptions.map((oil) => (
                        <option key={oil} value={oil}>{oil}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">{t.quantity}</label>
                    <input
                      type="number"
                      step={0.5}
                      min={1}
                      max={20}
                      value={oilLiters}
                      onChange={(e) => setOilLiters(Number(e.target.value))}
                      className={`w-full rounded-xl border px-3 py-2 text-sm font-semibold focus:outline-none ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{isArabic ? 'السعر المقدر للتر:' : 'Prix par litre:'} {formatPrice(productPricing.oilPerLitre)}</span>
                  <span className="font-bold text-amber-400">{isArabic ? 'مجموع الزيت:' : 'Sous-total huile:'} {formatPrice(oilTotal)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Filters Card */}
          <div className={`rounded-2xl border p-4 sm:p-5 ${cardSurface}`}>
            <div className="mb-3 flex items-center gap-2 text-amber-500">
              <Wrench size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">3. {t.filters}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(filterOptions).map(([key, options]) => {
                const typedKey = key as keyof typeof selectedFilters;
                const isChecked = enabledFilters[typedKey];
                const filterNames = {
                  oil: isArabic ? 'فلتر الزيت' : 'Filtre à huile',
                  air: isArabic ? 'فلتر الهواء' : 'Filtre à air',
                  fuel: isArabic ? 'فلتر الوقود' : 'Filtre carburant',
                  cabin: isArabic ? 'فلتر المقصورة' : 'Filtre habitacle',
                };

                return (
                  <div
                    key={key}
                    className={`rounded-xl border p-3 transition ${
                      isChecked ? subCard : isDark ? 'border-slate-800 bg-slate-950/30 opacity-60' : 'border-slate-100 bg-slate-50 opacity-60'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold">{filterNames[typedKey]}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setEnabledFilters((c) => ({
                            ...c,
                            [typedKey]: !c[typedKey],
                          }))
                        }
                        className="h-4 w-4 rounded accent-amber-500"
                      />
                    </div>

                    <select
                      value={selectedFilters[typedKey]}
                      disabled={!isChecked}
                      onChange={(e) =>
                        setSelectedFilters((c) => ({
                          ...c,
                          [typedKey]: e.target.value,
                        }))
                      }
                      className={`w-full rounded-xl border px-2.5 py-1.5 text-xs focus:outline-none disabled:opacity-50 ${inputClass}`}
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Invoice Summary & Receipt Ticket */}
        <div className="space-y-5">
          <div className={`rounded-2xl border p-4 sm:p-5 ${cardSurface}`}>
            <div className="mb-4 flex items-center gap-2 text-amber-500">
              <CircleDollarSign size={18} />
              <h3 className="text-base font-bold">{t.total}</h3>
            </div>

            <div className={`space-y-3 rounded-xl border p-3.5 text-sm ${subCard}`}>
              <div className="flex justify-between text-slate-400">
                <span>{isArabic ? 'الزيت' : 'Huile moteur'}</span>
                <span className="font-semibold text-slate-200">{formatPrice(oilTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isArabic ? 'فلتر الزيت' : 'Filtre huile'}</span>
                <span>{formatPrice(enabledFilters.oil ? productPricing.oilFilter : 0)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isArabic ? 'فلتر الهواء' : 'Filtre air'}</span>
                <span>{formatPrice(enabledFilters.air ? productPricing.airFilter : 0)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isArabic ? 'فلتر الوقود' : 'Filtre carburant'}</span>
                <span>{formatPrice(enabledFilters.fuel ? productPricing.fuelFilter : 0)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isArabic ? 'فلتر المقصورة' : 'Filtre habitacle'}</span>
                <span>{formatPrice(enabledFilters.cabin ? productPricing.cabinFilter : 0)}</span>
              </div>

              {/* Labor input */}
              <div className="border-t border-slate-800 pt-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">{t.labor}</span>
                  <input
                    type="number"
                    min={0}
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value)}
                    className={`w-28 rounded-lg border px-2 py-1 text-end text-sm font-bold ${inputClass}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-700 pt-3 text-base font-bold">
                <span className={isDark ? 'text-white' : 'text-slate-900'}>{isArabic ? 'المجموع النهائي' : 'Total'}</span>
                <span className="text-xl text-amber-500">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleValidate}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-105 active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? (isArabic ? 'جاري الحفظ...' : 'Enregistrement...') : t.confirm}
            </button>

            {successMessage && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Printed Ticket with QR Code */}
            {serviceTicket && (
              <div className="print-ticket mt-5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-slate-100">
                <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                      {isArabic ? 'وصل خدمة وصيانة' : 'Bon d’entretien'}
                    </span>
                    <h4 className="text-lg font-black text-white">{garageName}</h4>
                  </div>
                  <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-300">
                    {serviceTicket.id}
                  </span>
                </div>

                <div className="grid gap-3 text-xs sm:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between"><span className="text-slate-500">{isArabic ? 'الزبون:' : 'Client:'}</span> <strong className="text-white">{serviceTicket.customerName}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">{isArabic ? 'الهاتف:' : 'Tél:'}</span> <span>{serviceTicket.phone}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">{isArabic ? 'اللوحة:' : 'Plaque:'}</span> <span className="text-amber-400">{serviceTicket.plate}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">{isArabic ? 'المركبة:' : 'Véhicule:'}</span> <span>{serviceTicket.vehicle}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">{isArabic ? 'الكيلومتر:' : 'Km:'}</span> <span>{serviceTicket.mileage} km</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">{isArabic ? 'التاريخ:' : 'Date:'}</span> <span>{new Date(serviceTicket.date).toLocaleDateString('fr-DZ')}</span></div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5 text-sm font-bold text-amber-400">
                      <span>{isArabic ? 'المجموع:' : 'Total:'}</span>
                      <span>{formatPrice(serviceTicket.amount)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-center">
                    <img src={ticketQrUrl} alt="QR Code Avis Client" className="h-24 w-24 rounded-lg bg-white p-1" />
                    <p className="mt-1.5 text-[9px] uppercase tracking-wider text-slate-400">
                      {isArabic ? 'امسح للتقييم' : 'Scanner pour avis'}
                    </p>
                  </div>
                </div>

                <div className="no-print mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20"
                  >
                    <Printer size={14} />
                    {t.print}
                  </button>
                  <a
                    href={`/feedback/${serviceTicket.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2 text-center text-xs font-bold text-slate-950 hover:bg-amber-400"
                  >
                    <QrCode size={14} />
                    {t.openFeedback}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
