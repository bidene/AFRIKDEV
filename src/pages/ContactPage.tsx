import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { FadeInSection } from '../components/MotionPrimitives.tsx';
import { Mail, Phone, MapPin, Globe, Send, CheckCircle2 } from 'lucide-react';

const HUBS = [
  { name: 'Siège Afrique de l’Ouest — Dakar, Sénégal', address: 'Plateau Technologique, Avenue Léopold Sédar Senghor, Dakar', coords: '14.6928° N, 17.4467° W' },
  { name: 'Hub Golfe de Guinée — Abidjan, Côte d’Ivoire', address: 'Zone 4 Marcory, Pôle Digital Innovation, Abidjan', coords: '5.3600° N, 4.0083° W' },
  { name: 'Hub Afrique de l’Est — Nairobi & Kigali', address: 'Kilimani Tech Corridor, Nairobi / Norrsken Kigali House', coords: '1.2921° S, 36.8219° E' },
  { name: 'Hub Afrique du Nord — Casablanca, Maroc', address: 'Casablanca Technopark, Route de Nouaceur', coords: '33.5731° N, 7.5898° W' },
];

export const ContactPage: React.FC = () => {
  const { theme, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeHubIdx, setActiveHubIdx] = useState(0);

  const isLight = theme === 'light';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });
    if (res.ok) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      showToast('Votre message a bien été envoyé à l’équipe AFRIKDEV !');
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <p className="text-xs font-mono text-emerald-500">CONTACT & PARTENARIATS</p>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display">
          Une question ? Parlons-en.
        </h1>
        <p className={`text-sm sm:text-base max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Vous êtes développeur, startup, entreprise, université ou investisseur ? Contactez notre
          équipe pour toute demande d’information ou de partenariat technologique.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Formulaire de contact */}
        <div className="lg:col-span-7">
          <div
            className={`p-8 rounded-2xl border space-y-6 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            {submitted && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Merci ! Votre message a été enregistré. Notre équipe vous répondra sous 24h.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Nom</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom complet"
                    className={`w-full px-4 py-3 rounded-xl border text-sm ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@domaine.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Sujet</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Partenariat Hackathon / Recrutement Tech / Support"
                  className={`w-full px-4 py-3 rounded-xl border text-sm ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Message</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Détaillez votre demande..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                  required
                />
              </div>

              <button
                type="submit"
                className="pro-max-btn px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le message</span>
              </button>
            </form>
          </div>
        </div>

        {/* Coordonnées & Carte Interactive */}
        <FadeInSection delay={0.08} className="lg:col-span-5 space-y-6">
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <h2 className="text-lg font-bold font-display">Coordonnées directes</h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-blue-400" />
                </span>
                <span>Email : <strong>contact@afrikdev.africa</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-amber-400" />
                </span>
                <span>Téléphone : <strong className="font-mono">+221 33 820 45 90 / +225 27 22 40 18</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-rose-400" />
                </span>
                <span>Adresse : <strong>Plateau Technologique, Dakar & Abidjan Zone 4</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-purple-400" />
                </span>
                <span>Réseaux sociaux : <strong>GitHub · LinkedIn · X (@afrikdev) · Discord</strong></span>
              </div>
            </div>
          </div>

          {/* Carte Interactive des Pôles AFRIKDEV */}
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <h2 className="text-lg font-bold font-display">Carte interactive de nos pôles</h2>
            <div className="space-y-2">
              {HUBS.map((hub, idx) => (
                <button
                  key={hub.name}
                  type="button"
                  onClick={() => setActiveHubIdx(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-colors ${
                    activeHubIdx === idx
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : isLight
                      ? 'border-slate-200 hover:bg-slate-50'
                      : 'border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <p className="font-bold text-emerald-400">{hub.name}</p>
                  <p className="text-slate-400 mt-0.5">{hub.address}</p>
                  <p className="font-mono text-[11px] text-amber-400 mt-1">GPS : {hub.coords}</p>
                </button>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
};
