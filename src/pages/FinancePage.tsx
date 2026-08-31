import { useMemo, useState } from 'react';
import { ArrowUpRight, Banknote, CircleDollarSign, CreditCard, FileWarning, PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
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
  label: string;
  value: string;
  subLabel: string;
  accent: string;
  icon: typeof CircleDollarSign;
  rows: DetailRow[];
};

const formatCurrency = (value: number) => `DA ${value.toLocaleString('fr-DZ')}`;

const details = {
  sales: [
    { id: 'S-1048', date: '2026-08-29', vehicle: 'BMW X5', customer: 'Karim D.', type: 'Vidange + filtre', quantity: '18 L', amount: 124000, status: 'Payé' },
    { id: 'S-1049', date: '2026-08-28', vehicle: 'Mercedes C-Class', customer: 'Nadia B.', type: 'Huile + filtre', quantity: '14 L', amount: 98000, status: 'Payé' },
    { id: 'S-1050', date: '2026-08-27', vehicle: 'Audi A3', customer: 'Leila M.', type: 'Service complet', quantity: '12 L', amount: 76000, status: 'Payé' },
  ],
  receivables: [
    { id: 'R-220', date: '2026-08-22', vehicle: 'Toyota Corolla', customer: 'Farid T.', type: 'Crédit client', quantity: '1 facture', amount: 62000, status: 'À recevoir' },
    { id: 'R-221', date: '2026-08-20', vehicle: 'Renault Clio', customer: 'Lina K.', type: 'Crédit client', quantity: '1 facture', amount: 41500, status: 'À recevoir' },
    { id: 'R-222', date: '2026-08-18', vehicle: 'Peugeot 308', customer: 'Yacine R.', type: 'Crédit client', quantity: '1 facture', amount: 28300, status: 'À recevoir' },
  ],
  debts: [
    { id: 'D-330', date: '2026-08-30', vehicle: '—', customer: 'ACM Lubricants', type: 'Huile moteur', quantity: '120 L', amount: 176000, status: 'À payer' },
    { id: 'D-331', date: '2026-08-26', vehicle: '—', customer: 'AutoParts DZ', type: 'Filtres', quantity: '80 pcs', amount: 92400, status: 'À payer' },
    { id: 'D-332', date: '2026-08-24', vehicle: '—', customer: 'Bays Motion', type: 'Accessoires', quantity: '35 pcs', amount: 58100, status: 'À payer' },
  ],
  expenses: [
    { id: 'E-440', date: '2026-08-29', vehicle: '—', customer: 'Fournisseur', type: 'Salaire + charges', quantity: '1 paie', amount: 425000, status: 'Payé' },
    { id: 'E-441', date: '2026-08-25', vehicle: '—', customer: 'Fournisseur', type: 'Électricité / eau', quantity: '1 facture', amount: 31000, status: 'Payé' },
    { id: 'E-442', date: '2026-08-21', vehicle: '—', customer: 'Fournisseur', type: 'Entretien atelier', quantity: '1 dossier', amount: 24000, status: 'Payé' },
  ],
  losses: [
    { id: 'L-550', date: '2026-08-18', vehicle: 'Mercedes C-Class', customer: 'Client', type: 'Rabais + retour', quantity: '1 service', amount: 12000, status: 'Perte' },
    { id: 'L-551', date: '2026-08-12', vehicle: 'Audi A3', customer: 'Client', type: 'Périmé / stock cassé', quantity: '8 L', amount: 8000, status: 'Perte' },
    { id: 'L-552', date: '2026-08-09', vehicle: 'BMW X5', customer: 'Client', type: 'Réduction commerciale', quantity: '1 dossier', amount: 9500, status: 'Perte' },
  ],
  oil: [
    { id: 'O-600', date: '2026-08-29', vehicle: 'BMW X5', customer: 'Karim D.', type: 'Huile 5W-30', quantity: '18 L', amount: 62000, status: 'Vendu' },
    { id: 'O-601', date: '2026-08-28', vehicle: 'Mercedes C-Class', customer: 'Nadia B.', type: 'Huile 5W-40', quantity: '14 L', amount: 47000, status: 'Vendu' },
    { id: 'O-602', date: '2026-08-27', vehicle: 'Audi A3', customer: 'Leila M.', type: 'Huile 5W-30', quantity: '12 L', amount: 42000, status: 'Vendu' },
  ],
  filters: [
    { id: 'F-700', date: '2026-08-29', vehicle: 'BMW X5', customer: 'Karim D.', type: 'Filtre à huile', quantity: '2 pcs', amount: 3000, status: 'Vendu' },
    { id: 'F-701', date: '2026-08-28', vehicle: 'Mercedes C-Class', customer: 'Nadia B.', type: 'Filtre à air', quantity: '1 pcs', amount: 2400, status: 'Vendu' },
    { id: 'F-702', date: '2026-08-27', vehicle: 'Audi A3', customer: 'Leila M.', type: 'Filtre à carburant', quantity: '1 pcs', amount: 1850, status: 'Vendu' },
  ],
  income: [
    { id: 'I-800', date: '2026-08-29', vehicle: 'BMW X5', customer: 'Karim D.', type: 'Vidange + main d’œuvre', quantity: '1 service', amount: 124000, status: 'Entrée' },
    { id: 'I-801', date: '2026-08-28', vehicle: 'Mercedes C-Class', customer: 'Nadia B.', type: 'Huile + filtre', quantity: '1 service', amount: 98000, status: 'Entrée' },
    { id: 'I-802', date: '2026-08-27', vehicle: 'Audi A3', customer: 'Leila M.', type: 'Service complet', quantity: '1 service', amount: 76000, status: 'Entrée' },
  ],
};

const summaryData: SummaryCard[] = [
  { key: 'sales', label: 'Ventes', value: 'DA 1 440 000', subLabel: 'Total vente', accent: 'from-emerald-500/35 to-emerald-500/10', icon: CircleDollarSign, rows: details.sales },
  { key: 'receivables', label: 'Créances', value: 'DA 132 000', subLabel: 'À recevoir', accent: 'from-sky-500/35 to-sky-500/10', icon: Banknote, rows: details.receivables },
  { key: 'debts', label: 'Dettes', value: 'DA 338 000', subLabel: 'À payer', accent: 'from-rose-500/35 to-rose-500/10', icon: CreditCard, rows: details.debts },
  { key: 'expenses', label: 'Dépenses', value: 'DA 425 000', subLabel: 'Charges', accent: 'from-amber-500/35 to-amber-500/10', icon: Wallet, rows: details.expenses },
  { key: 'losses', label: 'Pertes', value: 'DA 29 500', subLabel: 'Rabais / pertes', accent: 'from-orange-500/35 to-orange-500/10', icon: TrendingDown, rows: details.losses },
  { key: 'oil', label: 'Huile vendue', value: '1 480 L', subLabel: 'Volume total', accent: 'from-cyan-500/35 to-cyan-500/10', icon: TrendingUp, rows: details.oil },
  { key: 'filters', label: 'Filtres vendus', value: '168 pcs', subLabel: 'Par type', accent: 'from-violet-500/35 to-violet-500/10', icon: PiggyBank, rows: details.filters },
  { key: 'income', label: 'Entrées', value: 'DA 1 240 000', subLabel: 'Revenus', accent: 'from-emerald-500/35 to-emerald-500/10', icon: ArrowUpRight, rows: details.income },
];

export function FinancePage() {
  const { language } = useUiStore();
  const isArabic = language === 'ar';
  const [selectedKey, setSelectedKey] = useState<SummaryCard['key']>('sales');

  const selectedItem = useMemo(
    () => summaryData.find((item) => item.key === selectedKey) ?? summaryData[0],
    [selectedKey],
  );

  const labelMap = {
    sales: isArabic ? 'المبيعات' : 'Ventes',
    receivables: isArabic ? 'الذمم المدينة' : 'Créances',
    debts: isArabic ? 'الديون' : 'Dettes',
    expenses: isArabic ? 'المصاريف' : 'Dépenses',
    losses: isArabic ? 'الخسائر' : 'Pertes',
    oil: isArabic ? 'الزيوت المباع' : 'Huile vendue',
    filters: isArabic ? 'الفلاتر المباع' : 'Filtres vendus',
    income: isArabic ? 'المداخيل' : 'Entrées',
  } as const;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Finance</p>
          <h2 className="text-3xl font-black text-white">{isArabic ? 'المالية' : 'Finance'}</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryData.map((item) => {
          const Icon = item.icon;
          const isSelected = item.key === selectedKey;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedKey(item.key)}
              className={`rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_0_1px_rgba(251,146,60,0.35)]'
                  : 'border-slate-700 bg-slate-900/80 hover:border-slate-600'
              }`}
            >
              <div className={`inline-flex rounded-xl bg-gradient-to-br ${item.accent} p-2`}>
                <Icon size={18} className="text-amber-200" />
              </div>
              <p className="mt-4 text-sm text-slate-300">{item.label}</p>
              <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
              <p className="mt-1 text-xs text-slate-400">{item.subLabel}</p>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{isArabic ? 'تفاصيل' : 'Détails'}</p>
            <h3 className="text-2xl font-black text-white">{labelMap[selectedKey]}</h3>
          </div>
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-200">
            {selectedItem.rows.length} {isArabic ? 'éléments' : 'éléments'}
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-700">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="bg-slate-950/80 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">{isArabic ? 'الرقم' : 'N°'}</th>
                <th className="px-4 py-3">{isArabic ? 'التاريخ' : 'Date'}</th>
                <th className="px-4 py-3">{isArabic ? 'السيارة' : 'Véhicule'}</th>
                <th className="px-4 py-3">{isArabic ? 'العميل' : 'Client'}</th>
                <th className="px-4 py-3">{isArabic ? 'النوع' : 'Type'}</th>
                <th className="px-4 py-3">{isArabic ? 'الكمية' : 'Qté'}</th>
                <th className="px-4 py-3">{isArabic ? 'المبلغ' : 'Montant'}</th>
                <th className="px-4 py-3">{isArabic ? 'الحالة' : 'Statut'}</th>
              </tr>
            </thead>
            <tbody>
              {selectedItem.rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-slate-800 bg-slate-900/50 transition hover:bg-slate-800/80"
                >
                  <td className="px-4 py-3 font-semibold text-amber-300">{row.id}</td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3">{row.vehicle}</td>
                  <td className="px-4 py-3">{row.customer}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">{row.quantity}</td>
                  <td className="px-4 py-3 font-semibold text-white">{formatCurrency(row.amount)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
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