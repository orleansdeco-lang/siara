import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Car,
  Clock3,
  DollarSign,
  Droplets,
  Languages,
  LogOut,
  Menu,
  Moon,
  Package,
  Plus,
  Settings,
  Star,
  Sun,
  Users,
  Users2,
  X,
  Zap,
} from 'lucide-react';
import { useSidebarStore, useUiStore, useUserStore } from '../store/store';
import { useAuthStore } from '../store/authStore';

const menuItemsByLang = {
  fr: [
    { label: 'Vue globale', icon: BarChart3, path: '/' },
    { label: 'Nouveau service', icon: Plus, path: '/services/new' },
    { label: 'Clients', icon: Users, path: '/clients' },
    { label: 'Véhicules & Historique', icon: Car, path: '/vehicles' },
    { label: 'Stock intelligent', icon: Package, path: '/inventory' },
    { label: 'Finance & Caisse', icon: DollarSign, path: '/finance' },
    { label: 'Équipe & العمال', icon: Users2, path: '/team' },
    { label: 'Gestion des accès', icon: Settings, path: '/owner/team' },
    { label: 'Historique des actions', icon: Clock3, path: '/owner/activity' },
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
    { label: 'إدارة العمال والصلاحيات', icon: Settings, path: '/owner/team' },
    { label: 'سجل النشاطات', icon: Clock3, path: '/owner/activity' },
    { label: 'تقييمات الزبائن (QR)', icon: Star, path: '/reviews' },
  ],
} as const;

export function Sidebar() {
  const { isExpanded, toggleSidebar, setExpanded } = useSidebarStore();
  const { language, theme, toggleTheme, setLanguage } = useUiStore();
  const { name, role } = useUserStore();
  const account = useAuthStore((state) => state.account);
  const signOut = useAuthStore((state) => state.signOut);
  const location = useLocation();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';
  const menuItems = [...menuItemsByLang[language]].filter((item) => {
    if (item.path.startsWith('/owner/')) return Boolean(account?.isOwner);
    const permissionByPath: Record<string, string> = {
      '/clients': 'Clients',
      '/services/new': 'Services',
      '/inventory': 'Stock',
      '/finance': 'Finance',
      '/reviews': 'Avis',
    };
    const requiredPermission = permissionByPath[item.path];
    return !requiredPermission || account?.isOwner || account?.permissions?.includes(requiredPermission);
  });
  const accountName = account?.profile?.ownerName || account?.email || name;
  const accountRole = account?.profile ? 'مالك المحل / Propriétaire' : role;
  const accountInitials = accountName.slice(0, 2).toUpperCase();

  useEffect(() => {
    if (window.innerWidth < 768) setExpanded(false);
  }, [setExpanded]);

  const handleNavigation = () => {
    if (window.innerWidth < 768) setExpanded(false);
  };

  return (
    <aside
      className={`fixed top-0 z-40 flex h-screen flex-col backdrop-blur transition-all duration-300 ${
        isArabic
          ? 'right-0 border-l ltr:border-r-0'
          : 'left-0 border-r rtl:border-l-0'
      } ${
        isDark ? 'border-slate-800 bg-slate-900/95 text-slate-200' : 'border-slate-200 bg-white/95 text-slate-800'
      } ${isExpanded ? 'w-[min(18rem,calc(100vw-1rem))] md:w-64' : 'w-16 md:w-20'} max-md:top-14 max-md:h-[calc(100vh-3.5rem)] ${
        isExpanded ? 'max-md:translate-y-0' : 'max-md:-translate-y-[120%]'
      }`}
    >
      <div className={`flex items-center justify-between border-b p-4 sm:p-5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20">
          <Droplets size={21} strokeWidth={2.5} />
          </div>
          {isExpanded && (
          <div>
            <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>SIARA</span>
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
              onClick={handleNavigation}
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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-xs font-bold text-amber-300" aria-label={accountName}>
            {accountInitials}
          </div>
          {isExpanded && (
            <div className="min-w-0 flex-1">
              <p className={`truncate text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{accountName}</p>
              <p className={`truncate text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{accountRole}</p>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t p-3 md:order-last">
          <div className="mb-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                isDark ? 'border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Languages size={15} className="text-amber-400" />
              {language === 'fr' ? 'العربية' : 'Français'}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                isDark ? 'border-slate-800 bg-slate-950 text-amber-300 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              aria-label={isArabic ? 'الوضع الليلي' : 'Changer le thème'}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
              {isDark ? (isArabic ? 'نهاري' : 'Clair') : (isArabic ? 'ليلي' : 'Sombre')}
            </button>
          </div>
        </div>
      )}

      <div className={`border-t p-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <Link
          to="/settings"
          onClick={handleNavigation}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
            location.pathname === '/settings'
              ? 'bg-amber-500 text-slate-950 font-semibold'
              : isDark
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Settings size={18} className="shrink-0" />
          {isExpanded && <span className="text-xs font-medium">{isArabic ? 'إعدادات الورشة' : 'Paramètres de l’atelier'}</span>}
        </Link>
        <button
          type="button"
          onClick={signOut}
          className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
            isDark ? 'text-red-300 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut size={18} className="shrink-0" />
          {isExpanded && <span className="text-xs font-medium">{isArabic ? 'تسجيل الخروج' : 'Déconnexion'}</span>}
        </button>
      </div>
    </aside>
  );
}
