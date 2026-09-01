import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Car,
  DollarSign,
  Menu,
  Package,
  Plus,
  Settings,
  Star,
  Users,
  Users2,
  X,
  Zap,
} from 'lucide-react';
import { useSidebarStore, useUiStore, useUserStore } from '../store/store';

const menuItemsByLang = {
  fr: [
    { label: 'Vue globale', icon: BarChart3, path: '/' },
    { label: 'Nouveau service', icon: Plus, path: '/services/new' },
    { label: 'Clients', icon: Users, path: '/clients' },
    { label: 'Véhicules & Historique', icon: Car, path: '/vehicles' },
    { label: 'Stock intelligent', icon: Package, path: '/inventory' },
    { label: 'Finance & Caisse', icon: DollarSign, path: '/finance' },
    { label: 'Équipe & العمال', icon: Users2, path: '/team' },
    { label: 'Avis clients (QR)', icon: Star, path: '/reviews' },
  ],
  ar: [
    { label: 'نظرة عامة', icon: BarChart3, path: '/' },
    { label: 'خدمة جديدة', icon: Plus, path: '/services/new' },
    { label: 'العملاء', icon: Users, path: '/clients' },
    { label: 'المركبات والسجل', icon: Car, path: '/vehicles' },
    { label: 'المخزون الذكي', icon: Package, path: '/inventory' },
    { label: 'المالية والصندوق', icon: DollarSign, path: '/finance' },
    { label: 'فريق العمل والعمولات', icon: Users2, path: '/team' },
    { label: 'تقييمات الزبائن (QR)', icon: Star, path: '/reviews' },
  ],
} as const;

export function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebarStore();
  const { language, theme } = useUiStore();
  const { name, role, avatar } = useUserStore();
  const location = useLocation();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';
  const menuItems = menuItemsByLang[language];

  return (
    <aside
      className={`fixed top-0 z-40 flex h-screen flex-col backdrop-blur transition-all duration-300 ${
        isArabic
          ? 'right-0 border-l ltr:border-r-0'
          : 'left-0 border-r rtl:border-l-0'
      } ${
        isDark ? 'border-slate-800 bg-slate-900/95 text-slate-200' : 'border-slate-200 bg-white/95 text-slate-800'
      } ${isExpanded ? 'w-[min(18rem,calc(100vw-1rem))] md:w-64' : 'w-16 md:w-20'}`}
    >
      <div className={`flex items-center justify-between border-b p-4 sm:p-5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 text-lg font-black text-slate-950 shadow-lg shadow-amber-500/20">
            S
          </div>
          {isExpanded && (
            <div>
              <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>SIARA</span>
              <span className="ms-1.5 rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                PRO
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className={`rounded-lg p-1.5 transition ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
          aria-label="Toggle sidebar"
        >
          {isExpanded ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isExpanded && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isArabic ? 'إغلاق القائمة' : 'Fermer le menu'}
          className="fixed inset-0 -z-10 bg-slate-950/60 md:hidden"
        />
      )}

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-400 font-semibold text-slate-950 shadow-md shadow-amber-500/20'
                  : isDark
                    ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
              }`}
              title={!isExpanded ? item.label : ''}
            >
              <Icon size={20} className="shrink-0" />
              {isExpanded && <span className="truncate text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {isExpanded && (
        <div className="mx-3 mb-3 rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-orange-400/10 p-3">
          <div className="mb-1 flex items-center gap-2">
            <Zap size={16} className="text-amber-400" />
            <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>SIARA Cloud</span>
          </div>
          <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {isArabic ? 'متصل بقاعدة البيانات وسحابي 100%' : 'Connecté & synchronisé au Cloud'}
          </p>
        </div>
      )}

      <div className={`border-t p-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <img src={avatar} alt={name} className="h-9 w-9 rounded-full border border-amber-500/50 object-cover" />
          {isExpanded && (
            <div className="min-w-0 flex-1">
              <p className={`truncate text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{name}</p>
              <p className={`truncate text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{role}</p>
            </div>
          )}
        </div>
      </div>

      <div className={`border-t p-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <Link
          to="/settings"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
            location.pathname === '/settings'
              ? 'bg-amber-500 text-slate-950 font-semibold'
              : isDark
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Settings size={18} className="shrink-0" />
          {isExpanded && <span className="text-xs font-medium">{isArabic ? 'الإعدادات و Supabase' : 'Paramètres & Supabase'}</span>}
        </Link>
      </div>
    </aside>
  );
}
