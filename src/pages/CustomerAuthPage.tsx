import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarFront, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/store';

export function CustomerAuthPage() {
  const navigate = useNavigate();
  const { language } = useUiStore();
  const registerCustomer = useAuthStore((state) => state.registerCustomer);
  const signIn = useAuthStore((state) => state.signIn);
  const isArabic = language === 'ar';
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (mode === 'register') {
      if (!name.trim() || !phone.trim() || password.length < 6) {
        setError(isArabic ? 'أدخل الاسم والهاتف وكلمة سر من 6 أحرف على الأقل.' : 'Nom, téléphone et mot de passe (6 caractères minimum) requis.');
        return;
      }
      registerCustomer(email.trim(), password, name.trim(), phone.trim());
      navigate('/app');
      return;
    }
    if (!signIn(email.trim(), password)) {
      setError(isArabic ? 'البريد الإلكتروني أو كلمة السر غير صحيحة.' : 'Email ou mot de passe incorrect.');
      return;
    }
    const account = useAuthStore.getState().account;
    if (account?.role !== 'CUSTOMER') {
      useAuthStore.getState().signOut();
      setError(isArabic ? 'هذا الحساب مخصص للورشة.' : 'Ce compte est réservé à l’atelier.');
      return;
    }
    navigate('/app');
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <section className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center gap-3"><div className="rounded-2xl bg-amber-500 p-3 text-slate-950"><CarFront /></div><div><p className="text-2xl font-black">SIARA</p><p className="text-xs text-slate-400">{isArabic ? 'مساحة صاحب السيارة' : 'Espace propriétaire'}</p></div></div>
          <div className="mb-6 flex rounded-xl bg-slate-950 p-1">
            <button type="button" onClick={() => setMode('login')} className={`flex-1 rounded-lg py-2 text-sm font-bold ${mode === 'login' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>{isArabic ? 'دخول' : 'Connexion'}</button>
            <button type="button" onClick={() => setMode('register')} className={`flex-1 rounded-lg py-2 text-sm font-bold ${mode === 'register' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>{isArabic ? 'حساب جديد' : 'Créer un compte'}</button>
          </div>
          <h1 className="text-2xl font-black">{mode === 'login' ? (isArabic ? 'مرحباً بك' : 'Bienvenue') : (isArabic ? 'أنشئ حسابك' : 'Créer votre compte')}</h1>
          <form onSubmit={submit} className="mt-5 space-y-3">
            {mode === 'register' && <label className="block"><span className="mb-1 block text-xs text-slate-400">{isArabic ? 'الاسم الكامل' : 'Nom complet'}</span><div className="relative"><UserRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm" required /></div></label>}
            {mode === 'register' && <label className="block"><span className="mb-1 block text-xs text-slate-400">{isArabic ? 'الهاتف' : 'Téléphone'}</span><div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm" required /></div></label>}
            <label className="block"><span className="mb-1 block text-xs text-slate-400">Email</span><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm" required /></div></label>
            <label className="block"><span className="mb-1 block text-xs text-slate-400">{isArabic ? 'كلمة السر' : 'Mot de passe'}</span><div className="relative"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm" required /></div></label>
            <button className="w-full rounded-xl bg-amber-500 py-3 font-bold text-slate-950">{mode === 'login' ? (isArabic ? 'دخول' : 'Se connecter') : (isArabic ? 'إنشاء الحساب' : 'Créer le compte')}</button>
          </form>
          {error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
        </section>
      </div>
    </main>
  );
}
