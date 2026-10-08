import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { StaggerGrid, StaggerItem } from '../components/MotionPrimitives.tsx';
import { Trophy, Users, Calendar, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ChallengesPage: React.FC = () => {
  const { challenges, currentUser, theme, authFetch, refreshData, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [joinModalChallengeId, setJoinModalChallengeId] = useState<number | null>(null);
  const [teamProjectName, setTeamProjectName] = useState('');

  const isLight = theme === 'light';

  const categories = [
    'Tous',
    'Hackathon',
    'Challenge IA',
    'Challenge Web',
    'Challenge Mobile',
    'Challenge Cybersécurité',
  ];

  const filteredChallenges = challenges.filter(
    (c) => selectedCategory === 'Tous' || c.category === selectedCategory
  );

  const handleJoinChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinModalChallengeId) return;

    const res = await authFetch(`/api/challenges/${joinModalChallengeId}/join`, {
      method: 'POST',
      body: JSON.stringify({
        userId: currentUser?.id || 1,
        userName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Équipe AFRIKDEV',
        country: currentUser?.country || 'Sénégal',
        projectName: teamProjectName || 'Solution Tech Africa',
      }),
    });
    if (res.ok) {
      await refreshData();
      setJoinModalChallengeId(null);
      setTeamProjectName('');
      showToast('Participation enregistrée ! Vous apparaissez dans le classement.');
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="space-y-3">
        <p className="text-xs font-mono text-amber-500">COMPÉTITIONS DE PROGRAMMATION & D’INNOVATION</p>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display">
          Les challenges AFRIKDEV
        </h1>
        <p className={`text-sm sm:text-base max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Participez à nos hackathons et challenges thématiques (IA, Web, Mobile, Cybersécurité),
          mesurez-vous aux meilleurs développeurs du continent et remportez des dotations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950'
                : isLight
                ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Challenges List */}
      <StaggerGrid className="space-y-8">
        {filteredChallenges.map((chal) => {
          let leaderboard: Array<{ rank: number; name: string; country: string; score: number; project: string }> = [];
          try {
            leaderboard = JSON.parse(chal.leaderboardJson);
          } catch {
            leaderboard = [];
          }

          return (
            <StaggerItem
              key={chal.id}
              className={`pro-max-card p-8 rounded-2xl border grid grid-cols-1 lg:grid-cols-12 gap-8 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Challenge Details */}
              <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <span className="text-amber-500 font-bold">{chal.category}</span>
                    <span>·</span>
                    <span className="text-emerald-400">Challenge actuel ({chal.status})</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> Date limite : {chal.deadline}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold font-display">{chal.title}</h2>
                  <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {chal.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Récompenses</span>
                      </div>
                      <p className="text-xs font-bold text-amber-400">{chal.rewards}</p>
                    </div>

                    <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                        <Users className="w-4 h-4 text-emerald-500" />
                        <span>Nombre de participants</span>
                      </div>
                      <p className="text-lg font-extrabold font-mono tabular-nums text-emerald-500">
                        {chal.participantsCount} inscrits
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="text-xs font-semibold flex items-center gap-1.5 text-slate-300">
                      <ShieldAlert className="w-4 h-4 text-emerald-500" />
                      <span>Règlement officiel :</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{chal.rules}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setJoinModalChallengeId(chal.id)}
                    className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Participer au challenge</span>
                  </button>
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="lg:col-span-5">
                <div
                  className={`p-6 rounded-xl border h-full space-y-4 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold font-display flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Classement en temps réel</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">Score / 100</span>
                  </div>

                  <div className="divide-y divide-slate-800/60 text-xs">
                    {leaderboard.map((row, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-md font-mono font-bold flex items-center justify-center ${
                              idx === 0
                                ? 'bg-amber-500 text-slate-950'
                                : idx === 1
                                ? 'bg-slate-700 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-semibold">{row.name}</p>
                            <p className="text-[11px] text-slate-400">
                              {row.country} · Projet : {row.project}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono font-bold tabular-nums text-emerald-400">
                          {row.score} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGrid>

      {/* Modal Join Challenge */}
      {joinModalChallengeId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <h3 className="text-xl font-bold font-display flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Confirmer votre participation</span>
            </h3>
            <form onSubmit={handleJoinChallenge} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Nom de votre projet ou de votre équipe
                </label>
                <input
                  type="text"
                  value={teamProjectName}
                  onChange={(e) => setTeamProjectName(e.target.value)}
                  placeholder="Ex: Teranga AI Lab"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setJoinModalChallengeId(null)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                >
                  Valider l’inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
