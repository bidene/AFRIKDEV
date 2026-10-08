/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.tsx';
import { Layout } from './components/Layout.tsx';
import { SplashScreen } from './components/SplashScreen.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { TalentsPage } from './pages/TalentsPage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { ArticlesPage } from './pages/ArticlesPage.tsx';
import { ChallengesPage } from './pages/ChallengesPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { FaqPage } from './pages/FaqPage.tsx';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/AuthPages.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { MessagingPage, NotificationsPage, SettingsPage } from './pages/MemberPages.tsx';
import { AdminPage } from './pages/AdminPage.tsx';

export default function App() {
  return (
    <AppProvider>
      <SplashScreen />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* 1. Accueil */}
            <Route path="/" element={<HomePage />} />
            {/* 2. À propos */}
            <Route path="/a-propos" element={<AboutPage />} />
            {/* 3. Découvrir les talents */}
            <Route path="/talents" element={<TalentsPage />} />
            {/* 4. Projets & Collaborations */}
            <Route path="/projets" element={<ProjectsPage />} />
            {/* 5. Services */}
            <Route path="/services" element={<ServicesPage />} />
            {/* 6. Articles */}
            <Route path="/articles" element={<ArticlesPage />} />
            {/* 7. Challenges */}
            <Route path="/challenges" element={<ChallengesPage />} />
            {/* 8. Contact */}
            <Route path="/contact" element={<ContactPage />} />
            {/* 9. FAQ */}
            <Route path="/faq" element={<FaqPage />} />
            {/* 10. Connexion */}
            <Route path="/connexion" element={<LoginPage />} />
            {/* 11. Inscription */}
            <Route path="/inscription" element={<RegisterPage />} />
            {/* 12. Mot de passe oublié */}
            <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
            {/* 13. Profil utilisateur */}
            <Route path="/profil/:username" element={<ProfilePage />} />
            <Route path="/profil" element={<ProfilePage />} />
            {/* 14. Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* 15. Messagerie */}
            <Route path="/messagerie" element={<MessagingPage />} />
            {/* 16. Notifications */}
            <Route path="/notifications" element={<NotificationsPage />} />
            {/* 17. Paramètres */}
            <Route path="/parametres" element={<SettingsPage />} />
            {/* 18. Administration */}
            <Route path="/admin" element={<AdminPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
