import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Droplets, LockKeyhole, Phone, UserRound } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { requestWhatsAppOtp } from '../lib/auth';
import { useUiStore } from '../store/store';

export function AuthPage() {
  const navigate = useNavigate();
  const { language } = useUiStore();
  const register = useAuthStore((state) => state.register);
  const signIn = useAuthStore((state) => state.signIn);
  const isArabic = language === 'ar';
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (mode === 'register') {
      if (password.length < 6 || !name.trim()) {
        setError(isArabic ? 'أدخل الاسم وكلمة سر من 6 أحرف على الأقل.' : 'Nom requis et mot de passe de 6 caractères minimum.');
        return;
      }
      register(email.trim(), password);
      navigate('/setup');
      return;
    }
    if (!signIn(email.trim(), password)) {
      setError(isArabic ? 'البريد الإلكتروني أو كلمة السر غير صحيحة.' : 'Email ou mot de passe incorrect.');
      return;
    }
    const currentAccount = useAuthStore.getState().account;
    navigate(currentAccount?.profile ? '/' : '/setup');
  };

  const sendOtp = async () => {
    setError('');
    try {
      await requestWhatsAppOtp(phone.trim());
      setOtpSent(true);
    } catch {
      setError(isArabic ? 'OTP يحتاج إعداد WhatsApp داخل Supabase Edge Function.' : 'L’OTP WhatsApp nécessite une Edge Function Supabase configurée.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-8 lg:grid-cols-2">
        <div className="hidden space-y-5 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 text-slate-950"><Droplets size={28} /></div>
            <span className="text-4xl font-black tracking-tight">SIARA</span>
          </div>
          <h1 className="max-w-lg text-5xl font-black leading-tight">{isArabic ? 'إدارة ورشتك بسهولة.' : 'Gérez votre atelier simplement.'}</h1>
          <p className="max-w-lg text-slate-400">{isArabic ? 'حساب مستقل لكل محل، مع عملاء وخدمات ومخزون خاص بك.' : 'Un compte indépendant pour chaque atelier, avec vos clients, services et votre stock.'}</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center gap-3 lg:hidden"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 text-slate-950"><Droplets size={22} /></div><span className="text-2xl font-black">SIARA</span></div>
          <div className="mb-6 flex gap-2 rounded-xl bg-slate-950 p-1">
            <button type="button" onClick={() => setMode('login')} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>{isArabic ? 'دخول' : 'Connexion'}</button>
            <button type="button" onClick={() => setMode('register')} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'register' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>{isArabic ? 'حساب جديد' : 'Créer un compte'}</button>
          </div>
          <h2 className="text-2xl font-black">{mode === 'register' ? (isArabic ? 'أنشئ حساب المحل' : 'Créer le compte de l’atelier') : (isArabic ? 'مرحبا بك في SIARA' : 'Bienvenue sur SIARA')}</h2>
          <form onSubmit={submit} className="mt-5 space-y-3">
            {mode === 'register' && <label className="block"><span className="mb-1 block text-xs text-slate-400">{isArabic ? 'اسم صاحب المحل' : 'Nom du propriétaire'}</span><div className="relative"><UserRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-500" required /></div></label>}
            <label className="block"><span className="mb-1 block text-xs text-slate-400">Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-amber-500" required /></label>
            <label className="block"><span className="mb-1 block text-xs text-slate-400">{isArabic ? 'كلمة السر' : 'Mot de passe'}</span><div className="relative"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-500" required /></div></label>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-4 py-3 font-bold text-slate-950">{mode === 'register' ? (isArabic ? 'متابعة إعداد المحل' : 'Continuer la configuration') : (isArabic ? 'دخول' : 'Se connecter')}<ArrowRight size={17} /></button>
          </form>
          {mode === 'register' && <div className="mt-5 border-t border-slate-800 pt-5"><p className="mb-2 text-xs font-semibold text-slate-300">{isArabic ? 'OTP WhatsApp (جاهز للربط)' : 'OTP WhatsApp (prêt à connecter)'}</p><div className="flex gap-2"><div className="relative min-w-0 flex-1"><Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+213..." className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-500" /></div><button type="button" onClick={sendOtp} className="rounded-xl border border-amber-500/50 px-3 text-xs font-bold text-amber-300">{isArabic ? 'إرسال' : 'Envoyer'}</button></div>{otpSent && <input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="OTP" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />}</div>}
          {error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
          <Link to="/" className="mt-5 block text-center text-xs text-slate-500 hover:text-amber-300">{isArabic ? 'الدخول التجريبي متاح بعد إنشاء حساب محلي' : 'Le mode local fonctionne sans configuration Supabase'}</Link>
        </div>
      </div>
    </div>
  );
}
