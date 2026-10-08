import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';
import { ALL_AFRICAN_COUNTRIES, ALL_WORLD_AND_DIASPORA_COUNTRIES } from '../constants/countries.ts';
import { AfrikdevLogo } from '../components/AfrikdevLogo.tsx';
import { ShieldCheck, Lock, Mail, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithCredentials, loginWithGoogle, theme } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('amina.diallo@afrikdev.africa');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const isLight = theme === 'light';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithCredentials(email, rememberMe);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div
        className={`p-8 rounded-2xl border space-y-6 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/70 border-slate-800'
        }`}
      >
        <div className="space-y-2 text-center">
          <div className="flex justify-center pb-1">
            <AfrikdevLogo size="lg" showWordmark={false} />
          </div>
          <p className="text-xs font-mono text-emerald-500">AUTHENTIFICATION SÉCURISÉE</p>
          <h1 className="text-2xl font-extrabold font-display">Connexion à AFRIKDEV</h1>
          <p className="text-xs text-slate-400">
            Accédez à votre tableau de bord, vos projets et votre messagerie.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
              }`}
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600"
              />
              <span>Se souvenir de moi</span>
            </label>
            <Link to="/mot-de-passe-oublie" className="text-emerald-500 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
          >
            Se connecter
          </button>
        </form>

        <div className="relative py-1 text-center">
          <span className="text-xs text-slate-500">ou continuer avec</span>
        </div>

        <button
          type="button"
          onClick={async () => {
            await loginWithGoogle();
            navigate('/dashboard');
          }}
          className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
            isLight
              ? 'border-slate-300 hover:bg-slate-100 text-slate-800'
              : 'border-slate-700 hover:bg-slate-800 text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Google Sign-In (Firebase OAuth)</span>
        </button>

        <p className="text-center text-xs text-slate-400">
          Pas encore membre ?{' '}
          <Link to="/inscription" className="text-emerald-500 font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { registerAccount, theme } = useApp();
  const navigate = useNavigate();

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Sénégal');
  const [profession, setProfession] = useState('Développeur Full-Stack');

  const isLight = theme === 'light';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerAccount({ firstName, lastName, email, country, profession });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-14">
      <div
        className={`p-8 rounded-2xl border space-y-6 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/70 border-slate-800'
        }`}
      >
        <div className="space-y-2 text-center">
          <div className="flex justify-center pb-1">
            <AfrikdevLogo size="lg" showWordmark={false} />
          </div>
          <p className="text-xs font-mono text-emerald-500">REJOINDRE LA COMMUNAUTÉ</p>
          <h1 className="text-2xl font-extrabold font-display">Inscription sur AFRIKDEV</h1>
          <p className="text-xs text-slate-400">
            Créez votre profil professionnel et collaborez avec les talents tech du continent.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nom</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ex: Diallo"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
                }`}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ex: Mamadou"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Email professionnel</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@domaine.com"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Mot de passe sécurisé</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 caractères"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Pays</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              >
                <optgroup label="Afrique (54 pays)">
                  {ALL_AFRICAN_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Diaspora & Reste du monde">
                  {ALL_WORLD_AND_DIASPORA_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Profession</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Ex: Ingénieur DevOps / UI Designer"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
                }`}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="pro-max-btn w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
          >
            Créer mon compte et vérifier mon email
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Déjà inscrit ?{' '}
          <Link to="/connexion" className="text-emerald-500 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { theme, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const isLight = theme === 'light';

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast(`Lien de réinitialisation envoyé à ${email}`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div
        className={`p-8 rounded-2xl border space-y-6 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/70 border-slate-800'
        }`}
      >
        <div className="space-y-2 text-center">
          <Lock className="w-8 h-8 text-emerald-500 mx-auto" />
          <h1 className="text-2xl font-extrabold font-display">Mot de passe oublié</h1>
          <p className="text-xs text-slate-400">
            Entrez votre adresse email pour recevoir un lien sécurisé de réinitialisation.
          </p>
        </div>

        {sent ? (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Email de réinitialisation envoyé</span>
            </div>
            <p>
              Vérifiez votre boîte de réception ({email}) et suivez les instructions pour définir
              votre nouveau mot de passe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Email du compte</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@domaine.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
            >
              Réinitialiser le mot de passe
            </button>
          </form>
        )}

        <div className="text-center">
          <Link to="/connexion" className="text-xs text-emerald-500 hover:underline">
            ← Retour à la page de connexion
          </Link>
        </div>
      </div>
    </div>
  );
};
