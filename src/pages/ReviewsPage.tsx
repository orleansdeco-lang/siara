import { reviews } from '../data/dashboard';
import { useSupabaseTable } from '../lib/supabase';

type ReviewRow = {
  customer?: string;
  client?: string;
  rating?: number | string;
  comment?: string;
  review?: string;
};

export function ReviewsPage() {
  const reviewRows = useSupabaseTable<ReviewRow>('reviews', reviews as ReviewRow[]);
  const displayReviews = reviewRows.map((review) => ({
    customer: review.customer ?? review.client ?? 'Client',
    rating: Number(review.rating ?? 5),
    comment: review.comment ?? review.review ?? 'Très satisfait du service.',
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Avis</h2>
      {(displayReviews.length > 0 ? displayReviews : reviews).map((review) => (
        <div key={review.customer} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-white">{review.customer}</p>
            <span className="text-amber-300">{'★'.repeat(review.rating)}</span>
          </div>
          <p className="mt-3 text-slate-300">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
