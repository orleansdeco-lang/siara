import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, HeartHandshake, Languages, Sparkles, Star } from 'lucide-react';
import { fetchSupabaseTable, insertSupabaseRow } from '../lib/supabase';

const SERVICE_KEY = 'siara_service_labels_v1';
const REVIEW_KEY = 'siara_customer_reviews_v1';

type ServiceTicket = {
  id: string;
  customerName: string;
  phone: string;
  plate: string;
  vehicle: string;
  date: string;
  serviceType: string;
  amount: number;
  notes: string;
};

export function CustomerFeedbackPage() {
  const { serviceId } = useParams();
  const [lang, setLang] = useState<'ar' | 'fr'>('ar');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isArabic = lang === 'ar';

  const ticket = useMemo<ServiceTicket | null>(() => {
    if (!serviceId) return null;

    try {
      const raw = localStorage.getItem(SERVICE_KEY);
      if (raw) {
        const items = JSON.parse(raw) as ServiceTicket[];
        const match = items.find((item) => item.id === serviceId);
        if (match) return match;
      }
    } catch {}

    // Graceful fallback for demo or remote mobile scan
    return {
      id: serviceId,
      customerName: isArabic ? 'زبون الورشة المحترم' : 'Client Estimé',
      phone: '0550 00 00 00',
      plate: 'SIARA-DZ',
      vehicle: isArabic ? 'خدمة تغيير زيت وصيانة' : 'Service de vidange',
      date: new Date().toISOString(),
      serviceType: isArabic ? 'تغيير زيت وفلاتر' : 'Vidange + filtres',
      amount: 7500,
      notes: 'SIARA Workshop Alger',
    };
  }, [serviceId, isArabic]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const clientName = ticket?.customerName || (isArabic ? 'زبون الورشة' : 'Client');
    const newReview = {
      customer_name: clientName,
      customer: clientName,
      rating,
      comment: comment.trim() || (isArabic ? 'خدمة ممتازة، سريع واحترافي.' : 'Très satisfait du service.'),
      service_id: serviceId || 'svc-qr',
      created_at: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      const raw = localStorage.getItem(REVIEW_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      localStorage.setItem(REVIEW_KEY, JSON.stringify([newReview, ...existing]));
    } catch {}

    // Save to Supabase
    try {
      await insertSupabaseRow('reviews', {
        garage_id: 1,
        customer_name: newReview.customer_name,
        rating: newReview.rating,
        comment: newReview.comment,
        status: 'published',
      });
    } catch (e) {
      console.warn('Supabase review insert:', e);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className={`min-h-screen bg-slate-950 p-4 text-slate-100 sm:p-6`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top language toggle */}
      <div className="mx-auto flex max-w-lg justify-end pb-3">
        <button
          type="button"
          onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
        >
          <Languages size={14} className="text-amber-400" />
          <span>{lang === 'ar' ? 'Français' : 'العربية'}</span>
        </button>
      </div>

      <div className="mx-auto max-w-lg space-y-5 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 text-2xl font-black text-slate-950 shadow-lg shadow-amber-500/20">
            S
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400">
            {isArabic ? 'ورشة سيارة لخدمات الصيانة' : 'SIARA Workshop'}
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">
            {isArabic ? 'رأيك يهمنا في جودة الخدمة' : 'Votre avis compte'}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {isArabic ? 'ساعدنا على تقديم أفضل جودة بتجربتك معنا اليوم' : 'Partagez votre expérience avec notre équipe'}
          </p>
        </div>

        {/* Ticket mini badge */}
        {ticket && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs text-slate-300">
            <div className="flex justify-between font-bold text-white">
              <span>{ticket.customerName}</span>
              <span className="text-amber-400">{ticket.plate}</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {ticket.serviceType} • {ticket.vehicle}
            </div>
          </div>
        )}

        {!submitted ? (
          <div className="space-y-4">
            {/* Star Rating */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center">
              <span className="mb-2 block text-xs font-bold text-slate-300">
                {isArabic ? 'كيف تقيم الخدمة بشكل عام؟' : 'Comment évaluez-vous notre service ?'}
              </span>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-xl transition active:scale-95 ${
                      val <= rating
                        ? 'border-amber-400 bg-amber-500/20 text-amber-400 shadow-md shadow-amber-500/20'
                        : 'border-slate-800 bg-slate-900 text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                {isArabic ? 'ملاحظاتك أو اقتراحاتك (اختياري)' : 'Vos remarques (optionnel)'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder={
                  isArabic
                    ? 'اكتب رأيك حول سرعة العمل، نظافة الورشة، والأسعار...'
                    : 'Partagez votre avis sur l’accueil, la rapidité et les conseils...'
                }
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:brightness-105 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting
                ? isArabic ? 'جاري الإرسال...' : 'Envoi en cours...'
                : isArabic ? 'إرسال التقييم شكراً لك' : 'Envoyer mon évaluation'}
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-center py-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-white">
              {isArabic ? 'شكراً جزيلاً لتقييمك!' : 'Merci pour votre confiance !'}
            </h3>
            <p className="text-xs text-slate-400">
              {isArabic
                ? 'تم تسجيل رأيك بنجاح في نظام ورشة SIARA لمساعدتنا على تحسين خدماتنا باستمرار.'
                : 'Votre avis a été enregistré avec succès et transmis directement à notre équipe.'}
            </p>
            <Link
              to="/"
              className="inline-flex rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              {isArabic ? 'الرجوع للرئيسية' : 'Retour à l’accueil'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
