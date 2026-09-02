import { useMemo } from 'react';
import { Clock3, MonitorCheck } from 'lucide-react';
import { useUiStore } from '../store/store';

type Activity = { id: string; action: string; details: string; actor: string; device: string; createdAt: string };

export function ActivityHistoryPage() {
  const { language, theme } = useUiStore();
  const isArabic = language === 'ar';
  const isDark = theme === 'dark';
  const activities = useMemo<Activity[]>(() => {
    try {
      const raw = localStorage.getItem('siara_activity_log_v1');
      return raw ? (JSON.parse(raw) as Activity[]) : [];
    } catch {
      return [];
    }
  }, []);
  return <div className="mx-auto max-w-5xl space-y-5"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">{isArabic ? 'مراقبة المالك' : 'Surveillance propriétaire'}</p><h1 className={`mt-1 text-2xl font-black sm:text-3xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{isArabic ? 'سجل النشاطات' : 'Historique des activités'}</h1></div><div className={`rounded-2xl border p-5 ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-sm'}`}>{activities.length === 0 ? <p className="text-sm text-slate-400">{isArabic ? 'لا توجد نشاطات مسجلة بعد.' : 'Aucune activité enregistrée.'}</p> : <div className="space-y-3">{activities.map((activity) => <div key={activity.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"><div className="flex items-start gap-3"><div className="rounded-lg bg-amber-500/15 p-2 text-amber-300"><Clock3 size={16} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold text-white">{activity.action}</p><time className="text-xs text-slate-500">{new Date(activity.createdAt).toLocaleString('fr-DZ')}</time></div><p className="mt-1 text-sm text-slate-300">{activity.details}</p><p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MonitorCheck size={13} />{activity.actor} • {activity.device}</p></div></div></div>)}</div>}</div></div>;
}
