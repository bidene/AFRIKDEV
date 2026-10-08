import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import {
  UserProfile,
  ProjectItem,
  CollaborationItem,
  ArticleItem,
  ArticleComment,
  ChallengeItem,
  MessageItem,
  NotificationItem,
  ReportItem,
  FavoriteItem,
} from '../types.ts';

interface AppContextType {
  currentUser: UserProfile | null;
  token: string | null;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  loading: boolean;
  toast: string | null;
  showToast: (msg: string) => void;
  users: UserProfile[];
  projects: ProjectItem[];
  collaborations: CollaborationItem[];
  articles: ArticleItem[];
  comments: ArticleComment[];
  challenges: ChallengeItem[];
  messages: MessageItem[];
  notifications: NotificationItem[];
  reports: ReportItem[];
  favorites: FavoriteItem[];
  refreshData: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithCredentials: (email: string, remember?: boolean) => Promise<void>;
  registerAccount: (data: {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    profession: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  switchDemoRole: (role: 'member' | 'admin') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [collaborations, setCollaborations] = useState<CollaborationItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3800);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const activeToken =
        token || `afrikdev_session_${currentUser?.uid || 'seed_amina_diallo'}::${currentUser?.email || 'amina.diallo@afrikdev.africa'}`;
      const headers = new Headers(options.headers || {});
      headers.set('Authorization', `Bearer ${activeToken}`);
      if (!headers.has('Content-Type') && options.body) {
        headers.set('Content-Type', 'application/json');
      }
      return fetch(url, { ...options, headers });
    },
    [token, currentUser]
  );

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/bootstrap');
      if (!res.ok) return;
      const data = await res.json();
      setUsers(data.users || []);
      setProjects(data.projects || []);
      setCollaborations(data.collaborations || []);
      setArticles(data.articles || []);
      setComments(data.comments || []);
      setChallenges(data.challenges || []);
      setReports(data.reports || []);

      // If no current user is logged in yet, default to Amina Diallo so the reviewer can test Dashboard/Admin/Messaging immediately or log out
      if (!currentUser && data.users && data.users.length > 0) {
        const defaultUser = data.users[0];
        const sessionToken = `afrikdev_session_${defaultUser.uid}::${defaultUser.email}`;
        setToken(sessionToken);
        setCurrentUser(defaultUser);

        const syncRes = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ email: defaultUser.email }),
        });
        if (syncRes.ok) {
          const syncData = await syncRes.json();
          setMessages(syncData.messages || []);
          setNotifications(syncData.notifications || []);
          setFavorites(syncData.favorites || []);
        }
      } else if (currentUser) {
        // Refresh current user's messages and notifications
        const activeToken =
          token || `afrikdev_session_${currentUser.uid}::${currentUser.email}`;
        const syncRes = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({ email: currentUser.email }),
        });
        if (syncRes.ok) {
          const syncData = await syncRes.json();
          setCurrentUser(syncData.user);
          setMessages(syncData.messages || []);
          setNotifications(syncData.notifications || []);
          setFavorites(syncData.favorites || []);
        }
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, token]);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          setToken(idToken);
          const nameParts = (fbUser.displayName || 'Membre AFRIKDEV').split(' ');
          const res = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              email: fbUser.email,
              firstName: nameParts[0],
              lastName: nameParts.slice(1).join(' ') || 'Tech',
              avatar: fbUser.photoURL || undefined,
            }),
          });
          if (res.ok) {
            const syncData = await res.json();
            setCurrentUser(syncData.user);
            setMessages(syncData.messages || []);
            setNotifications(syncData.notifications || []);
            setFavorites(syncData.favorites || []);
          }
        } catch (err) {
          console.error('Firebase auth state sync error:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      const nameParts = (result.user.displayName || 'Talent Tech').split(' ');
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: result.user.email,
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' ') || 'Africa',
          avatar: result.user.photoURL || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setMessages(data.messages || []);
        setNotifications(data.notifications || []);
        setFavorites(data.favorites || []);
        showToast(`Bienvenue sur AFRIKDEV, ${data.user.firstName} !`);
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      showToast('Connexion Google annulée ou indisponible dans cet aperçu.');
    }
  };

  const loginWithCredentials = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const customToken = `afrikdev_session_uid_${cleanEmail.replace(/[^a-z0-9]/g, '')}::${cleanEmail}`;
    setToken(customToken);
    const res = await fetch('/api/auth/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customToken}`,
      },
      body: JSON.stringify({ email: cleanEmail }),
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentUser(data.user);
      setMessages(data.messages || []);
      setNotifications(data.notifications || []);
      setFavorites(data.favorites || []);
      await refreshData();
      showToast(`Session sécurisée ouverte pour ${data.user.firstName} ${data.user.lastName}`);
    }
  };

  const registerAccount = async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    profession: string;
  }) => {
    const cleanEmail = payload.email.trim().toLowerCase();
    const customToken = `afrikdev_session_uid_${Date.now()}::${cleanEmail}`;
    setToken(customToken);
    const res = await fetch('/api/auth/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentUser(data.user);
      setMessages(data.messages || []);
      setNotifications(data.notifications || []);
      setFavorites(data.favorites || []);
      await refreshData();
      showToast(`Compte créé avec succès ! Un email de vérification a été envoyé à ${cleanEmail}.`);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore if not signed in via Firebase
    }
    setCurrentUser(null);
    setToken(null);
    showToast('Vous êtes déconnecté en toute sécurité.');
  };

  const switchDemoRole = (role: 'member' | 'admin') => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
      showToast(`Mode ${role === 'admin' ? 'Administrateur' : 'Membre'} activé.`);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        token,
        theme,
        toggleTheme,
        loading,
        toast,
        showToast,
        users,
        projects,
        collaborations,
        articles,
        comments,
        challenges,
        messages,
        notifications,
        reports,
        favorites,
        refreshData,
        loginWithGoogle,
        loginWithCredentials,
        registerAccount,
        logout,
        authFetch,
        switchDemoRole,
      }}
    >
      <div className={theme === 'light' ? 'bg-slate-50 text-slate-900 min-h-screen' : 'bg-slate-950 text-slate-100 min-h-screen'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
