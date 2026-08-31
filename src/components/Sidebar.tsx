<<<<<<< HEAD
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
    { label: 'Véhicules', icon: Car, path: '/vehicles' },
    { label: 'Stock intelligent', icon: Package, path: '/inventory' },
    { label: 'Finance', icon: DollarSign, path: '/finance' },
    { label: 'Équipe', icon: Users2, path: '/team' },
    { label: 'Avis', icon: Star, path: '/reviews' },
  ],
  ar: [
    { label: 'نظرة عامة', icon: BarChart3, path: '/' },
    { label: 'خدمة جديدة', icon: Plus, path: '/services/new' },
    { label: 'العملاء', icon: Users, path: '/clients' },
    { label: 'المركبات', icon: Car, path: '/vehicles' },
    { label: 'المخزون الذكي', icon: Package, path: '/inventory' },
    { label: 'المالية', icon: DollarSign, path: '/finance' },
    { label: 'الفريق', icon: Users2, path: '/team' },
    { label: 'التقييمات', icon: Star, path: '/reviews' },
  ],
} as const;

export function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebarStore();
  const { language, theme } = useUiStore();
  const { name, role, avatar } = useUserStore();
  const location = useLocation();
  const isDark = theme === 'dark';
  const menuItems = menuItemsByLang[language];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r backdrop-blur transition-all duration-300 ${
        isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white/90'
      } ${isExpanded ? 'w-72' : 'w-20'}`}
    >
      <div className={`flex items-center justify-between border-b p-5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 text-lg font-bold text-white shadow-lg shadow-amber-500/20">
            S
          </div>
          {isExpanded && <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>SIARA</span>}
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className={`rounded-md p-1 transition ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          aria-label="Toggle sidebar"
        >
          {isExpanded ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                isActive
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  : isDark
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={!isExpanded ? item.label : ''}
            >
              <Icon size={20} className="shrink-0" />
              {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {isExpanded && (
        <div className="mx-3 mb-5 rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-orange-400/10 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Zap size={16} className="text-amber-400" />
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>SIARA Pro</span>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{language === 'ar' ? 'ترقية للحصول على ميزات مميزة' : 'Upgrade for premium features'}</p>
        </div>
      )}

      <div className={`border-t p-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <img src={avatar} alt={name} className="h-10 w-10 rounded-full border-2 border-amber-500 object-cover" />
          {isExpanded && (
            <div className="min-w-0">
              <p className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{name}</p>
              <p className={`truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{role}</p>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className={`border-t p-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <Link
            to="/settings"
            className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <Settings size={18} />
            <span className="text-sm">{language === 'ar' ? 'الإعدادات' : 'Paramètres'}</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
=======
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
    { label: 'Véhicules', icon: Car, path: '/vehicles' },
    { label: 'Stock intelligent', icon: Package, path: '/inventory' },
    { label: 'Finance', icon: DollarSign, path: '/finance' },
    { label: 'Équipe', icon: Users2, path: '/team' },
    { label: 'Avis', icon: Star, path: '/reviews' },
  ],
  ar: [
    { label: 'نظرة عامة', icon: BarChart3, path: '/' },
    { label: 'خدمة جديدة', icon: Plus, path: '/services/new' },
    { label: 'العملاء', icon: Users, path: '/clients' },
    { label: 'المركبات', icon: Car, path: '/vehicles' },
    { label: 'المخزون الذكي', icon: Package, path: '/inventory' },
    { label: 'المالية', icon: DollarSign, path: '/finance' },
    { label: 'الفريق', icon: Users2, path: '/team' },
    { label: 'التقييمات', icon: Star, path: '/reviews' },
  ],
} as const;

export function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebarStore();
  const { language, theme } = useUiStore();
  const { name, role, avatar } = useUserStore();
  const location = useLocation();
  const isDark = theme === 'dark';
  const menuItems = menuItemsByLang[language];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r backdrop-blur transition-all duration-300 ${
        isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white/90'
      } ${isExpanded ? 'w-72' : 'w-20'}`}
    >
      <div className={`flex items-center justify-between border-b p-5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 text-lg font-bold text-white shadow-lg shadow-amber-500/20">
            S
          </div>
          {isExpanded && <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>SIARA</span>}
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className={`rounded-md p-1 transition ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          aria-label="Toggle sidebar"
        >
          {isExpanded ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                isActive
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  : isDark
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={!isExpanded ? item.label : ''}
            >
              <Icon size={20} className="shrink-0" />
              {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {isExpanded && (
        <div className="mx-3 mb-5 rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-orange-400/10 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Zap size={16} className="text-amber-400" />
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>SIARA Pro</span>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{language === 'ar' ? 'ترقية للحصول على ميزات مميزة' : 'Upgrade for premium features'}</p>
        </div>
      )}

      <div className={`border-t p-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <img src={avatar} alt={name} className="h-10 w-10 rounded-full border-2 border-amber-500 object-cover" />
          {isExpanded && (
            <div className="min-w-0">
              <p className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{name}</p>
              <p className={`truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{role}</p>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className={`border-t p-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <Link
            to="/settings"
            className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <Settings size={18} />
            <span className="text-sm">{language === 'ar' ? 'الإعدادات' : 'Paramètres'}</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
>>>>>>> 36b65e1 (Initial commit)
