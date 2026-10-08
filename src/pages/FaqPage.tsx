import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext.tsx';
import { EASE_OUT_EXPO, StaggerGrid, StaggerItem } from '../components/MotionPrimitives.tsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Qui peut rejoindre AFRIKDEV ?',
    a: 'Tout développeur, designer, ingénieur, étudiant, freelance, entrepreneur ou professionnel de la technologie peut rejoindre la communauté.',
  },
  {
    q: 'Est-ce gratuit ?',
    a: 'Oui. AFRIKDEV propose une formule gratuite permettant de découvrir et utiliser toutes les fonctionnalités essentielles : création de profil, publication de projets, recherche de collaborateurs, messagerie et participation aux challenges.',
  },
  {
    q: 'Puis-je publier mes projets ?',
    a: 'Oui. Vous pouvez publier vos projets open-source, startups, applications web ou mobiles avec captures d’écran, lien GitHub, démo et stack technique.',
  },
  {
    q: 'Puis-je trouver des collaborateurs ?',
    a: 'Oui. La section Collaboration vous permet de publier une opportunité, de rechercher des profils complémentaires et de gérer votre équipe.',
  },
  {
    q: 'Puis-je proposer mes services ?',
    a: 'Oui. En indiquant votre disponibilité (Disponible ou Freelance) et vos domaines d’expertise sur votre profil, les entreprises et porteurs de projets peuvent vous contacter directement.',
  },
  {
    q: 'Comment participer aux challenges ?',
    a: 'Il suffit de créer un compte puis d’accéder à la section Challenges pour inscrire votre projet ou votre équipe au hackathon en cours.',
  },
];

export const FaqPage: React.FC = () => {
  const { theme } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isLight = theme === 'light';

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-14 space-y-10">
      <div className="space-y-3">
        <p className="text-xs font-mono text-emerald-500">FOIRE AUX QUESTIONS (FAQ)</p>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display">
          Questions fréquentes sur AFRIKDEV
        </h1>
        <p className={`text-sm sm:text-base ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Tout ce qu’il faut savoir pour rejoindre la communauté numérique africaine et collaborer.
        </p>
      </div>

      <StaggerGrid className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <StaggerItem
              key={item.q}
              className={`pro-max-card rounded-2xl border overflow-hidden ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
              >
                <span className="text-base font-bold font-display">{item.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                    className="px-6 pb-5 pt-1 text-sm text-slate-400 leading-relaxed border-t border-slate-800/40"
                  >
                    {item.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </StaggerItem>
          );
        })}
      </StaggerGrid>

      <div
        className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div>
          <h2 className="text-base font-bold font-display">Vous avez une autre question ?</h2>
          <p className="text-xs text-slate-400">Notre équipe vous répond rapidement via la page Contact.</p>
        </div>
        <Link
          to="/contact"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold whitespace-nowrap"
        >
          Contacter l’équipe
        </Link>
      </div>
    </div>
  );
};
