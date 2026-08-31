import { useMemo, useState } from 'react';
import { BadgeCheck, BriefcaseBusiness, CalendarCheck2, CircleDollarSign, ClipboardList, PencilLine, TrendingUp, UserRoundCheck, WalletCards } from 'lucide-react';
import { useUiStore } from '../store/store';

type DiscountEntry = {
  date: string;
  time: string;
  reason: string;
  amount: number;
  recordedBy: string;
};

type BonusEntry = {
  date: string;
  time: string;
  reason: string;
  amount: number;
  approvedBy: string;
};

type NoteEntry = {
  by: string;
  text: string;
};

type FilterMetric = {
  label: string;
  amount: number;
  note: string;
};

type FinancialEntry = {
  date: string;
  time: string;
  label: string;
  amount: number;
  type: 'sales' | 'bonus' | 'discount';
};

type Employee = {
  id: number;
  name: string;
  role: string;
  startedAt: string;
  commissionRate: number;
  attendance: { present: number; absent: number; late: number };
  sales: number;
  profitShare: number;
  discountTotal: number;
  bonusTotal: number;
  notes: NoteEntry[];
  discounts: DiscountEntry[];
  bonuses: BonusEntry[];
  ledger: FinancialEntry[];
  filterMetrics: FilterMetric[];
};

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: 'عبد المالك',
    role: 'مسير',
    startedAt: '2023-02-15',
    commissionRate: 7.5,
    attendance: { present: 24, absent: 1, late: 2 },
    sales: 248000,
    profitShare: 12,
    discountTotal: 8200,
    bonusTotal: 12000,
    notes: [
      { by: 'صاحب المحل', text: 'عامل منتظم، كيسه في إدارة الطابور و التوقيت.' },
      { by: 'المسير', text: 'يعرّف بعناية على فريق العمل و يراقب الجودة.' },
    ],
    discounts: [
      { date: '2026-08-28', time: '09:15', reason: 'تخفيض على خدمة عاجلة', amount: 1500, recordedBy: 'قاسم' },
      { date: '2026-08-21', time: '14:40', reason: 'تخفيض أثناء العروض', amount: 2100, recordedBy: 'عبد المالك' },
      { date: '2026-08-12', time: '18:05', reason: 'تخفيض خاص للعميل المتكرر', amount: 4600, recordedBy: 'قاسم' },
    ],
    bonuses: [
      { date: '2026-08-25', time: '17:30', reason: 'إنجاز هدف المبيعات', amount: 15000, approvedBy: 'صاحب المحل' },
      { date: '2026-08-18', time: '15:10', reason: 'ضبط وقت القاطرات و الخدمة', amount: 7000, approvedBy: 'عبد المالك' },
    ],
    ledger: [
      { date: '2023-02-15', time: '08:30', label: 'مبيعات أولية', amount: 35000, type: 'sales' },
      { date: '2026-08-10', time: '12:30', label: 'مكافأة هدف', amount: 7000, type: 'bonus' },
      { date: '2026-08-21', time: '14:40', label: 'خصم عميل', amount: 2100, type: 'discount' },
      { date: '2026-08-25', time: '17:30', label: 'هدف المبيعات', amount: 15000, type: 'bonus' },
    ],
    filterMetrics: [
      { label: 'فلتر مازوت', amount: 100, note: '100 دج لكل فلتر مازوت' },
      { label: 'فلتر زيت', amount: 80, note: '80 دج لكل فلتر زيت' },
      { label: 'صيانة', amount: 150, note: '150 دج لكل صيانة' },
      { label: 'خدمة إضافية', amount: 200, note: '200 دج لكل خدمة إضافية' },
    ],
  },
  {
    id: 2,
    name: 'يوسف',
    role: 'عامل',
    startedAt: '2024-01-10',
    commissionRate: 6,
    attendance: { present: 22, absent: 3, late: 4 },
    sales: 192000,
    profitShare: 9,
    discountTotal: 6100,
    bonusTotal: 9000,
    notes: [
      { by: 'صاحب المحل', text: 'عامل سريع و متمكن في تبديل الزيت و الفلاتر.' },
      { by: 'المسير', text: 'أداء ممتاز في الخدمات السريعة، يحتاج تنظيم في بعض المواعيد.' },
    ],
    discounts: [
      { date: '2026-08-29', time: '11:00', reason: 'تخفيض اعتمادا على عدد الخدمات', amount: 1200, recordedBy: 'يوسف' },
      { date: '2026-08-16', time: '10:45', reason: 'تخفيض خاص للعميل', amount: 1900, recordedBy: 'عبد المالك' },
      { date: '2026-08-05', time: '13:25', reason: 'تخفيض على رعاية العميل', amount: 3000, recordedBy: 'قاسم' },
    ],
    bonuses: [
      { date: '2026-08-20', time: '16:30', reason: 'خدمة سريعة و سرعة إنجاز', amount: 6000, approvedBy: 'عبد المالك' },
      { date: '2026-08-10', time: '12:15', reason: 'توفير وقت و زيادة عدد الخدمات', amount: 3000, approvedBy: 'صاحب المحل' },
    ],
    ledger: [
      { date: '2024-01-10', time: '08:15', label: 'مبيعات شهرية', amount: 28000, type: 'sales' },
      { date: '2026-08-10', time: '12:15', label: 'مكافأة السرعة', amount: 3000, type: 'bonus' },
      { date: '2026-08-05', time: '13:25', label: 'خصم رعاية عميل', amount: 3000, type: 'discount' },
      { date: '2026-08-20', time: '16:30', label: 'إنجاز سريع', amount: 6000, type: 'bonus' },
    ],
    filterMetrics: [
      { label: 'فلتر مازوت', amount: 100, note: '100 دج لكل فلتر مازوت' },
      { label: 'فلتر زيت', amount: 70, note: '70 دج لكل فلتر زيت' },
      { label: 'إصلاح صغير', amount: 120, note: '120 دج لكل إصلاح صغير' },
      { label: 'مستلزمات', amount: 90, note: '90 دج لكل مستلزمات' },
    ],
  },
  {
    id: 3,
    name: 'قاسم',
    role: 'محاسب',
    startedAt: '2022-05-20',
    commissionRate: 5,
    attendance: { present: 25, absent: 0, late: 1 },
    sales: 310000,
    profitShare: 8,
    discountTotal: 4700,
    bonusTotal: 14500,
    notes: [
      { by: 'صاحب المحل', text: 'متابع دقيق للمحاسبة و تسوية الخزينة.' },
      { by: 'المسير', text: 'مستوى ممتاز في ضبط الفواتير و متابعة الخصومات.' },
    ],
    discounts: [
      { date: '2026-08-27', time: '08:45', reason: 'تخفيض ضمن سياسة التسويق', amount: 900, recordedBy: 'قاسم' },
      { date: '2026-08-17', time: '15:20', reason: 'خصم غرامة تأخر في الدفع', amount: 2200, recordedBy: 'صاحب المحل' },
      { date: '2026-08-07', time: '12:50', reason: 'تخفيض خاص لعميل تجاري', amount: 1600, recordedBy: 'قاسم' },
    ],
    bonuses: [
      { date: '2026-08-26', time: '11:35', reason: 'مراجعة دقيقة للميزانية', amount: 9000, approvedBy: 'صاحب المحل' },
      { date: '2026-08-11', time: '10:20', reason: 'تسوية خزينة و توقف حوادث', amount: 5500, approvedBy: 'عبد المالك' },
    ],
    ledger: [
      { date: '2022-05-20', time: '09:00', label: 'معاينة مالية أولية', amount: 22000, type: 'sales' },
      { date: '2026-08-11', time: '10:20', label: 'تسوية الخزينة', amount: 5500, type: 'bonus' },
      { date: '2026-08-17', time: '15:20', label: 'خصم تأخر الدفع', amount: 2200, type: 'discount' },
      { date: '2026-08-26', time: '11:35', label: 'مراجعة الميزانية', amount: 9000, type: 'bonus' },
    ],
    filterMetrics: [
      { label: 'فلتر مازوت', amount: 120, note: '120 دج لكل فلتر مازوت' },
      { label: 'فلتر زيت', amount: 90, note: '90 دج لكل فلتر زيت' },
      { label: 'خدمة إضافية', amount: 180, note: '180 دج لكل خدمة إضافية' },
      { label: 'إدارة مالية', amount: 60, note: '60 دج لكل إدارة مالية' },
    ],
  },
];

const formatCurrency = (value: number) => `DA ${value.toLocaleString('fr-DZ')}`;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getCompletionScore = (employee: Employee) => {
  const attendanceRate = (employee.attendance.present / 30) * 100;
  const salesRatio = clamp((employee.sales / 350000) * 100, 0, 100);
  const bonusRatio = clamp((employee.bonusTotal / 20000) * 100, 0, 100);
  const discountRatio = clamp((100 - (employee.discountTotal / 12000) * 100), 0, 100);
  const weighted = attendanceRate * 0.45 + salesRatio * 0.35 + bonusRatio * 0.1 + discountRatio * 0.1;

  return Math.round(weighted);
};

export function TeamPage() {
  const { language } = useUiStore();
  const isArabic = language === 'ar';

  const strings = {
    fr: {
      title: 'Équipe',
      addEmployee: 'Ajouter un employé',
      employeeProfile: 'Profil employé',
      sales: 'Ventes',
      discounts: 'Réductions',
      bonuses: 'Bonus',
      commission: 'Règles de commission',
      attendance: 'Présence / Absence',
      notes: 'Notes du manager / propriétaire',
      profitByFilter: 'Règles de commission (optionnel)',
      registeredDiscounts: 'Réductions enregistrées',
      bonusList: 'Bonus et récompenses',
      financeHistory: 'Historique financier depuis le début',
      optionalRules: 'Défini uniquement par le propriétaire',
      fixedAmount: 'Montant fixe',
      editInfo: 'Modifier les informations',
      name: 'Nom',
      role: 'Rôle',
      startDate: 'Date d’embauche',
      present: 'Présent',
      absent: 'Absent',
      late: 'Retard',
      completion: 'Progression',
      joined: 'Date d’embauche',
      recordedBy: 'Enregistré par',
      approvedBy: 'Approuvé par',
      reason: 'Motif',
      time: 'Heure',
      date: 'Date',
      edit: 'Modifier',
      save: 'Enregistrer',
      employee: 'Employé',
      ledger: 'Journal financier',
      type: 'Type',
      net: 'Net',
      salesLedger: 'Ventes',
      bonusLedger: 'Bonus',
      discountLedger: 'Réduction',
    },
    ar: {
      title: 'الموظفين',
      addEmployee: 'إضافة موظف',
      employeeProfile: 'ملف الموظف',
      sales: 'المبيعات',
      discounts: 'الخصومات',
      bonuses: 'المكافآت',
      commission: 'قواعد العمولة',
      attendance: 'الحضور و الغياب',
      notes: 'ملاحظات المسير / صاحب المحل',
      profitByFilter: 'قواعد العمولة (اختياري)',
      registeredDiscounts: 'الخصومات المسجلة',
      bonusList: 'المكافئات',
      financeHistory: 'السجل المالي منذ البداية',
      optionalRules: 'يحددها صاحب المحل فقط',
      fixedAmount: 'المبلغ الثابت',
      editInfo: 'تعديل المعلومات',
      name: 'الاسم',
      role: 'الرتبة',
      startDate: 'تاريخ الالتحاق',
      present: 'حاضر',
      absent: 'غياب',
      late: 'متأخر',
      completion: 'التقدم',
      joined: 'تاريخ الالتحاق',
      recordedBy: 'المسجل',
      approvedBy: 'الموافق',
      reason: 'السبب',
      time: 'الوقت',
      date: 'التاريخ',
      edit: 'تعديل',
      save: 'حفظ',
      employee: 'موظف',
      ledger: 'السجل المالي',
      type: 'النوع',
      net: 'الصافي',
      salesLedger: 'مبيعات',
      bonusLedger: 'مكافأة',
      discountLedger: 'خصم',
    },
  } as const;

  const t = strings[isArabic ? 'ar' : 'fr'];
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedId, setSelectedId] = useState<number>(1);

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedId) ?? employees[0],
    [employees, selectedId],
  );

  const updateSelectedEmployee = (field: keyof Employee, value: string | number | object) => {
    setEmployees((current) =>
      current.map((employee) =>
        employee.id === selectedId
          ? {
              ...employee,
              [field]: value,
            }
          : employee,
      ),
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">{t.employee}</p>
          <h2 className="text-3xl font-black text-white">{t.title}</h2>
        </div>
        <button className="rounded-xl border border-amber-500/60 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20">
          + {t.addEmployee}
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-3">
          <div className="space-y-3">
            {employees.map((employee) => {
              const isSelected = employee.id === selectedEmployee.id;
              const completion = getCompletionScore(employee);

              return (
                <button
                  key={employee.id}
                  type="button"
                  onClick={() => setSelectedId(employee.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_0_1px_rgba(251,146,60,0.35)]'
                      : 'border-slate-700 bg-slate-950/40 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-white">{employee.name}</p>
                      <p className="text-sm text-slate-300">{employee.role}</p>
                    </div>
                    <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                      {completion}%
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>{t.joined}</span>
                    <span>{employee.startedAt}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5">
          <div className="flex flex-col gap-4 border-b border-slate-700 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-amber-300">
                <BriefcaseBusiness size={16} />
                <span className="text-xs uppercase tracking-[0.2em]">{t.employeeProfile}</span>
              </div>
              <h3 className="text-2xl font-black text-white">{selectedEmployee.name}</h3>
              <p className="text-sm text-slate-400">{selectedEmployee.role}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                {getCompletionScore(selectedEmployee)}% {t.completion}
              </span>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:border-slate-500">
                <PencilLine size={15} />
                {t.edit}
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
              <div className="mb-3 flex items-center justify-between text-slate-300">
                <span>{t.sales}</span>
                <CircleDollarSign size={16} className="text-amber-300" />
              </div>
              <p className="text-2xl font-black text-white">{formatCurrency(selectedEmployee.sales)}</p>
              <p className="mt-2 text-xs text-emerald-300">{isArabic ? 'نسبة الربح' : 'Marge'}: {selectedEmployee.profitShare}%</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
              <div className="mb-3 flex items-center justify-between text-slate-300">
                <span>{t.discounts}</span>
                <WalletCards size={16} className="text-red-300" />
              </div>
              <p className="text-2xl font-black text-white">{formatCurrency(selectedEmployee.discountTotal)}</p>
              <p className="mt-2 text-xs text-red-300">{selectedEmployee.discounts.length} {isArabic ? 'تسجيل' : 'enregistrements'}</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
              <div className="mb-3 flex items-center justify-between text-slate-300">
                <span>{t.bonuses}</span>
                <TrendingUp size={16} className="text-emerald-300" />
              </div>
              <p className="text-2xl font-black text-white">{formatCurrency(selectedEmployee.bonusTotal)}</p>
              <p className="mt-2 text-xs text-emerald-300">{selectedEmployee.bonuses.length} {isArabic ? 'مكافأة' : 'bonus'}</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
              <div className="mb-3 flex items-center justify-between text-slate-300">
                <span>{t.commission}</span>
                <BadgeCheck size={16} className="text-amber-300" />
              </div>
              <p className="text-xl font-black text-white">{formatCurrency(selectedEmployee.filterMetrics[0]?.amount ?? 0)}</p>
              <p className="mt-2 text-xs text-slate-400">{selectedEmployee.filterMetrics[0]?.label ?? '—'} • {t.optionalRules}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <div className="mb-3 flex items-center gap-2 text-white">
                <ClipboardList size={16} className="text-amber-300" />
                <h4 className="text-lg font-bold">{t.profitByFilter}</h4>
              </div>
              <div className="space-y-3">
                {selectedEmployee.filterMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{metric.label}</span>
                      <span className="font-bold text-amber-300">{formatCurrency(metric.amount)}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{metric.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <div className="mb-3 flex items-center gap-2 text-white">
                <UserRoundCheck size={16} className="text-emerald-300" />
                <h4 className="text-lg font-bold">{t.attendance}</h4>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <p className="text-xs text-emerald-200">{t.present}</p>
                  <p className="mt-2 text-2xl font-black text-white">{selectedEmployee.attendance.present}</p>
                </div>
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-xs text-red-200">{t.absent}</p>
                  <p className="mt-2 text-2xl font-black text-white">{selectedEmployee.attendance.absent}</p>
                </div>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                  <p className="text-xs text-amber-200">{t.late}</p>
                  <p className="mt-2 text-2xl font-black text-white">{selectedEmployee.attendance.late}</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                <div className="mb-2 flex items-center gap-2 text-slate-300">
                  <CalendarCheck2 size={15} className="text-amber-300" />
                  <span>{t.notes}</span>
                </div>
                <div className="space-y-3">
                  {selectedEmployee.notes.map((note) => (
                    <div key={`${note.by}-${note.text}`} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2">
                      <p className="text-xs font-semibold text-amber-300">{note.by}</p>
                      <p className="mt-1 text-sm text-slate-300">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <h4 className="mb-3 text-lg font-bold text-white">{t.registeredDiscounts}</h4>
              <div className="space-y-3">
                {selectedEmployee.discounts.map((discount, index) => (
                  <div key={`${discount.date}-${index}`} className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-white">{discount.reason}</span>
                      <span className="text-red-300">-{formatCurrency(discount.amount)}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <span>{t.date}: {discount.date}</span>
                      <span>{t.time}: {discount.time}</span>
                      <span>{t.recordedBy}: {discount.recordedBy}</span>
                      <span>{t.reason}: {discount.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <h4 className="mb-3 text-lg font-bold text-white">{t.bonusList}</h4>
              <div className="space-y-3">
                {selectedEmployee.bonuses.map((bonus, index) => (
                  <div key={`${bonus.date}-${index}`} className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-white">{bonus.reason}</span>
                      <span className="text-emerald-300">+{formatCurrency(bonus.amount)}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <span>{t.date}: {bonus.date}</span>
                      <span>{t.time}: {bonus.time}</span>
                      <span>{t.approvedBy}: {bonus.approvedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-lg font-bold text-white">{t.financeHistory}</h4>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-200">
                {t.net}: {formatCurrency(selectedEmployee.sales + selectedEmployee.bonusTotal - selectedEmployee.discountTotal)}
              </span>
            </div>
            <div className="space-y-3">
              {selectedEmployee.ledger.map((entry, index) => {
                const isPositive = entry.type !== 'discount';
                return (
                  <div key={`${entry.date}-${entry.label}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                    <div>
                      <p className="font-semibold text-white">{entry.label}</p>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-400">
                        <span>{entry.date}</span>
                        <span>{entry.time}</span>
                        <span>{entry.type === 'sales' ? t.salesLedger : entry.type === 'bonus' ? t.bonusLedger : t.discountLedger}</span>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${isPositive ? 'text-emerald-300' : 'text-red-300'}`}>
                      {isPositive ? '+' : '-'}{formatCurrency(entry.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
            <h4 className="mb-3 text-lg font-bold text-white">{t.editInfo}</h4>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="block text-sm text-slate-300">
                {t.name}
                <input
                  value={selectedEmployee.name}
                  onChange={(event) => updateSelectedEmployee('name', event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-amber-400"
                />
              </label>
              <label className="block text-sm text-slate-300">
                {t.role}
                <input
                  value={selectedEmployee.role}
                  onChange={(event) => updateSelectedEmployee('role', event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-amber-400"
                />
              </label>
              <label className="block text-sm text-slate-300">
                {t.fixedAmount} (DA)
                <input
                  type="number"
                  value={selectedEmployee.filterMetrics[0]?.amount ?? 0}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    setEmployees((current) =>
                      current.map((employee) =>
                        employee.id === selectedId
                          ? {
                              ...employee,
                              filterMetrics: employee.filterMetrics.map((item, index) =>
                                index === 0 ? { ...item, amount: next } : item,
                              ),
                            }
                          : employee,
                      ),
                    );
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-amber-400"
                />
              </label>
              <label className="block text-sm text-slate-300">
                {t.startDate}
                <input
                  type="date"
                  value={selectedEmployee.startedAt}
                  onChange={(event) => updateSelectedEmployee('startedAt', event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none ring-0 focus:border-amber-400"
                />
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
