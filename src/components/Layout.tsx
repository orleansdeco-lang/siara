import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Database, Menu, Plus } from 'lucide-react';
import { useGarageStore, useSidebarStore, useUiStore } from '../store/store';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isExpanded, toggleSidebar } = useSidebarStore();
  const { theme, language } = useUiStore();
  const { name: garageName } = useGarageStore();

  const isDark = theme === 'dark';
  const isArabic = language === 'ar';
  const dashboardLabel = isArabic ? 'لوحة تحكم الورشة' : 'Atelier de Vidange & Mécanique';
  const newServiceLabel = isArabic ? 'خدمة جديدة' : 'Nouveau service';

  const marginClass = isArabic
    ? isExpanded
      ? 'mr-0 md:mr-64'
      : 'mr-0 md:mr-20'
    : isExpanded
      ? 'ml-0 md:ml-64'
      : 'ml-0 md:ml-20';

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      {isExpanded && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isArabic ? 'إغلاق القائمة' : 'Fermer le menu'}
          className="fixed inset-0 z-30 bg-slate-950/60 md:hidden"
        />
      )}
      <div className={`transition-all duration-300 ${marginClass}`}>
        <header
          className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-200 ${
            isDark ? 'border-slate-800 bg-slate-950/85' : 'border-slate-200 bg-white/85'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3.5">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={toggleSidebar}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border md:hidden ${
                  isDark ? 'border-slate-800 bg-slate-900 text-amber-400' : 'border-slate-200 bg-white text-amber-600'
                }`}
                aria-label={isArabic ? 'فتح القائمة' : 'Ouvrir le menu'}
              >
                <Menu size={19} />
              </button>
              <div
                className={`hidden h-10 w-10 items-center justify-center rounded-xl border sm:flex ${
                  isDark ? 'border-slate-800 bg-slate-900 text-amber-400' : 'border-slate-200 bg-slate-50 text-amber-600'
                }`}
              >
                <Database size={18} />
              </div>
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {dashboardLabel}
                </p>
                <h1 className={`text-base font-bold sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {garageName}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/services/new"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 transition hover:brightness-105 active:scale-95 sm:text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">{newServiceLabel}</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="min-w-0 p-2.5 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
