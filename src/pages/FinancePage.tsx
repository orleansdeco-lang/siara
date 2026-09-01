import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Banknote,
  CircleDollarSign,
  CreditCard,
  Droplets,
  Filter,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import { useUiStore } from '../store/store';

type DetailRow = {
  id: string;
  date: string;
  vehicle: string;
  customer: string;
  type: string;
  quantity: string;
  amount: number;
  status: string;
};

type SummaryCard = {
  key: 'sales' | 'receivables' | 'debts' | 'expenses' | 'losses' | 'oil' | 'filters' | 'income';
  labelFr: string;
  labelAr: string;
  value: string;
  subLabelFr: string;
  subLabelAr: string;
  accent: string;
  icon: typeof CircleDollarSign;
  rows: DetailRow[];
};

const formatCurrency = (value: number) => `DA ${new Intl.NumberFormat('fr-DZ').format(value)}`;

const details = {
  sales: [
    { id: 'S-1048', date: '2026-08-29', vehicle: 'BMW X5', customer: 'Karim D.', type: 'Vidange 5W-30 + Filtre', quantity: '18 L', amount: 124000, status: 'Payé' },
    { id: 'S-1049', date: '2026-08-28', vehicle: 'Mercedes C-Class', customer: 'Nadia B.', type: 'Huile 5W-40 + 3 Filtres', quantity: '14 L', amount: 98000, status: 'Payé' },
    { id: 'S-1050', date: '2026-08-27', vehicle: 'Audi A3', customer: 'Leila M.', type: 'Service complet', quantity: '12 L', amount: 76000, status: 'Payé' },
  ],
  receivables: [
    { id: 'R-220', date: '2026-08-22', vehicle: 'Toyota Corolla', customer: 'Farid T.', type: 'Crédit client / دين عميل', quantity: '1 facture', amount: 62000, status: 'À recevoir' },
    { id: 'R-221', date: '2026-08-20', vehicle: 'Renault Clio', customer: 'Lina K.', type: 'Crédit client / دين عميل', quantity: '1 facture', amount: 41500, status: 'À recevoir' },
    { id: 'R-222', date: '2026-08-18', vehicle: 'Peugeot 308', customer: 'Yacine R.', type: 'Crédit client / دين عميل', quantity: '1 facture', amount: 28300, status: 'À recevoir' },
  ],
  debts: [
    { id: 'D-330', date: '2026-08-30', vehicle: '—', customer: 'ACM Lubricants', type: 'Huile moteur 5W-30 (Fûts)', quantity: '120 L', amount: 176000, status: 'À payer' },
    { id: 'D-331', date: '2026-08-26', vehicle: '—', customer: 'AutoParts DZ', type: 'Filtres MANN', quantity: '80 pcs', amount: 92400, status: 'À payer' },
    { id: 'D-332', date: '2026-08-24', vehicle: '—', customer: 'Bays Motion', type: 'Accessoires & Outillage', quantity: '35 pcs', amount: 58100, status: 'À payer' },
  ],
  expenses: [
    { id: 'E-440', date: '2026-08-29', vehicle: '—', customer: 'Personnel', type: 'Salaires & Primes', quantity: '3 employés', amount: 425000, status: 'Payé' },
    { id: 'E-441', date: '2026-08-25', vehicle: '—', customer: 'Sonelgaz', type: 'Électricité atelier', quantity: '1 facture', amount: 31000, status: 'Payé' },
    { id: 'E-442', date: '2026-08-21', vehicle: '—', customer: 'Fournisseur', type: 'Consommables & Nettoyage', quantity: '1 lot', amount: 24000, status: 'Payé' },
  ],
  losses: [
    { id: 'L-550', date: '2026-08-18', vehicle: 'Mercedes C-Class', customer: 'Client', type: 'Remise commerciale', quantity: '1 service', amount: 12000, status: 'Perte' },
    { id: 'L-551', date: '2026-08-12', vehicle: 'Audi A3', customer: 'Atelier', type: 'Bidon endommagé', quantity: '8 L', amount: 8000, status: 'Perte' },
  ],
  oil: [
    { id: 'O-600', date: '2026-08-29', vehicle: 'BMW X5', customer: 'Karim D.', type: 'Huile 5W-30 Synthèse', quantity: '18 L', amount: 62000, status: 'Vendu' },
    { id: 'O-601', date: '2026-08-28', vehicle: 'Mercedes C-Class', customer: 'Nadia B.', type: 'Huile 5W-40', quantity: '14 L', amount: 47000, status: 'Vendu' },
  ],
  filters: [
    { id: 'F-700', date: '2026-08-29', vehicle: 'BMW X5', customer: 'Karim D.', type: 'Filtre à huile MANN', quantity: '2 pcs', amount: 5200, status: 'Vendu' },
    { id: 'F-701', date: '2026-08-28', vehicle: 'Mercedes C-Class', customer: 'Nadia B.', type: 'Filtre à air', quantity: '1 pcs', amount: 2100, status: 'Vendu' },
  ],
  income: [
    { id: 'I-800', date: '2026-08-29', vehicle: 'BMW X5', customer: 'Karim D.', type: 'Vidange complète + Main d’œuvre', quantity: '1 service', amount: 124000, status: 'Entrée' },
    { id: 'I-801', date: '2026-08-28', vehicle: 'Mercedes C-Class', customer: 'Nadia B.', type: 'Huile + filtres', quantity: '1 service', amount: 98000, status: 'Entrée' },
  ],
};

const summaryData: SummaryCard[] = [
  { key: 'sales', labelFr: 'Chiffre d’affaires', labelAr: 'إجمالي المبيعات', value: 'DA 1,440,000', subLabelFr: 'Total ventes', subLabelAr: 'مبيعات الخدمات والزيوت', accent: 'from-emerald-500/35 to-emerald-500/10', icon: CircleDollarSign, rows: details.sales },
  { key: 'receivables', labelFr: 'Créances clients', labelAr: 'الديون المستحقة عند العملاء', value: 'DA 131,800', subLabelFr: 'À encaisser', subLabelAr: 'مستحقات للتحصيل', accent: 'from-sky-500/35 to-sky-500/10', icon: Banknote, rows: details.receivables },
  { key: 'debts', labelFr: 'Dettes fournisseurs', labelAr: 'ديون الموردين والشركات', value: 'DA 326,500', subLabelFr: 'À payer', subLabelAr: 'مستحقات واجبة الدفع', accent: 'from-rose-500/35 to-rose-500/10', icon: CreditCard, rows: details.debts },
  { key: 'expenses', labelFr: 'Charges & Dépenses', labelAr: 'المصاريف والرواتب', value: 'DA 480,000', subLabelFr: 'Charges fixes', subLabelAr: 'تكاليف تشغيلية', accent: 'from-amber-500/35 to-amber-500/10', icon: Wallet, rows: details.expenses },
  { key: 'losses', labelFr: 'Pertes & Remises', labelAr: 'الخصومات والتخفيضات', value: 'DA 20,000', subLabelFr: 'Remises accordées', subLabelAr: 'تخفيضات وهدر', accent: 'from-orange-500/35 to-orange-500/10', icon: TrendingDown, rows: details.losses },
  { key: 'oil', labelFr: 'Huile vendue', labelAr: 'الزيوت المباعة', value: '1,480 Litres', subLabelFr: 'Volume écoulé', subLabelAr: 'حجم الزيت المباع', accent: 'from-cyan-500/35 to-cyan-500/10', icon: Droplets, rows: details.oil },
  { key: 'filters', labelFr: 'Filtres vendus', labelAr: 'الفلاتر المباعة', value: '168 pcs', subLabelFr: 'Unités changées', subLabelAr: 'عدد الفلاتر المستبدلة', accent: 'from-violet-500/35 to-violet-500/10', icon: Filter, rows: details.filters },
  { key: 'income', labelFr: 'Encaissements réels', labelAr: 'السيولة المحصلة في الصندوق', value: 'DA 1,240,000', subLabelFr: 'Trésorerie nette', subLabelAr: 'نقدية الصندوق', accent: 'from-emerald-500/35 to-emerald-500/10', icon: ArrowUpRight, rows: details.income },
];

export function FinancePage() {
  const { language, theme } = useUiStore();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';

  const [selectedKey, setSelectedKey] = useState<SummaryCard['key']>('sales');

  const selectedItem = useMemo(
    () => summaryData.find((item) => item.key === selectedKey) ?? summaryData[0],
    [selectedKey]
  );

  const cardSurface = isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-sm';
  const baseText = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">
            {isArabic ? 'المحاسبة والمالية' : 'Finance & Caisse'}
          </p>
          <h2 className={`text-2xl font-black sm:text-3xl ${baseText}`}>
            {isArabic ? 'التقارير المالية وحركة الصندوق' : 'Rapports financiers & Trésorerie'}
          </h2>
        </div>
      </div>

      {/* Summary 8-Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item) => {
          const Icon = item.icon;
          const isSelected = item.key === selectedKey;
          const label = isArabic ? item.labelAr : item.labelFr;
          const subLabel = isArabic ? item.subLabelAr : item.subLabelFr;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedKey(item.key)}
              className={`flex flex-col justify-between rounded-2xl border p-4 text-start transition active:scale-95 ${
                isSelected
                  ? 'border-amber-500 bg-amber-500/10 shadow-md ring-1 ring-amber-500/50'
                  : `${cardSurface} hover:border-slate-700`
              }`}
            >
              <div>
                <div className={`inline-flex rounded-xl bg-gradient-to-br ${item.accent} p-2`}>
                  <Icon size={18} className="text-amber-400" />
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-400">{label}</p>
                <p className={`mt-1 text-xl font-black ${baseText}`}>{item.value}</p>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">{subLabel}</p>
            </button>
          );
        })}
      </div>

      {/* Details Table Card */}
      <div className={`rounded-2xl border p-5 ${cardSurface}`}>
        <div className="mb-4 flex items-center justify-between border-b border-slate-800/50 pb-3">
          <div>
            <span className="text-xs font-bold uppercase text-amber-500">
              {isArabic ? 'تفاصيل السجلات' : 'Détails des écritures'}
            </span>
            <h3 className={`mt-0.5 text-lg font-bold ${baseText}`}>
              {isArabic ? selectedItem.labelAr : selectedItem.labelFr}
            </h3>
          </div>
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
            {selectedItem.rows.length} {isArabic ? 'سجلات' : 'écritures'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                <th className="py-2.5 px-3">{isArabic ? 'المرجع' : 'Réf'}</th>
                <th className="py-2.5 px-3">{isArabic ? 'التاريخ' : 'Date'}</th>
                <th className="py-2.5 px-3">{isArabic ? 'الطرف المعني / الزبون' : 'Tiers / Client'}</th>
                <th className="py-2.5 px-3">{isArabic ? 'البيان / نوع الخدمة' : 'Description'}</th>
                <th className="py-2.5 px-3">{isArabic ? 'الكمية' : 'Volume / Qté'}</th>
                <th className="py-2.5 px-3">{isArabic ? 'المبلغ' : 'Montant'}</th>
                <th className="py-2.5 px-3">{isArabic ? 'الحالة' : 'Statut'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {selectedItem.rows.map((row) => (
                <tr key={row.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">{row.id}</td>
                  <td className="py-3 px-3 text-slate-400">{row.date}</td>
                  <td className={`py-3 px-3 font-semibold ${baseText}`}>{row.customer}</td>
                  <td className="py-3 px-3 text-slate-300">{row.type}</td>
                  <td className="py-3 px-3 text-slate-400">{row.quantity}</td>
                  <td className={`py-3 px-3 font-bold ${baseText}`}>{formatCurrency(row.amount)}</td>
                  <td className="py-3 px-3">
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
