import { useState } from 'react';
import {
  CheckCircle2,
  Globe,
  Moon,
  Save,
  Sun,
} from 'lucide-react';
import { useGarageStore, useUiStore } from '../store/store';

export function SettingsPage() {
  const { language, theme, setTheme, setLanguage } = useUiStore();
  const { name, address, phone, currency, setGarage } = useGarageStore();

  const isDark = theme === 'dark';
  const isArabic = language === 'ar';

  const [garageName, setGarageName] = useState(name);
  const [garageAddress, setGarageAddress] = useState(address);
  const [garagePhone, setGaragePhone] = useState(phone);
  const [garageCurrency, setGarageCurrency] = useState(currency);

  const [savedMessage, setSavedMessage] = useState('');

  const handleSaveGarage = () => {
    setGarage({
      name: garageName.trim() || 'SIARA Workshop',
      address: garageAddress.trim(),
      phone: garagePhone.trim(),
      currency: garageCurrency.trim() || 'DZD',
    });
    setSavedMessage(isArabic ? 'تم حفظ إعدادات الورشة بنجاح!' : 'Informations enregistrées avec succès !');
    setTimeout(() => setSavedMessage(''), 3500);
  };

  const cardSurface = isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-sm';
  const subCard = isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50';
  const baseText = isDark ? 'text-white' : 'text-slate-900';
  const inputClass = isDark
    ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:border-amber-500'
    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">
          {isArabic ? 'إعدادات النظام والورشة' : 'Paramètres du système'}
        </p>
        <h2 className={`mt-1 text-2xl font-black sm:text-3xl ${baseText}`}>
          {isArabic ? 'إعدادات الورشة' : 'Paramètres de l’atelier'}
        </h2>
      </div>

      {/* Garage Profile Settings */}
      <div className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${cardSurface}`}>
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <h3 className={`font-bold text-base ${baseText}`}>
            {isArabic ? 'معلومات وبيانات الورشة' : 'Informations de l’atelier'}
          </h3>
          <span className="text-xs text-slate-400">
            {isArabic ? 'تظهر في وصولات الصيانة والـ QR' : 'Affiché sur les bons imprimés'}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-400">{isArabic ? 'اسم الورشة' : 'Nom de l’atelier'}</label>
            <input
              value={garageName}
              onChange={(e) => setGarageName(e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-400">{isArabic ? 'رقم الهاتف' : 'Téléphone'}</label>
            <input
              value={garagePhone}
              onChange={(e) => setGaragePhone(e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-400">{isArabic ? 'العنوان / المدينة' : 'Adresse / Ville'}</label>
            <input
              value={garageAddress}
              onChange={(e) => setGarageAddress(e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-400">{isArabic ? 'العملة الافتراضية' : 'Devise'}</label>
            <input
              value={garageCurrency}
              onChange={(e) => setGarageCurrency(e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
            />
          </div>
        </div>

        {savedMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{savedMessage}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSaveGarage}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 active:scale-95"
          >
            <Save size={15} />
            <span>{isArabic ? 'حفظ إعدادات الورشة' : 'Enregistrer les modifications'}</span>
          </button>
        </div>
      </div>

      {/* Language & Theme Preferences */}
      <div className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${cardSurface}`}>
        <h3 className={`font-bold text-base border-b border-slate-800/60 pb-3 ${baseText}`}>
          {isArabic ? 'المظهر واللغة الافتراضية' : 'Préférences d’affichage'}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className={`rounded-xl border p-4 space-y-2.5 ${subCard}`}>
            <div className="flex items-center gap-2 font-bold text-xs text-amber-500">
              <Globe size={16} />
              <span>{isArabic ? 'لغة الواجهة' : 'Langue'}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${
                  language === 'ar'
                    ? 'border-amber-500 bg-amber-500 text-slate-950'
                    : isDark ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                العربية (RTL)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${
                  language === 'fr'
                    ? 'border-amber-500 bg-amber-500 text-slate-950'
                    : isDark ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                Français (LTR)
              </button>
            </div>
          </div>

          <div className={`rounded-xl border p-4 space-y-2.5 ${subCard}`}>
            <div className="flex items-center gap-2 font-bold text-xs text-amber-500">
              <Sun size={16} />
              <span>{isArabic ? 'المظهر' : 'Thème'}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition ${
                  theme === 'dark'
                    ? 'border-amber-500 bg-amber-500 text-slate-950'
                    : isDark ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                <Moon size={14} />
                <span>{isArabic ? 'ليلي / Dark' : 'Sombre'}</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition ${
                  theme === 'light'
                    ? 'border-amber-500 bg-amber-500 text-slate-950'
                    : isDark ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                <Sun size={14} />
                <span>{isArabic ? 'نهاري / Light' : 'Clair'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
