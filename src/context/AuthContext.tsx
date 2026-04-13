import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Account = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  xp?: number;
  streak?: number;
  lastStreakDate?: string | null; // YYYY-MM-DD
  level?: number;
};

type User = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  xp: number;
  streak: number;
  lastStreakDate?: string | null;
  level: number;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  signUp: (account: Account) => Promise<{ ok: boolean; message?: string }>;
  signOut: () => Promise<void>;
  awardXp: (amount: number) => Promise<{ ok: boolean; xp?: number }>;
  completeDaily: () => Promise<{ ok: boolean; xpAwarded?: number; streak?: number }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_USER_KEY = '@SignQuest:user';
const STORAGE_ACCOUNTS_KEY = '@SignQuest:accounts';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_USER_KEY);
        if (raw) setUser(JSON.parse(raw));
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistUser = async (u: User | null) => {
    if (u) await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(u));
    else await AsyncStorage.removeItem(STORAGE_USER_KEY);
  };

  const saveAccounts = async (accounts: Account[]) => {
    await AsyncStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  };

  const computeLevelFromXp = (xp: number) => {
    // Simple leveling: every 1000 XP is a level. Level 1 starts at 0 XP.
    return Math.floor(xp / 1000) + 1;
  };

  // usernameOrEmail accepts either a username or an email for convenience
  const signIn = async (usernameOrEmail: string, password: string) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_ACCOUNTS_KEY);
      const accounts: Account[] = raw ? JSON.parse(raw) : [];
      const found = accounts.find((a) => (a.username === usernameOrEmail || a.email === usernameOrEmail) && a.password === password);
      if (!found) return { ok: false, message: 'Invalid username or password' };
      // normalize defaults for older accounts
      const xp = typeof found.xp === 'number' ? found.xp : 0;
      const streak = typeof found.streak === 'number' ? found.streak : 0;
      const level = typeof found.level === 'number' ? found.level : computeLevelFromXp(xp);

      const u: User = { firstName: found.firstName, lastName: found.lastName, email: found.email, username: found.username, xp, streak, lastStreakDate: found.lastStreakDate ?? null, level };
      setUser(u);
      await persistUser(u);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: 'Sign in failed' };
    }
  };

  const signUp = async (account: Account) => {
    try {
      // basic validation
      if (!account.firstName || !account.lastName || !account.email || !account.username || !account.password) {
        return { ok: false, message: 'Please fill all fields' };
      }

      const raw = await AsyncStorage.getItem(STORAGE_ACCOUNTS_KEY);
      const accounts: Account[] = raw ? JSON.parse(raw) : [];
      if (accounts.some((a) => a.username === account.username)) return { ok: false, message: 'Username already taken' };
      // initialize progress fields
      const initial: Account = { ...account, xp: 0, streak: 0, lastStreakDate: null, level: 1 };
      accounts.push(initial);
      await saveAccounts(accounts);

      const u: User = { firstName: account.firstName, lastName: account.lastName, email: account.email, username: account.username, xp: 0, streak: 0, lastStreakDate: null, level: 1 };
      setUser(u);
      await persistUser(u);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: 'Sign up failed' };
    }
  };

  const updateAccountAndUser = async (updated: Account) => {
    const raw = await AsyncStorage.getItem(STORAGE_ACCOUNTS_KEY);
    const accounts: Account[] = raw ? JSON.parse(raw) : [];
    const idx = accounts.findIndex((a) => a.username === updated.username);
    if (idx >= 0) accounts[idx] = updated;
    else accounts.push(updated);
    await saveAccounts(accounts);

    if (user && user.username === updated.username) {
      const newUser: User = {
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        username: updated.username,
        xp: updated.xp ?? 0,
        streak: updated.streak ?? 0,
        lastStreakDate: updated.lastStreakDate ?? null,
        level: updated.level ?? computeLevelFromXp(updated.xp ?? 0),
      };
      setUser(newUser);
      await persistUser(newUser);
    }
  };

  const awardXp = async (amount: number) => {
    if (!user) return { ok: false };
    const raw = await AsyncStorage.getItem(STORAGE_ACCOUNTS_KEY);
    const accounts: Account[] = raw ? JSON.parse(raw) : [];
    const idx = accounts.findIndex((a) => a.username === user.username);
    const existing = idx >= 0 ? accounts[idx] : null;
    const newXp = (existing?.xp ?? 0) + amount;
    const newLevel = computeLevelFromXp(newXp);
    const updated: Account = {
      firstName: existing?.firstName ?? user.firstName,
      lastName: existing?.lastName ?? user.lastName,
      email: existing?.email ?? user.email,
      username: user.username,
      password: existing?.password ?? '',
      xp: newXp,
      streak: existing?.streak ?? user.streak ?? 0,
      lastStreakDate: existing?.lastStreakDate ?? user.lastStreakDate ?? null,
      level: newLevel,
    };
    await updateAccountAndUser(updated);
    return { ok: true, xp: newXp };
  };

  const completeDaily = async () => {
    if (!user) return { ok: false };
    const today = new Date();
    const tzOffset = today.getTimezoneOffset() * 60000;
    const localIso = new Date(today.getTime() - tzOffset).toISOString().slice(0, 10); // YYYY-MM-DD

    const raw = await AsyncStorage.getItem(STORAGE_ACCOUNTS_KEY);
    const accounts: Account[] = raw ? JSON.parse(raw) : [];
    const idx = accounts.findIndex((a) => a.username === user.username);
    const existing = idx >= 0 ? accounts[idx] : null;

    const prevDate = existing?.lastStreakDate ?? user.lastStreakDate ?? null;

    // determine if yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yIso = new Date(yesterday.getTime() - tzOffset).toISOString().slice(0, 10);

    let newStreak = existing?.streak ?? user.streak ?? 1;
    if (prevDate === localIso) {
      // already completed today, so no change
    } else if (prevDate === yIso) {
      // consecutive
      newStreak = (existing?.streak ?? user.streak ?? 0) + 1;
    } else {
      // missed day or no previous
      newStreak = 1;
    }

    // award XP for completing daily: base + streak bonus
    const xpAward = 50 + (newStreak - 1) * 10;
    const newXp = (existing?.xp ?? user.xp ?? 0) + xpAward;
    const newLevel = computeLevelFromXp(newXp);

    const updated: Account = {
      firstName: existing?.firstName ?? user.firstName,
      lastName: existing?.lastName ?? user.lastName,
      email: existing?.email ?? user.email,
      username: user.username,
      password: existing?.password ?? '',
      xp: newXp,
      streak: newStreak,
      lastStreakDate: localIso,
      level: newLevel,
    };

    await updateAccountAndUser(updated);
    return { ok: true, xpAwarded: xpAward, streak: newStreak };
  };

  const signOut = async () => {
    setUser(null);
    await persistUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, awardXp, completeDaily }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
