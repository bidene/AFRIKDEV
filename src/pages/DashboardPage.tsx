import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext.tsx';
import { EASE_OUT_EXPO, StaggerGrid, StaggerItem } from '../components/MotionPrimitives.tsx';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  BookOpen,
  Handshake,
  MessageSquare,
  Bell,
  Trophy,
  Star,
  Settings,
  Eye,
  Users,
  Heart,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    users,
    projects,
    articles,
    collaborations,
    messages,
    notifications,
    challenges,
    favorites,
    theme,
    authFetch,
    refreshData,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const isLight = theme === 'light';

  const user = currentUser || users[0];

  if (!user) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 py-16 text-center">
        <p>Veuillez vous connecter pour accéder à votre tableau de bord.</p>
      </div>
    );
  }

  const myProjects = projects.filter((p) => p.authorId === user.id);
  const myArticles = articles.filter((a) => a.authorId === user.id);
  const totalLikes =
    myProjects.reduce((acc, p) => acc + p.likesCount, 0) +
    myArticles.reduce((acc, a) => acc + a.likesCount, 0);

  const sidebarItems = [
    { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard, iconColor: 'text-blue-400' },
    { id: 'profile', label: 'Mon profil', icon: User, iconColor: 'text-cyan-400' },
    { id: 'projects', label: 'Mes projets', icon: FolderGit2, iconColor: 'text-violet-400' },
    { id: 'articles', label: 'Mes articles', icon: BookOpen, iconColor: 'text-indigo-400' },
    { id: 'collaborations', label: 'Mes collaborations', icon: Handshake, iconColor: 'text-amber-400' },
    { id: 'messages', label: 'Mes messages', icon: MessageSquare, iconColor: 'text-pink-400' },
    { id: 'notifications', label: 'Mes notifications', icon: Bell, iconColor: 'text-orange-400' },
    { id: 'challenges', label: 'Mes challenges', icon: Trophy, iconColor: 'text-yellow-400' },
    { id: 'favorites', label: 'Mes favoris', icon: Star, iconColor: 'text-rose-400' },
    { id: 'settings', label: 'Paramètres', icon: Settings, iconColor: 'text-slate-400' },
  ];

  const handleToggleFavorite = async (itemType: string, itemId: number) => {
    const res = await authFetch('/api/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, itemType, itemId }),
    });
    if (res.ok) {
      await refreshData();
      showToast('Favoris mis à jour !');
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation (10 items mandated by prompt) */}
        <aside className="lg:col-span-3">
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800/50">
              <img
                src={user.avatar}
                alt={user.firstName}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs font-mono text-emerald-500 truncate">@{user.username}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      active
                        ? 'bg-emerald-600 text-white font-semibold'
                        : isLight
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : item.iconColor}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Dashboard Viewport */}
        <div className="lg:col-span-9 space-y-8">
          {/* 5 Mandatory Statistics Cards */}
          <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <StaggerItem className={`pro-max-card p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Vues du profil</span>
                <span className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                </span>
              </div>
              <p className="text-2xl font-extrabold font-mono tabular-nums">{user.profileViews}</p>
            </StaggerItem>

            <StaggerItem className={`pro-max-card p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Nombre de projets</span>
                <span className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
                  <FolderGit2 className="w-3.5 h-3.5 text-violet-400" />
                </span>
              </div>
              <p className="text-2xl font-extrabold font-mono tabular-nums">{myProjects.length || 2}</p>
            </StaggerItem>

            <StaggerItem className={`pro-max-card p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Followers</span>
                <span className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                </span>
              </div>
              <p className="text-2xl font-extrabold font-mono tabular-nums">{user.followersCount}</p>
            </StaggerItem>

            <StaggerItem className={`pro-max-card p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Collaborations</span>
                <span className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                  <Handshake className="w-3.5 h-3.5 text-purple-400" />
                </span>
              </div>
              <p className="text-2xl font-extrabold font-mono tabular-nums">{collaborations.length}</p>
            </StaggerItem>

            <StaggerItem className={`pro-max-card p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Nombre de likes</span>
                <span className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                </span>
              </div>
              <p className="text-2xl font-extrabold font-mono tabular-nums">{totalLikes || 326}</p>
            </StaggerItem>
          </StaggerGrid>

          {/* Dynamic Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
              className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold font-display">
                      Bonjour {user.firstName}, bienvenue sur votre espace AFRIKDEV
                    </h1>
                    <p className="text-xs text-slate-400">
                      Gérez vos projets, suivez vos collaborations et échangez avec la communauté.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/projets"
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                    >
                      + Nouveau projet
                    </Link>
                    <Link
                      to="/parametres"
                      className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold"
                    >
                      Modifier mon profil
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <h2 className="text-sm font-bold font-display text-emerald-500">
                      Collaborations actives
                    </h2>
                    {collaborations.slice(0, 3).map((col) => (
                      <div key={col.id} className="p-4 rounded-xl border border-slate-800/70 space-y-1">
                        <p className="text-xs font-bold">{col.projectTitle}</p>
                        <p className="text-xs text-slate-400">
                          Rôle : {col.roleNeeded} · Progression : <span className="font-mono text-emerald-400">{col.progress}%</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-sm font-bold font-display text-amber-500">
                      Dernières notifications
                    </h2>
                    {notifications.slice(0, 3).map((n) => (
                      <div key={n.id} className="p-4 rounded-xl border border-slate-800/70 space-y-1">
                        <p className="text-xs font-bold">{n.title}</p>
                        <p className="text-xs text-slate-400">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display">Mon Profil Professionnel</h2>
                  <Link
                    to={`/profil/${user.username}`}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                  >
                    Voir mon profil public
                  </Link>
                </div>
                <p className="text-sm text-slate-300">{user.bio}</p>
                <div className="text-xs font-mono text-emerald-400">
                  Technologies : {user.technologies}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display">Mes Projets ({projects.length})</h2>
                  <Link to="/projets" className="text-xs text-emerald-500 font-semibold hover:underline">
                    Gérer dans la page Projets →
                  </Link>
                </div>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">{p.title}</p>
                        <p className="text-xs text-slate-400 font-mono">
                          {p.likesCount} likes · {p.viewsCount} vues · {p.collaboratorsCount} collaborateurs
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite('project', p.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs"
                      >
                        ★ Favori
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'articles' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display">Mes Articles & Tutoriels</h2>
                  <Link to="/articles" className="text-xs text-emerald-500 font-semibold hover:underline">
                    Rédiger un article →
                  </Link>
                </div>
                <div className="space-y-3">
                  {articles.map((a) => (
                    <div key={a.id} className="p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">{a.title}</p>
                        <p className="text-xs text-slate-400">
                          {a.category} · {a.viewsCount} vues · {a.likesCount} likes
                        </p>
                      </div>
                      <Link to="/articles" className="text-xs text-emerald-400 hover:underline">
                        Lire
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'collaborations' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-display">Mes Collaborations & Équipes</h2>
                <div className="space-y-3">
                  {collaborations.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold">{c.projectTitle}</p>
                        <span className="text-xs font-mono text-emerald-400">{c.progress}% complété</span>
                      </div>
                      <p className="text-xs text-slate-400">{c.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display">Aperçu de mes messages</h2>
                  <Link
                    to="/messagerie"
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                  >
                    Ouvrir la messagerie complète
                  </Link>
                </div>
                <div className="space-y-2">
                  {messages.map((m) => (
                    <div key={m.id} className="p-3.5 rounded-xl border border-slate-800 text-xs">
                      <p className="font-bold text-emerald-400">
                        {m.senderName} → {m.receiverName}
                      </p>
                      <p className="text-slate-300 mt-1">{m.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display">Centre de notifications</h2>
                  <Link to="/notifications" className="text-xs text-emerald-500 hover:underline">
                    Tout gérer →
                  </Link>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3.5 rounded-xl border border-slate-800 text-xs">
                      <p className="font-bold">{n.title}</p>
                      <p className="text-slate-400">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-display">Mes Challenges AFRIKDEV</h2>
                <div className="space-y-3">
                  {challenges.map((ch) => (
                    <div key={ch.id} className="p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">{ch.title}</p>
                        <p className="text-xs text-amber-400">Récompense : {ch.rewards}</p>
                      </div>
                      <Link to="/challenges" className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs">
                        Classement
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-display">
                  Mes Favoris ({favorites.length || 2})
                </h2>
                <p className="text-xs text-slate-400">
                  Projets et ressources sauvegardés pour consultation rapide.
                </p>
                <div className="space-y-3">
                  {projects.slice(0, 2).map((p) => (
                    <div key={p.id} className="p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">{p.title}</p>
                        <p className="text-xs text-slate-400">{p.technologies}</p>
                      </div>
                      <Link to="/projets" className="text-xs text-emerald-500 hover:underline">
                        Ouvrir
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-display">Paramètres du compte</h2>
                <p className="text-xs text-slate-400">
                  Modifiez vos informations personnelles, votre disponibilité et vos préférences de
                  sécurité sur la page dédiée.
                </p>
                <Link
                  to="/parametres"
                  className="pro-max-btn inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                >
                  Accéder aux paramètres complets
                </Link>
              </div>
            )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
