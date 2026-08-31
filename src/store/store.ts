import { create } from 'zustand';

interface SidebarState {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

interface UserState {
  name: string;
  role: string;
  avatar: string;
  setUser: (name: string, role: string, avatar: string) => void;
}

export type ThemeMode = 'dark' | 'light';
export type LocaleMode = 'fr' | 'ar';

interface UiState {
  theme: ThemeMode;
  language: LocaleMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: LocaleMode) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: true,
  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
}));

export const useUserStore = create<UserState>((set) => ({
  name: 'Sofia Martin',
  role: 'Director General',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  setUser: (name, role, avatar) => set({ name, role, avatar }),
}));

export const useUiStore = create<UiState>((set) => ({
  theme: 'dark',
  language: 'fr',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}));
