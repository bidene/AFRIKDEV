import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';
import { ALL_AFRICAN_COUNTRIES, ALL_WORLD_AND_DIASPORA_COUNTRIES } from '../constants/countries.ts';
import { StaggerGrid, StaggerItem } from '../components/MotionPrimitives.tsx';
import { Search, CheckCircle2, Heart, UserPlus, MessageSquare } from 'lucide-react';

export const TalentsPage: React.FC = () => {
  const { users, projects, theme, authFetch, refreshData, showToast, currentUser } = useApp();
  const [searchParams] = useSearchParams();
  const initialTech = searchParams.get('tech') || 'Tous';

  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('Tous');
  const [techFilter, setTechFilter] = useState(initialTech);
  const [domainFilter, setDomainFilter] = useState('Tous');
  const [expFilter, setExpFilter] = useState('Tous');
  const [availFilter, setAvailFilter] = useState('Tous');

  const isLight = theme === 'light';

  const countries = ['Tous', ...ALL_AFRICAN_COUNTRIES, ...ALL_WORLD_AND_DIASPORA_COUNTRIES];
  const technologiesList = [
    'Tous',
    'React',
    'Next.js',
    'Node.js',
    'Laravel',
    'Python',
    'Flutter',
    'UI/UX',
    'DevOps',
    'Cybersécurité',
    'Réseaux',
  ];
  const domainsList = [
    'Tous',
    'Développement Web',
    'Applications mobiles',
    'UI/UX Design',
    'Cloud & DevOps',
    'Réseaux',
    'Cybersécurité',
    'Intelligence artificielle',
  ];
  const experiencesList = ['Tous', 'Junior', 'Intermédiaire', 'Senior', 'Expert'];
  const availabilitiesList = ['Tous', 'Disponible', 'Freelance', 'Ouvert aux projets'];

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      `${u.firstName} ${u.lastName} ${u.username} ${u.technologies} ${u.skills} ${u.profession} ${u.city} ${u.country}`
        .toLowerCase()
        .includes(q);
    const matchesCountry = countryFilter === 'Tous' || u.country === countryFilter;
    const matchesTech =
      techFilter === 'Tous' ||
      u.technologies.toLowerCase().includes(techFilter.toLowerCase()) ||
      u.specialty.toLowerCase().includes(techFilter.toLowerCase());
    const matchesDomain = domainFilter === 'Tous' || u.specialty === domainFilter;
    const matchesExp = expFilter === 'Tous' || u.experienceLevel === expFilter;
    const matchesAvail = availFilter === 'Tous' || u.availability === availFilter;

    return matchesQuery && matchesCountry && matchesTech && matchesDomain && matchesExp && matchesAvail;
  });

  const handleFollow = async (targetId: number, name: string) => {
    const res = await authFetch(`/api/users/${targetId}/follow`, {
      method: 'POST',
      body: JSON.stringify({ followerName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Membre AFRIKDEV' }),
    });
    if (res.ok) {
      await refreshData();
      showToast(`Vous suivez désormais ${name} !`);
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <p className="text-xs font-mono text-emerald-500">ANNUAIRE PAN-AFRICAIN DES COMPÉTENCES</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
          Découvrez les talents tech africains
        </h1>
        <p className={`text-sm sm:text-base max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Filtrez par pays, technologie, domaine d’expertise, niveau d’expérience ou disponibilité pour
          trouver votre prochain collaborateur ou freelance.
        </p>
      </div>

      {/* Search & 5 Filters Panel */}
      <div
        className={`p-6 rounded-2xl border space-y-5 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un développeur, une compétence ou une technologie..."
            className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Pays</label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            >
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Technologie</label>
            <select
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            >
              {technologiesList.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Domaine</label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            >
              {domainsList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Expérience</label>
            <select
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            >
              {experiencesList.map((ex) => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Disponibilité</label>
            <select
              value={availFilter}
              onChange={(e) => setAvailFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            >
              {availabilitiesList.map((av) => (
                <option key={av} value={av}>{av}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Affichage de <strong className="font-mono text-emerald-500">{filteredUsers.length}</strong> profils vérifiés
        </span>
        <button
          type="button"
          onClick={() => {
            setSearchQuery('');
            setCountryFilter('Tous');
            setTechFilter('Tous');
            setDomainFilter('Tous');
            setExpFilter('Tous');
            setAvailFilter('Tous');
          }}
          className="text-emerald-500 hover:underline"
        >
          Réinitialiser les filtres
        </button>
      </div>

      {/* Profiles Grid */}
      <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((dev) => {
          const userProjectsCount = projects.filter((p) => p.authorId === dev.id).length || 2;
          return (
            <StaggerItem
              key={dev.id}
              className={`pro-max-card p-6 rounded-2xl border flex flex-col justify-between ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-emerald-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={dev.avatar}
                      alt={`${dev.firstName} ${dev.lastName}`}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-emerald-500/30"
                    />
                    <span
                      title={dev.isOnline ? 'En ligne' : 'Hors ligne'}
                      className={`w-3 h-3 rounded-full absolute -bottom-1 -right-1 border-2 border-slate-950 ${
                        dev.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-lg font-bold truncate">
                        {dev.firstName} {dev.lastName}
                      </h2>
                      {dev.isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-xs font-mono text-slate-400">@{dev.username}</p>
                    <p className="text-xs font-semibold text-emerald-500 mt-0.5">{dev.profession}</p>
                  </div>
                </div>

                {/* Unboxed metadata */}
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span>Pays : <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{dev.country}</strong></span>
                    <span>·</span>
                    <span>Ville : <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{dev.city}</strong></span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span>Spécialité : {dev.specialty}</span>
                    <span>·</span>
                    <span>Expérience : {dev.experienceLevel}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span className="text-amber-400 font-medium">Disponibilité : {dev.availability}</span>
                    <span>·</span>
                    <span className="font-mono">{userProjectsCount} projets</span>
                  </div>
                </div>

                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {dev.bio}
                </p>

                <div className="text-xs font-mono text-slate-400">
                  Technologies maîtrisées :{' '}
                  <span className={isLight ? 'text-slate-900 font-medium' : 'text-emerald-300'}>
                    {dev.technologies.split(',').join(' · ')}
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-800/50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleFollow(dev.id, `${dev.firstName} ${dev.lastName}`)}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      isLight
                        ? 'border-slate-200 hover:bg-slate-100 text-slate-700'
                        : 'border-slate-800 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Suivre ({dev.followersCount})</span>
                  </button>
                  <Link
                    to={`/messagerie?to=${dev.id}`}
                    className={`p-2 rounded-lg border transition-colors ${
                      isLight
                        ? 'border-slate-200 hover:bg-slate-100 text-slate-700'
                        : 'border-slate-800 hover:bg-slate-800 text-slate-300'
                    }`}
                    title="Envoyer un message"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                  </Link>
                </div>

                <Link
                  to={`/profil/${dev.username}`}
                  className="pro-max-btn px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold whitespace-nowrap"
                >
                  Voir le profil
                </Link>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGrid>
    </div>
  );
};
