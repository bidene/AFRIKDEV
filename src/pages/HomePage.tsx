import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext.tsx';
import {
  FadeInSection,
  StaggerGrid,
  StaggerItem,
  AnimatedStatCounter,
  EASE_OUT_EXPO,
} from '../components/MotionPrimitives.tsx';
import {
  ArrowRight,
  Search,
  Heart,
  Eye,
  Users,
  CheckCircle2,
  Code2,
  GitBranch,
  Cloud,
  Cpu,
  Smartphone,
  Globe,
  Network,
  Shield,
  Trophy,
  MessageSquare,
  Sparkles,
  FolderGit2,
  Handshake,
  MapPin,
  Briefcase,
  ShoppingBag,
  Palette,
  BookOpen,
} from 'lucide-react';

const HERO_IMG = '/src/assets/images/hero_afrikdev_team_1791476192526.jpg';

const AFRICAN_HUBS = [
  { id: 'dakar', city: 'Dakar', country: 'Sénégal', x: 96, y: 298, members: 215, focus: 'Fintech & Cloud' },
  { id: 'abidjan', city: 'Abidjan', country: 'Côte d’Ivoire', x: 175, y: 394, members: 180, focus: 'Mobile & UI/UX' },
  { id: 'accra', city: 'Accra', country: 'Ghana', x: 218, y: 388, members: 165, focus: 'DevOps & Cyber' },
  { id: 'lagos', city: 'Lagos', country: 'Nigeria', x: 274, y: 378, members: 310, focus: 'API & Réseaux' },
  { id: 'casablanca', city: 'Casablanca', country: 'Maroc', x: 185, y: 120, members: 195, focus: 'IA & Data Science' },
  { id: 'tunis', city: 'Tunis', country: 'Tunisie', x: 312, y: 84, members: 130, focus: 'SaaS & Web' },
  { id: 'cairo', city: 'Le Caire', country: 'Égypte', x: 472, y: 145, members: 220, focus: 'E-commerce & Cloud' },
  { id: 'nairobi', city: 'Nairobi', country: 'Kenya', x: 545, y: 445, members: 275, focus: 'Agritech & Mobile Money' },
  { id: 'kigali', city: 'Kigali', country: 'Rwanda', x: 478, y: 465, members: 155, focus: 'GovTech & Design' },
  { id: 'johannesburg', city: 'Johannesburg', country: 'Afrique du Sud', x: 438, y: 695, members: 240, focus: 'Enterprise Cloud' },
];

export const HomePage: React.FC = () => {
  const { users, projects, collaborations, articles, challenges, theme, authFetch, refreshData, showToast } = useApp();
  const [selectedHub, setSelectedHub] = useState(AFRICAN_HUBS[0]);
  const [homeSearch, setHomeSearch] = useState('');
  const [selectedTech, setSelectedTech] = useState('Tous');

  const isLight = theme === 'light';

  const heroDomains = [
    { label: 'Code & API', query: 'Code', sub: 'Full-Stack & Backend', icon: Code2, color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
    { label: 'Open Source', query: 'GitHub', sub: 'Projets GitHub', icon: GitBranch, color: 'text-violet-400 bg-violet-500/15 border-violet-500/30' },
    { label: 'Cloud & DevOps', query: 'Cloud', sub: 'Serveurs & CI/CD', icon: Cloud, color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30' },
    { label: 'IA & Data', query: 'IA', sub: 'Modèles & ML', icon: Cpu, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
    { label: 'Mobile', query: 'Mobile', sub: 'Flutter & iOS/Android', icon: Smartphone, color: 'text-pink-400 bg-pink-500/15 border-pink-500/30' },
    { label: 'Web & SaaS', query: 'Web', sub: 'React, Next.js & UI', icon: Globe, color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30' },
    { label: 'Réseaux', query: 'Réseaux', sub: 'Infra & Télécoms', icon: Network, color: 'text-orange-400 bg-orange-500/15 border-orange-500/30' },
    { label: 'Cybersécurité', query: 'Cybersécurité', sub: 'Audit & Pentest', icon: Shield, color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' },
  ];

  const servicesList = [
    {
      num: '01',
      title: 'Développement Web',
      desc: 'Sites vitrines, applications web, plateformes SaaS et solutions métiers.',
      icon: Globe,
      color: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    },
    {
      num: '02',
      title: 'E-commerce',
      desc: 'Création de boutiques en ligne et plateformes de vente.',
      icon: ShoppingBag,
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    },
    {
      num: '03',
      title: 'Applications mobiles',
      desc: 'Applications Android et iOS modernes.',
      icon: Smartphone,
      color: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
    },
    {
      num: '04',
      title: 'UI/UX Design',
      desc: "Conception d'interfaces modernes et expériences utilisateurs.",
      icon: Palette,
      color: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    },
    {
      num: '05',
      title: 'Cloud & DevOps',
      desc: 'Déploiement, serveurs, CI/CD, Docker et infrastructures cloud.',
      icon: Cloud,
      color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
    },
    {
      num: '06',
      title: 'Réseaux',
      desc: 'Installation, configuration et administration des infrastructures réseau.',
      icon: Network,
      color: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
    },
    {
      num: '07',
      title: 'Cybersécurité',
      desc: 'Audit, sécurisation et protection des applications et infrastructures.',
      icon: Shield,
      color: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    },
    {
      num: '08',
      title: 'Intelligence artificielle',
      desc: 'Automatisation, assistants IA, analyse de données et intégration de modèles IA.',
      icon: Cpu,
      color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
    },
  ];

  const filteredHomeUsers = users.filter((u) => {
    const matchesSearch =
      !homeSearch ||
      `${u.firstName} ${u.lastName} ${u.technologies} ${u.specialty} ${u.country}`
        .toLowerCase()
        .includes(homeSearch.toLowerCase());
    const matchesTech =
      selectedTech === 'Tous' ||
      u.technologies.toLowerCase().includes(selectedTech.toLowerCase()) ||
      u.specialty.toLowerCase().includes(selectedTech.toLowerCase());
    return matchesSearch && matchesTech;
  });

  const handleLikeProject = async (id: number) => {
    const res = await authFetch(`/api/projects/${id}/like`, { method: 'POST' });
    if (res.ok) {
      await refreshData();
      showToast('Projet soutenu avec succès !');
    }
  };

  return (
    <div className="space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 lg:pt-16 overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: EASE_OUT_EXPO }}
            className="lg:col-span-6 space-y-6"
          >
            <p className="text-xs font-mono tracking-wider text-emerald-500 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </span>
              <span>AFRIKDEV — LA COMMUNAUTÉ NUMÉRIQUE AFRICAINE · « CONSTRUIRE L’AFRIQUE NUMÉRIQUE, UN PROJET À LA FOIS. »</span>
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.08] text-balance">
              Les talents tech africains construisent le futur.
            </h1>
            <p className={`text-base sm:text-lg leading-relaxed max-w-xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Découvrez des développeurs, partagez vos projets, trouvez des collaborateurs et
              construisez ensemble les solutions numériques de demain.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/inscription"
                className="pro-max-btn px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center gap-2 whitespace-nowrap shadow-lg shadow-emerald-950/50"
              >
                <span>Rejoindre la communauté</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/projets"
                className={`pro-max-btn px-6 py-3.5 rounded-xl border font-semibold text-sm whitespace-nowrap ${
                  isLight
                    ? 'border-slate-300 text-slate-800 hover:bg-slate-100'
                    : 'border-slate-700 text-slate-200 hover:bg-slate-900'
                }`}
              >
                Découvrir les projets
              </Link>
            </div>

            {/* Éléments visuels autour du hero */}
            <div className="pt-5">
              <div className="flex items-center justify-between mb-3.5">
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Écosystème technologique de la communauté
                </p>
                <span className="text-[11px] font-mono text-emerald-400">8 pôles d’expertise</span>
              </div>
              <StaggerGrid className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {heroDomains.map((item) => {
                  const Icon = item.icon;
                  return (
                    <StaggerItem key={item.label}>
                      <Link
                        to={`/talents?tech=${encodeURIComponent(item.query)}`}
                        className={`pro-max-card group flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isLight
                            ? 'bg-white border-slate-200/90 hover:border-emerald-500 hover:shadow-md text-slate-800'
                            : 'bg-slate-900/80 border-slate-800/90 hover:border-emerald-500/70 hover:bg-slate-900 text-slate-100 shadow-sm'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 ${item.color}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold tracking-tight truncate group-hover:text-emerald-400 transition-colors">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {item.sub}
                          </p>
                        </div>
                      </Link>
                    </StaggerItem>
                  );
                })}
              </StaggerGrid>
            </div>
          </motion.div>

          {/* Hero Photography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.08, ease: EASE_OUT_EXPO }}
            className="lg:col-span-6"
          >
            <div className="pro-max-card relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-video">
              <img
                src={HERO_IMG}
                alt="Jeunes développeurs africains travaillant ensemble sur des ordinateurs"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Hub Technologique Pan-Africain · Dakar · Abidjan · Accra · Lagos · Nairobi · Casablanca</span>
                  <span className="font-mono text-amber-400">24/7 Actif</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SECTION STATISTIQUES DYNAMIQUES (ANIMÉES LORS DU DÉFILEMENT) */}
      <FadeInSection className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-2xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800/90'
          }`}
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-emerald-500">
              <AnimatedStatCounter target={1000} prefix="+" />
            </div>
            <div className="text-sm font-semibold">développeurs</div>
            <p className="text-xs text-slate-500">Ingénieurs, designers, DevOps & architectes actifs</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-amber-500">
              <AnimatedStatCounter target={500} prefix="+" />
            </div>
            <div className="text-sm font-semibold">projets</div>
            <p className="text-xs text-slate-500">Solutions open-source, SaaS, Fintech et Agritech</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
              <Handshake className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-emerald-500">
              <AnimatedStatCounter target={200} prefix="+" />
            </div>
            <div className="text-sm font-semibold">collaborations</div>
            <p className="text-xs text-slate-500">Équipes inter-pays formées sur la plateforme</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <Globe className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-amber-500">
              <AnimatedStatCounter target={30} prefix="+" />
            </div>
            <div className="text-sm font-semibold">pays représentés</div>
            <p className="text-xs text-slate-500">Afrique de l’Ouest, Centrale, Est, Nord, Australe & Diaspora</p>
          </div>
        </div>
      </FadeInSection>

      {/* 3. SECTION « UNE COMMUNAUTÉ AFRICAINE » (CARTE INTERACTIVE DE L'AFRIQUE) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5">
            <p className="text-xs font-mono text-emerald-500 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              </span>
              <span>UNE COMMUNAUTÉ AFRICAINE</span>
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-balance">
              Une seule communauté. Des milliers d’idées.
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              AFRIKDEV rassemble les talents numériques africains dans un même espace afin de
              faciliter les échanges, les collaborations et la création de projets innovants.
            </p>

            {/* Selected Hub Card */}
            <div
              className={`p-5 rounded-xl border space-y-3 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">
                    {selectedHub.city}, {selectedHub.country}
                  </h3>
                  <p className="text-xs text-slate-400">Spécialité dominante : {selectedHub.focus}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono tabular-nums text-emerald-500">
                    {selectedHub.members}
                  </span>
                  <p className="text-[11px] text-slate-400">membres actifs</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {AFRICAN_HUBS.map((hub) => (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setSelectedHub(hub)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      selectedHub.id === hub.id
                        ? 'bg-emerald-600 text-white'
                        : isLight
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {hub.city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive SVG Stylized Map of Africa */}
          <div className="lg:col-span-7">
            <div
              className={`p-6 rounded-2xl border flex flex-col items-center justify-center relative ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <svg
                viewBox="0 0 740 820"
                className="w-full max-w-[540px] h-auto drop-shadow-xl"
                role="img"
                aria-label="Carte détaillée de l'Afrique avec les frontières des pays et les membres de la communauté AFRIKDEV"
              >
                {/* Detailed Mainland Africa Contour in Blue */}
                <path
                  d="M 192,88 L 218,75 L 258,78 L 296,68 L 325,74 L 322,102 L 348,118 L 392,115 L 408,104 L 446,112 L 486,125 L 508,118 L 516,138 L 505,152 L 528,195 L 552,248 L 568,288 L 588,318 L 614,328 L 656,312 L 662,324 L 642,368 L 605,415 L 570,455 L 558,498 L 564,538 L 555,568 L 565,595 L 552,622 L 518,655 L 515,695 L 488,735 L 448,766 L 408,778 L 385,774 L 372,738 L 352,692 L 338,635 L 322,598 L 328,552 L 336,512 L 318,472 L 298,448 L 302,415 L 288,395 L 254,394 L 222,382 L 196,392 L 154,395 L 122,375 L 98,342 L 88,305 L 85,274 L 96,242 L 88,215 L 116,174 L 145,142 L 166,114 Z"
                  fill="#1D4ED8"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Detailed Madagascar Island Contour */}
                <path
                  d="M 642,562 L 652,578 L 646,612 L 632,658 L 618,688 L 598,696 L 586,682 L 588,652 L 602,622 L 612,592 L 632,572 Z"
                  fill="#1D4ED8"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Internal White Country Borders matching the uploaded Africa vector illustration */}
                <g fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {/* North & Sahara Borders */}
                  <path d="M 145,142 L 182,142 L 182,168 L 116,168" />
                  <path d="M 166,114 L 212,135 L 268,212 L 182,212 L 182,168" />
                  <path d="M 322,102 L 315,152 L 325,205 L 268,212" />
                  <path d="M 315,152 L 348,118" />
                  <path d="M 435,110 L 435,218 L 365,218 L 325,205" />
                  <path d="M 435,218 L 538,218" />

                  {/* West Africa & Sahel Borders */}
                  <path d="M 182,212 L 182,272 L 118,272 L 96,242" />
                  <path d="M 268,212 L 262,285 L 182,272" />
                  <path d="M 365,218 L 355,315 L 262,285" />
                  <path d="M 365,218 L 435,218 L 432,338 L 355,315" />
                  <path d="M 85,274 L 128,288 L 118,318 L 88,305" />
                  <path d="M 128,288 L 168,312 L 154,395" />
                  <path d="M 118,318 L 142,348 L 122,375" />
                  <path d="M 182,272 L 218,318 L 168,312" />
                  <path d="M 196,392 L 202,336 L 234,336 L 234,386" />
                  <path d="M 218,318 L 218,382" />
                  <path d="M 262,285 L 274,324 L 234,336" />
                  <path d="M 274,324 L 336,332 L 318,402 L 288,395" />

                  {/* Central & East Africa Borders */}
                  <path d="M 432,338 L 525,332 L 552,248" />
                  <path d="M 525,332 L 568,288" />
                  <path d="M 525,332 L 548,398 L 625,388" />
                  <path d="M 588,318 L 582,362 L 642,368" />
                  <path d="M 355,315 L 368,388 L 432,395 L 432,338" />
                  <path d="M 318,402 L 368,388 L 385,425 L 302,415" />
                  <path d="M 298,448 L 348,448 L 352,482 L 318,472" />
                  <path d="M 385,425 L 468,422 L 472,535 L 392,535 L 352,482" />
                  <path d="M 432,395 L 508,408 L 548,398" />
                  <path d="M 548,398 L 564,462 L 508,452 L 508,408" />
                  <path d="M 468,422 L 508,408" />
                  <path d="M 468,458 L 508,452 L 515,525 L 558,518" />
                  <path d="M 468,472 L 486,472 L 486,498 L 468,498" />

                  {/* Southern Africa Borders */}
                  <path d="M 336,512 L 392,535 L 398,605 L 322,598" />
                  <path d="M 392,535 L 456,558 L 495,552 L 515,525" />
                  <path d="M 515,525 L 524,588 L 555,568" />
                  <path d="M 398,605 L 452,605 L 456,558" />
                  <path d="M 452,605 L 498,622 L 524,588" />
                  <path d="M 398,605 L 395,695 L 352,692" />
                  <path d="M 395,695 L 448,682 L 452,605" />
                  <path d="M 448,682 L 498,668 L 498,622" />
                  <path d="M 498,668 L 518,655" />
                  {/* Lesotho & Eswatini */}
                  <circle cx="464" cy="722" r="10" />
                  <circle cx="496" cy="692" r="7" />
                </g>

                {/* Inter-Hub Connection Lines */}
                <line x1="96" y1="298" x2="185" y2="120" stroke="#fbbf24" strokeOpacity="0.55" strokeDasharray="4 4" />
                <line x1="96" y1="298" x2="175" y2="394" stroke="#fbbf24" strokeOpacity="0.65" />
                <line x1="175" y1="394" x2="274" y2="378" stroke="#fbbf24" strokeOpacity="0.65" />
                <line x1="274" y1="378" x2="478" y2="465" stroke="#fbbf24" strokeOpacity="0.55" />
                <line x1="478" y1="465" x2="545" y2="445" stroke="#fbbf24" strokeOpacity="0.65" />
                <line x1="478" y1="465" x2="438" y2="695" stroke="#fbbf24" strokeOpacity="0.55" strokeDasharray="4 4" />
                <line x1="185" y1="120" x2="472" y2="145" stroke="#fbbf24" strokeOpacity="0.55" />
                <line x1="472" y1="145" x2="545" y2="445" stroke="#fbbf24" strokeOpacity="0.55" />

                {/* Interactive Community Member Points */}
                {AFRICAN_HUBS.map((hub) => {
                  const isSelected = selectedHub.id === hub.id;
                  return (
                    <g
                      key={hub.id}
                      onClick={() => setSelectedHub(hub)}
                      className="cursor-pointer"
                    >
                      {isSelected && (
                        <circle
                          cx={hub.x}
                          cy={hub.y}
                          r="18"
                          fill="#f59e0b"
                          fillOpacity="0.35"
                        />
                      )}
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r={isSelected ? '8.5' : '6.5'}
                        fill={isSelected ? '#f59e0b' : '#ffffff'}
                        stroke="#020617"
                        strokeWidth="2"
                      />
                      <text
                        x={hub.x + 12}
                        y={hub.y + 4}
                        fill="#ffffff"
                        stroke="#020617"
                        strokeWidth="3"
                        paintOrder="stroke"
                        fontSize="12.5"
                        fontWeight={isSelected ? '800' : '600'}
                      >
                        {hub.city}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <p className="text-xs text-slate-400 mt-2">
                Cliquez sur un pôle technologique pour explorer les membres locaux de la communauté.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION « DÉCOUVREZ LES TALENTS » PREVIEW */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono text-emerald-500 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-blue-400" />
              </span>
              <span>DÉCOUVREZ LES TALENTS</span>
            </p>
            <h2 className="text-3xl font-bold font-display">
              Les experts qui bâtissent l’écosystème tech africain
            </h2>
          </div>
          <Link
            to="/talents"
            className="text-sm font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Explorer tous les profils ({users.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Search & Interactive Skill Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={homeSearch}
              onChange={(e) => setHomeSearch(e.target.value)}
              placeholder="Rechercher un développeur, une compétence ou une technologie..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-900'
                  : 'bg-slate-900 border-slate-800 text-slate-100'
              }`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['Tous', 'React', 'Next.js', 'Node.js', 'Laravel', 'Python', 'Flutter', 'UI/UX', 'DevOps', 'Cybersécurité', 'Réseaux'].map(
              (tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setSelectedTech(tech)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedTech === tech
                      ? 'bg-emerald-600 text-white'
                      : isLight
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {tech}
                </button>
              )
            )}
          </div>
        </div>

        {/* Developer Cards Grid */}
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHomeUsers.slice(0, 6).map((dev) => (
            <StaggerItem
              key={dev.id}
              className={`pro-max-card p-6 rounded-2xl border flex flex-col justify-between ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-emerald-500/60'
                  : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={dev.avatar}
                    alt={`${dev.firstName} ${dev.lastName}`}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-emerald-500/30 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold truncate">
                        {dev.firstName} {dev.lastName}
                      </h3>
                      {dev.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs font-mono text-slate-400">@{dev.username}</p>
                    <p className="text-xs text-emerald-500 font-medium mt-0.5">{dev.specialty}</p>
                  </div>
                </div>

                {/* Unboxed clean metadata with typographic separators */}
                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>{dev.city}, {dev.country}</span>
                  <span aria-hidden="true">·</span>
                  <span>Niveau {dev.experienceLevel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 font-medium">{dev.availability}</span>
                </div>

                <p className={`text-xs leading-relaxed line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {dev.bio}
                </p>

                <div className="text-xs text-slate-400 font-mono">
                  Technologies : <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>{dev.technologies.split(',').join(' · ')}</span>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-800/50 flex items-center justify-between">
                <span className="text-xs font-mono tabular-nums text-slate-400">
                  {projects.filter((p) => p.authorId === dev.id).length || 2} projets publiés
                </span>
                <Link
                  to={`/profil/${dev.username}`}
                  className="pro-max-btn px-3.5 py-2 rounded-lg bg-emerald-600/15 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-semibold whitespace-nowrap"
                >
                  Voir le profil
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* 5. SECTION PROJETS & COLLABORATION */}
      <FadeInSection className="max-w-[1360px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono text-emerald-500 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
                <FolderGit2 className="w-3.5 h-3.5 text-violet-400" />
              </span>
              <span>PROJETS DE LA COMMUNAUTÉ</span>
            </p>
            <h2 className="text-3xl font-bold font-display">
              Découvrez les projets qui font avancer l’Afrique
            </h2>
          </div>
          <Link
            to="/projets"
            className="text-sm font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1.5"
          >
            <span>Voir tous les projets & opportunités</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.slice(0, 4).map((proj) => (
            <StaggerItem
              key={proj.id}
              className={`pro-max-card rounded-2xl border overflow-hidden flex flex-col justify-between ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{proj.country}</span>
                    <span aria-hidden="true">·</span>
                    <span>Par {proj.authorName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{new Date(proj.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display">{proj.title}</h3>
                  <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {proj.description}
                  </p>
                  <p className="text-xs font-mono text-emerald-400">
                    {proj.technologies.split(',').join(' · ')}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-400">
                  <button
                    type="button"
                    onClick={() => handleLikeProject(proj.id)}
                    className="pro-max-btn flex items-center gap-1 hover:text-rose-400"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>{proj.likesCount}</span>
                  </button>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>{proj.viewsCount}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>{proj.collaboratorsCount} collab.</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/projets"
                    className={`pro-max-btn px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                      isLight
                        ? 'border-slate-300 text-slate-800 hover:bg-slate-100'
                        : 'border-slate-700 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    Voir le projet
                  </Link>
                  <Link
                    to="/projets"
                    className="pro-max-btn px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    Collaborer
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* SECTION COLLABORATION BANNER */}
        <div
          className={`p-8 rounded-2xl border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
            isLight ? 'bg-emerald-950 text-white border-emerald-800' : 'bg-slate-900 border-emerald-500/30'
          }`}
        >
          <div className="lg:col-span-8 space-y-3">
            <p className="text-xs font-mono text-amber-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Handshake className="w-3.5 h-3.5 text-amber-400" />
              </span>
              <span>ESPACE COLLABORATION & ÉQUIPES</span>
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display">
              Trouvez les bonnes personnes pour votre projet
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Vous avez une idée mais vous avez besoin d’un développeur, d’un designer, d’un
              administrateur réseau ou d’un expert métier ? Trouvez les compétences dont vous avez
              besoin au sein de la communauté.
            </p>
            <div className="text-xs text-emerald-300 flex flex-wrap gap-x-3 gap-y-1 pt-1">
              <span>Publier une opportunité</span>
              <span>·</span>
              <span>Rechercher des talents</span>
              <span>·</span>
              <span>Envoyer une demande</span>
              <span>·</span>
              <span>Messagerie directe</span>
              <span>·</span>
              <span>Gestion des équipes & Suivi</span>
            </div>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link
              to="/projets"
              className="pro-max-btn px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm whitespace-nowrap"
            >
              Publier une opportunité ({collaborations.length} actives)
            </Link>
          </div>
        </div>
      </FadeInSection>

      {/* 6. SECTION SERVICES */}
      <FadeInSection className="max-w-[1360px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono text-emerald-500 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-pink-500/15 border border-pink-500/30 flex items-center justify-center">
                <Briefcase className="w-3.5 h-3.5 text-pink-400" />
              </span>
              <span>SERVICES & EXPERTISES</span>
            </p>
            <h2 className="text-3xl font-bold font-display">
              Des compétences tech à portée de main
            </h2>
          </div>
          <Link
            to="/services"
            className="text-sm font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1.5"
          >
            <span>Découvrir le catalogue des services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {servicesList.map((srv) => {
            const SrvIcon = srv.icon;
            return (
              <StaggerItem key={srv.num}>
                <Link
                  to="/services"
                  className={`pro-max-card group block h-full p-6 rounded-2xl border space-y-3.5 ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-emerald-500'
                      : 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${srv.color}`}>
                      <SrvIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 font-semibold">{srv.num}.</span>
                  </div>
                  <h3 className="text-lg font-bold font-display">{srv.title}</h3>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {srv.desc}
                  </p>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </FadeInSection>

      {/* 7. SECTION ACTUALITÉS / ARTICLES & CHALLENGES */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Articles Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-mono text-emerald-500 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                </span>
                <span>ACTUALITÉS, TUTORIELS & GUIDES</span>
              </p>
              <h2 className="text-2xl font-bold font-display">Dernières publications techniques</h2>
            </div>
            <Link to="/articles" className="text-xs font-semibold text-emerald-500 hover:underline">
              Tous les articles →
            </Link>
          </div>

          <div className="space-y-4">
            {articles.slice(0, 3).map((art) => (
              <Link
                key={art.id}
                to="/articles"
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row gap-5 transition-colors ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-emerald-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <img
                  src={art.coverImage}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="w-full sm:w-36 h-28 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-emerald-500 font-medium">{art.category}</span>
                    <span>·</span>
                    <span>{art.authorName}</span>
                    <span>·</span>
                    <span>{art.readTime} de lecture</span>
                  </div>
                  <h3 className="text-base font-bold font-display line-clamp-1">{art.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{art.excerpt}</p>
                  <div className="text-xs font-mono tabular-nums text-slate-500 flex items-center gap-4">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-cyan-400" /> {art.viewsCount} vues</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> {art.likesCount} likes</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-amber-400" /> {art.commentsCount} comm.</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Challenges Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-mono text-amber-500 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                </span>
                <span>COMPÉTITIONS & INNOVATION</span>
              </p>
              <h2 className="text-2xl font-bold font-display">Les challenges AFRIKDEV</h2>
            </div>
            <Link to="/challenges" className="text-xs font-semibold text-amber-500 hover:underline">
              Voir le classement →
            </Link>
          </div>

          <div className="space-y-4">
            {challenges.slice(0, 2).map((chal) => (
              <div
                key={chal.id}
                className={`p-6 rounded-2xl border space-y-4 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-amber-500 font-semibold">{chal.category}</span>
                  <span className="font-mono text-slate-400">Date limite : {chal.deadline}</span>
                </div>
                <h3 className="text-lg font-bold font-display">{chal.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{chal.description}</p>
                <div className="text-xs space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Participants inscrits :</span>
                    <span className="font-mono font-bold text-emerald-500">{chal.participantsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Récompenses :</span>
                    <span className="font-semibold text-amber-400">{chal.rewards}</span>
                  </div>
                </div>
                <Link
                  to="/challenges"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Participer au challenge</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
