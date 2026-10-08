import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext.tsx';
import { PageTransition, EASE_OUT_EXPO } from './MotionPrimitives.tsx';
import { AfrikdevLogo } from './AfrikdevLogo.tsx';
import {
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  MessageSquare,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Mail,
  Info,
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, theme, toggleTheme, notifications, messages, toast, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const unreadMessages = messages.filter(
    (m) => m.receiverId === currentUser?.id && !m.isRead
  ).length;

  const isLight = theme === 'light';

  const navLinks = [
    { label: 'Talents', path: '/talents' },
    { label: 'Projets', path: '/projets' },
    { label: 'Services', path: '/services' },
    { label: 'Articles', path: '/articles' },
    { label: 'Challenges', path: '/challenges' },
  ];

  const secondaryLinks = [
    { label: 'À propos', path: '/a-propos', icon: Info, color: 'text-cyan-400' },
    { label: 'Contact', path: '/contact', icon: Mail, color: 'text-amber-400' },
    { label: 'FAQ', path: '/faq', icon: HelpCircle, color: 'text-purple-400' },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-blue-400' },
    { label: 'Messagerie', path: '/messagerie', icon: MessageSquare, color: 'text-pink-400' },
    { label: 'Notifications', path: '/notifications', icon: Bell, color: 'text-orange-400' },
    { label: 'Paramètres', path: '/parametres', icon: Settings, color: 'text-indigo-400' },
    { label: 'Administration', path: '/admin', icon: ShieldCheck, color: 'text-rose-400' },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      {/* Top Bar Contract: Zone 1 (Single wordmark) — Zone 2 (5 text nav links + More dropdown) — Zone 3 (Primary Actions) */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isLight
            ? 'bg-white/90 border-slate-200 text-slate-900'
            : 'bg-slate-950/90 border-slate-800/80 text-slate-100'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Logo + Wordmark */}
          <Link
            to="/"
            className="whitespace-nowrap shrink-0"
          >
            <AfrikdevLogo size="md" />
          </Link>

          {/* Zone 2: 5 Single-Line Navigation Links + More Dropdown */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative whitespace-nowrap transition-colors py-1.5 ${
                    active
                      ? 'text-emerald-500 font-semibold'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-underline"
                      transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                    />
                  )}
                </Link>
              );
            })}

            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                className={`flex items-center gap-1 whitespace-nowrap py-1 transition-colors ${
                  isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Espaces</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {moreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: EASE_OUT_EXPO }}
                    onMouseLeave={() => setMoreMenuOpen(false)}
                    className={`absolute right-0 mt-2 w-56 rounded-xl border p-2 shadow-xl z-50 ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    {secondaryLinks.map((sec) => {
                      const Icon = sec.icon;
                      return (
                        <Link
                          key={sec.path}
                          to={sec.path}
                          onClick={() => setMoreMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isLight
                              ? 'text-slate-700 hover:bg-slate-100'
                              : 'text-slate-200 hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${sec.color}`} />
                            {sec.label}
                          </span>
                          {sec.path === '/notifications' && unreadNotifs > 0 && (
                            <span className="font-mono text-[11px] text-amber-500 font-semibold">
                              {unreadNotifs}
                            </span>
                          )}
                          {sec.path === '/messagerie' && unreadMessages > 0 && (
                            <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                              {unreadMessages}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                    {currentUser && (
                      <>
                        <div className={`my-1 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`} />
                        <Link
                          to={`/profil/${currentUser.username}`}
                          onClick={() => setMoreMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-200 hover:bg-slate-800'
                          }`}
                        >
                          <User className="w-4 h-4 text-emerald-500" />
                          Mon Profil Public
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            logout();
                            navigate('/connexion');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Zone 3: 1-2 Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Basculer le thème clair ou sombre"
              className={`p-2 rounded-lg border transition-colors ${
                isLight
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2.5">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap"
                >
                  Mon Dashboard
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/connexion"
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap"
                >
                  Rejoindre la communauté
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Menu mobile"
              className={`lg:hidden p-2 rounded-lg border ${
                isLight ? 'border-slate-200 text-slate-800' : 'border-slate-800 text-slate-200'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-b px-4 py-4 space-y-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-emerald-600 text-white'
                      : isLight
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {secondaryLinks.map((sec) => (
                <Link
                  key={sec.path}
                  to={sec.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === sec.path
                      ? 'bg-emerald-600 text-white'
                      : isLight
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {sec.label}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-800/40 flex items-center gap-2">
              <Link
                to="/connexion"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-semibold rounded-lg border border-emerald-500/40 text-emerald-500"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white"
              >
                Inscription
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Feedback Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
            className="fixed bottom-5 right-5 z-50 max-w-md bg-emerald-950 border border-emerald-500/50 text-emerald-100 px-4 py-3 rounded-xl shadow-2xl text-sm flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with PageTransition */}
      <main className="flex-1">
        <PageTransition routeKey={location.pathname}>{children}</PageTransition>
      </main>

      {/* Quiet Footer with all 18 pages accessible */}
      <footer
        className={`border-t mt-20 py-14 text-sm ${
          isLight
            ? 'bg-slate-100 border-slate-200 text-slate-600'
            : 'bg-slate-950 border-slate-800/80 text-slate-400'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-3">
            <Link to="/" className="inline-block">
              <AfrikdevLogo size="md" />
            </Link>
            <p className="text-xs font-medium text-amber-500">
              « Construire l’Afrique numérique, un projet à la fois. »
            </p>
            <p className="text-xs leading-relaxed max-w-sm">
              La communauté numérique africaine dédiée aux développeurs, designers, administrateurs
              réseaux, ingénieurs cloud, freelances et startups technologiques du continent et de la
              diaspora.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Plateforme & Découverte
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-emerald-500">1. Accueil</Link></li>
              <li><Link to="/a-propos" className="hover:text-emerald-500">2. À propos</Link></li>
              <li><Link to="/talents" className="hover:text-emerald-500">3. Découvrir les talents</Link></li>
              <li><Link to="/projets" className="hover:text-emerald-500">4. Projets & Collaborations</Link></li>
              <li><Link to="/services" className="hover:text-emerald-500">5. Services Tech</Link></li>
              <li><Link to="/articles" className="hover:text-emerald-500">6. Articles & Tutoriels</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Communauté & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/challenges" className="hover:text-emerald-500">7. Challenges AFRIKDEV</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-500">8. Contact</Link></li>
              <li><Link to="/faq" className="hover:text-emerald-500">9. FAQ</Link></li>
              <li><Link to="/connexion" className="hover:text-emerald-500">10. Connexion</Link></li>
              <li><Link to="/inscription" className="hover:text-emerald-500">11. Inscription</Link></li>
              <li><Link to="/mot-de-passe-oublie" className="hover:text-emerald-500">12. Mot de passe oublié</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Espace Membre & Admin
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={`/profil/${currentUser?.username || 'aminadiallo'}`} className="hover:text-emerald-500">
                  13. Profil utilisateur
                </Link>
              </li>
              <li><Link to="/dashboard" className="hover:text-emerald-500">14. Tableau de bord</Link></li>
              <li><Link to="/messagerie" className="hover:text-emerald-500">15. Messagerie interne</Link></li>
              <li><Link to="/notifications" className="hover:text-emerald-500">16. Notifications</Link></li>
              <li><Link to="/parametres" className="hover:text-emerald-500">17. Paramètres du compte</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-500">18. Administration</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© 2026 AFRIKDEV — La communauté numérique africaine. Tous droits réservés.</p>
          <p className="text-slate-500">
            Découverte · Connexion · Collaboration · Création · Opportunités
          </p>
        </div>
      </footer>
    </div>
  );
};
