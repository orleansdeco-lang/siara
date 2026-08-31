import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Moon, Search, Sun, Languages } from 'lucide-react';
import { useSidebarStore, useUiStore } from '../store/store';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isExpanded } = useSidebarStore();
  const { theme, language, toggleTheme, setLanguage } = useUiStore();

  const isDark = theme === 'dark';
  const dashboardLabel = language === 'ar' ? 'لوحة التحكم' : 'Dashboard';
  const newServiceLabel = language === 'ar' ? 'خدمة جديدة' : 'Nouveau service';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      <div className={`transition-all duration-300 ${isExpanded ? 'pl-72' : 'pl-20'}`}>
        <header className={`sticky top-0 z-30 border-b backdrop-blur-sm ${isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white/80'}`}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
                <Search size={18} className={isDark ? 'text-slate-300' : 'text-slate-600'} />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{dashboardLabel}</p>
                <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>SIARA</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  isDark ? 'border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Languages size={16} />
                {language === 'fr' ? 'FR' : 'AR'}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className={`rounded-xl border p-2 transition ${
                  isDark ? 'border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link
                to="/services/new"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:brightness-110"
              >
                {newServiceLabel}
              </Link>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}