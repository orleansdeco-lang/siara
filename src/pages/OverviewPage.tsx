import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CalendarRange,
  CarFront,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Droplets,
  FileWarning,
  MessageSquareText,
  PackageSearch,
  ReceiptText,
  Search,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Wallet,
  Wrench,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useUiStore } from '../store/store';

const dateRanges = {
  fr: ['Aujourd’hui', 'Hier', 'Cette semaine', 'Ce mois', 'Personnalisé'],
  ar: ['اليوم', 'أمس', 'هذا الأسبوع', 'هذا الشهر', 'مخصص'],
};

const quickActions = {
  fr: [
    { label: 'Nouveau service', icon: ClipboardList },
    { label: 'Client', icon: Search },
    { label: 'Véhicule', icon: CarFront },
    { label: 'Vente', icon: ShoppingCart },
    { label: 'Dépense', icon: ReceiptText },
    { label: 'Scanner', icon: Sparkles },
  ],
  ar: [
    { label: 'خدمة جديدة', icon: ClipboardList },
    { label: 'العميل', icon: Search },
    { label: 'المركبة', icon: CarFront },
    { label: 'بيع', icon: ShoppingCart },
    { label: 'مصروف', icon: ReceiptText },
    { label: 'الماسح', icon: Sparkles },
  ],
};

const workshopStatus = {
  fr: [
    { bay: 'Poste 1', status: 'En cours', vehicle: 'BMW X5', eta: '12:30' },
    { bay: 'Poste 2', status: 'En attente', vehicle: 'Renault Clio', eta: '13:00' },
    { bay: 'Poste 3', status: 'Prêt', vehicle: 'Mercedes C-Class', eta: '14:15' },
    { bay: 'Poste 4', status: 'Inspection', vehicle: 'Toyota Corolla', eta: '15:45' },
  ],
  ar: [
    { bay: 'المنصّة 1', status: 'قيد التنفيذ', vehicle: 'BMW X5', eta: '12:30' },
    { bay: 'المنصّة 2', status: 'في الانتظار', vehicle: 'Renault Clio', eta: '13:00' },
    { bay: 'المنصّة 3', status: 'جاهز', vehicle: 'Mercedes C-Class', eta: '14:15' },
    { bay: 'المنصّة 4', status: 'فحص', vehicle: 'Toyota Corolla', eta: '15:45' },
  ],
};

const serviceRows = [
  { id: 'SV-1048', vehicle: 'BMW X5', owner: 'Karim D.', oil: '5W-30', total: 'DA 124,000', status: 'In progress' },
  { id: 'SV-1049', vehicle: 'Mercedes C-Class', owner: 'Nadia B.', oil: '5W-40', total: 'DA 98,000', status: 'Ready' },
  { id: 'SV-1050', vehicle: 'Audi A3', owner: 'Leila M.', oil: '5W-30', total: 'DA 76,000', status: 'Done' },
  { id: 'SV-1051', vehicle: 'Toyota Corolla', owner: 'Samir H.', oil: '5W-40', total: 'DA 68,000', status: 'Waiting' },
];

const revenueTrend = [
  { name: 'Lun', revenue: 42 },
  { name: 'Mar', revenue: 38 },
  { name: 'Mer', revenue: 58 },
  { name: 'Jeu', revenue: 45 },
  { name: 'Ven', revenue: 70 },
  { name: 'Sam', revenue: 66 },
  { name: 'Dim', revenue: 81 },
];

const productMix = {
  fr: [
    { name: 'Huile', value: 48 },
    { name: 'Filtres', value: 25 },
    { name: 'Fluides', value: 15 },
    { name: 'Accessoires', value: 12 },
  ],
  ar: [
    { name: 'الزيت', value: 48 },
    { name: 'الفلتر', value: 25 },
    { name: 'السوائل', value: 15 },
    { name: 'الإكسسوارات', value: 12 },
  ],
};

const debtRows = [
  { customer: 'Farid T.', amount: 'DA 62,000', due: '5 jours' },
  { customer: 'Lina K.', amount: 'DA 41,500', due: '9 jours' },
  { customer: 'Yacine R.', amount: 'DA 28,300', due: '12 jours' },
];

const supplierDebtRows = [
  { supplier: 'ACM Lubricants', amount: 'DA 176,000', due: '6 jours' },
  { supplier: 'AutoParts DZ', amount: 'DA 92,400', due: '11 jours' },
  { supplier: 'Bays Motion', amount: 'DA 58,100', due: '4 jours' },
];

const stockAlerts = [
  { item: 'Huile 5W-30', qty: '12 fûts', level: 'Stock faible' },
  { item: 'Filtre à huile MANN-HU719/7x', qty: '3 packs', level: 'Rupture' },
  { item: 'Liquide de frein', qty: '5 bouteilles', level: 'Stock faible' },
];

const barrelMonitoring = [
  { name: '5W-30', current: 28, max: 40 },
  { name: '5W-40', current: 18, max: 35 },
  { name: '10W-40', current: 12, max: 28 },
  { name: 'Huile de boîte', current: 8, max: 22 },
];

const maintenanceReminders = [
  { vehicle: 'Renault Clio', due: 'Dans 3 jours', service: 'Huile + filtre' },
  { vehicle: 'Peugeot 308', due: 'Dans 7 jours', service: 'Contrôle des freins' },
  { vehicle: 'Toyota Yaris', due: 'Dans 10 jours', service: 'Service refroidissement' },
];

const documentAlerts = [
  { doc: 'Renouvellement assurance', due: '12 jours' },
  { doc: 'Permis élimination huile usagée', due: '3 jours' },
  { doc: 'Certificat TVA', due: '28 jours' },
];

const employeeRows = [
  { name: 'Amina N.', role: 'Chef d’atelier', performance: 96, commission: 'DA 28,500' },
  { name: 'Youssef R.', role: 'Technicien', performance: 91, commission: 'DA 24,000' },
  { name: 'Sonia D.', role: 'Ventes', performance: 88, commission: 'DA 19,800' },
  { name: 'Hakim M.', role: 'Support atelier', performance: 84, commission: 'DA 15,200' },
];

const topProducts = [
  { name: 'Huile moteur 5W-30', sold: 186 },
  { name: 'Filtres à huile', sold: 126 },
  { name: 'Liquide de frein', sold: 94 },
  { name: 'Pré-mix refroidissement', sold: 71 },
];

const reviews = [
  { customer: 'Amine K.', rating: 5, comment: 'Très professionnel, délai rapide et prix transparent.' },
  { customer: 'Sarah L.', rating: 5, comment: 'Excellent suivi sur mon véhicule et communication claire.' },
  { customer: 'Rachid B.', rating: 4, comment: 'Bon service, livraison rapide et suivi après-vente correct.' },
];

const criticalAlerts = [
  { level: 'Critique', label: 'Caisse sous le seuil attendu', detail: 'DA 118,000 vs cible DA 180,000' },
  { level: 'Alerte', label: 'Deux huiles en stock faible', detail: '5W-30 et 10W-40 à reconstituer' },
  { level: 'Alerte', label: '3 documents à expiration', detail: 'Renouveler avant fin de semaine' },
];

const closingSummary = [
  { label: 'Clôture attendue', value: 'DA 1,240,000' },
  { label: 'Marge cible', value: '32.8%' },
  { label: 'Risque cash', value: 'Faible' },
];

const pieColors = ['#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7'];

export function OverviewPage() {
  const { language, theme } = useUiStore();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';
  const [selectedRange, setSelectedRange] = useState(isArabic ? 'اليوم' : 'Aujourd’hui');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [now, setNow] = useState(new Date());
  const [messages, setMessages] = useState([
    { role: 'assistant', text: isArabic ? 'صباح الخير. الإيرادات ترتفع بنسبة 18.4% هذا الأسبوع، ومخزون الزيت مستقر.' : 'Good morning. Revenue is up 18.4% this week, and the oil inventory is stable.' },
  ]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setSelectedRange(isArabic ? 'اليوم' : 'Aujourd’hui');
  }, [isArabic]);

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat(isArabic ? 'ar-DZ' : 'fr-FR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(now),
    [isArabic, now],
  );

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat(isArabic ? 'ar-DZ' : 'fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now),
    [isArabic, now],
  );

  const kpis = [
    { label: isArabic ? 'الإيرادات' : 'Revenue', value: 'DA 1,240,000', delta: '+18.4%', trend: 'up', icon: CircleDollarSign },
    { label: isArabic ? 'المصروفات' : 'Expenses', value: 'DA 425,000', delta: '-6.1%', trend: 'down', icon: Wallet },
    { label: isArabic ? 'الربح' : 'Profit', value: 'DA 815,000', delta: '+12.8%', trend: 'up', icon: TrendingUp },
    { label: isArabic ? 'صندوق النقدية' : 'Cash register', value: 'DA 198,500', delta: '+4.7%', trend: 'up', icon: CreditCard },
  ];

  const handleSendAi = () => {
    const text = chatInput.trim();
    if (!text) return;

    setMessages((previous) => [...previous, { role: 'user', text }]);
    const lower = text.toLowerCase();

    let response = isArabic
      ? 'أستطيع تلخيص حالة الورشة: الإيرادات جيدة، لكن منتجين من الزيوت يحتاجان لإعادة التوريد وثلاثة مستندات على وشك الانتهاء.'
      : 'I can summarize the workshop status: revenue is healthy, but two oil SKUs need restocking and three documents are expiring soon.';

    if (lower.includes('stock') || lower.includes('inventory') || lower.includes('مخزون') || lower.includes('زيت')) {
      response = isArabic
        ? 'مخزون الزيوت أقل من الهدف: 5W-30 عند 28% و10W-40 عند 12%. أعد الطلب قبل الجمعة.'
        : 'Current oil stock is slightly below target: 5W-30 is at 28% capacity and 10W-40 is at 12% capacity. Reorder by Friday.';
    } else if (lower.includes('revenue') || lower.includes('profit') || lower.includes('إيراد') || lower.includes('ربح')) {
      response = isArabic
        ? 'الإيرادات للفترة المختارة هي DA 1,240,000 مع ربح إجمالي DA 815,000 وهامش 32.8%.'
        : 'Revenue for the selected period is DA 1,240,000 with a gross profit of DA 815,000 and a 32.8% margin.';
    } else if (lower.includes('debt') || lower.includes('customer') || lower.includes('دين') || lower.includes('عميل')) {
      response = isArabic
        ? 'المديونيات من العملاء تبلغ DA 131,800 ومبالغ الموردين DA 326,500. أكبر فاتورة عميل هي Farid T. بمبلغ DA 62,000.'
        : 'Customer receivables total DA 131,800 and supplier payables total DA 326,500. The largest customer invoice is Farid T. at DA 62,000.';
    }

    setMessages((previous) => [...previous, { role: 'assistant', text: response }]);
    setChatInput('');
  };

  const cardSurface = isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90';
  const subCard = isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50';
  const baseText = isDark ? 'text-white' : 'text-slate-900';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';
  const softText = isDark ? 'text-slate-300' : 'text-slate-600';
  const inputClass = isDark ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-800 placeholder:text-slate-400';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400">{isArabic ? 'لوحة مالك الورشة' : 'Owner dashboard'}</p>
          <h2 className={`mt-2 text-3xl font-bold ${baseText}`}>{isArabic ? 'نظرة عامة على أداء الورشة' : 'Workshop performance overview'}</h2>
        </div>

        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
          <div className={`rounded-2xl border px-4 py-3 text-sm ${cardSurface} ${softText}`}>
            <div className={mutedText}>{isArabic ? 'التاريخ الحالي' : 'Current date'}</div>
            <div className={`mt-1 font-semibold ${baseText}`}>{formattedDate}</div>
            <div className="text-amber-300">{formattedTime}</div>
          </div>

          <div className={`flex flex-wrap gap-2 rounded-2xl border p-1.5 ${cardSurface}`}>
            {(dateRanges[language]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                  selectedRange === range
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {(quickActions[language]).map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className={`rounded-2xl border p-3 text-left transition ${cardSurface} ${isDark ? 'hover:border-slate-700 hover:bg-slate-900' : 'hover:border-slate-300 hover:bg-slate-50'}`}
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
              <Icon size={18} />
            </div>
            <div className={`text-sm font-medium ${baseText}`}>{label}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, delta, trend, icon: Icon }) => (
          <div key={label} className={`rounded-2xl border p-5 shadow-lg ${cardSurface} ${isDark ? 'shadow-slate-950/30' : 'shadow-slate-200/60'}`}>
            <div className="flex items-center justify-between">
              <p className={mutedText}>{label}</p>
              <div className={`rounded-xl p-2 ${isDark ? 'bg-slate-950 text-amber-300' : 'bg-slate-100 text-amber-500'}`}>
                <Icon size={16} />
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-3">
              <span className={`text-3xl font-bold ${baseText}`}>{value}</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${trend === 'up' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}>
                {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          <div className={`rounded-2xl border p-5 ${cardSurface}`}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList size={18} className="text-amber-400" />
                <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'خدمات اليوم' : 'Today’s services'}</h3>
              </div>
              <button type="button" className="text-sm text-amber-300">{isArabic ? 'عرض الكل' : 'View all'}</button>
            </div>

            <div className={`overflow-hidden rounded-xl border ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <table className={`min-w-full divide-y text-left text-sm ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-200 text-slate-700'}`}>
                <thead className={isDark ? 'bg-slate-950/80 text-slate-400' : 'bg-slate-100 text-slate-500'}>
                  <tr>
                    <th className="px-4 py-3 font-medium">{isArabic ? 'رقم الخدمة' : 'Ticket'}</th>
                    <th className="px-4 py-3 font-medium">{isArabic ? 'المركبة' : 'Vehicle'}</th>
                    <th className="px-4 py-3 font-medium">{isArabic ? 'المالك' : 'Owner'}</th>
                    <th className="px-4 py-3 font-medium">{isArabic ? 'الزيت' : 'Oil'}</th>
                    <th className="px-4 py-3 font-medium">{isArabic ? 'الإجمالي' : 'Total'}</th>
                    <th className="px-4 py-3 font-medium">{isArabic ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className={isDark ? 'divide-y divide-slate-800 bg-slate-900' : 'divide-y divide-slate-200 bg-white'}>
                  {serviceRows.map((service) => (
                    <tr key={service.id} className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                      <td className={`px-4 py-3 font-medium ${baseText}`}>{service.id}</td>
                      <td className="px-4 py-3">{service.vehicle}</td>
                      <td className="px-4 py-3">{service.owner}</td>
                      <td className="px-4 py-3">{service.oil}</td>
                      <td className="px-4 py-3">{service.total}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-amber-500/15 px-2 py-1 text-[11px] font-medium text-amber-300">{service.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className={`rounded-2xl border p-5 ${cardSurface}`}>
              <div className="mb-5 flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'أداء الأعمال' : 'Business performance'}</h3>
                <span className="text-sm text-emerald-300">+24.6%</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend}>
                    <defs>
                      <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={isDark ? '#334155' : '#cbd5e1'} strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#475569'} />
                    <YAxis stroke={isDark ? '#94a3b8' : '#475569'} />
                    <Tooltip contentStyle={{ background: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: 12 }} />
                    <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#revenueFill)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`rounded-2xl border p-5 ${cardSurface}`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'أفضل المنتجات' : 'Top products'}</h3>
                <span className={mutedText}>{isArabic ? 'هذا الشهر' : 'This month'}</span>
              </div>
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product.name}>
                    <div className={`mb-1 flex items-center justify-between text-sm ${softText}`}>
                      <span>{product.name}</span>
                      <span>{product.sold}</span>
                    </div>
                    <div className={`h-2 overflow-hidden rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400" style={{ width: `${Math.max(35, product.sold / 2)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className={`rounded-2xl border p-5 ${cardSurface}`}>
              <div className="mb-4 flex items-center gap-2">
                <Star size={18} className="text-amber-400" />
                <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'التقييمات' : 'Reviews'}</h3>
              </div>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.customer} className={`rounded-xl border p-3 ${subCard}`}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className={`font-medium ${baseText}`}>{review.customer}</span>
                      <span className="flex items-center gap-1 text-amber-300">
                        {Array.from({ length: review.rating }, (_, index) => (
                          <Star key={`${review.customer}-${index}`} size={12} fill="currentColor" />
                        ))}
                      </span>
                    </div>
                    <p className={`text-sm ${softText}`}>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border p-5 ${cardSurface}`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'مزيج المنتجات' : 'Product mix'}</h3>
                <span className={mutedText}>{isArabic ? 'الحصة' : 'Share'}</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={productMix[language]} dataKey="value" nameKey="name" innerRadius={42} outerRadius={78} paddingAngle={4}>
                      {productMix[language].map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {productMix[language].map((item, index) => (
                  <div key={item.name} className={`flex items-center justify-between text-sm ${softText}`}>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                      {item.name}
                    </div>
                    <span>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`rounded-2xl border p-5 ${cardSurface}`}>
            <div className="mb-4 flex items-center gap-2">
              <CalendarRange size={18} className="text-amber-400" />
              <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'حالة الورشة' : 'Workshop status'}</h3>
            </div>
            <div className="space-y-3">
              {(workshopStatus[language]).map((item) => (
                <div key={item.bay} className={`rounded-xl border p-3 ${subCard}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${baseText}`}>{item.bay}</span>
                    <span className="rounded-full bg-amber-500/15 px-2 py-1 text-[10px] uppercase text-amber-300">{item.status}</span>
                  </div>
                  <div className={`mt-2 text-sm ${softText}`}>{isArabic ? 'المركبة:' : 'Vehicle:'} {item.vehicle}</div>
                  <div className={`mt-1 text-xs ${mutedText}`}>ETA: {item.eta}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl border p-5 ${cardSurface}`}>
            <div className="mb-4 flex items-center gap-2">
              <Wallet size={18} className="text-amber-400" />
              <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'المديونيات' : 'Debts'}</h3>
            </div>
            <div className="space-y-5">
              <div>
                <div className={`mb-2 text-xs uppercase tracking-[0.2em] ${mutedText}`}>{isArabic ? 'ديون العملاء' : 'Customer debt'}</div>
                <div className="space-y-2">
                  {debtRows.map((item) => (
                    <div key={item.customer} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${subCard}`}>
                      <span className={baseText}>{item.customer}</span>
                      <div className="text-right">
                        <div className={baseText}>{item.amount}</div>
                        <div className={mutedText}>{item.due}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className={`mb-2 text-xs uppercase tracking-[0.2em] ${mutedText}`}>{isArabic ? 'ديون الموردين' : 'Supplier debt'}</div>
                <div className="space-y-2">
                  {supplierDebtRows.map((item) => (
                    <div key={item.supplier} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${subCard}`}>
                      <span className={baseText}>{item.supplier}</span>
                      <div className="text-right">
                        <div className={baseText}>{item.amount}</div>
                        <div className={mutedText}>{item.due}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border p-5 ${cardSurface}`}>
            <div className="mb-4 flex items-center gap-2">
              <PackageSearch size={18} className="text-amber-400" />
              <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'تنبيهات المخزون' : 'Inventory alerts'}</h3>
            </div>
            <div className="space-y-3">
              {stockAlerts.map((item) => (
                <div key={item.item} className={`flex items-center justify-between rounded-xl p-3 text-sm ${subCard}`}>
                  <div>
                    <div className={`font-medium ${baseText}`}>{item.item}</div>
                    <div className={mutedText}>{item.qty}</div>
                  </div>
                  <span className={item.level.includes('Rupture') || item.level.includes('Out of stock') ? 'rounded-full bg-red-500/15 px-2 py-1 text-xs text-red-300' : 'rounded-full bg-amber-500/15 px-2 py-1 text-xs text-amber-300'}>
                    {item.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl border p-5 ${cardSurface}`}>
            <div className="mb-4 flex items-center gap-2">
              <Droplets size={18} className="text-amber-400" />
              <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'مراقبة الزيوت بالجملة' : 'Bulk oil monitoring'}</h3>
            </div>
            <div className="space-y-3">
              {barrelMonitoring.map((item) => (
                <div key={item.name}>
                  <div className={`mb-1 flex items-center justify-between text-sm ${softText}`}>
                    <span>{item.name}</span>
                    <span>{item.current}/{item.max}</span>
                  </div>
                  <div className={`h-2.5 overflow-hidden rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400" style={{ width: `${(item.current / item.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
        <div className={`rounded-2xl border p-5 ${cardSurface}`}>
          <div className="mb-4 flex items-center gap-2">
            <Wrench size={18} className="text-amber-400" />
            <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'تذكيرات الصيانة' : 'Maintenance reminders'}</h3>
          </div>
          <div className="space-y-3">
            {maintenanceReminders.map((item) => (
              <div key={item.vehicle} className={`rounded-xl p-3 ${subCard}`}>
                <div className={`font-medium ${baseText}`}>{item.vehicle}</div>
                <div className={`mt-1 text-sm ${softText}`}>{item.service}</div>
                <div className="mt-1 text-xs text-amber-300">{item.due}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${cardSurface}`}>
          <div className="mb-4 flex items-center gap-2">
            <FileWarning size={18} className="text-amber-400" />
            <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'انتهاء المستندات' : 'Document expiry'}</h3>
          </div>
          <div className="space-y-3">
            {documentAlerts.map((item) => (
              <div key={item.doc} className={`flex items-center justify-between rounded-xl p-3 text-sm ${subCard}`}>
                <span className={baseText}>{item.doc}</span>
                <span className="text-amber-300">{item.due}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${cardSurface}`}>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-amber-400" />
            <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'أداء الموظفين' : 'Employee performance'}</h3>
          </div>
          <div className="space-y-3">
            {employeeRows.map((employee) => (
              <div key={employee.name} className={`rounded-xl p-3 ${subCard}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${baseText}`}>{employee.name}</span>
                  <span className="text-sm text-emerald-300">{employee.commission}</span>
                </div>
                <div className={`mt-1 text-xs ${mutedText}`}>{employee.role}</div>
                <div className={`mt-2 h-2 overflow-hidden rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400" style={{ width: `${employee.performance}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className={`rounded-2xl border p-5 ${cardSurface}`}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-400" />
              <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'تنبيهات حرجة وتحذيرية' : 'Critical & warning alerts'}</h3>
            </div>
            <button type="button" className="text-sm text-amber-300">{isArabic ? 'إدارة' : 'Manage'}</button>
          </div>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <div key={alert.label} className={`rounded-xl border p-3 ${alert.level === 'Critique' || alert.level === 'Critical' ? 'border-red-500/40 bg-red-500/10' : 'border-amber-500/40 bg-amber-500/10'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold uppercase ${alert.level === 'Critique' || alert.level === 'Critical' ? 'text-red-300' : 'text-amber-300'}`}>{alert.level}</span>
                  <AlertTriangle size={14} className={alert.level === 'Critique' || alert.level === 'Critical' ? 'text-red-300' : 'text-amber-300'} />
                </div>
                <div className={`mt-2 font-medium ${baseText}`}>{alert.label}</div>
                <div className={`mt-1 text-sm ${softText}`}>{alert.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${cardSurface}`}>
          <div className="mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-amber-400" />
            <h3 className={`text-lg font-semibold ${baseText}`}>{isArabic ? 'ملخص الإغلاق اليومي' : 'End-of-day closing summary'}</h3>
          </div>
          <div className="space-y-3">
            {closingSummary.map((item) => (
              <div key={item.label} className={`flex items-center justify-between rounded-xl p-3 text-sm ${subCard}`}>
                <span className={softText}>{item.label}</span>
                <span className={`font-semibold ${baseText}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center justify-between text-emerald-300">
              <span className="text-sm font-medium">{isArabic ? 'الموضع النهائي' : 'Final position'}</span>
              <TrendingUp size={16} />
            </div>
            <div className={`mt-2 text-2xl font-bold ${baseText}`}>DA 815,000</div>
            <div className="mt-1 text-sm text-emerald-200">{isArabic ? 'ربح إجمالي للفترة المحددة' : 'Gross profit for selected range'}</div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        {isAiOpen && (
          <div className={`mb-3 w-80 rounded-2xl border p-3 shadow-2xl backdrop-blur ${isDark ? 'border-slate-700 bg-slate-900/95 shadow-slate-950/50' : 'border-slate-200 bg-white/95 shadow-slate-200/60'}`}>
            <div className="mb-3 flex items-center justify-between">
              <div className={`flex items-center gap-2 ${baseText}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                  <Bot size={16} />
                </div>
                <span className="font-medium">SIARA AI</span>
              </div>
              <button type="button" onClick={() => setIsAiOpen(false)} className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}>
                ✕
              </button>
            </div>

            <div className="max-h-56 space-y-2 overflow-y-auto pr-1 text-sm">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-xl px-3 py-2 ${
                    message.role === 'assistant'
                      ? isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                      : 'bg-amber-500/15 text-amber-100'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder={isArabic ? 'اسأل عن الإيرادات أو المخزون...' : 'Ask about revenue or stock...'}
                className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none ${inputClass}`}
              />
              <button
                type="button"
                onClick={handleSendAi}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 p-2 text-white"
                aria-label="Send AI chat"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsAiOpen((value) => !value)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow-2xl shadow-amber-500/30 transition hover:scale-105"
          aria-label="Toggle AI assistant"
        >
          <MessageSquareText size={22} />
        </button>
      </div>
    </div>
  );
}
