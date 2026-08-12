import { UserProfile, AccountTier } from '../types';
import { INITIAL_USER } from '../data/initialData';

const AUTH_KEYS = {
  ACCOUNTS: 'msa_user_accounts',
  CURRENT_USER_ID: 'msa_current_user_id',
};

export interface UserAccount extends UserProfile {
  passwordHash?: string;
  avatar?: string;
  bio?: string;
  title?: string;
}

export function getStoredAccounts(): UserAccount[] {
  if (typeof window === 'undefined') return [INITIAL_USER];
  const data = localStorage.getItem(AUTH_KEYS.ACCOUNTS);
  if (!data) {
    const initialAccounts: UserAccount[] = [
      {
        ...INITIAL_USER,
        passwordHash: 'demo123',
        avatar: 'arcade_bot',
        bio: 'Daily micro-learner mastering touch typing, Spanish pragmatics, and algorithm tracing.',
        title: 'Microlearning Scholar',
      },
    ];
    localStorage.setItem(AUTH_KEYS.ACCOUNTS, JSON.stringify(initialAccounts));
    return initialAccounts;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [INITIAL_USER];
  }
}

export function getCurrentUser(): UserAccount {
  if (typeof window === 'undefined') return INITIAL_USER;
  const currentId = localStorage.getItem(AUTH_KEYS.CURRENT_USER_ID);
  const accounts = getStoredAccounts();
  if (!currentId) {
    // Default to first account
    return accounts[0] || INITIAL_USER;
  }
  const found = accounts.find((a) => a.id === currentId);
  return found || accounts[0] || INITIAL_USER;
}

export function setCurrentUserId(userId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEYS.CURRENT_USER_ID, userId);
  
  // Also sync to msa_user_profile for legacy compatibility
  const current = getCurrentUser();
  localStorage.setItem('msa_user_profile', JSON.stringify(current));
}

export function loginUser(email: string, password?: string): { success: boolean; user?: UserAccount; error?: string } {
  const accounts = getStoredAccounts();
  const normalizedEmail = email.trim().toLowerCase();
  const account = accounts.find((a) => a.email.trim().toLowerCase() === normalizedEmail);

  if (!account) {
    return { success: false, error: 'No account found with this email address. Please sign up!' };
  }

  if (account.passwordHash && password && account.passwordHash !== password) {
    return { success: false, error: 'Incorrect password. Please check your credentials.' };
  }

  setCurrentUserId(account.id);
  return { success: true, user: account };
}

export function signupUser({
  displayName,
  email,
  password,
  avatar = 'arcade_bot',
  dailyGoalSessions = 3,
}: {
  displayName: string;
  email: string;
  password?: string;
  avatar?: string;
  dailyGoalSessions?: number;
}): { success: boolean; user?: UserAccount; error?: string } {
  const accounts = getStoredAccounts();
  const normalizedEmail = email.trim().toLowerCase();

  if (accounts.some((a) => a.email.trim().toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists. Please sign in.' };
  }

  const newAccount: UserAccount = {
    id: `user_${Date.now()}`,
    displayName: displayName.trim() || 'New Arcader',
    email: normalizedEmail,
    passwordHash: password || 'password123',
    accountTier: 'free',
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    streakDays: 1,
    lastSessionDate: new Date().toISOString().split('T')[0],
    dailyGoalSessions,
    soundEnabled: true,
    avatar,
    bio: 'Ready to train memory and speed with Microskill Arcade.',
    title: 'Arcade Novice',
    preferences: {
      targetLanguages: ['Spanish'],
      targetCodingLanguages: ['JavaScript', 'Python'],
      mathFocusLevel: 1,
    },
  };

  const updatedAccounts = [newAccount, ...accounts];
  localStorage.setItem(AUTH_KEYS.ACCOUNTS, JSON.stringify(updatedAccounts));
  setCurrentUserId(newAccount.id);

  return { success: true, user: newAccount };
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEYS.CURRENT_USER_ID);
}

export function updateAccount(updatedAccount: UserAccount): UserAccount {
  const accounts = getStoredAccounts();
  const index = accounts.findIndex((a) => a.id === updatedAccount.id);
  if (index !== -1) {
    accounts[index] = { ...accounts[index], ...updatedAccount };
  } else {
    accounts.push(updatedAccount);
  }
  localStorage.setItem(AUTH_KEYS.ACCOUNTS, JSON.stringify(accounts));
  localStorage.setItem('msa_user_profile', JSON.stringify(updatedAccount));
  return updatedAccount;
}
