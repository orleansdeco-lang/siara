import { useMemo, useState } from 'react';
import {
  CalendarCheck2,
  ClipboardList,
  Edit,
  Save,
} from 'lucide-react';
import { useUiStore } from '../store/store';

export type Employee = {
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
  salary: number;
  notes: string;
};

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: 'عبد المالك / Abdelmalek',
    role: 'مسير الورشة / Chef d’atelier',
    startedAt: '2023-02-15',
    commissionRate: 7.5,
    attendance: { present: 24, absent: 1, late: 2 },
    sales: 248000,
    profitShare: 12,
    discountTotal: 8200,
    bonusTotal: 12000,
    salary: 55000,
    notes: 'عامل منتظم، كفاءة عالية في إدارة الطابور وجودة تبديل الزيوت.',
  },
  {
    id: 2,
    name: 'يوسف / Youssef',
    role: 'فني صيانة سريع / Technicien',
    startedAt: '2024-01-10',
    commissionRate: 6.0,
    attendance: { present: 22, absent: 3, late: 4 },
    sales: 192000,
    profitShare: 9,
    discountTotal: 6100,
    bonusTotal: 9000,
    salary: 45000,
    notes: 'سريع ومتمكن في فك وتركيب فلاتر الزيت والهواء لمختلف السيارات.',
  },
  {
    id: 3,
    name: 'قاسم / Kacem',
    role: 'محاسب واستقبال / Comptoir',
    startedAt: '2022-05-20',
    commissionRate: 5.0,
    attendance: { present: 25, absent: 0, late: 1 },
    sales: 310000,
    profitShare: 8,
    discountTotal: 4700,
    bonusTotal: 14500,
    salary: 50000,
    notes: 'متابع دقيق لحسابات الصندوق وإصدار وصولات الصيانة.',
  },
];

export function TeamPage() {
  const { language, theme } = useUiStore();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';

  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [isEditing, setIsEditing] = useState(false);

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === selectedId) ?? employees[0],
    [employees, selectedId]
  );

  const formatCurrency = (val: number) => `DA ${new Intl.NumberFormat('fr-DZ').format(val)}`;

  const updateSelected = (field: keyof Employee, val: any) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === selectedId ? { ...e, [field]: val } : e))
    );
  };

  const calculateCommission = (emp: Employee) => {
    return Math.round((emp.sales * emp.commissionRate) / 100);
  };

  const calculateNetPay = (emp: Employee) => {
    return emp.salary + calculateCommission(emp) + emp.bonusTotal - emp.discountTotal;
  };

  const cardSurface = isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-sm';
  const subCard = isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50';
  const baseText = isDark ? 'text-white' : 'text-slate-900';
  const inputClass = isDark
    ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:border-amber-500'
    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">
            {isArabic ? 'الموارد البشرية والرواتب' : 'Gestion de l’équipe'}
          </p>
          <h2 className={`text-2xl font-black sm:text-3xl ${baseText}`}>
            {isArabic ? 'إدارة الموظفين ونظام العمولات والمكافآت' : 'Équipe & Commissions'}
          </h2>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
        {/* Left: Employee Selection List */}
        <div className="space-y-3">
          <div className={`rounded-2xl border p-4 ${cardSurface}`}>
            <span className="text-xs font-semibold text-slate-400">
              {employees.length} {isArabic ? 'موظفين مسجلين' : 'employés dans l’atelier'}
            </span>
          </div>

          <div className="space-y-2.5">
            {employees.map((emp) => {
              const isSelected = emp.id === selectedId;
              const commission = calculateCommission(emp);

              return (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(emp.id);
                    setIsEditing(false);
                  }}
                  className={`w-full rounded-2xl border p-4 text-start transition ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                      : isDark ? 'border-slate-800 bg-slate-900/80 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-bold text-sm ${baseText}`}>{emp.name}</h4>
                      <p className="mt-0.5 text-xs text-slate-400">{emp.role}</p>
                    </div>
                    <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-400">
                      {emp.commissionRate}% {isArabic ? 'عمولة' : 'comm.'}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-800/40 pt-2 text-xs">
                    <span className="text-slate-400">{isArabic ? 'عمولة المبيعات:' : 'Commission:'} <strong className="text-emerald-400">{formatCurrency(commission)}</strong></span>
                    <span className="text-slate-400">{emp.attendance.present}/30 {isArabic ? 'أيام حضور' : 'jours'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Employee Details & Commission Ledger */}
        <div className={`rounded-2xl border p-5 space-y-5 ${cardSurface}`}>
          {selectedEmployee && (
            <>
              {/* Header profile */}
              <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                    {isArabic ? 'ملف العامل' : 'Profil collaborateur'}
                  </span>
                  <h3 className={`text-xl font-black ${baseText}`}>{selectedEmployee.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {selectedEmployee.role} • {isArabic ? 'التحق بتاريخ:' : 'Début:'} {selectedEmployee.startedAt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20"
                >
                  {isEditing ? <Save size={14} /> : <Edit size={14} />}
                  <span>{isEditing ? (isArabic ? 'حفظ التعديلات' : 'Terminer') : (isArabic ? 'تعديل النسب' : 'Modifier')}</span>
                </button>
              </div>

              {/* Financial Calculation KPI Summary */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className={`rounded-xl border p-3 ${subCard}`}>
                  <span className="text-[11px] text-slate-400">{isArabic ? 'الراتب الأساسي' : 'Salaire de base'}</span>
                  <p className={`mt-1 text-sm font-bold ${baseText}`}>{formatCurrency(selectedEmployee.salary)}</p>
                </div>
                <div className={`rounded-xl border p-3 ${subCard}`}>
                  <span className="text-[11px] text-slate-400">{isArabic ? 'نسبة العمولة' : 'Taux commission'}</span>
                  <p className="mt-1 text-sm font-bold text-amber-400">{selectedEmployee.commissionRate}%</p>
                </div>
                <div className={`rounded-xl border p-3 ${subCard}`}>
                  <span className="text-[11px] text-slate-400">{isArabic ? 'مكافآت وحوافز' : 'Primes'}</span>
                  <p className="mt-1 text-sm font-bold text-emerald-400">+{formatCurrency(selectedEmployee.bonusTotal)}</p>
                </div>
                <div className={`rounded-xl border p-3 ${subCard}`}>
                  <span className="text-[11px] text-slate-400">{isArabic ? 'الصافي المستحق' : 'Net à payer'}</span>
                  <p className="mt-1 text-sm font-black text-amber-400">{formatCurrency(calculateNetPay(selectedEmployee))}</p>
                </div>
              </div>

              {/* Editable Fields */}
              {isEditing && (
                <div className={`rounded-xl border p-4 space-y-3 ${subCard}`}>
                  <h4 className="text-xs font-bold text-amber-500">{isArabic ? 'تعديل المعايير المالية للعامل' : 'Paramètres de rémunération'}</h4>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-400">{isArabic ? 'الراتب الأساسي (دج)' : 'Salaire (DA)'}</label>
                      <input
                        type="number"
                        value={selectedEmployee.salary}
                        onChange={(e) => updateSelected('salary', Number(e.target.value))}
                        className={`w-full rounded-xl border px-3 py-1.5 text-xs focus:outline-none ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-400">{isArabic ? 'نسبة العمولة (%)' : 'Taux (%)'}</label>
                      <input
                        type="number"
                        step={0.5}
                        value={selectedEmployee.commissionRate}
                        onChange={(e) => updateSelected('commissionRate', Number(e.target.value))}
                        className={`w-full rounded-xl border px-3 py-1.5 text-xs focus:outline-none ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-400">{isArabic ? 'إضافة مكافأة (دج)' : 'Prime (DA)'}</label>
                      <input
                        type="number"
                        value={selectedEmployee.bonusTotal}
                        onChange={(e) => updateSelected('bonusTotal', Number(e.target.value))}
                        className={`w-full rounded-xl border px-3 py-1.5 text-xs focus:outline-none ${inputClass}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance Breakdown */}
              <div className={`rounded-xl border p-4 ${subCard}`}>
                <div className="mb-3 flex items-center gap-2 text-amber-500">
                  <CalendarCheck2 size={16} />
                  <h4 className={`text-xs font-bold uppercase ${baseText}`}>{isArabic ? 'متابعة الحضور والانضباط الشهري' : 'Présence & Ponctualité'}</h4>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                    <div className="text-lg font-black">{selectedEmployee.attendance.present}</div>
                    <div className="text-[10px] uppercase font-bold">{isArabic ? 'أيام حضور' : 'Présent'}</div>
                  </div>
                  <div className="rounded-lg bg-rose-500/10 p-2 text-rose-400">
                    <div className="text-lg font-black">{selectedEmployee.attendance.absent}</div>
                    <div className="text-[10px] uppercase font-bold">{isArabic ? 'أيام غياب' : 'Absent'}</div>
                  </div>
                  <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                    <div className="text-lg font-black">{selectedEmployee.attendance.late}</div>
                    <div className="text-[10px] uppercase font-bold">{isArabic ? 'تأخيرات' : 'Retards'}</div>
                  </div>
                </div>
              </div>

              {/* Management Notes */}
              <div className={`rounded-xl border p-4 space-y-2 ${subCard}`}>
                <div className="flex items-center gap-2 text-amber-500">
                  <ClipboardList size={16} />
                  <h4 className={`text-xs font-bold uppercase ${baseText}`}>{isArabic ? 'ملاحظات الإدارة وصاحب المحل' : 'Notes & Appréciations'}</h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">{selectedEmployee.notes}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
