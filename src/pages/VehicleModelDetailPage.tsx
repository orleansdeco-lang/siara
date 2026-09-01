import { ArrowLeft, ArrowRight, Droplets, Gauge, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useSupabaseTable } from '../lib/supabase';
import { useUiStore } from '../store/store';

export type VehicleModelRow = {
  id?: string;
  model_name?: string;
  name?: string;
  generation?: string;
  engine_code?: string;
  engine?: string;
  fuel_type?: string;
  year_start?: number | string;
  year_end?: number | string;
  oil_capacity_liters?: number | string;
  oil_capacity_with_filter?: number | string;
  oil_capacity_without_filter?: number | string;
  recommended_viscosity?: string;
  recommended_spec?: string;
  compatible_filter_refs?: string[] | string | null;
  recommended_interval_km?: number | string;
  recommended_interval_km_normal?: number | string;
  recommended_interval_km_severe?: number | string;
  oil_change_notes?: string | null;
  status?: string;
};

const fallbackModels: VehicleModelRow[] = [
  {
    id: 'duster-sample',
    model_name: 'Dacia Duster',
    generation: 'Duster II (2017 - 2022)',
    engine_code: 'K9K 1.5 Blue dCi 115',
    fuel_type: 'Diesel',
    year_start: 2017,
    year_end: 2022,
    oil_capacity_liters: '4.5',
    oil_capacity_with_filter: '4.5',
    oil_capacity_without_filter: '4.2',
    recommended_viscosity: '5W-30',
    recommended_spec: 'RN0720 / ACEA C4',
    compatible_filter_refs: ['MANN-HU719/7x', 'PUR-LS489A'],
    recommended_interval_km: 10000,
    recommended_interval_km_normal: 10000,
    recommended_interval_km_severe: 5000,
    oil_change_notes: 'محرك بحاجة لزيت Low-SAPS للمحافظة على فلتر الجسيمات DPF. يوصى بتبديل الفلتر مع كل غيار.',
    status: 'verified',
  },
  {
    id: 'clio-sample',
    model_name: 'Renault Clio',
    generation: 'Clio IV (2013 - 2019)',
    engine_code: 'K9K 1.5 dCi 90',
    fuel_type: 'Diesel',
    year_start: 2013,
    year_end: 2019,
    oil_capacity_liters: '4.5',
    oil_capacity_with_filter: '4.5',
    oil_capacity_without_filter: '4.2',
    recommended_viscosity: '5W-30 / 5W-40',
    recommended_spec: 'RN0720 / RN0710',
    compatible_filter_refs: ['MANN-HU719/7x', 'PUR-LS489A', 'Bosch 0986AG'],
    recommended_interval_km: 10000,
    recommended_interval_km_normal: 10000,
    recommended_interval_km_severe: 5000,
    oil_change_notes: 'في القيادة الحضرية والازدحام الشديد، ينصح بتبديل الزيت كل 7,000 إلى 8,000 كم.',
    status: 'verified',
  },
  {
    id: 'megane-sample',
    model_name: 'Renault Megane',
    generation: 'Megane IV (2016 - 2020)',
    engine_code: 'R9M 1.6 dCi 130',
    fuel_type: 'Diesel',
    year_start: 2016,
    year_end: 2020,
    oil_capacity_liters: '5.0',
    oil_capacity_with_filter: '5.0',
    oil_capacity_without_filter: '4.7',
    recommended_viscosity: '5W-30',
    recommended_spec: 'RN0720',
    compatible_filter_refs: ['MANN-HU719/7x', 'Mahle KX-063'],
    recommended_interval_km: 15000,
    recommended_interval_km_normal: 15000,
    recommended_interval_km_severe: 7500,
    oil_change_notes: 'محرك بتقنية التيربو عالي الكفاءة، يتطلب زيت تخليقي كامل 100%.',
    status: 'verified',
  },
];

export function VehicleModelDetailPage() {
  const { id } = useParams();
  const { language, theme } = useUiStore();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';

  const models = useSupabaseTable<VehicleModelRow>('vehicle_models', fallbackModels);
  const model =
    models.find((m) => m.id === id || m.model_name?.toLowerCase().includes(String(id).toLowerCase())) ??
    fallbackModels.find((m) => m.id === id) ??
    fallbackModels[0];

  const cardSurface = isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-sm';
  const subCard = isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50';
  const baseText = isDark ? 'text-white' : 'text-slate-900';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  const filters = Array.isArray(model.compatible_filter_refs)
    ? model.compatible_filter_refs.join(', ')
    : typeof model.compatible_filter_refs === 'string'
    ? model.compatible_filter_refs
    : 'MANN-HU719/7x';

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/vehicles"
          className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
            isDark
              ? 'border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700 hover:bg-slate-800'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {isArabic ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
          <span>{isArabic ? 'العودة لسجل المركبات' : 'Retour aux véhicules'}</span>
        </Link>
      </div>

      {/* Main Reference Header */}
      <div className={`rounded-2xl border p-5 sm:p-6 ${cardSurface}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-500">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isArabic ? 'المواصفات الفنية المعتمدة للمحرك' : 'Fiche Technique Constructeur'}
              </span>
            </div>
            <h2 className={`mt-2 text-2xl font-black sm:text-3xl ${baseText}`}>
              {model.model_name || 'Modèle'}
            </h2>
            <p className="mt-1 text-xs text-slate-400">{model.generation}</p>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
            <ShieldCheck size={14} />
            <span>{isArabic ? 'مواصفة مؤكدة' : 'Vérifié OEM'}</span>
          </span>
        </div>

        {/* Technical Specs Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className={`rounded-xl border p-3.5 ${subCard}`}>
            <span className={`text-[11px] font-semibold ${mutedText}`}>{isArabic ? 'رمز المحرك' : 'Moteur'}</span>
            <p className={`mt-1 text-sm font-bold ${baseText}`}>{model.engine_code || 'K9K 1.5 dCi'}</p>
          </div>
          <div className={`rounded-xl border p-3.5 ${subCard}`}>
            <span className={`text-[11px] font-semibold ${mutedText}`}>{isArabic ? 'نوع الوقود' : 'Carburant'}</span>
            <p className={`mt-1 text-sm font-bold ${baseText}`}>{model.fuel_type || 'Diesel'}</p>
          </div>
          <div className={`rounded-xl border p-3.5 ${subCard}`}>
            <span className={`text-[11px] font-semibold ${mutedText}`}>{isArabic ? 'سنوات الإنتاج' : 'Années'}</span>
            <p className={`mt-1 text-sm font-bold ${baseText}`}>{model.year_start} - {model.year_end}</p>
          </div>
          <div className={`rounded-xl border p-3.5 ${subCard}`}>
            <span className={`text-[11px] font-semibold ${mutedText}`}>{isArabic ? 'سعة الزيت المقدرة' : 'Capacité carter'}</span>
            <p className="mt-1 text-sm font-bold text-amber-500">{model.oil_capacity_liters} Litres</p>
          </div>
        </div>
      </div>

      {/* Details Two-Column Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Oil Specifications Card */}
        <div className={`rounded-2xl border p-5 space-y-3.5 ${cardSurface}`}>
          <div className="flex items-center gap-2 text-amber-500">
            <Droplets size={18} />
            <h3 className={`text-base font-bold ${baseText}`}>
              {isArabic ? 'توصيات ومواصفات زيت المحرك' : 'Recommandations d’huile'}
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className={`flex justify-between rounded-xl border p-3 ${subCard}`}>
              <span className={mutedText}>{isArabic ? 'المعيار / المعايرة المعتمدة:' : 'Norme constructeur:'}</span>
              <strong className="text-amber-400">{model.recommended_spec}</strong>
            </div>
            <div className={`flex justify-between rounded-xl border p-3 ${subCard}`}>
              <span className={mutedText}>{isArabic ? 'اللزوجة الموصى بها:' : 'Viscosité recommandée:'}</span>
              <strong className={baseText}>{model.recommended_viscosity}</strong>
            </div>
            <div className={`flex justify-between rounded-xl border p-3 ${subCard}`}>
              <span className={mutedText}>{isArabic ? 'السعة مع الفلتر الجديد:' : 'Capacité avec filtre:'}</span>
              <strong className="text-emerald-400">{model.oil_capacity_with_filter || model.oil_capacity_liters} L</strong>
            </div>
            <div className={`flex justify-between rounded-xl border p-3 ${subCard}`}>
              <span className={mutedText}>{isArabic ? 'السعة بدون تغيير الفلتر:' : 'Capacité sans filtre:'}</span>
              <strong className={baseText}>{model.oil_capacity_without_filter || '4.0'} L</strong>
            </div>
          </div>
        </div>

        {/* Maintenance Intervals Card */}
        <div className={`rounded-2xl border p-5 space-y-3.5 ${cardSurface}`}>
          <div className="flex items-center gap-2 text-amber-500">
            <Wrench size={18} />
            <h3 className={`text-base font-bold ${baseText}`}>
              {isArabic ? 'الفلاتر وفترات الصيانة الموصى بها' : 'Filtres & Intervalles de vidange'}
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className={`flex justify-between rounded-xl border p-3 ${subCard}`}>
              <span className={mutedText}>{isArabic ? 'مراجع الفلاتر المتوافقة:' : 'Réf. Filtres compatibles:'}</span>
              <strong className="text-amber-400">{filters}</strong>
            </div>
            <div className={`flex justify-between rounded-xl border p-3 ${subCard}`}>
              <span className={mutedText}>{isArabic ? 'الفاصل في الاستخدام العادي:' : 'Intervalle standard:'}</span>
              <strong className="text-emerald-400">{model.recommended_interval_km_normal || 10000} km</strong>
            </div>
            <div className={`flex justify-between rounded-xl border p-3 ${subCard}`}>
              <span className={mutedText}>{isArabic ? 'الفاصل في الاستخدام الشاق / المدن:' : 'Intervalle sévère / Urbain:'}</span>
              <strong className="text-rose-400">{model.recommended_interval_km_severe || 5000} km</strong>
            </div>
            <div className={`flex justify-between rounded-xl border p-3 ${subCard}`}>
              <span className={mutedText}>{isArabic ? 'تغيير فلتر الزيت:' : 'Remplacement filtre:'}</span>
              <strong className={baseText}>{isArabic ? 'مع كل غيار زيت إلزامي' : 'À chaque vidange'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Workshop Notes */}
      <div className={`rounded-2xl border p-5 ${cardSurface}`}>
        <div className="mb-2 flex items-center gap-2 text-amber-500">
          <Gauge size={18} />
          <h3 className={`text-base font-bold ${baseText}`}>{isArabic ? 'ملاحظات وتوجيهات الورشة' : 'Conseils techniques'}</h3>
        </div>
        <p className="text-xs leading-relaxed text-slate-400">
          {model.oil_change_notes ||
            (isArabic
              ? 'احرص دائماً على فحص مستوى الزيت بعد تشغيل المحرك لـ 30 ثانية والتأكد من إحكام إغلاق برغي الكارتير وتغيير الحلقة النحاسية (Joint de vidange).'
              : 'Vérifiez toujours le niveau après 30s de fonctionnement moteur et remplacez le joint de bouchon de vidange.')}
        </p>
      </div>
    </div>
  );
}
