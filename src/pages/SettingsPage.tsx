export function SettingsPage() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <h2 className="text-2xl font-bold text-white">Paramètres</h2>
      <div className="mt-6 space-y-4 text-slate-300">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">Profil d’entreprise</div>
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">Notifications</div>
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">Intégrations</div>
      </div>
    </div>
  );
}
