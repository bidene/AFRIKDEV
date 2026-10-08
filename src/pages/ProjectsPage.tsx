import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';
import { StaggerGrid, StaggerItem, FadeInSection } from '../components/MotionPrimitives.tsx';
import {
  Heart,
  Eye,
  Users,
  Plus,
  ExternalLink,
  GitBranch,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, collaborations, currentUser, theme, authFetch, refreshData, showToast } = useApp();
  const navigate = useNavigate();

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewCollabModal, setShowNewCollabModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  // New Project Form
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('React,Next.js,TypeScript,Node.js');
  const [projCountry, setProjCountry] = useState(currentUser?.country || 'Sénégal');
  const [projCategory, setProjCategory] = useState('Fintech & Web');

  // New Opportunity Form
  const [oppProjectTitle, setOppProjectTitle] = useState('');
  const [oppRole, setOppRole] = useState('');
  const [oppSkills, setOppSkills] = useState('');
  const [oppDesc, setOppDesc] = useState('');

  const isLight = theme === 'light';

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authFetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        title: projTitle,
        description: projDesc,
        technologies: projTech,
        country: projCountry,
        category: projCategory,
        authorId: currentUser?.id || 1,
        authorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Amina Diallo',
        authorUsername: currentUser?.username || 'aminadiallo',
      }),
    });
    if (res.ok) {
      await refreshData();
      setShowNewProjectModal(false);
      setProjTitle('');
      setProjDesc('');
      showToast('Votre projet a été publié sur AFRIKDEV !');
    }
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authFetch('/api/collaborations', {
      method: 'POST',
      body: JSON.stringify({
        projectTitle: oppProjectTitle,
        senderId: currentUser?.id || 1,
        senderName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Amina Diallo',
        roleNeeded: oppRole,
        skillsRequired: oppSkills,
        description: oppDesc,
      }),
    });
    if (res.ok) {
      await refreshData();
      setShowNewCollabModal(false);
      setOppProjectTitle('');
      setOppRole('');
      setOppSkills('');
      setOppDesc('');
      showToast('Opportunité de collaboration publiée !');
    }
  };

  const handleCollabAction = async (id: number, status: 'accepted' | 'declined') => {
    const res = await authFetch(`/api/collaborations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        memberName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Talent AFRIKDEV',
        progress: status === 'accepted' ? 85 : 40,
      }),
    });
    if (res.ok) {
      await refreshData();
      showToast(
        status === 'accepted'
          ? 'Vous avez rejoint l’équipe du projet !'
          : 'Demande de collaboration déclinée.'
      );
    }
  };

  const handleLikeProject = async (id: number) => {
    const res = await authFetch(`/api/projects/${id}/like`, { method: 'POST' });
    if (res.ok) {
      await refreshData();
      showToast('Like ajouté au projet !');
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* SECTION 1: PROJETS */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono text-emerald-500">VITRINE DES PROJETS AFRICAINS</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
              Découvrez les projets qui font avancer l’Afrique
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setShowNewProjectModal(true)}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Publier un projet</span>
          </button>
        </div>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <StaggerItem
              key={proj.id}
              className={`pro-max-card rounded-2xl border overflow-hidden flex flex-col justify-between ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <div className="aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>Pays : <strong className="text-slate-200">{proj.country}</strong></span>
                    <span>·</span>
                    <span>Auteur : <strong className="text-emerald-400">{proj.authorName}</strong></span>
                    <span>·</span>
                    <span>Date : {new Date(proj.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <h2 className="text-xl font-bold font-display">{proj.title}</h2>
                  <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {proj.description}
                  </p>
                  <p className="text-xs font-mono text-emerald-400">
                    Technologies : {proj.technologies.split(',').join(' · ')}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-400">
                  <button
                    type="button"
                    onClick={() => handleLikeProject(proj.id)}
                    className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>{proj.likesCount} likes</span>
                  </button>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-slate-500" />
                    <span>{proj.viewsCount} vues</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>{proj.collaboratorsCount} collaborateurs</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(proj)}
                    className={`px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                      isLight
                        ? 'border-slate-300 text-slate-800 hover:bg-slate-100'
                        : 'border-slate-700 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    Voir le projet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOppProjectTitle(proj.title);
                      setShowNewCollabModal(true);
                    }}
                    className="pro-max-btn px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    Collaborer
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>

      {/* SECTION 2: COLLABORATION, GESTION DES ÉQUIPES & SUIVI DES PROJETS */}
      <FadeInSection className="space-y-8 pt-8 border-t border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono text-amber-500">SECTION COLLABORATION & ÉQUIPES</p>
            <h2 className="text-3xl font-bold font-display">
              Trouvez les bonnes personnes pour votre projet
            </h2>
            <p className={`text-sm max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Vous avez une idée mais vous avez besoin d’un développeur, d’un designer, d’un
              administrateur réseau ou d’un expert métier ? Trouvez les compétences dont vous avez
              besoin au sein de la communauté.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewCollabModal(true)}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Publier une opportunité</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {collaborations.map((col) => {
            let teamMembers: string[] = [];
            try {
              teamMembers = JSON.parse(col.teamMembersJson);
            } catch {
              teamMembers = [col.senderName];
            }

            return (
              <div
                key={col.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-5 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-500 font-semibold">{col.roleNeeded}</span>
                    <span className="font-mono text-slate-400">Statut : {col.status}</span>
                  </div>
                  <h3 className="text-lg font-bold font-display">{col.projectTitle}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{col.description}</p>
                  <p className="text-xs font-mono text-amber-400">
                    Compétences : {col.skillsRequired}
                  </p>

                  {/* Team Management & Project Progress */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Suivi d’avancement du projet</span>
                      <span className="font-mono font-semibold text-emerald-400">{col.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${col.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 pt-1">
                      Équipe actuelle ({teamMembers.length}) :{' '}
                      <span className="text-slate-200 font-medium">{teamMembers.join(', ')}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/50 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/messagerie?to=${col.senderId}`)}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Messagerie</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCollabAction(col.id, 'accepted')}
                      className="pro-max-btn px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accepter / Rejoindre</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCollabAction(col.id, 'declined')}
                      className="p-1.5 rounded-lg border border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
                      title="Refuser"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </FadeInSection>

      {/* Modal: Project Detail */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-2xl p-6 rounded-2xl border space-y-5 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <img
              src={selectedProject.imageUrl}
              alt={selectedProject.title}
              referrerPolicy="no-referrer"
              className="w-full h-56 object-cover rounded-xl"
            />
            <div className="space-y-2">
              <div className="text-xs text-slate-400">
                {selectedProject.country} · Par {selectedProject.authorName} · {selectedProject.category}
              </div>
              <h3 className="text-2xl font-bold font-display">{selectedProject.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedProject.description}</p>
              <p className="text-xs font-mono text-emerald-400">
                Stack : {selectedProject.technologies}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-emerald-500 flex items-center gap-1 hover:underline"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>Dépôt GitHub</span>
                </a>
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-amber-400 flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Démo Live</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Project */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <h3 className="text-xl font-bold font-display">Publier un nouveau projet</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nom du projet</label>
                <input
                  type="text"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="Ex: FasoPay — Paiement QR Code hors-ligne"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Pays</label>
                  <input
                    type="text"
                    value={projCountry}
                    onChange={(e) => setProjCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Technologies utilisées</label>
                <input
                  type="text"
                  value={projTech}
                  onChange={(e) => setProjTech(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description détaillée</label>
                <textarea
                  rows={4}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                >
                  Publier le projet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Collaboration Opportunity */}
      {showNewCollabModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <h3 className="text-xl font-bold font-display">Publier une opportunité de collaboration</h3>
            <form onSubmit={handleCreateOpportunity} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nom du projet concerné</label>
                <input
                  type="text"
                  value={oppProjectTitle}
                  onChange={(e) => setOppProjectTitle(e.target.value)}
                  placeholder="Ex: Plateforme EdTech Afrique Francophone"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Profil / Rôle recherché</label>
                <input
                  type="text"
                  value={oppRole}
                  onChange={(e) => setOppRole(e.target.value)}
                  placeholder="Ex: Développeur Mobile Flutter ou Architecte Cloud"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Compétences souhaitées</label>
                <input
                  type="text"
                  value={oppSkills}
                  onChange={(e) => setOppSkills(e.target.value)}
                  placeholder="Ex: Flutter, API REST, PostgreSQL, Docker"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description de la mission collaborative</label>
                <textarea
                  rows={3}
                  value={oppDesc}
                  onChange={(e) => setOppDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewCollabModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold"
                >
                  Publier l’opportunité
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
