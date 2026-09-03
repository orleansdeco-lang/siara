import { create } from 'zustand';

interface SidebarState {
  isExpanded: boolean;
  toggleSidebar: () => void;
  setExpanded: (expanded: boolean) => void;
}

interface UserState {
  name: string;
  role: string;
  avatar: string;
  setUser: (name: string, role: string, avatar: string) => void;
}

export type ThemeMode = 'dark' | 'light' | 'midnight';
export type LocaleMode = 'fr' | 'ar';

interface GarageState {
  id: number;
  name: string;
  address: string;
  phone: string;
  currency: string;
  setGarage: (garage: Partial<Omit<GarageState, 'setGarage'>>) => void;
}

interface UiState {
  theme: ThemeMode;
  language: LocaleMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: LocaleMode) => void;
}

const THEME_KEY = 'siara_theme_mode';
const LANG_KEY = 'siara_locale_mode';
const GARAGE_KEY = 'siara_garage_info';

const getInitialTheme = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'midnight') return saved;
  } catch {}
  return 'dark';
};

const getInitialLanguage = (): LocaleMode => {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'fr' || saved === 'ar') return saved;
  } catch {}
  return 'ar';
};

const getInitialGarage = () => {
  try {
    const saved = localStorage.getItem(GARAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    id: 1,
    name: 'SIARA Workshop Alger',
    address: 'Bir Mourad Raïs, Alger',
    phone: '+213 555 12 34 56',
    currency: 'DZD',
  };
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: true,
  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
  setExpanded: (expanded) => set({ isExpanded: expanded }),
}));

export const useUserStore = create<UserState>((set) => ({
  name: 'Sofia Martin',
  role: 'Directrice Générale / مسيرة',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  setUser: (name, role, avatar) => set({ name, role, avatar }),
}));

export const useGarageStore = create<GarageState>((set) => ({
  ...getInitialGarage(),
  setGarage: (garage) => {
    set((state) => {
      const updated = { ...state, ...garage };
      try {
        localStorage.setItem(GARAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  },
}));

export const useUiStore = create<UiState>((set) => ({
  theme: getInitialTheme(),
  language: getInitialLanguage(),
  toggleTheme: () => {
    set((state) => {
      const next: ThemeMode = state.theme === 'dark' ? 'light' : state.theme === 'light' ? 'midnight' : 'dark';
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {}
      return { theme: next };
    });
  },
  setTheme: (theme) => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
    set({ theme });
  },
  setLanguage: (language) => {
    try {
      localStorage.setItem(LANG_KEY, language);
    } catch {}
    set({ language });
  },
}));
