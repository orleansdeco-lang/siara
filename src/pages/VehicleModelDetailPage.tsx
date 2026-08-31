import { ArrowLeft, Droplets, Gauge, Sparkles, Wrench } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useSupabaseTable } from "../lib/supabase";

type VehicleModelRow = {
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

const coerceArray = (value: string[] | string | null | undefined): string[] => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim());
  }

  if (typeof value === "string") {
    const compact = value.trim();
    if (!compact) return [];

    try {
      const parsed = JSON.parse(compact);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map((item) => String(item).trim());
      }
    } catch {
      // ignore JSON parse errors and fall back to comma-separated splitting
    }

    return compact
      .split(/[;,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeVehicleModel = (model: VehicleModelRow): VehicleModelRow => ({
  ...model,
  id: model.id ?? model.model_name ?? model.name ?? `${model.engine_code ?? "vehicle"}-${model.generation ?? "model"}`,
  model_name: model.model_name ?? model.name ?? "Modèle inconnu",
  generation: model.generation ?? "Génération inconnue",
  engine_code: model.engine_code ?? model.engine ?? "N/A",
  compatible_filter_refs: coerceArray(model.compatible_filter_refs),
});

const fallbackModels: VehicleModelRow[] = [
  {
    id: "duster-sample",
    model_name: "Duster",
    generation: "Duster II",
    engine_code: "K9K 1.5 Blue dCi 115",
    fuel_type: "diesel",
    year_start: 2017,
    year_end: 2022,
    oil_capacity_liters: "4.500",
    recommended_viscosity: "5W-30",
    recommended_spec: "RN0720",
    compatible_filter_refs: ["MANN-HU719/7x"],
    recommended_interval_km: 10000,
    oil_capacity_with_filter: "4.500",
    oil_capacity_without_filter: "4.200",
    recommended_interval_km_normal: 10000,
    recommended_interval_km_severe: 5000,
    oil_change_notes: "Vidange recommandée tous les 10 000 km en conduite normale.",
    status: "verified",
  },
  {
    id: "clio-sample",
    model_name: "Clio",
    generation: "Clio IV",
    engine_code: "K9K 1.5 dCi 90",
    fuel_type: "diesel",
    year_start: 2013,
    year_end: 2019,
    oil_capacity_liters: "4.500",
    recommended_viscosity: "5W-30",
    recommended_spec: "RN0720",
    compatible_filter_refs: ["MANN-HU719/7x", "PUR-LS489A"],
    recommended_interval_km: 10000,
    oil_capacity_with_filter: "4.500",
    oil_capacity_without_filter: "4.200",
    recommended_interval_km_normal: 10000,
    recommended_interval_km_severe: 5000,
    oil_change_notes: "Suivre l’intervalle court en conduite urbaine ou en conditions difficiles.",
    status: "verified",
  },
  {
    id: "megane-sample",
    model_name: "Megane",
    generation: "Megane IV",
    engine_code: "R9M 1.6 dCi 130",
    fuel_type: "diesel",
    year_start: 2016,
    year_end: 2020,
    oil_capacity_liters: "5.000",
    recommended_viscosity: "5W-30",
    recommended_spec: "RN0720",
    compatible_filter_refs: ["MANN-HU719/7x"],
    recommended_interval_km: 15000,
    oil_capacity_with_filter: "5.000",
    oil_capacity_without_filter: "4.700",
    recommended_interval_km_normal: 15000,
    recommended_interval_km_severe: 7500,
    oil_change_notes: "Ce moteur reste stable avec une vidange tous les 15 000 km en usage standard.",
    status: "verified",
  },
  {
    id: "hilux-sample",
    model_name: "Hilux",
    generation: "Hilux VII",
    engine_code: "2KD-FTV 2.5 D-4D 102",
    fuel_type: "diesel",
    year_start: 2005,
    year_end: 2015,
    oil_capacity_liters: "7.000",
    recommended_viscosity: "5W-30",
    recommended_spec: "ACEA B3",
    compatible_filter_refs: ["MANN-HU719/7x"],
    recommended_interval_km: 10000,
    oil_capacity_with_filter: "7.000",
    oil_capacity_without_filter: "6.700",
    recommended_interval_km_normal: 10000,
    recommended_interval_km_severe: 5000,
    oil_change_notes: "Pour les missions lourdes, raccourcir l’intervalle à 5 000 km.",
    status: "verified",
  },
];

export function VehicleModelDetailPage() {
  const { id } = useParams();
  const models = useSupabaseTable<VehicleModelRow>("vehicle_models", fallbackModels).map(normalizeVehicleModel);
  const model = models.find((entry) => entry.id === id) ?? fallbackModels.find((entry) => entry.id === id) ?? fallbackModels[0];

  const filters = coerceArray(model.compatible_filter_refs).join(", ") || "Non renseigné";

  return (
    <div className="space-y-6">
      <Link
        to="/vehicles"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:text-white"
      >
        <ArrowLeft size={16} />
        Retour aux modèles
      </Link>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-400">Référence moteur</p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              {model.model_name ?? "Modèle inconnu"}
            </h2>
            <p className="mt-2 text-slate-400">{model.generation ?? "Génération inconnue"}</p>
          </div>
          <span className="inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-300">
            {model.status ?? "verified"}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-500">Moteur</p>
            <p className="mt-2 font-semibold text-white">{model.engine_code ?? "N/A"}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-500">Carburant</p>
            <p className="mt-2 font-semibold text-white">{model.fuel_type ?? "N/A"}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-500">Période</p>
            <p className="mt-2 font-semibold text-white">
              {model.year_start ?? "N/A"} - {model.year_end ?? "N/A"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-500">Huile</p>
            <p className="mt-2 font-semibold text-white">
              {model.oil_capacity_liters ?? "N/A"} L · {model.recommended_viscosity ?? "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Droplets size={18} className="text-amber-400" />
            <h3 className="text-lg font-semibold">Recommandation d’huile</h3>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3">
              <span>Spécification</span>
              <span className="font-medium text-white">{model.recommended_spec ?? "Non renseignée"}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3">
              <span>Viscosité</span>
              <span className="font-medium text-white">{model.recommended_viscosity ?? "N/A"}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3">
              <span>Capacité avec filtre</span>
              <span className="font-medium text-white">{model.oil_capacity_with_filter ?? model.oil_capacity_liters ?? "N/A"} L</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3">
              <span>Capacité sans filtre</span>
              <span className="font-medium text-white">{model.oil_capacity_without_filter ?? "N/A"} L</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Wrench size={18} className="text-amber-400" />
            <h3 className="text-lg font-semibold">Filtre & intervalle</h3>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3">
              <span>Référence filtre</span>
              <span className="font-medium text-white">{filters}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3">
              <span>Intervalle normal</span>
              <span className="font-medium text-white">{model.recommended_interval_km_normal ?? model.recommended_interval_km ?? "N/A"} km</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3">
              <span>Intervalle sévère</span>
              <span className="font-medium text-white">{model.recommended_interval_km_severe ?? "N/A"} km</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3">
              <span>Conduite</span>
              <span className="font-medium text-white">Ville / route / charge</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Gauge size={18} className="text-amber-400" />
            <h3 className="text-lg font-semibold">Conseils d’entretien</h3>
          </div>
          <p className="text-sm leading-7 text-slate-300">
            {model.oil_change_notes ?? "Aucune note spécifique fournie pour ce modèle. Suivre les recommandations du constructeur et adapter selon le type d’usage."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Sparkles size={18} className="text-amber-400" />
            <h3 className="text-lg font-semibold">Points clés</h3>
          </div>

          <ul className="space-y-3 text-sm text-slate-300">
            <li>• Vérifier l’état du filtre à huile à chaque vidange.</li>
            <li>• Contrôler régulièrement le niveau d’huile moteur et le bon fonctionnement du système de refroidissement.</li>
            <li>• Réduire l’intervalle en conduite urbaine, en charge ou en conditions poussiéreuses.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}