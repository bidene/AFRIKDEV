import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';
import { StaggerGrid, StaggerItem, FadeInSection } from '../components/MotionPrimitives.tsx';
import { Lightbulb, Users, Share2, Award, HeartHandshake, Eye } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { theme } = useApp();
  const isLight = theme === 'light';

  const values = [
    {
      num: '01',
      title: 'Innovation',
      desc: 'Concevoir des architectures et solutions technologiques adaptées aux défis réels du continent.',
      icon: Lightbulb,
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    },
    {
      num: '02',
      title: 'Collaboration',
      desc: 'Favoriser l’entraide inter-pays entre développeurs, designers, DevOps et entrepreneurs.',
      icon: Users,
      color: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    },
    {
      num: '03',
      title: 'Partage',
      desc: 'Diffuser librement le savoir technique via des tutoriels, retours d’expérience et projets open-source.',
      icon: Share2,
      color: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    },
    {
      num: '04',
      title: 'Excellence',
      desc: 'Promouvoir des standards d’ingénierie logicielle, de sécurité et de design de classe mondiale.',
      icon: Award,
      color: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    },
    {
      num: '05',
      title: 'Inclusion',
      desc: 'Donner une visibilité équitable à chaque talent numérique, des capitales aux régions émergentes.',
      icon: HeartHandshake,
      color: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
    },
    {
      num: '06',
      title: 'Transparence',
      desc: 'Bâtir un écosystème de confiance vérifié pour les freelances, startups, recruteurs et investisseurs.',
      icon: Eye,
      color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
    },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-14 space-y-16">
      {/* Main Hero */}
      <div className="max-w-3xl space-y-5">
        <p className="text-xs font-mono text-emerald-500">À PROPOS D’AFRIKDEV</p>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight text-balance">
          Construisons ensemble l’avenir numérique de l’Afrique
        </h1>
        <p className={`text-base sm:text-lg leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          AFRIKDEV est une plateforme pensée pour rapprocher les talents numériques africains et
          créer un environnement favorable au partage de connaissances, à la collaboration et à
          l'innovation.
        </p>
      </div>

      {/* Notre Vision */}
      <div
        className={`p-8 sm:p-10 rounded-2xl border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/70 border-slate-800'
        }`}
      >
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs font-mono text-amber-500 font-semibold">NOTRE VISION</p>
          <h2 className="text-2xl sm:text-3xl font-bold font-display">
            Faire émerger une communauté technologique africaine forte, connectée et capable de
            créer des solutions adaptées aux réalités du continent.
          </h2>
          <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Chaque fonctionnalité de la plateforme est structurée autour d’un cycle vertueux :
            Découverte → Connexion → Collaboration → Création → Opportunités.
          </p>
        </div>
        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
          <Link
            to="/inscription"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-center text-xs font-semibold transition-colors"
          >
            Rejoindre la communauté AFRIKDEV
          </Link>
          <Link
            to="/talents"
            className={`px-6 py-3.5 rounded-xl border text-center text-xs font-semibold transition-colors ${
              isLight ? 'border-slate-300 text-slate-800' : 'border-slate-700 text-slate-200'
            }`}
          >
            Découvrir les profils membres
          </Link>
        </div>
      </div>

      {/* Nos 6 Valeurs */}
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-mono text-emerald-500">NOS VALEURS FONDAMENTALES</p>
          <h2 className="text-3xl font-bold font-display">Les piliers de la communauté AFRIKDEV</h2>
        </div>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <StaggerItem
                key={val.num}
                className={`pro-max-card p-6 rounded-2xl border space-y-3 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-500 font-bold">{val.num}.</span>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${val.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-xl font-bold font-display">{val.title}</h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {val.desc}
                </p>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </div>
  );
};
