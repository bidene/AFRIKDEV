import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';
import { FadeInSection } from '../components/MotionPrimitives.tsx';
import {
  CheckCircle2,
  Github,
  Linkedin,
  Globe,
  MessageSquare,
  UserPlus,
  Handshake,
  Award,
  Briefcase,
  FolderGit2,
  BookOpen,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { users, projects, articles, currentUser, theme, authFetch, refreshData, showToast } = useApp();
  const navigate = useNavigate();
  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [collabRole, setCollabRole] = useState('Co-Architecte / Lead Développeur');
  const [collabDesc, setCollabDesc] = useState('');

  const isLight = theme === 'light';

  const profile =
    users.find((u) => u.username === username) ||
    currentUser ||
    users[0];

  if (!profile) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 py-16 text-center">
        <p>Chargement du profil professionnel...</p>
      </div>
    );
  }

  let experiences: Array<{ role: string; company: string; period: string; summary: string }> = [];
  let certifications: Array<{ name: string; issuer: string; year: string }> = [];

  try {
    experiences = JSON.parse(profile.experiencesJson);
  } catch {
    experiences = [];
  }
  try {
    certifications = JSON.parse(profile.certificationsJson);
  } catch {
    certifications = [];
  }

  const memberProjects = projects.filter((p) => p.authorId === profile.id);
  const memberArticles = articles.filter((a) => a.authorId === profile.id);

  const handleFollow = async () => {
    const res = await authFetch(`/api/users/${profile.id}/follow`, {
      method: 'POST',
      body: JSON.stringify({
        followerName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Membre AFRIKDEV',
      }),
    });
    if (res.ok) {
      await refreshData();
      showToast(`Vous suivez désormais ${profile.firstName} ${profile.lastName} !`);
    }
  };

  const handleSendCollab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabDesc.trim()) return;
    const res = await authFetch('/api/collaborations', {
      method: 'POST',
      body: JSON.stringify({
        projectTitle: `Collaboration directe avec ${profile.firstName} ${profile.lastName}`,
        senderId: currentUser?.id || 1,
        senderName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Membre AFRIKDEV',
        receiverId: profile.id,
        roleNeeded: collabRole,
        skillsRequired: profile.technologies,
        description: collabDesc,
      }),
    });
    if (res.ok) {
      await refreshData();
      setCollabModalOpen(false);
      setCollabDesc('');
      showToast(`Demande de collaboration envoyée à ${profile.firstName} !`);
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Top Profile Header Card */}
      <div
        className={`p-8 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/70 border-slate-800'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={profile.avatar}
              alt={`${profile.firstName} ${profile.lastName}`}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
                  {profile.firstName} {profile.lastName}
                </h1>
                {profile.isVerified && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              </div>
              <p className="text-sm font-semibold text-emerald-500">
                {profile.profession} · @{profile.username}
              </p>
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Pays : {profile.country}</span>
                <span>·</span>
                <span>Ville : {profile.city}</span>
                <span>·</span>
                <span className="text-amber-400 font-medium">Disponibilité : {profile.availability}</span>
                <span>·</span>
                <span className="font-mono">{profile.followersCount} followers</span>
                <span>·</span>
                <span className="font-mono">{profile.profileViews} vues du profil</span>
              </div>
            </div>
          </div>

          {/* 3 Mandatory Buttons: Contacter, Collaborer, Suivre */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/messagerie?to=${profile.id}`)}
              className="pro-max-btn px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contacter</span>
            </button>
            <button
              type="button"
              onClick={() => setCollabModalOpen(true)}
              className="pro-max-btn px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 whitespace-nowrap"
            >
              <Handshake className="w-4 h-4" />
              <span>Collaborer</span>
            </button>
            <button
              type="button"
              onClick={handleFollow}
              className={`pro-max-btn px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 whitespace-nowrap ${
                isLight
                  ? 'border-slate-300 hover:bg-slate-100 text-slate-800'
                  : 'border-slate-700 hover:bg-slate-800 text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-500" />
              <span>Suivre</span>
            </button>
          </div>
        </div>

        {/* Bio & External Links */}
        <div className="mt-6 pt-6 border-t border-slate-800/50 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-2">
            <h2 className="text-xs font-mono text-slate-400">BIOGRAPHIE PROFESSIONNELLE</h2>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
              {profile.bio}
            </p>
          </div>
          <div className="lg:col-span-4 space-y-2">
            <h2 className="text-xs font-mono text-slate-400">LIENS & PORTFOLIO</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-emerald-500 hover:underline"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-emerald-500 hover:underline"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-amber-400 hover:underline"
              >
                <Globe className="w-4 h-4" />
                <span>Portfolio</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Compétences, Technologies, Expériences & Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <h2 className="text-lg font-bold font-display">Compétences & Technologies</h2>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400 mb-1">Technologies maîtrisées :</p>
                <p className="font-mono text-emerald-400 leading-relaxed">
                  {profile.technologies.split(',').join(' · ')}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Compétences métiers :</p>
                <p className={isLight ? 'text-slate-800 font-medium' : 'text-slate-200 font-medium'}>
                  {profile.skills.split(',').join(' · ')}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Certifications</span>
            </h2>
            <div className="space-y-3">
              {certifications.map((cert, idx) => (
                <div key={idx} className="border-b border-slate-800/40 pb-3 last:border-none last:pb-0">
                  <p className="text-sm font-semibold">{cert.name}</p>
                  <p className="text-xs text-slate-400">
                    {cert.issuer} · <span className="font-mono">{cert.year}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expériences, Projets & Articles */}
        <div className="lg:col-span-7 space-y-6">
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-500" />
              <span>Expériences professionnelles</span>
            </h2>
            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={idx} className="space-y-1 border-b border-slate-800/40 pb-4 last:border-none last:pb-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">{exp.role}</h3>
                    <span className="text-xs font-mono text-emerald-500">{exp.period}</span>
                  </div>
                  <p className="text-xs font-medium text-amber-400">{exp.company}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{exp.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-emerald-500" />
              <span>Projets réalisés ({memberProjects.length})</span>
            </h2>
            <div className="space-y-3">
              {memberProjects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl border border-slate-800/60 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold">{proj.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{proj.description}</p>
                    <p className="text-[11px] font-mono text-emerald-400 mt-1">{proj.technologies}</p>
                  </div>
                  <Link
                    to="/projets"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shrink-0"
                  >
                    Voir
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              <span>Articles publiés ({memberArticles.length})</span>
            </h2>
            <div className="space-y-3">
              {memberArticles.map((art) => (
                <div key={art.id} className="p-4 rounded-xl border border-slate-800/60 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold">{art.title}</h3>
                    <p className="text-xs text-slate-400">
                      {art.category} · {art.readTime} · {art.viewsCount} vues
                    </p>
                  </div>
                  <Link
                    to="/articles"
                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold shrink-0"
                  >
                    Lire
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Collaboration Request */}
      {collabModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <h3 className="text-xl font-bold font-display">
              Proposer une collaboration à {profile.firstName}
            </h3>
            <form onSubmit={handleSendCollab} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Rôle proposé</label>
                <input
                  type="text"
                  value={collabRole}
                  onChange={(e) => setCollabRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Détails du projet et objectifs</label>
                <textarea
                  rows={4}
                  value={collabDesc}
                  onChange={(e) => setCollabDesc(e.target.value)}
                  placeholder="Décrivez votre projet, les compétences recherchées et le planning..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCollabModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                >
                  Envoyer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
