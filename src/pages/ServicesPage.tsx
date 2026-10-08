import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';
import { StaggerGrid, StaggerItem } from '../components/MotionPrimitives.tsx';
import {
  Globe,
  ShoppingBag,
  Smartphone,
  Palette,
  Cloud,
  Network,
  Shield,
  Cpu,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { users, theme } = useApp();
  const isLight = theme === 'light';

  const serviceCategories = [
    {
      num: '01',
      title: 'Développement Web',
      description: 'Sites vitrines, applications web, plateformes SaaS et solutions métiers.',
      deliverables: 'Applications React / Next.js, API Node.js / Laravel, Portails d’entreprise',
      icon: Globe,
      filterKey: 'Développement Web',
      color: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    },
    {
      num: '02',
      title: 'E-commerce',
      description: 'Création de boutiques en ligne et plateformes de vente.',
      deliverables: 'Intégration Mobile Money (Wave, Orange Money, M-Pesa), Gestion de stocks, Marketplaces',
      icon: ShoppingBag,
      filterKey: 'Laravel',
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    },
    {
      num: '03',
      title: 'Applications mobiles',
      description: 'Applications Android et iOS modernes.',
      deliverables: 'Applications cross-platform Flutter & React Native, Mode Offline-First',
      icon: Smartphone,
      filterKey: 'Applications mobiles',
      color: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
    },
    {
      num: '04',
      title: 'UI/UX Design',
      description: "Conception d'interfaces modernes et expériences utilisateurs.",
      deliverables: 'Maquettes Figma, Design Systems, Tests d’utilisabilité & Accessibilité WCAG',
      icon: Palette,
      filterKey: 'UI/UX Design',
      color: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    },
    {
      num: '05',
      title: 'Cloud & DevOps',
      description: 'Déploiement, serveurs, CI/CD, Docker et infrastructures cloud.',
      deliverables: 'Clusters Kubernetes, Automatisation Terraform, Pipelines CI/CD haute disponibilité',
      icon: Cloud,
      filterKey: 'Cloud & DevOps',
      color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
    },
    {
      num: '06',
      title: 'Réseaux',
      description: 'Installation, configuration et administration des infrastructures réseau.',
      deliverables: 'Architecture Cisco / MikroTik, SD-WAN, Interconnexion VPN & Fibre optique',
      icon: Network,
      filterKey: 'Réseaux',
      color: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
    },
    {
      num: '07',
      title: 'Cybersécurité',
      description: 'Audit, sécurisation et protection des applications et infrastructures.',
      deliverables: 'Tests d’intrusion (Pentest), Audit OWASP, Durcissement serveurs & Conformité',
      icon: Shield,
      filterKey: 'Cybersécurité',
      color: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    },
    {
      num: '08',
      title: 'Intelligence artificielle',
      description: 'Automatisation, assistants IA, analyse de données et intégration de modèles IA.',
      deliverables: 'Modèles NLP langues locales, Vision par ordinateur, Automatisation métier',
      icon: Cpu,
      filterKey: 'Intelligence artificielle',
      color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
    },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12 space-y-14">
      <div className="space-y-3 max-w-3xl">
        <p className="text-xs font-mono text-emerald-500">CATALOGUE DES SERVICES PROFESSIONNELS</p>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display">
          Des compétences tech à portée de main
        </h1>
        <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Trouvez des freelances vérifiés, des ingénieurs spécialisés et des studios techniques au sein
          de la communauté AFRIKDEV pour accompagner vos projets numériques de A à Z.
        </p>
      </div>

      {/* 8 Mandatory Service Categories Grid */}
      <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {serviceCategories.map((cat) => {
          const Icon = cat.icon;
          const matchingExperts = users.filter(
            (u) =>
              u.specialty.toLowerCase().includes(cat.filterKey.toLowerCase()) ||
              u.technologies.toLowerCase().includes(cat.filterKey.toLowerCase())
          );

          return (
            <StaggerItem
              key={cat.num}
              className={`pro-max-card p-7 rounded-2xl border flex flex-col justify-between space-y-6 ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-emerald-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/60'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-500">
                    CATÉGORIE {cat.num}
                  </span>
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold font-display">{cat.title}</h2>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {cat.description}
                </p>
                <div className="text-xs text-slate-400 pt-1">
                  Livrables clés : <span className="text-slate-200">{cat.deliverables}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{matchingExperts.length || 3} experts disponibles</span>
                </div>
                <Link
                  to={`/talents?tech=${encodeURIComponent(cat.filterKey)}`}
                  className="pro-max-btn px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Trouver un expert</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGrid>
    </div>
  );
};
