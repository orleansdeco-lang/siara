import { FormEvent, useState } from 'react';
import { KeyRound, Mail, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { useUiStore } from '../store/store';
import { useAuthStore } from '../store/authStore';

type WorkerAccess = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
};

const permissionOptions = ['Clients', 'Services', 'Stock', 'Finance', 'Avis'];

export function OwnerTeamPage() {
  const { language, theme } = useUiStore();
  const isArabic = language === 'ar';
  const isDark = theme === 'dark';
  const getWorkers = useAuthStore((state) => state.getWorkers);
  const addWorker = useAuthStore((state) => state.addWorker);
  const removeWorker = useAuthStore((state) => state.removeWorker);
  const [workers, setWorkers] = useState<WorkerAccess[]>(() => getWorkers().map((worker) => ({ ...worker, permissions: worker.permissions || [] })));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Technicien');
  const [permissions, setPermissions] = useState<string[]>(['Services']);
  const [message, setMessage] = useState('');
  const surface = isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-sm';
  const input = isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-300 bg-white text-slate-900';

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 6) {
      setMessage(isArabic ? 'أدخل المعلومات وكلمة سر من 6 أحرف على الأقل.' : 'Nom, email et mot de passe de 6 caractères minimum requis.');
      return;
    }
    addWorker({ name: name.trim(), email: email.trim(), password, role, permissions });
    setWorkers(getWorkers().map((worker) => ({ ...worker, permissions: worker.permissions || [] })));
    setName('');
    setEmail('');
    setPassword('');
    setMessage(isArabic ? 'تمت إضافة العامل.' : 'Collaborateur ajouté.');
  };

  const togglePermission = (permission: string) => {
    setPermissions((current) => current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission]);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">{isArabic ? 'خاص بالمالك' : 'Espace propriétaire'}</p><h1 className={`mt-1 text-2xl font-black sm:text-3xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{isArabic ? 'العمال والصلاحيات' : 'Employés & permissions'}</h1><p className="mt-2 text-sm text-slate-400">{isArabic ? 'أنشئ حساب كل عامل وحدد الصفحات التي يمكنه الوصول إليها.' : 'Créez le compte de chaque employé et contrôlez ses accès.'}</p></div>
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={submit} className={`space-y-4 rounded-2xl border p-5 ${surface}`}>
          <div className="flex items-center gap-2 text-amber-300"><UserPlus size={18} /><h2 className="font-bold">{isArabic ? 'إضافة عامل' : 'Ajouter un employé'}</h2></div>
          <label className="block text-xs text-slate-400">Nom / الاسم<input value={name} onChange={(event) => setName(event.target.value)} className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm ${input}`} /></label>
          <label className="block text-xs text-slate-400"><span className="flex items-center gap-1"><Mail size={13} /> Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm ${input}`} /></label>
          <label className="block text-xs text-slate-400"><span className="flex items-center gap-1"><KeyRound size={13} /> Mot de passe / كلمة السر</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm ${input}`} /></label>
          <label className="block text-xs text-slate-400">Rôle / الصلاحية<select value={role} onChange={(event) => setRole(event.target.value)} className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm ${input}`}><option>Technicien</option><option>Réception</option><option>Comptable</option><option>Manager</option></select></label>
          <div><p className="mb-2 text-xs text-slate-400">Permissions / الصلاحيات</p><div className="grid grid-cols-2 gap-2">{permissionOptions.map((permission) => <label key={permission} className={`flex items-center gap-2 rounded-xl border p-2 text-xs ${input}`}><input type="checkbox" checked={permissions.includes(permission)} onChange={() => togglePermission(permission)} className="accent-amber-500" />{permission}</label>)}</div></div>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-4 py-3 text-sm font-bold text-slate-950"><ShieldCheck size={16} />{isArabic ? 'حفظ العامل' : 'Créer le compte'}</button>
          {message && <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">{message}</p>}
        </form>
        <div className={`rounded-2xl border p-5 ${surface}`}><h2 className={`mb-4 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{isArabic ? 'العمال المسجلون' : 'Employés enregistrés'}</h2><div className="space-y-3">{workers.length === 0 ? <p className="text-sm text-slate-400">{isArabic ? 'لم تتم إضافة عمال بعد.' : 'Aucun employé pour le moment.'}</p> : workers.map((worker) => <div key={worker.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-white">{worker.name}</p><p className="mt-1 text-xs text-slate-400">{worker.email} • {worker.role}</p><div className="mt-2 flex flex-wrap gap-1">{worker.permissions.map((permission) => <span key={permission} className="rounded-md bg-amber-500/15 px-2 py-1 text-[10px] text-amber-300">{permission}</span>)}</div></div><button type="button" onClick={() => { removeWorker(worker.id); setWorkers(getWorkers().map((item) => ({ ...item, permissions: item.permissions || [] }))); }} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10" aria-label="Supprimer"><Trash2 size={16} /></button></div></div>)}</div></div>
      </div>
    </div>
  );
}
