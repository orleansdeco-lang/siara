import { create } from 'zustand';

export type GarageProfile = {
  name: string;
  wilaya: string;
  address: string;
  storefrontImage: string;
  ownerName: string;
  workshopPhone: string;
  ownerPhone: string;
};

export type Account = {
  id: string;
  email: string;
  password: string;
  profile?: GarageProfile;
};

type AuthState = {
  account: Account | null;
  signIn: (email: string, password: string) => boolean;
  register: (email: string, password: string) => Account;
  updateProfile: (profile: GarageProfile) => void;
  signOut: () => void;
};

const ACCOUNTS_KEY = 'siara_accounts_v1';
const SESSION_KEY = 'siara_session_v1';

function readAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as Account[]) : [];
  } catch {
    return [];
  }
}

function persistAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function readSession(): Account | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  account: readSession(),
  signIn: (email, password) => {
    const account = readAccounts().find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (!account) return false;
    localStorage.setItem(SESSION_KEY, JSON.stringify(account));
    set({ account });
    return true;
  },
  register: (email, password) => {
    const accounts = readAccounts();
    const account: Account = { id: `account-${Date.now()}`, email, password };
    persistAccounts([...accounts, account]);
    localStorage.setItem(SESSION_KEY, JSON.stringify(account));
    set({ account });
    return account;
  },
  updateProfile: (profile) => {
    set((state) => {
      if (!state.account) return state;
      const updated = { ...state.account, profile };
      persistAccounts(readAccounts().map((item) => item.id === updated.id ? updated : item));
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      return { account: updated };
    });
  },
  signOut: () => {
    localStorage.removeItem(SESSION_KEY);
    set({ account: null });
  },
}));
