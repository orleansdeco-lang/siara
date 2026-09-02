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
  isOwner?: boolean;
  ownerAccountId?: string;
  permissions?: string[];
};

export type WorkerAccount = Account & {
  name: string;
  role: string;
};

type AuthState = {
  account: Account | null;
  signIn: (email: string, password: string) => boolean;
  register: (email: string, password: string) => Account;
  addWorker: (worker: Omit<WorkerAccount, 'id' | 'ownerAccountId' | 'isOwner'>) => WorkerAccount;
  getWorkers: () => WorkerAccount[];
  removeWorker: (id: string) => void;
  updateProfile: (profile: GarageProfile) => void;
  signOut: () => void;
};

const ACCOUNTS_KEY = 'siara_accounts_v1';
const WORKERS_KEY = 'siara_workers_v1';
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

function readWorkers(): WorkerAccount[] {
  try {
    const raw = localStorage.getItem(WORKERS_KEY);
    return raw ? (JSON.parse(raw) as WorkerAccount[]) : [];
  } catch {
    return [];
  }
}

export function recordActivity(action: string, details: string, account?: Account | null) {
  try {
    const raw = localStorage.getItem('siara_activity_log_v1');
    const entries = raw ? JSON.parse(raw) as Array<Record<string, string>> : [];
    const device = `${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Ordinateur'} • ${navigator.platform || 'Appareil'}`;
    localStorage.setItem('siara_activity_log_v1', JSON.stringify([
      { id: `activity-${Date.now()}`, action, details, actor: account?.email || 'Compte', device, createdAt: new Date().toISOString() },
      ...entries,
    ]));
  } catch {
    // Local activity history is best-effort when storage is unavailable.
  }
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
    const worker = readWorkers().find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    const signedInAccount = account || worker;
    if (!signedInAccount) return false;
    localStorage.setItem(SESSION_KEY, JSON.stringify(signedInAccount));
    recordActivity('Connexion', `Connexion réussie pour ${signedInAccount.email}`, signedInAccount);
    set({ account: signedInAccount });
    return true;
  },
  register: (email, password) => {
    const accounts = readAccounts();
    const account: Account = { id: `account-${Date.now()}`, email, password, isOwner: true, permissions: ['*'] };
    persistAccounts([...accounts, account]);
    localStorage.setItem(SESSION_KEY, JSON.stringify(account));
    recordActivity('Création du compte', 'Création du compte propriétaire', account);
    set({ account });
    return account;
  },
  addWorker: (worker) => {
    const owner = readSession();
    if (!owner) throw new Error('Aucun propriétaire connecté.');
    const next: WorkerAccount = { ...worker, id: `worker-${Date.now()}`, ownerAccountId: owner.ownerAccountId || owner.id, isOwner: false };
    localStorage.setItem(WORKERS_KEY, JSON.stringify([next, ...readWorkers()]));
    recordActivity('Ajout d’un travailleur', `${next.name} (${next.email})`, owner);
    return next;
  },
  getWorkers: () => {
    const owner = readSession();
    if (!owner) return [];
    const ownerId = owner.ownerAccountId || owner.id;
    return readWorkers().filter((worker) => worker.ownerAccountId === ownerId);
  },
  removeWorker: (id) => {
    const owner = readSession();
    const worker = readWorkers().find((item) => item.id === id);
    localStorage.setItem(WORKERS_KEY, JSON.stringify(readWorkers().filter((item) => item.id !== id)));
    recordActivity('Suppression d’un travailleur', worker?.name || id, owner);
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
    const account = readSession();
    recordActivity('Déconnexion', 'Déconnexion du compte', account);
    localStorage.removeItem(SESSION_KEY);
    set({ account: null });
  },
}));
