import { db } from './index.ts';
import {
  users,
  projects,
  collaborations,
  articles,
  articleComments,
  challenges,
  messages,
  notifications,
  reports,
  contactSubmissions,
  favorites,
} from './schema.ts';
import { eq, desc, or, and } from 'drizzle-orm';

const AVATAR_AMINA = '/src/assets/images/avatar_dev_amina_1791476226662.jpg';
const AVATAR_KOFI = '/src/assets/images/avatar_dev_kofi_1791476235659.jpg';
const IMG_FINTECH = '/src/assets/images/project_fintech_africa_1791476205058.jpg';
const IMG_AGRITECH = '/src/assets/images/project_agritech_drone_1791476216244.jpg';
const IMG_HERO = '/src/assets/images/hero_afrikdev_team_1791476192526.jpg';

export async function ensureSeeded() {
  try {
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      return;
    }

    // 1. Seed Users / Talents across Africa
    const insertedUsers = await db
      .insert(users)
      .values([
        {
          uid: 'seed_amina_diallo',
          email: 'amina.diallo@afrikdev.africa',
          firstName: 'Amina',
          lastName: 'Diallo',
          username: 'aminadiallo',
          avatar: AVATAR_AMINA,
          bio: 'Architecte Full-Stack & Tech Lead passionnée par la Fintech inclusive et les infrastructures distribuées en Afrique de l’Ouest.',
          country: 'Sénégal',
          city: 'Dakar',
          profession: 'Lead Full-Stack Engineer',
          specialty: 'Développement Web',
          technologies: 'React,Next.js,TypeScript,Node.js,PostgreSQL,Docker',
          skills: 'Architecture Microservices,API Paiement Mobile,Sécurité OAuth,Systèmes Distribués',
          experienceLevel: 'Senior',
          availability: 'Disponible',
          experiencesJson: JSON.stringify([
            {
              role: 'Lead Software Engineer',
              company: 'KosaPay Dakar',
              period: '2023 - Présent',
              summary: 'Direction technique de la passerelle de paiement UEMOA traitant +2M de transactions mensuelles.',
            },
            {
              role: 'Full-Stack Developer',
              company: 'Teranga Cloud Labs',
              period: '2020 - 2023',
              summary: 'Développement d’applications SaaS B2B en React, Next.js et Node.js.',
            },
          ]),
          certificationsJson: JSON.stringify([
            { name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', year: '2024' },
            { name: 'Professional Cloud Developer', issuer: 'Google Cloud', year: '2023' },
          ]),
          githubUrl: 'https://github.com/aminadiallo-dev',
          linkedinUrl: 'https://linkedin.com/in/aminadiallo-dev',
          portfolioUrl: 'https://aminadiallo.africa',
          role: 'admin',
          status: 'active',
          isVerified: true,
          isOnline: true,
          profileViews: 1480,
          followersCount: 342,
        },
        {
          uid: 'seed_kofi_mensah',
          email: 'kofi.mensah@afrikdev.africa',
          firstName: 'Kofi',
          lastName: 'Mensah',
          username: 'kofimensah',
          avatar: AVATAR_KOFI,
          bio: 'Ingénieur Cloud, DevOps & Cybersécurité. Automatisation Kubernetes, CI/CD souverain et résilience des réseaux bancaires.',
          country: 'Ghana',
          city: 'Accra',
          profession: 'Cloud & DevOps Architect',
          specialty: 'Cloud & DevOps',
          technologies: 'Docker,Kubernetes,Terraform,Python,Go,Linux,Cybersécurité',
          skills: 'Infrastructure as Code,Audit Pentest,CI/CD GitLab,Haute Disponibilité',
          experienceLevel: 'Expert',
          availability: 'Freelance',
          experiencesJson: JSON.stringify([
            {
              role: 'Principal DevOps Architect',
              company: 'GoldCoast Cloud Infrastructure',
              period: '2022 - Présent',
              summary: 'Déploiement de clusters multi-régions pour 14 institutions financières.',
            },
            {
              role: 'Network & Security Engineer',
              company: 'Accra CyberDefense',
              period: '2019 - 2022',
              summary: 'Sécurisation des infrastructures critiques et conformité ISO 27001.',
            },
          ]),
          certificationsJson: JSON.stringify([
            { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', year: '2024' },
            { name: 'Offensive Security Certified Professional (OSCP)', issuer: 'OffSec', year: '2022' },
          ]),
          githubUrl: 'https://github.com/kofimensah-cloud',
          linkedinUrl: 'https://linkedin.com/in/kofimensah-cloud',
          portfolioUrl: 'https://kofimensah.dev',
          role: 'member',
          status: 'active',
          isVerified: true,
          isOnline: true,
          profileViews: 1120,
          followersCount: 289,
        },
        {
          uid: 'seed_nadia_benali',
          email: 'nadia.benali@afrikdev.africa',
          firstName: 'Nadia',
          lastName: 'Benali',
          username: 'nadiabenali',
          avatar: AVATAR_AMINA,
          bio: 'Ingénieure Intelligence Artificielle & NLP spécialisée dans les langues africaines (Wolof, Swahili, Darija, Bambara) et la vision par ordinateur.',
          country: 'Maroc',
          city: 'Casablanca',
          profession: 'AI & Machine Learning Engineer',
          specialty: 'Intelligence artificielle',
          technologies: 'Python,PyTorch,FastAPI,Next.js,Docker,PostgreSQL',
          skills: 'Modèles LLM,Vision par Ordinateur,Agritech Telemetry,MLOps',
          experienceLevel: 'Senior',
          availability: 'Ouvert aux projets',
          experiencesJson: JSON.stringify([
            {
              role: 'Lead AI Researcher',
              company: 'Atlas AI Lab Casablanca',
              period: '2022 - Présent',
              summary: 'Entraînement de modèles de reconnaissance vocale multilingues pour l’inclusion rurale.',
            },
          ]),
          certificationsJson: JSON.stringify([
            { name: 'TensorFlow Developer Certificate', issuer: 'DeepLearning.AI', year: '2023' },
          ]),
          githubUrl: 'https://github.com/nadiabenali-ai',
          linkedinUrl: 'https://linkedin.com/in/nadiabenali-ai',
          portfolioUrl: 'https://nadiabenali.ai',
          role: 'member',
          status: 'active',
          isVerified: true,
          isOnline: true,
          profileViews: 985,
          followersCount: 215,
        },
        {
          uid: 'seed_jean_kouassi',
          email: 'jean.kouassi@afrikdev.africa',
          firstName: 'Jean-Marc',
          lastName: 'Kouassi',
          username: 'jmkouassi',
          avatar: AVATAR_KOFI,
          bio: 'Développeur Mobile Flutter & UI/UX Designer. Conception d’applications mobiles offline-first adaptées aux zones à faible connectivité.',
          country: 'Côte d’Ivoire',
          city: 'Abidjan',
          profession: 'Senior Mobile & UI/UX Designer',
          specialty: 'Applications mobiles',
          technologies: 'Flutter,Dart,UI/UX,Figma,Laravel,Firebase',
          skills: 'Design System,Architecture Offline-First,Prototypage Interactif,Mobile Money SDK',
          experienceLevel: 'Senior',
          availability: 'Disponible',
          experiencesJson: JSON.stringify([
            {
              role: 'Senior Mobile Engineer',
              company: 'Lagune Digital Studio',
              period: '2021 - Présent',
              summary: 'Création de 8 applications Android/iOS totalisant plus de 500 000 téléchargements.',
            },
          ]),
          certificationsJson: JSON.stringify([
            { name: 'Google UX Design Professional Certificate', issuer: 'Google', year: '2023' },
          ]),
          githubUrl: 'https://github.com/jmkouassi',
          linkedinUrl: 'https://linkedin.com/in/jmkouassi',
          portfolioUrl: 'https://jmkouassi.design',
          role: 'member',
          status: 'active',
          isVerified: true,
          isOnline: false,
          profileViews: 840,
          followersCount: 178,
        },
        {
          uid: 'seed_chidi_okonkwo',
          email: 'chidi.okonkwo@afrikdev.africa',
          firstName: 'Chidi',
          lastName: 'Okonkwo',
          username: 'chidiokonkwo',
          avatar: AVATAR_KOFI,
          bio: 'Architecte Réseaux & Télécoms et développeur Backend Laravel/Node.js. Déploiement d’infrastructures SD-WAN et ISP communautaires.',
          country: 'Nigeria',
          city: 'Lagos',
          profession: 'Network & Backend Engineer',
          specialty: 'Réseaux',
          technologies: 'Réseaux,Cisco,Linux,Laravel,Node.js,Cybersécurité',
          skills: 'BGP/OSPF,Sécurité Périmétrique,API E-commerce,MikroTik & Fibre',
          experienceLevel: 'Expert',
          availability: 'Freelance',
          experiencesJson: JSON.stringify([
            {
              role: 'Core Network Architect',
              company: 'EkoFiber Telecom',
              period: '2020 - Présent',
              summary: 'Gestion du backbone optique métropolitain et interconnexion de datacenters à Lagos.',
            },
          ]),
          certificationsJson: JSON.stringify([
            { name: 'Cisco CCNP Enterprise', issuer: 'Cisco', year: '2023' },
          ]),
          githubUrl: 'https://github.com/chidi-net',
          linkedinUrl: 'https://linkedin.com/in/chidi-net',
          portfolioUrl: 'https://chidiokonkwo.ng',
          role: 'member',
          status: 'active',
          isVerified: true,
          isOnline: true,
          profileViews: 760,
          followersCount: 164,
        },
        {
          uid: 'seed_fatou_ndiaye',
          email: 'fatou.ndiaye@afrikdev.africa',
          firstName: 'Fatou',
          lastName: 'Ndiaye',
          username: 'fatoundiaye',
          avatar: AVATAR_AMINA,
          bio: 'Product Designer UI/UX & Frontend Developer React. Je transforme des problématiques métiers complexes en interfaces simples, accessibles et rapides.',
          country: 'Rwanda',
          city: 'Kigali',
          profession: 'Product Designer UI/UX',
          specialty: 'UI/UX Design',
          technologies: 'UI/UX,React,Next.js,Tailwind CSS,Figma',
          skills: 'Recherche Utilisateur,Accessibilité WCAG,Design Systems,Frontend React',
          experienceLevel: 'Intermédiaire',
          availability: 'Disponible',
          experiencesJson: JSON.stringify([
            {
              role: 'UI/UX Product Designer',
              company: 'Kigali Innovation Hub',
              period: '2022 - Présent',
              summary: 'Refonte UX de plateformes e-santé et edtech au Rwanda et au Kenya.',
            },
          ]),
          certificationsJson: JSON.stringify([
            { name: 'Interaction Design Foundation Certified', issuer: 'IxDF', year: '2024' },
          ]),
          githubUrl: 'https://github.com/fatou-ux',
          linkedinUrl: 'https://linkedin.com/in/fatou-ux',
          portfolioUrl: 'https://fatoundiaye.rw',
          role: 'member',
          status: 'active',
          isVerified: true,
          isOnline: true,
          profileViews: 690,
          followersCount: 152,
        },
      ])
      .returning();

    const amina = insertedUsers[0];
    const kofi = insertedUsers[1];
    const nadia = insertedUsers[2];
    const jean = insertedUsers[3];
    const chidi = insertedUsers[4];

    // 2. Seed Projects
    const insertedProjects = await db
      .insert(projects)
      .values([
        {
          title: 'KosaPay — Passerelle Pan-Africaine de Micro-Paiement Unifiée',
          description: 'API et dashboard permettant aux marchands et startups d’accepter instantanément Orange Money, Wave, MTN MoMo et M-Pesa via un SDK unique avec réconciliation comptable automatisée.',
          imageUrl: IMG_FINTECH,
          authorId: amina.id,
          authorName: 'Amina Diallo',
          authorUsername: 'aminadiallo',
          technologies: 'Next.js,TypeScript,Node.js,PostgreSQL,Docker',
          country: 'Sénégal',
          category: 'Fintech & Web',
          repoUrl: 'https://github.com/afrikdev/kosapay-core',
          demoUrl: 'https://kosapay.afrikdev.africa',
          likesCount: 184,
          viewsCount: 2430,
          collaboratorsCount: 6,
          isVerified: true,
          isFeatured: true,
        },
        {
          title: 'AgriPulse AI — Télémétrie Satellitaire & Diagnostic Agricole par Drone',
          description: 'Plateforme d’analyse agronomique par intelligence artificielle combinant imagerie multispectrale et capteurs IoT solaires pour optimiser l’irrigation et détecter les maladies des cultures.',
          imageUrl: IMG_AGRITECH,
          authorId: nadia.id,
          authorName: 'Nadia Benali',
          authorUsername: 'nadiabenali',
          technologies: 'Python,PyTorch,React,Flutter,FastAPI',
          country: 'Maroc',
          category: 'Intelligence Artificielle',
          repoUrl: 'https://github.com/afrikdev/agripulse-ai',
          demoUrl: 'https://agripulse.afrikdev.africa',
          likesCount: 156,
          viewsCount: 1890,
          collaboratorsCount: 4,
          isVerified: true,
          isFeatured: true,
        },
        {
          title: 'AfriShield — Scanner Automatisé d’Audit Cybersécurité & Conformité',
          description: 'Outil open-source d’analyse de vulnérabilités applicatives (OWASP Top 10) et de surveillance réseau en temps réel conçu pour les PME et institutions financières africaines.',
          imageUrl: IMG_HERO,
          authorId: kofi.id,
          authorName: 'Kofi Mensah',
          authorUsername: 'kofimensah',
          technologies: 'Go,Docker,Kubernetes,Cybersécurité,React',
          country: 'Ghana',
          category: 'Cybersécurité & Cloud',
          repoUrl: 'https://github.com/afrikdev/afrishield-sec',
          demoUrl: 'https://afrishield.afrikdev.africa',
          likesCount: 129,
          viewsCount: 1540,
          collaboratorsCount: 5,
          isVerified: true,
          isFeatured: true,
        },
        {
          title: 'SanteConnect Offline — Dossier Médical Mobile Synchronisé',
          description: 'Application mobile Flutter fonctionnant 100% hors-ligne pour les cliniques rurales, avec synchronisation différentielle chiffrée dès que le réseau 3G/Edge est disponible.',
          imageUrl: IMG_FINTECH,
          authorId: jean.id,
          authorName: 'Jean-Marc Kouassi',
          authorUsername: 'jmkouassi',
          technologies: 'Flutter,Laravel,PostgreSQL,UI/UX',
          country: 'Côte d’Ivoire',
          category: 'Applications Mobiles',
          repoUrl: 'https://github.com/afrikdev/santeconnect-mobile',
          demoUrl: 'https://santeconnect.afrikdev.africa',
          likesCount: 112,
          viewsCount: 1320,
          collaboratorsCount: 3,
          isVerified: true,
          isFeatured: false,
        },
      ])
      .returning();

    // 3. Seed Collaborations
    await db.insert(collaborations).values([
      {
        projectId: insertedProjects[0].id,
        projectTitle: 'KosaPay — Passerelle Pan-Africaine de Micro-Paiement Unifiée',
        senderId: amina.id,
        senderName: 'Amina Diallo',
        roleNeeded: 'Ingénieur Sécurité & Cryptographie',
        skillsRequired: 'Cybersécurité, Node.js, OAuth2, PCI-DSS',
        description: 'Nous recherchons un spécialiste sécurité pour auditer nos webhooks de transaction et renforcer le chiffrement de bout en bout avant le lancement en Côte d’Ivoire.',
        status: 'open',
        progress: 75,
        teamMembersJson: JSON.stringify(['Amina Diallo', 'Kofi Mensah', 'Jean-Marc Kouassi']),
      },
      {
        projectId: insertedProjects[1].id,
        projectTitle: 'AgriPulse AI — Télémétrie Satellitaire & Diagnostic Agricole',
        senderId: nadia.id,
        senderName: 'Nadia Benali',
        roleNeeded: 'Développeur Mobile Flutter (Offline Map)',
        skillsRequired: 'Flutter, Dart, Cartographie Hors-Ligne, Bluetooth Low Energy',
        description: 'Besoin d’un développeur Flutter expérimenté pour intégrer le module de visualisation des parcelles sans connexion internet pour les coopératives agricoles.',
        status: 'open',
        progress: 60,
        teamMembersJson: JSON.stringify(['Nadia Benali', 'Fatou Ndiaye']),
      },
      {
        projectId: insertedProjects[2].id,
        projectTitle: 'AfriShield — Scanner Automatisé d’Audit Cybersécurité',
        senderId: kofi.id,
        senderName: 'Kofi Mensah',
        roleNeeded: 'UI/UX Designer & Développeur Frontend React',
        skillsRequired: 'React, Tailwind CSS, UI/UX, Visualisation de données',
        description: 'Refonte de l’interface du tableau de bord de télémétrie réseau pour faciliter la lecture des alertes critiques par les administrateurs systèmes.',
        status: 'open',
        progress: 45,
        teamMembersJson: JSON.stringify(['Kofi Mensah', 'Chidi Okonkwo']),
      },
    ]);

    // 4. Seed Articles
    const insertedArticles = await db
      .insert(articles)
      .values([
        {
          title: 'Architecture résiliente : Concevoir des APIs Fintech multi-pays en Afrique',
          excerpt: 'Guide complet sur la gestion de l’idempotence, des files d’attente asynchrones et de la latence réseau lors de l’interconnexion aux opérateurs Mobile Money.',
          content: `Construire une infrastructure de paiement en Afrique nécessite de repenser les hypothèses classiques du développement web. Entre les coupures intermittentes d'opérateurs tiers et les délais de confirmation USSD, une architecture synchrone classique échoue rapidement.\n\n1. Idempotence stricte sur chaque transaction\nChaque requête de paiement doit embarquer une clé d'idempotence unique générée côté client afin d'éviter tout double débit en cas de retransmission réseau.\n\n2. Files d'attente distribuées et Webhooks signés\nL'utilisation de workers asynchrones couplés à PostgreSQL permet de garantir la cohérence transactionnelle (ACID) tout en maintenant un temps de réponse inférieur à 150ms.`,
          coverImage: IMG_FINTECH,
          authorId: amina.id,
          authorName: 'Amina Diallo',
          authorAvatar: AVATAR_AMINA,
          category: 'Tutoriels',
          readTime: '7 min',
          viewsCount: 1640,
          likesCount: 142,
          commentsCount: 2,
          isPublished: true,
        },
        {
          title: 'IA & Langues Africaines : Entraîner des modèles NLP à faibles ressources',
          excerpt: 'Retour d’expérience sur la collecte de corpus vocaux communautaires et le fine-tuning de modèles ouverts pour le Wolof, le Swahili et le Bambara.',
          content: `L'intelligence artificielle vocale représente un levier majeur d'inclusion numérique sur le continent africain. Pourtant, la majorité des langues locales disposent de peu de données annotées.\n\nGrâce aux approches d'apprentissage auto-supervisé et à la mobilisation des développeurs sur AFRIKDEV, il est désormais possible d'atteindre d'excellents taux de reconnaissance avec seulement quelques dizaines d'heures d'audio qualifié.`,
          coverImage: IMG_AGRITECH,
          authorId: nadia.id,
          authorName: 'Nadia Benali',
          authorAvatar: AVATAR_AMINA,
          category: 'Retours d’expérience',
          readTime: '6 min',
          viewsCount: 1290,
          likesCount: 98,
          commentsCount: 1,
          isPublished: true,
        },
        {
          title: 'Sécuriser ses clusters Kubernetes et pipelines CI/CD contre les attaques Supply Chain',
          excerpt: 'Bonnes pratiques DevSecOps, signature d’images conteneurisées et isolation réseau pour les startups technologiques en forte croissance.',
          content: `La sécurité ne doit plus être une étape finale avant la mise en production. En intégrant l'analyse statique, la vérification des dépendances et le contrôle strict des accès RBAC dès le premier commit, les équipes réduisent de 80% leur surface d'attaque.`,
          coverImage: IMG_HERO,
          authorId: kofi.id,
          authorName: 'Kofi Mensah',
          authorAvatar: AVATAR_KOFI,
          category: 'Guides',
          readTime: '8 min',
          viewsCount: 980,
          likesCount: 87,
          commentsCount: 0,
          isPublished: true,
        },
      ])
      .returning();

    // 5. Seed Article Comments
    await db.insert(articleComments).values([
      {
        articleId: insertedArticles[0].id,
        userId: kofi.id,
        userName: 'Kofi Mensah',
        userAvatar: AVATAR_KOFI,
        content: 'Excellent retour technique Amina. La gestion des clés d’idempotence sur PostgreSQL nous a sauvé lors du pic de trafic de décembre.',
      },
      {
        articleId: insertedArticles[0].id,
        userId: jean.id,
        userName: 'Jean-Marc Kouassi',
        userAvatar: AVATAR_KOFI,
        content: 'Très clair ! Côté mobile Flutter, nous couplons cela avec une file SQLite locale pour rejouer la requête automatiquement.',
      },
      {
        articleId: insertedArticles[1].id,
        userId: amina.id,
        userName: 'Amina Diallo',
        userAvatar: AVATAR_AMINA,
        content: 'Bravo Nadia, hâte de tester l’API vocale Wolof dans nos prochaines interfaces accessibles !',
      },
    ]);

    // 6. Seed Challenges
    await db.insert(challenges).values([
      {
        title: 'Hackathon Pan-Africain FinTech & Inclusion Financière 2026',
        category: 'Hackathon',
        description: 'Concevez une solution open-source facilitant l’accès au micro-crédit, à l’épargne communautaire (tontines numériques) ou aux paiements transfrontaliers instantanés.',
        deadline: '30 Novembre 2026',
        participantsCount: 248,
        rewards: '5 000 € de dotation + Incubation Cloud + Mentorat Investisseurs',
        rules: 'Équipes de 1 à 4 membres résidant en Afrique ou de la diaspora. Code source hébergé sur GitHub avec démo fonctionnelle obligatoire.',
        status: 'active',
        leaderboardJson: JSON.stringify([
          { rank: 1, name: 'Team KosaPay (Sénégal)', country: 'Sénégal', score: 96, project: 'TontineChain API' },
          { rank: 2, name: 'Accra Nodes (Ghana)', country: 'Ghana', score: 93, project: 'MoMo Bridge SDK' },
          { rank: 3, name: 'Atlas AI (Maroc)', country: 'Maroc', score: 91, project: 'CreditScore Rural IA' },
          { rank: 4, name: 'Abidjan Devs (Côte d’Ivoire)', country: 'Côte d’Ivoire', score: 88, project: 'PayOffline NFC' },
        ]),
      },
      {
        title: 'Challenge IA — Santé & Diagnostic Médical Rural',
        category: 'Challenge IA',
        description: 'Développez un modèle léger capable de fonctionner sur smartphone d’entrée de gamme pour assister les agents de santé communautaires.',
        deadline: '15 Décembre 2026',
        participantsCount: 164,
        rewards: '3 500 € + Crédits GPU Cloud + Publication Officielle',
        rules: 'Modèle quantifié (< 150 Mo), temps d’inférence inférieur à 500ms sur mobile Android.',
        status: 'active',
        leaderboardJson: JSON.stringify([
          { rank: 1, name: 'Nadia Benali & Co', country: 'Maroc', score: 95, project: 'MalariaScan Edge' },
          { rank: 2, name: 'Kigali MedTech', country: 'Rwanda', score: 90, project: 'RetinaCheck Mobile' },
        ]),
      },
      {
        title: 'Challenge Cybersécurité — Audit & Défense d’Infrastructure (CTF)',
        category: 'Challenge Cybersécurité',
        description: 'Identifiez et corrigez les vulnérabilités critiques sur une architecture bancaire simulée (API REST, conteneurs Docker et pare-feu réseau).',
        deadline: '22 Décembre 2026',
        participantsCount: 119,
        rewards: '2 500 € + Certifications Sécurité Offertes',
        rules: 'Épreuve individuelle ou binôme. Rapport de remédiation complet exigé.',
        status: 'active',
        leaderboardJson: JSON.stringify([
          { rank: 1, name: 'Kofi Mensah', country: 'Ghana', score: 98, project: 'ZeroTrust Patch' },
          { rank: 2, name: 'Chidi Okonkwo', country: 'Nigeria', score: 94, project: 'NetGuard WAF' },
        ]),
      },
    ]);

    // 7. Seed Messages
    await db.insert(messages).values([
      {
        conversationKey: `${amina.id}_${kofi.id}`,
        senderId: kofi.id,
        senderName: 'Kofi Mensah',
        senderAvatar: AVATAR_KOFI,
        receiverId: amina.id,
        receiverName: 'Amina Diallo',
        receiverAvatar: AVATAR_AMINA,
        content: 'Salut Amina ! J’ai terminé la revue de l’infrastructure Terraform pour le déploiement multi-région de KosaPay. Tout est prêt.',
        isRead: false,
      },
      {
        conversationKey: `${amina.id}_${kofi.id}`,
        senderId: amina.id,
        senderName: 'Amina Diallo',
        senderAvatar: AVATAR_AMINA,
        receiverId: kofi.id,
        receiverName: 'Kofi Mensah',
        receiverAvatar: AVATAR_KOFI,
        content: 'Super nouvelle Kofi ! On fait un point technique cet après-midi avec Jean-Marc pour synchroniser le SDK mobile.',
        isRead: true,
      },
      {
        conversationKey: `${amina.id}_${nadia.id}`,
        senderId: nadia.id,
        senderName: 'Nadia Benali',
        senderAvatar: AVATAR_AMINA,
        receiverId: amina.id,
        receiverName: 'Amina Diallo',
        receiverAvatar: AVATAR_AMINA,
        content: 'Bonjour Amina, seriez-vous disponible pour collaborer sur l’intégration des paiements dans notre plateforme AgriPulse ?',
        isRead: false,
      },
    ]);

    // 8. Seed Notifications
    await db.insert(notifications).values([
      {
        userId: amina.id,
        type: 'message',
        title: 'Nouveau message de Kofi Mensah',
        message: 'J’ai terminé la revue de l’infrastructure Terraform pour le déploiement multi-région.',
        link: '/messagerie',
        isRead: false,
      },
      {
        userId: amina.id,
        type: 'collaboration',
        title: 'Nouvelle proposition de collaboration',
        message: 'Nadia Benali souhaite collaborer sur l’interconnexion API KosaPay x AgriPulse AI.',
        link: '/projets',
        isRead: false,
      },
      {
        userId: amina.id,
        type: 'follower',
        title: 'Nouveau follower',
        message: 'Jean-Marc Kouassi (Abidjan, Côte d’Ivoire) suit désormais votre profil.',
        link: '/profil/jmkouassi',
        isRead: false,
      },
      {
        userId: amina.id,
        type: 'challenge',
        title: 'Hackathon Pan-Africain FinTech 2026',
        message: 'Votre équipe figure actuellement à la 1ère place du classement provisoire !',
        link: '/challenges',
        isRead: true,
      },
      {
        userId: amina.id,
        type: 'like',
        title: 'Nouveau like sur votre article',
        message: '14 développeurs ont aimé votre guide sur les architectures Fintech résilientes.',
        link: '/articles',
        isRead: true,
      },
    ]);

    // 9. Seed Moderation Reports
    await db.insert(reports).values([
      {
        reporterId: kofi.id,
        reporterName: 'Kofi Mensah',
        targetType: 'project',
        targetId: 99,
        targetName: 'Clone Crypto Scam Bot',
        reason: 'Projet suspect ne respectant pas la charte éthique de la communauté AFRIKDEV.',
        status: 'resolved',
        adminAction: 'Contenu supprimé et compte averti par l’équipe de modération.',
      },
      {
        reporterId: nadia.id,
        reporterName: 'Nadia Benali',
        targetType: 'user',
        targetId: 105,
        targetName: 'spam_recruiter_24',
        reason: 'Envoi massif de messages commerciaux non sollicités dans la messagerie.',
        status: 'pending',
        adminAction: 'En attente de vérification administrateur',
      },
    ]);
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

export async function getOrCreateAuthUser(payload: {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  profession?: string;
  avatar?: string;
}) {
  try {
    const existing = await db.select().from(users).where(eq(users.email, payload.email)).limit(1);
    if (existing.length > 0) {
      return existing[0];
    }

    const firstName = payload.firstName || payload.email.split('@')[0];
    const lastName = payload.lastName || 'Tech';
    const baseUsername = `${firstName}${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, '') || `dev${Date.now()}`;

    const result = await db
      .insert(users)
      .values({
        uid: payload.uid,
        email: payload.email,
        firstName,
        lastName,
        username: `${baseUsername}_${Math.floor(100 + Math.random() * 899)}`,
        avatar: payload.avatar || AVATAR_AMINA,
        bio: `Professionnel de la tech (${payload.profession || 'Développeur Full-Stack'}) engagé dans la communauté AFRIKDEV.`,
        country: payload.country || 'Sénégal',
        city: 'Dakar',
        profession: payload.profession || 'Développeur Full-Stack',
        specialty: 'Développement Web',
        technologies: 'React,Next.js,TypeScript,Node.js',
        skills: 'Développement Web,Architecture Logicielle,API REST',
        experienceLevel: 'Senior',
        availability: 'Disponible',
        experiencesJson: JSON.stringify([
          {
            role: payload.profession || 'Développeur Full-Stack',
            company: 'Tech Hub Africa',
            period: '2023 - Présent',
            summary: 'Conception et développement de solutions numériques innovantes.',
          },
        ]),
        certificationsJson: JSON.stringify([
          { name: 'Verified Member AFRIKDEV', issuer: 'AFRIKDEV Community', year: '2026' },
        ]),
        githubUrl: 'https://github.com',
        linkedinUrl: 'https://linkedin.com',
        portfolioUrl: 'https://afrikdev.africa',
        role: 'member',
        status: 'active',
        isVerified: true,
        isOnline: true,
        profileViews: 45,
        followersCount: 12,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: { email: payload.email },
      })
      .returning();

    // Create a welcome notification
    if (result[0]) {
      await db.insert(notifications).values({
        userId: result[0].id,
        type: 'challenge',
        title: 'Bienvenue sur AFRIKDEV !',
        message: 'Complétez votre profil, découvrez les projets africains et rejoignez les challenges en cours.',
        link: '/dashboard',
        isRead: false,
      });
    }

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateAuthUser:', error);
    throw new Error('Impossible de récupérer ou créer le profil utilisateur.', { cause: error });
  }
}

export async function getAllUsers() {
  try {
    return await db.select().from(users).orderBy(desc(users.profileViews));
  } catch (error) {
    console.error('Database query failed in getAllUsers:', error);
    throw new Error('Impossible de charger les talents.', { cause: error });
  }
}

export async function getAllProjects() {
  try {
    return await db.select().from(projects).orderBy(desc(projects.likesCount));
  } catch (error) {
    console.error('Database query failed in getAllProjects:', error);
    throw new Error('Impossible de charger les projets.', { cause: error });
  }
}

export async function getAllCollaborations() {
  try {
    return await db.select().from(collaborations).orderBy(desc(collaborations.createdAt));
  } catch (error) {
    console.error('Database query failed in getAllCollaborations:', error);
    throw new Error('Impossible de charger les collaborations.', { cause: error });
  }
}

export async function getAllArticles() {
  try {
    return await db.select().from(articles).orderBy(desc(articles.createdAt));
  } catch (error) {
    console.error('Database query failed in getAllArticles:', error);
    throw new Error('Impossible de charger les articles.', { cause: error });
  }
}

export async function getAllArticleComments() {
  try {
    return await db.select().from(articleComments).orderBy(desc(articleComments.createdAt));
  } catch (error) {
    console.error('Database query failed in getAllArticleComments:', error);
    throw new Error('Impossible de charger les commentaires.', { cause: error });
  }
}

export async function getAllChallenges() {
  try {
    return await db.select().from(challenges).orderBy(desc(challenges.participantsCount));
  } catch (error) {
    console.error('Database query failed in getAllChallenges:', error);
    throw new Error('Impossible de charger les challenges.', { cause: error });
  }
}

export async function getUserMessages(userId: number) {
  try {
    return await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(messages.createdAt);
  } catch (error) {
    console.error('Database query failed in getUserMessages:', error);
    throw new Error('Impossible de charger la messagerie.', { cause: error });
  }
}

export async function getUserNotifications(userId: number) {
  try {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  } catch (error) {
    console.error('Database query failed in getUserNotifications:', error);
    throw new Error('Impossible de charger les notifications.', { cause: error });
  }
}

export async function getAllReports() {
  try {
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  } catch (error) {
    console.error('Database query failed in getAllReports:', error);
    throw new Error('Impossible de charger les signalements.', { cause: error });
  }
}

export async function getUserFavorites(userId: number) {
  try {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  } catch (error) {
    console.error('Database query failed in getUserFavorites:', error);
    throw new Error('Impossible de charger les favoris.', { cause: error });
  }
}

export { eq, desc, or, and };
