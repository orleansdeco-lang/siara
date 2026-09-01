import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  CarFront,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Droplets,
  MessageSquareText,
  ReceiptText,
  Search,
  ShoppingCart,
  Star,
  TrendingDown,
  TrendingUp,
  Wallet,
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
import { useSupabaseTable } from '../lib/supabase';
import { useUiStore } from '../store/store';

const dateRanges = {
  fr: ['Aujourd’hui', 'Hier', 'Cette semaine', 'Ce mois'],
  ar: ['اليوم', 'أمس', 'هذا الأسبوع', 'هذا الشهر'],
};

const defaultServices = [
  { id: 'SV-1048', vehicle_model: 'BMW X5', customer_name: 'Karim D.', oil_type: '5W-30', total_amount: 12400, payment_status: 'payé' },
  { id: 'SV-1049', vehicle_model: 'Mercedes C-Class', customer_name: 'Nadia B.', oil_type: '5W-40', total_amount: 9800, payment_status: 'payé' },
  { id: 'SV-1050', vehicle_model: 'Audi A3', customer_name: 'Leila M.', oil_type: '5W-30', total_amount: 7600, payment_status: 'payé' },
  { id: 'SV-1051', vehicle_model: 'Toyota Corolla', customer_name: 'Samir H.', oil_type: '5W-40', total_amount: 6800, payment_status: 'dette' },
];

const revenueTrend = [
  { name: 'Lun / الإثنين', revenue: 42000 },
  { name: 'Mar / الثلاثاء', revenue: 38000 },
  { name: 'Mer / الأربعاء', revenue: 58000 },
  { name: 'Jeu / الخميس', revenue: 45000 },
  { name: 'Ven / الجمعة', revenue: 70000 },
  { name: 'Sam / السبت', revenue: 66000 },
  { name: 'Dim / الأحد', revenue: 81000 },
];

const productMix = {
  fr: [
    { name: 'Huile moteur', value: 48 },
    { name: 'Filtres', value: 25 },
    { name: 'Fluides & Frein', value: 15 },
    { name: 'Accessoires', value: 12 },
  ],
  ar: [
    { name: 'زيوت المحرك', value: 48 },
    { name: 'الفلاتر بأنواعها', value: 25 },
    { name: 'سوائل الفرامل والتبريد', value: 15 },
    { name: 'قطع ومستلزمات', value: 12 },
  ],
};

const defaultReviews = [
  { customer_name: 'Amine K.', rating: 5, comment: 'خدمة سريعة واحترافية جداً، دقة في المواعيد وشفافية في الأسعار.' },
  { customer_name: 'Sarah L.', rating: 5, comment: 'Très bon suivi de mon véhicule, équipe accueillante et travail soigné.' },
  { customer_name: 'Rachid B.', rating: 4, comment: 'Service rapide et bon conseil sur le choix de l’huile moteur.' },
];

const barrelMonitoring = [
  { name: 'Huile 5W-30 (Synthétique)', current: 28, max: 40 },
  { name: 'Huile 5W-40 (Semi-synthèse)', current: 18, max: 35 },
  { name: 'Huile 10W-40 (Standard)', current: 12, max: 28 },
  { name: 'Huile de boîte (Transmission)', current: 8, max: 20 },
];

const pieColors = ['#f59e0b', '#fbbf24', '#fcd34d', '#fed7aa'];

export function OverviewPage() {
  const navigate = useNavigate();
  const { language, theme } = useUiStore();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';

  const [selectedRange, setSelectedRange] = useState(isArabic ? 'اليوم' : 'Aujourd’hui');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [now, setNow] = useState(new Date());

  // Supabase Table hooks
  const liveServices = useSupabaseTable<any>('services', defaultServices, '*', [], 'created_at.desc');
  const liveReviews = useSupabaseTable<any>('reviews', defaultReviews, '*', [], 'created_at.desc');

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: isArabic
        ? 'مرحباً بك! نظام SIARA الذكي جاهز. الإيرادات ممتازة هذا الأسبوع والمخزون تحت المتابعة.'
        : 'Bonjour ! Le système SIARA est actif. Vos revenus sont en hausse de 18% cette semaine.',
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSelectedRange(isArabic ? 'اليوم' : 'Aujourd’hui');
  }, [isArabic]);

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat(isArabic ? 'ar-DZ' : 'fr-DZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now),
    [isArabic, now]
  );

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat(isArabic ? 'ar-DZ' : 'fr-DZ', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now),
    [isArabic, now]
  );

  const formatPrice = (val: number) => `DA ${new Intl.NumberFormat('fr-DZ').format(val)}`;

  const kpis = [
    { label: isArabic ? 'مجموع الإيرادات' : 'Revenu Total', value: 'DA 1,240,000', delta: '+18.4%', trend: 'up', icon: CircleDollarSign },
    { label: isArabic ? 'المصاريف والسلع' : 'Dépenses & Achats', value: 'DA 425,000', delta: '-6.1%', trend: 'down', icon: Wallet },
    { label: isArabic ? 'صافي الأرباح' : 'Bénéfice Net', value: 'DA 815,000', delta: '+12.8%', trend: 'up', icon: TrendingUp },
    { label: isArabic ? 'السيولة بالصندوق' : 'Caisse Actuelle', value: 'DA 198,500', delta: '+4.7%', trend: 'up', icon: CreditCard },
  ];

  const quickActionsList = [
    { label: isArabic ? 'تسجيل خدمة جديدة' : 'Nouveau service', icon: ClipboardList, path: '/services/new', color: 'from-amber-500 to-orange-400' },
    { label: isArabic ? 'دليل العملاء' : 'Clients', icon: Search, path: '/clients', color: 'from-blue-500 to-indigo-500' },
    { label: isArabic ? 'سجل المركبات' : 'Véhicules', icon: CarFront, path: '/vehicles', color: 'from-emerald-500 to-teal-500' },
    { label: isArabic ? 'المخزون والقطع' : 'Stock & Pièces', icon: ShoppingCart, path: '/inventory', color: 'from-purple-500 to-pink-500' },
    { label: isArabic ? 'المالية والصندوق' : 'Finance', icon: ReceiptText, path: '/finance', color: 'from-amber-500 to-yellow-500' },
    { label: isArabic ? 'آراء الزبائن' : 'Avis QR', icon: Star, path: '/reviews', color: 'from-rose-500 to-red-500' },
  ];

  const handleSendAi = () => {
    const text = chatInput.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    const lower = text.toLowerCase();

    let response = isArabic
      ? 'حالة الورشة ممتازة: العمليات تسير بشكل منتظم، ويوجد 4 خدمات مسجلة اليوم.'
      : 'Statut de l’atelier : Tout fonctionne normalement avec 4 services enregistrés aujourd’hui.';

    if (lower.includes('stock') || lower.includes('مخزون') || lower.includes('زيت') || lower.includes('huile')) {
      response = isArabic
        ? 'مخزون الزيوت: 5W-30 متبقي منه 28 برميلاً و10W-40 متبقي منه 12 برميلاً. ننصح بطلب شحنة جديدة قبل نهاية الأسبوع.'
        : 'Stock d’huile : Il reste 28 fûts de 5W-30 et 12 fûts de 10W-40. Prévoyez un réapprovisionnement.';
    } else if (lower.includes('ربح') || lower.includes('revenue') || lower.includes('إيراد') || lower.includes('دين')) {
      response = isArabic
        ? 'الإيرادات اليومية المسجلة بلغت DA 1,240,000 بهامش ربح قدره 32.8%.'
        : 'Revenus totaux : DA 1 240 000 avec une marge bénéficiaire nette de 32.8%.';
    }

    setMessages((prev) => [...prev, { role: 'assistant', text: response }]);
    setChatInput('');
  };

  const cardSurface = isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-sm';
  const subCard = isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50';
  const baseText = isDark ? 'text-white' : 'text-slate-900';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6">
      {/* Top Header Overview */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">
            {isArabic ? 'لوحة القيادة المباشرة' : 'Tableau de bord'}
          </p>
          <h2 className={`mt-1 text-2xl font-black sm:text-3xl ${baseText}`}>
            {isArabic ? 'نظرة عامة على نشاط الورشة' : 'Vue globale de l’atelier'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className={`rounded-2xl border px-4 py-2.5 text-xs font-semibold ${cardSurface}`}>
            <div className={mutedText}>{isArabic ? 'التوقيت المباشر' : 'Horloge système'}</div>
            <div className={`mt-0.5 font-bold ${baseText}`}>{formattedDate} • <span className="text-amber-500">{formattedTime}</span></div>
          </div>

          <div className={`flex gap-1.5 rounded-2xl border p-1 ${cardSurface}`}>
            {dateRanges[language].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  selectedRange === range
                    ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 shadow-sm'
                    : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {quickActionsList.map(({ label, icon: Icon, path, color }) => (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
            className={`group flex flex-col justify-between rounded-2xl border p-4 text-start transition active:scale-95 ${cardSurface} hover:border-amber-500/50 hover:shadow-md`}
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-slate-950 shadow-sm`}>
              <Icon size={18} />
            </div>
            <span className={`text-xs font-bold transition group-hover:text-amber-500 ${baseText}`}>{label}</span>
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, delta, trend, icon: Icon }) => (
          <div key={label} className={`rounded-2xl border p-5 ${cardSurface}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${mutedText}`}>{label}</span>
              <div className={`rounded-xl p-2 ${isDark ? 'bg-slate-950 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                <Icon size={18} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className={`text-2xl font-black ${baseText}`}>{value}</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${trend === 'up' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Services Table & Performance Charts */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          {/* Recent Services Table */}
          <div className={`rounded-2xl border p-5 ${cardSurface}`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList size={18} className="text-amber-500" />
                <h3 className={`text-base font-bold ${baseText}`}>{isArabic ? 'آخر الخدمات المسجلة' : 'Derniers services'}</h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/services/new')}
                className="text-xs font-bold text-amber-500 hover:underline"
              >
                + {isArabic ? 'خدمة جديدة' : 'Nouveau service'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs sm:text-sm">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                    <th className="py-2.5 px-3 font-semibold">{isArabic ? 'المركبة' : 'Véhicule'}</th>
                    <th className="py-2.5 px-3 font-semibold">{isArabic ? 'الزبون' : 'Client'}</th>
                    <th className="py-2.5 px-3 font-semibold">{isArabic ? 'نوع الزيت' : 'Huile'}</th>
                    <th className="py-2.5 px-3 font-semibold">{isArabic ? 'المبلغ' : 'Montant'}</th>
                    <th className="py-2.5 px-3 font-semibold">{isArabic ? 'الحالة' : 'Statut'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {liveServices.slice(0, 5).map((s: any, idx: number) => (
                    <tr key={s.id || idx} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                      <td className={`py-3 px-3 font-bold ${baseText}`}>{s.vehicle_model || s.vehicle || 'Véhicule'}</td>
                      <td className="py-3 px-3 text-slate-400">{s.customer_name || s.owner || 'Client'}</td>
                      <td className="py-3 px-3"><span className="rounded-md bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-400">{s.oil_type || s.oil || '5W-30'}</span></td>
                      <td className={`py-3 px-3 font-bold ${baseText}`}>{formatPrice(Number(s.total_amount || 7500))}</td>
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                          {isArabic ? 'مكتمل' : 'Effectué'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Area Chart */}
          <div className={`rounded-2xl border p-5 ${cardSurface}`}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${baseText}`}>{isArabic ? 'منحنى نمو الإيرادات الأسبوعي' : 'Évolution du revenu hebdomadaire'}</h3>
                <p className="text-xs text-slate-400">{isArabic ? 'مقارنة إيرادات الأيام السبعة الأخيرة' : 'Revenu net par jour'}</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-400">+24.6%</span>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={isDark ? '#334155' : '#e2e8f0'} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} textAnchor="middle" tick={{ fontSize: 11 }} />
                  <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: isDark ? '#0f172a' : '#ffffff', border: '1px solid #f59e0b', borderRadius: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#revenueFill)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Oil Monitoring & Reviews */}
        <div className="space-y-6">
          {/* Bulk Oil Barrels Monitoring */}
          <div className={`rounded-2xl border p-5 ${cardSurface}`}>
            <div className="mb-4 flex items-center gap-2 text-amber-500">
              <Droplets size={18} />
              <h3 className={`text-base font-bold ${baseText}`}>{isArabic ? 'مراقبة براميل الزيوت' : 'Niveau des fûts d’huile'}</h3>
            </div>
            <div className="space-y-3.5">
              {barrelMonitoring.map((item) => (
                <div key={item.name} className={`rounded-xl border p-3 ${subCard}`}>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className={baseText}>{item.name}</span>
                    <span className="text-amber-400">{item.current} / {item.max} {isArabic ? 'برميل' : 'fûts'}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                      style={{ width: `${(item.current / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Mix Pie Chart */}
          <div className={`rounded-2xl border p-5 ${cardSurface}`}>
            <h3 className={`mb-3 text-base font-bold ${baseText}`}>{isArabic ? 'نسبة المبيعات حسب الصنف' : 'Mix des ventes'}</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={productMix[language]} dataKey="value" nameKey="name" innerRadius={40} outerRadius={68} paddingAngle={4}>
                    {productMix[language].map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: isDark ? '#0f172a' : '#ffffff', border: '1px solid #f59e0b', borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              {productMix[language].map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                    <span>{item.name}</span>
                  </div>
                  <strong className={baseText}>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Preview */}
          <div className={`rounded-2xl border p-5 ${cardSurface}`}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-500">
                <Star size={18} />
                <h3 className={`text-base font-bold ${baseText}`}>{isArabic ? 'آخر تقييمات الزبائن' : 'Avis récents'}</h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/reviews')}
                className="text-xs font-bold text-amber-500 hover:underline"
              >
                {isArabic ? 'عرض الكل' : 'Voir tout'}
              </button>
            </div>

            <div className="space-y-3">
              {liveReviews.slice(0, 2).map((rev: any, i: number) => (
                <div key={rev.id || i} className={`rounded-xl border p-3 text-xs ${subCard}`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className={baseText}>{rev.customer_name || 'Client'}</span>
                    <span className="text-amber-400">{'★'.repeat(Number(rev.rating || 5))}</span>
                  </div>
                  <p className="mt-1.5 text-slate-400">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Assistant Chat Bot */}
      <div className={`fixed bottom-6 z-50 ${isArabic ? 'left-6' : 'right-6'}`}>
        {isAiOpen && (
          <div
            className={`mb-3 w-80 rounded-2xl border p-4 shadow-2xl backdrop-blur-md ${
              isDark ? 'border-slate-700 bg-slate-900/95' : 'border-slate-200 bg-white/95'
            }`}
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-amber-400" />
                <span className={`font-bold text-sm ${baseText}`}>SIARA AI Assistant</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAiOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-56 space-y-2 overflow-y-auto pr-1 text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-2.5 ${
                    m.role === 'assistant'
                      ? isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'
                      : 'bg-amber-500 text-slate-950 font-semibold'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAi()}
                placeholder={isArabic ? 'اسأل عن المخزون أو الأرباح...' : 'Posez une question...'}
                className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                  isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-300 bg-white text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={handleSendAi}
                className="rounded-xl bg-amber-500 p-2 text-slate-950 font-bold hover:bg-amber-400"
              >
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsAiOpen(!isAiOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 shadow-xl shadow-amber-500/30 transition hover:scale-105 active:scale-95"
          aria-label="SIARA AI"
        >
          <MessageSquareText size={20} />
        </button>
      </div>
    </div>
  );
}
