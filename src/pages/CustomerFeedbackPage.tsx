import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

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

type ReviewSubmission = {
  customer: string;
  rating: number;
  comment: string;
  serviceId: string;
  createdAt: string;
};

export function CustomerFeedbackPage() {
  const { serviceId } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ticket = useMemo<ServiceTicket | null>(() => {
    if (!serviceId) return null;

    try {
      const raw = window.localStorage.getItem(SERVICE_KEY);
      if (!raw) return null;
      const items = JSON.parse(raw) as ServiceTicket[];
      return items.find((item) => item.id === serviceId) ?? null;
    } catch {
      return null;
    }
  }, [serviceId]);

  const handleSubmit = () => {
    if (!ticket || !serviceId) return;

    const entries = (() => {
      try {
        const raw = window.localStorage.getItem(REVIEW_KEY);
        return raw ? JSON.parse(raw) as ReviewSubmission[] : [];
      } catch {
        return [];
      }
    })();

    const nextEntry: ReviewSubmission = {
      customer: ticket.customerName,
      rating,
      comment: comment.trim() || 'Très satisfait du service.',
      serviceId,
      createdAt: new Date().toISOString(),
    };

    window.localStorage.setItem(REVIEW_KEY, JSON.stringify([nextEntry, ...entries]));
    setSubmitted(true);
  };

  if (!ticket) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center text-slate-300">
        <h2 className="text-2xl font-bold text-white">Lien invalide</h2>
        <p className="mt-3">Ce bon de service est introuvable.</p>
        <Link to="/" className="mt-5 inline-flex rounded-xl bg-amber-500 px-4 py-2 font-semibold text-slate-950">
          Retour au dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Satisfaction client</p>
        <h2 className="mt-2 text-3xl font-black text-white">Votre avis compte</h2>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">{ticket.customerName}</p>
        <p className="mt-1">{ticket.serviceType} • {ticket.vehicle}</p>
        <p className="mt-1">{ticket.plate}</p>
      </div>

      {!submitted ? (
        <>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-300">Votre note</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={[
                    'rounded-xl border px-3 py-2 text-lg transition',
                    value <= rating ? 'border-amber-400 bg-amber-500/15 text-amber-300' : 'border-slate-700 bg-slate-950 text-slate-400',
                  ].join(' ')}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Votre commentaire</label>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={5}
              placeholder="Décrivez votre expérience..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-500"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-4 py-3 font-semibold text-slate-950"
          >
            Envoyer mon avis
          </button>
        </>
      ) : (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-200">
          Merci pour votre avis. Il a bien été enregistré.
        </div>
      )}
    </div>
  );
}
