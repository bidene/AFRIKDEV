import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext.tsx';
import { StaggerGrid, StaggerItem, EASE_OUT_EXPO } from '../components/MotionPrimitives.tsx';
import {
  Search,
  Send,
  Trash2,
  Ban,
  Flag,
  Bell,
  CheckCheck,
} from 'lucide-react';

export const MessagingPage: React.FC = () => {
  const { users, messages, currentUser, theme, authFetch, refreshData, showToast } = useApp();
  const [searchParams] = useSearchParams();
  const targetParam = Number(searchParams.get('to')) || 2;

  const [selectedPartnerId, setSelectedPartnerId] = useState<number>(targetParam);
  const [convSearch, setConvSearch] = useState('');
  const [text, setText] = useState('');
  const [blockedUsers, setBlockedUsers] = useState<number[]>([]);

  const isLight = theme === 'light';
  const me = currentUser || users[0];

  const partners = users.filter(
    (u) =>
      u.id !== me?.id &&
      (!convSearch ||
        `${u.firstName} ${u.lastName} ${u.profession}`
          .toLowerCase()
          .includes(convSearch.toLowerCase()))
  );

  const activePartner = partners.find((p) => p.id === selectedPartnerId) || partners[0];

  const conversationKey =
    me && activePartner
      ? me.id < activePartner.id
        ? `${me.id}_${activePartner.id}`
        : `${activePartner.id}_${me.id}`
      : '';

  const threadMessages = messages.filter(
    (m) =>
      (m.senderId === me?.id && m.receiverId === activePartner?.id) ||
      (m.senderId === activePartner?.id && m.receiverId === me?.id)
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !me || !activePartner) return;
    if (blockedUsers.includes(activePartner.id)) {
      showToast('Cet utilisateur est bloqué.');
      return;
    }

    const res = await authFetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        senderId: me.id,
        senderName: `${me.firstName} ${me.lastName}`,
        senderAvatar: me.avatar,
        receiverId: activePartner.id,
        receiverName: `${activePartner.firstName} ${activePartner.lastName}`,
        receiverAvatar: activePartner.avatar,
        content: text,
      }),
    });
    if (res.ok) {
      setText('');
      await refreshData();
    }
  };

  const handleDeleteConversation = async () => {
    if (!conversationKey) return;
    const res = await authFetch(`/api/messages/conversation/${conversationKey}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      await refreshData();
      showToast('Conversation supprimée.');
    }
  };

  const handleReportUser = async () => {
    if (!me || !activePartner) return;
    const res = await authFetch('/api/reports', {
      method: 'POST',
      body: JSON.stringify({
        reporterId: me.id,
        reporterName: `${me.firstName} ${me.lastName}`,
        targetType: 'user',
        targetId: activePartner.id,
        targetName: `${activePartner.firstName} ${activePartner.lastName}`,
        reason: 'Signalement depuis la messagerie interne.',
      }),
    });
    if (res.ok) {
      await refreshData();
      showToast(`Signalement transmis à l’équipe de modération concernant ${activePartner.firstName}.`);
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div>
        <p className="text-xs font-mono text-emerald-500">MESSAGERIE INTERNE TEMPS RÉEL</p>
        <h1 className="text-3xl font-extrabold font-display">Conversations privées</h1>
      </div>

      <div
        className={`rounded-2xl border overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px] ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        {/* Left Conversations List */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800/70 p-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={convSearch}
              onChange={(e) => setConvSearch(e.target.value)}
              placeholder="Rechercher une conversation..."
              className={`w-full pl-10 pr-3 py-2 rounded-xl border text-xs ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
              }`}
            />
          </div>

          <div className="space-y-1.5">
            {partners.map((partner) => {
              const isSelected = activePartner?.id === partner.id;
              return (
                <button
                  key={partner.id}
                  type="button"
                  onClick={() => setSelectedPartnerId(partner.id)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-colors ${
                    isSelected
                      ? 'bg-emerald-600/20 border border-emerald-500/40'
                      : isLight
                      ? 'hover:bg-slate-100'
                      : 'hover:bg-slate-800/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={partner.avatar}
                      alt={partner.firstName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span
                      className={`w-2.5 h-2.5 rounded-full absolute bottom-0 right-0 border border-slate-950 ${
                        partner.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">
                      {partner.firstName} {partner.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {partner.profession} · {partner.isOnline ? 'En ligne' : 'Hors ligne'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Chat Window */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          {activePartner && (
            <>
              {/* Conversation Header with Actions: Delete, Block, Report */}
              <div className="p-4 border-b border-slate-800/70 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activePartner.avatar}
                    alt={activePartner.firstName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold">
                      {activePartner.firstName} {activePartner.lastName}
                    </p>
                    <p className="text-xs text-emerald-500">
                      {activePartner.isOnline ? 'Statut : En ligne' : 'Statut : Hors ligne'} · {activePartner.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteConversation}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs flex items-center gap-1 text-slate-300"
                    title="Supprimer la conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Supprimer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBlockedUsers((prev) =>
                        prev.includes(activePartner.id)
                          ? prev.filter((id) => id !== activePartner.id)
                          : [...prev, activePartner.id]
                      );
                      showToast(`Statut de blocage mis à jour pour ${activePartner.firstName}.`);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs flex items-center gap-1 text-amber-400"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>{blockedUsers.includes(activePartner.id) ? 'Débloquer' : 'Bloquer'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReportUser}
                    className="px-2.5 py-1.5 rounded-lg border border-rose-500/40 hover:bg-rose-500/10 text-xs flex items-center gap-1 text-rose-400"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Signaler</span>
                  </button>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[380px]">
                {threadMessages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-12">
                    Aucun message dans cette conversation. Démarrez l’échange technique avec{' '}
                    {activePartner.firstName} !
                  </p>
                ) : (
                  threadMessages.map((msg) => {
                    const isMine = msg.senderId === me?.id;
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.16, ease: EASE_OUT_EXPO }}
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                            isMine
                              ? 'bg-emerald-600 text-white'
                              : isLight
                              ? 'bg-slate-100 text-slate-900'
                              : 'bg-slate-800 text-slate-100'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 mt-1">
                          {msg.senderName} · {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800/70 flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Écrire un message à ${activePartner.firstName}...`}
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const NotificationsPage: React.FC = () => {
  const { notifications, theme, authFetch, refreshData, showToast } = useApp();
  const [typeFilter, setTypeFilter] = useState('Tous');
  const isLight = theme === 'light';

  const notifCategories = [
    { id: 'Tous', label: 'Toutes' },
    { id: 'message', label: 'Nouveau message' },
    { id: 'collaboration', label: 'Nouvelle collaboration' },
    { id: 'follower', label: 'Nouveau follower' },
    { id: 'like', label: 'Like' },
    { id: 'comment', label: 'Commentaire' },
    { id: 'challenge', label: 'Challenge' },
  ];

  const filtered = notifications.filter(
    (n) => typeFilter === 'Tous' || n.type === typeFilter
  );

  const handleMarkRead = async (id: number) => {
    const res = await authFetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    if (res.ok) {
      await refreshData();
      showToast('Notification marquée comme lue.');
    }
  };

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-mono text-emerald-500">CENTRE D’ALERTES TEMPS RÉEL</p>
        <h1 className="text-3xl font-extrabold font-display">Mes Notifications</h1>
        <p className="text-xs text-slate-400">
          Suivez vos nouveaux messages, propositions de collaboration, followers, likes, commentaires,
          invitations à un projet et challenges.
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {notifCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setTypeFilter(c.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
              typeFilter === c.id
                ? 'bg-emerald-600 text-white'
                : isLight
                ? 'bg-white border border-slate-200 text-slate-700'
                : 'bg-slate-900 border border-slate-800 text-slate-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <StaggerGrid className="space-y-3">
        {filtered.map((n) => (
          <StaggerItem
            key={n.id}
            className={`pro-max-card p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              !n.isRead
                ? 'border-emerald-500/50 bg-emerald-950/15'
                : isLight
                ? 'bg-white border-slate-200'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <Bell className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">{n.title}</span>
                <span className="text-slate-500 font-mono">
                  · {new Date(n.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p className="text-xs text-slate-300">{n.message}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={n.link}
                className="pro-max-btn px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
              >
                Voir
              </Link>
              {!n.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkRead(n.id)}
                  className="pro-max-btn px-3 py-1.5 rounded-lg border border-slate-700 text-xs flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lu</span>
                </button>
              )}
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const { currentUser, users, theme, authFetch, refreshData, showToast } = useApp();
  const user = currentUser || users[0];

  const [firstName, setFirstName] = useState(user?.firstName || 'Amina');
  const [lastName, setLastName] = useState(user?.lastName || 'Diallo');
  const [bio, setBio] = useState(user?.bio || '');
  const [country, setCountry] = useState(user?.country || 'Sénégal');
  const [city, setCity] = useState(user?.city || 'Dakar');
  const [profession, setProfession] = useState(user?.profession || 'Lead Full-Stack Engineer');
  const [specialty, setSpecialty] = useState(user?.specialty || 'Développement Web');
  const [technologies, setTechnologies] = useState(user?.technologies || 'React,Next.js,TypeScript,Node.js');
  const [skills, setSkills] = useState(user?.skills || 'Architecture Microservices,API');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Senior');
  const [availability, setAvailability] = useState(user?.availability || 'Disponible');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || 'https://github.com');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || 'https://linkedin.com');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || 'https://afrikdev.africa');

  const isLight = theme === 'light';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const res = await authFetch(`/api/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        firstName,
        lastName,
        bio,
        country,
        city,
        profession,
        specialty,
        technologies,
        skills,
        experienceLevel,
        availability,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
      }),
    });
    if (res.ok) {
      await refreshData();
      showToast('Paramètres du profil mis à jour avec succès !');
    }
  };

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <p className="text-xs font-mono text-emerald-500">PARAMÈTRES DU COMPTE & SÉCURITÉ</p>
        <h1 className="text-3xl font-extrabold font-display">Configurer mon profil AFRIKDEV</h1>
      </div>

      <form
        onSubmit={handleSave}
        className={`p-8 rounded-2xl border space-y-6 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Pays</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Ville</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Disponibilité</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
            >
              <option value="Disponible">Disponible</option>
              <option value="Freelance">Freelance</option>
              <option value="Ouvert aux projets">Ouvert aux projets</option>
              <option value="En poste">En poste</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Profession</label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Spécialité</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Niveau d’expérience</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
            >
              <option value="Junior">Junior</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Senior">Senior</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Bio professionnelle</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Technologies (séparées par virgule)</label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Compétences clés</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Lien GitHub</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Lien LinkedIn</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Lien Portfolio</label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};
