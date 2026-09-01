import { useEffect, useState } from 'react';
import { QrCode, Star } from 'lucide-react';
import { fetchSupabaseTable } from '../lib/supabase';
import { useUiStore } from '../store/store';

export type ReviewRow = {
  id?: string | number;
  customer_name?: string;
  customer?: string;
  rating?: number | string;
  comment?: string;
  service_id?: string;
  created_at?: string;
};

const initialMockReviews: ReviewRow[] = [
  {
    id: 1,
    customer_name: 'Amine K.',
    rating: 5,
    comment: 'خدمة سريعة واحترافية جداً، دقة في المواعيد وشفافية في الأسعار. أنصح به بشدة.',
    created_at: '2026-08-29',
  },
  {
    id: 2,
    customer_name: 'Sarah L.',
    rating: 5,
    comment: 'Très bon suivi de mon véhicule, équipe accueillante et travail soigné.',
    created_at: '2026-08-28',
  },
  {
    id: 3,
    customer_name: 'Rachid B.',
    rating: 4,
    comment: 'Service rapide et bon conseil sur le choix de l’huile moteur.',
    created_at: '2026-08-27',
  },
  {
    id: 4,
    customer_name: 'Mohamed T.',
    rating: 5,
    comment: 'تغيير زيت احترافي مع فحص مجاني لضغط العجلات ومستوى سوائل التبريد.',
    created_at: '2026-08-25',
  },
];

const REVIEW_STORAGE_KEY = 'siara_customer_reviews_v1';

export function ReviewsPage() {
  const { language, theme } = useUiStore();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';

  const [reviews, setReviews] = useState<ReviewRow[]>(() => {
    try {
      const raw = localStorage.getItem(REVIEW_STORAGE_KEY);
      const local = raw ? JSON.parse(raw) : [];
      return [...local, ...initialMockReviews];
    } catch {
      return initialMockReviews;
    }
  });

  useEffect(() => {
    fetchSupabaseTable<any>('reviews', '*', [], 'created_at.desc').then((rows) => {
      if (rows && rows.length > 0) {
        // Merge Supabase reviews with local without duplicating
        setReviews((prev) => {
          const map = new Map();
          rows.forEach((r) => map.set(r.id || r.customer_name, r));
          prev.forEach((p) => {
            const key = p.id || p.customer_name;
            if (!map.has(key)) map.set(key, p);
          });
          return Array.from(map.values());
        });
      }
    });
  }, []);

  const averageRating = (
    reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / (reviews.length || 1)
  ).toFixed(1);

  const cardSurface = isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-sm';
  const subCard = isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50';
  const baseText = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">
            {isArabic ? 'رضا العملاء والتقييمات' : 'Satisfaction client'}
          </p>
          <h2 className={`text-2xl font-black sm:text-3xl ${baseText}`}>
            {isArabic ? 'تقييمات وآراء الزبائن (عبر رمز QR)' : 'Avis & Évaluations clients (QR Code)'}
          </h2>
        </div>
      </div>

      {/* Summary Score Card */}
      <div className={`rounded-2xl border p-5 ${cardSurface}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 text-3xl font-black text-slate-950 shadow-lg shadow-amber-500/20">
              {averageRating}
            </div>
            <div>
              <div className="flex items-center gap-1 text-lg text-amber-400">
                {'★'.repeat(5)}
              </div>
              <p className={`mt-1 font-bold text-sm ${baseText}`}>
                {isArabic ? 'متوسط تقييم الخدمة بالورشة' : 'Note moyenne globale'}
              </p>
              <p className="text-xs text-slate-400">
                {reviews.length} {isArabic ? 'تقييم تم تسجيله' : 'avis enregistrés'}
              </p>
            </div>
          </div>

          <div className={`rounded-xl border p-3.5 text-xs text-slate-400 sm:max-w-xs ${subCard}`}>
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <QrCode size={15} />
              <span>{isArabic ? 'كيف يعمل النظام؟' : 'Comment ça marche ?'}</span>
            </div>
            <p className="mt-1">
              {isArabic
                ? 'عند طباعة وصل الخدمة للزبون، يحتوي على رمز QR يتيح له التقييم فوراً من هاتفه.'
                : 'Chaque bon de service imprimé contient un QR code menant vers le formulaire de satisfaction.'}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((rev, index) => {
          const name = rev.customer_name || rev.customer || 'Client';
          const ratingNum = Math.min(5, Math.max(1, Number(rev.rating || 5)));

          return (
            <div key={`${name}-${index}`} className={`rounded-2xl border p-5 space-y-3 ${cardSurface}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-bold text-sm ${baseText}`}>{name}</h4>
                  <span className="text-[11px] text-slate-400">{rev.created_at?.slice(0, 10) || '2026-08-29'}</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: ratingNum }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-300">{rev.comment || 'Très satisfait du service.'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
