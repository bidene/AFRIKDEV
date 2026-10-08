import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext.tsx';
import { StaggerGrid, StaggerItem, EASE_OUT_EXPO } from '../components/MotionPrimitives.tsx';
import {
  ShieldCheck,
  Users,
  FolderGit2,
  BookOpen,
  Trophy,
  AlertTriangle,
  Search,
  CheckCircle2,
  Trash2,
  Star,
  Ban,
  Plus,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    users,
    projects,
    articles,
    collaborations,
    messages,
    challenges,
    reports,
    theme,
    authFetch,
    refreshData,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'projects' | 'articles' | 'challenges' | 'moderation'>('analytics');
  const [userSearch, setUserSearch] = useState('');

  // Admin Create Challenge Form
  const [chalTitle, setChalTitle] = useState('');
  const [chalCategory, setChalCategory] = useState('Hackathon');
  const [chalDeadline, setChalDeadline] = useState('30 Décembre 2026');
  const [chalRewards, setChalRewards] = useState('4 000 € + Crédits Cloud');
  const [chalDesc, setChalDesc] = useState('');
  const [chalRules, setChalRules] = useState('Code open-source GitHub obligatoire.');

  const isLight = theme === 'light';

  const handleVerifyUser = async (id: number, currentVal: boolean) => {
    const res = await authFetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isVerified: !currentVal }),
    });
    if (res.ok) {
      await refreshData();
      showToast('Statut de vérification du profil mis à jour.');
    }
  };

  const handleSuspendUser = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const res = await authFetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      await refreshData();
      showToast(`Compte utilisateur ${nextStatus === 'suspended' ? 'suspendu' : 'réactivé'}.`);
    }
  };

  const handleFeatureProject = async (id: number, currentFeatured: boolean) => {
    const res = await authFetch(`/api/admin/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isFeatured: !currentFeatured }),
    });
    if (res.ok) {
      await refreshData();
      showToast('Mise en avant du projet modifiée.');
    }
  };

  const handleDeleteProject = async (id: number) => {
    const res = await authFetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await refreshData();
      showToast('Projet supprimé par l’administrateur.');
    }
  };

  const handleTogglePublishArticle = async (id: number, currentPub: boolean) => {
    const res = await authFetch(`/api/admin/articles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isPublished: !currentPub }),
    });
    if (res.ok) {
      await refreshData();
      showToast(`Article ${!currentPub ? 'publié' : 'dépublié'}.`);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    const res = await authFetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await refreshData();
      showToast('Article supprimé.');
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authFetch('/api/challenges', {
      method: 'POST',
      body: JSON.stringify({
        title: chalTitle,
        category: chalCategory,
        deadline: chalDeadline,
        rewards: chalRewards,
        description: chalDesc,
        rules: chalRules,
      }),
    });
    if (res.ok) {
      await refreshData();
      setChalTitle('');
      setChalDesc('');
      showToast('Nouveau challenge AFRIKDEV publié !');
    }
  };

  const handleResolveReport = async (id: number, status: string, actionText: string) => {
    const res = await authFetch(`/api/admin/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminAction: actionText }),
    });
    if (res.ok) {
      await refreshData();
      showToast('Action de modération enregistrée dans le journal.');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      !userSearch ||
      `${u.firstName} ${u.lastName} ${u.email} ${u.country}`
        .toLowerCase()
        .includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-emerald-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>ESPACE ADMINISTRATEUR SÉCURISÉ</span>
          </p>
          <h1 className="text-3xl font-extrabold font-display">
            Administration & Modération AFRIKDEV
          </h1>
        </div>

        {/* Admin Section Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'analytics', label: 'Dashboard & Graphiques' },
            { id: 'users', label: `Utilisateurs (${users.length})` },
            { id: 'projects', label: `Projets (${projects.length})` },
            { id: 'articles', label: `Articles (${articles.length})` },
            { id: 'challenges', label: `Challenges (${challenges.length})` },
            { id: 'moderation', label: `Modération (${reports.length})` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === t.id
                  ? 'bg-emerald-600 text-white'
                  : isLight
                  ? 'bg-white border border-slate-200 text-slate-700'
                  : 'bg-slate-900 border border-slate-800 text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 7 Mandatory Admin KPI Counters */}
      <StaggerGrid className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Total utilisateurs', value: `+1 04${users.length}` },
          { label: 'Nouveaux (30j)', value: '+148' },
          { label: 'Projets publiés', value: `${projects.length + 512}` },
          { label: 'Articles', value: `${articles.length + 184}` },
          { label: 'Collaborations', value: `${collaborations.length + 210}` },
          { label: 'Messages', value: `${messages.length + 3420}` },
          { label: 'Challenges', value: `${challenges.length}` },
        ].map((kpi) => (
          <StaggerItem
            key={kpi.label}
            className={`pro-max-card p-4 rounded-xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <p className="text-[11px] text-slate-400 truncate">{kpi.label}</p>
            <p className="text-xl font-extrabold font-mono tabular-nums text-emerald-500 mt-1">
              {kpi.value}
            </p>
          </StaggerItem>
        ))}
      </StaggerGrid>

      {/* TAB 1: ANALYTICS & 5 CHARTS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1 & 2: Croissance des utilisateurs & Activité de la plateforme */}
          <div
            className={`lg:col-span-7 p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display">
                Croissance des utilisateurs & Activité de la plateforme (2026)
              </h2>
              <span className="text-xs font-mono text-emerald-500">+38% ce trimestre</span>
            </div>

            {/* SVG Growth & Activity Chart */}
            <svg viewBox="0 0 600 220" className="w-full h-48">
              <line x1="40" y1="190" x2="580" y2="190" stroke="#334155" strokeWidth="1" />
              <line x1="40" y1="130" x2="580" y2="130" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="40" y1="70" x2="580" y2="70" stroke="#1e293b" strokeDasharray="4 4" />

              {/* Area under curve */}
              <path
                d="M40,190 L40,165 L130,145 L220,125 L310,100 L400,75 L490,50 L580,25 L580,190 Z"
                fill="#3b82f6"
                fillOpacity="0.18"
              />
              {/* Main User Growth Line */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                points="40,165 130,145 220,125 310,100 400,75 490,50 580,25"
              />
              {/* Secondary Platform Activity Line */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="5 3"
                points="40,175 130,160 220,140 310,125 400,95 490,80 580,55"
              />

              {[
                { x: 40, label: 'Mai' },
                { x: 130, label: 'Juin' },
                { x: 220, label: 'Juil' },
                { x: 310, label: 'Août' },
                { x: 400, label: 'Sept' },
                { x: 490, label: 'Oct' },
                { x: 580, label: 'Nov' },
              ].map((m) => (
                <text key={m.label} x={m.x - 10} y="210" fill="#94a3b8" fontSize="11">
                  {m.label}
                </text>
              ))}
            </svg>
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-3 h-1 bg-emerald-500 inline-block" /> Croissance des développeurs inscrits
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-1 bg-amber-500 inline-block" /> Activité quotidienne (messages & commits)
              </span>
            </div>
          </div>

          {/* Chart 5: Répartition des utilisateurs par pays */}
          <div
            className={`lg:col-span-5 p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <h2 className="text-lg font-bold font-display">
              Répartition des utilisateurs par pays
            </h2>
            <div className="space-y-3 text-xs">
              {[
                { country: 'Sénégal', pct: 22, count: 230 },
                { country: 'Côte d’Ivoire', pct: 19, count: 198 },
                { country: 'Nigeria', pct: 18, count: 185 },
                { country: 'Maroc', pct: 15, count: 156 },
                { country: 'Ghana', pct: 14, count: 145 },
                { country: 'Rwanda & Kenya', pct: 12, count: 128 },
              ].map((row) => (
                <div key={row.country} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>{row.country}</span>
                    <span className="font-mono tabular-nums text-emerald-400">
                      {row.count} membres ({row.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${row.pct * 4}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 3 & 4: Projets publiés & Collaborations par domaine */}
          <div
            className={`lg:col-span-12 p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <h2 className="text-lg font-bold font-display">
              Projets publiés & Collaborations formées par domaine technologique
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-2">
              {[
                { domain: 'Web & SaaS', projects: 195, collabs: 84 },
                { domain: 'Fintech & API', projects: 120, collabs: 62 },
                { domain: 'Mobile Flutter', projects: 98, collabs: 45 },
                { domain: 'IA & Data', projects: 64, collabs: 31 },
                { domain: 'Cloud & DevOps', projects: 52, collabs: 24 },
                { domain: 'Cybersécurité', projects: 38, collabs: 19 },
              ].map((d) => (
                <div key={d.domain} className="p-4 rounded-xl border border-slate-800 space-y-2">
                  <p className="text-xs font-bold">{d.domain}</p>
                  <div className="text-xs font-mono space-y-1">
                    <p className="text-emerald-400">{d.projects} projets</p>
                    <p className="text-amber-400">{d.collabs} collaborations</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GESTION DES UTILISATEURS */}
      {activeTab === 'users' && (
        <div
          className={`p-6 rounded-2xl border space-y-5 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold font-display flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <span>Gestion des Utilisateurs (Vérifier, Suspendre, Modifier)</span>
            </h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Rechercher un utilisateur..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3">Membre</th>
                  <th className="py-3 px-3">Pays & Spécialité</th>
                  <th className="py-3 px-3">Statut</th>
                  <th className="py-3 px-3">Profil Vérifié</th>
                  <th className="py-3 px-3 text-right">Actions Administrateur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 px-3 font-semibold">
                      {u.firstName} {u.lastName}
                      <div className="text-[11px] font-mono text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      {u.country} · {u.specialty}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className={u.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}>
                        {u.status === 'active' ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {u.isVerified ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Vérifié
                        </span>
                      ) : (
                        <span className="text-slate-500">Non vérifié</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleVerifyUser(u.id, u.isVerified)}
                        className="px-2.5 py-1 rounded-md border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                      >
                        {u.isVerified ? 'Retirer badge' : 'Vérifier profil'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSuspendUser(u.id, u.status)}
                        className="px-2.5 py-1 rounded-md border border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                      >
                        {u.status === 'active' ? 'Suspendre' : 'Réactiver'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GESTION DES PROJETS */}
      {activeTab === 'projects' && (
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-emerald-500" />
            <span>Gestion des Projets (Vérifier, Mettre en avant, Supprimer)</span>
          </h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-bold">{p.title}</p>
                  <p className="text-xs text-slate-400">
                    Auteur : {p.authorName} ({p.country}) · {p.likesCount} likes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleFeatureProject(p.id, p.isFeatured)}
                    className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1 ${
                      p.isFeatured
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-slate-700 text-slate-300'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>{p.isFeatured ? 'Mis en avant' : 'Mettre en avant'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(p.id)}
                    className="p-2 rounded-lg border border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GESTION DES ARTICLES */}
      {activeTab === 'articles' && (
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <span>Gestion des Articles (Publier, Dépublier, Supprimer)</span>
          </h2>
          <div className="space-y-3">
            {articles.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-bold">{a.title}</p>
                  <p className="text-xs text-slate-400">
                    Par {a.authorName} · Catégorie : {a.category} · Statut :{' '}
                    <span className={a.isPublished ? 'text-emerald-400' : 'text-amber-400'}>
                      {a.isPublished ? 'Publié' : 'Brouillon / Dépublié'}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTogglePublishArticle(a.id, a.isPublished)}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs"
                  >
                    {a.isPublished ? 'Dépublier' : 'Publier'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteArticle(a.id)}
                    className="p-2 rounded-lg border border-rose-500/40 text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GESTION DES CHALLENGES */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div
            className={`lg:col-span-5 p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Créer un nouveau Challenge</span>
            </h2>
            <form onSubmit={handleCreateChallenge} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Titre du challenge</label>
                <input
                  type="text"
                  value={chalTitle}
                  onChange={(e) => setChalTitle(e.target.value)}
                  placeholder="Ex: Challenge Web — E-Gouvernement"
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Catégorie</label>
                  <select
                    value={chalCategory}
                    onChange={(e) => setChalCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Challenge IA">Challenge IA</option>
                    <option value="Challenge Web">Challenge Web</option>
                    <option value="Challenge Mobile">Challenge Mobile</option>
                    <option value="Challenge Cybersécurité">Challenge Cybersécurité</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Date limite</label>
                  <input
                    type="text"
                    value={chalDeadline}
                    onChange={(e) => setChalDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Récompenses</label>
                <input
                  type="text"
                  value={chalRewards}
                  onChange={(e) => setChalRewards(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={chalDesc}
                  onChange={(e) => setChalDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold"
              >
                Publier le challenge
              </button>
            </form>
          </div>

          <div
            className={`lg:col-span-7 p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Challenges actifs & Gestion des participants</span>
            </h2>
            <div className="space-y-3">
              {challenges.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">{c.title}</p>
                    <span className="text-xs font-mono text-emerald-400">
                      {c.participantsCount} participants
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {c.category} · Date limite : {c.deadline} · Dotation : {c.rewards}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MODÉRATION & HISTORIQUE DES ACTIONS */}
      {activeTab === 'moderation' && (
        <div
          className={`p-6 rounded-2xl border space-y-5 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Signalements, Contenus signalés & Historique des actions administratives</span>
          </h2>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-amber-400 uppercase">
                      [{rep.targetType}] {rep.targetName}
                    </span>
                    <span>·</span>
                    <span className="text-slate-400">Signalé par {rep.reporterName}</span>
                  </div>
                  <p className="text-xs text-slate-300">Motif : {rep.reason}</p>
                  <p className="text-[11px] font-mono text-emerald-400">
                    Journal d’audit : {rep.adminAction} (Statut : {rep.status})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleResolveReport(
                        rep.id,
                        'resolved',
                        'Contenu modéré et utilisateur averti par Admin'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                  >
                    Approuver modération
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleResolveReport(rep.id, 'dismissed', 'Signalement classé sans suite')
                    }
                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs"
                  >
                    Classer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
