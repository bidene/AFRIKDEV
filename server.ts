import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/db/index.ts';
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
} from './src/db/schema.ts';
import {
  ensureSeeded,
  getOrCreateAuthUser,
  getAllUsers,
  getAllProjects,
  getAllCollaborations,
  getAllArticles,
  getAllArticleComments,
  getAllChallenges,
  getUserMessages,
  getUserNotifications,
  getAllReports,
  getUserFavorites,
  eq,
  and,
} from './src/db/queries.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // SEO robots.txt & sitemap.xml
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: https://afrikdev.africa/sitemap.xml`);
  });

  app.get('/sitemap.xml', (_req, res) => {
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://afrikdev.africa/</loc><priority>1.0</priority></url>
  <url><loc>https://afrikdev.africa/talents</loc><priority>0.9</priority></url>
  <url><loc>https://afrikdev.africa/projets</loc><priority>0.9</priority></url>
  <url><loc>https://afrikdev.africa/services</loc><priority>0.8</priority></url>
  <url><loc>https://afrikdev.africa/articles</loc><priority>0.8</priority></url>
  <url><loc>https://afrikdev.africa/challenges</loc><priority>0.8</priority></url>
  <url><loc>https://afrikdev.africa/a-propos</loc><priority>0.7</priority></url>
  <url><loc>https://afrikdev.africa/contact</loc><priority>0.7</priority></url>
  <url><loc>https://afrikdev.africa/faq</loc><priority>0.6</priority></url>
</urlset>`);
  });

  // Public bootstrap endpoint: seeds database on first request and returns community data
  app.get('/api/bootstrap', async (_req, res) => {
    try {
      await ensureSeeded();
      const [
        allUsers,
        allProjects,
        allCollaborations,
        allArticles,
        allComments,
        allChallenges,
        allReports,
      ] = await Promise.all([
        getAllUsers(),
        getAllProjects(),
        getAllCollaborations(),
        getAllArticles(),
        getAllArticleComments(),
        getAllChallenges(),
        getAllReports(),
      ]);

      res.json({
        users: allUsers,
        projects: allProjects,
        collaborations: allCollaborations,
        articles: allArticles,
        comments: allComments,
        challenges: allChallenges,
        reports: allReports,
      });
    } catch (error: any) {
      console.error('Bootstrap error:', error);
      res.status(500).json({ error: error.message || 'Erreur lors du chargement des données.' });
    }
  });

  // Auth sync & registration
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      await ensureSeeded();
      const { firstName, lastName, country, profession, avatar } = req.body;
      const uid = req.user?.uid || `uid_${Date.now()}`;
      const email = req.user?.email || req.body.email || 'membre@afrikdev.africa';

      const dbUser = await getOrCreateAuthUser({
        uid,
        email,
        firstName,
        lastName,
        country,
        profession,
        avatar,
      });

      const [userMessages, userNotifications, userFavorites] = await Promise.all([
        getUserMessages(dbUser.id),
        getUserNotifications(dbUser.id),
        getUserFavorites(dbUser.id),
      ]);

      res.json({
        user: dbUser,
        messages: userMessages,
        notifications: userNotifications,
        favorites: userFavorites,
      });
    } catch (error: any) {
      console.error('Auth sync error:', error);
      res.status(500).json({ error: error.message || 'Erreur de synchronisation du profil.' });
    }
  });

  // Update User Profile / Settings
  app.put('/api/users/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const userId = Number(req.params.id);
      const {
        firstName,
        lastName,
        bio,
        country,
        city,
        profession,
        specialty,
        technologies,
        skills,
        experienceLevel,
        availability,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
      } = req.body;

      const updated = await db
        .update(users)
        .set({
          firstName,
          lastName,
          bio,
          country,
          city,
          profession,
          specialty,
          technologies,
          skills,
          experienceLevel,
          availability,
          githubUrl,
          linkedinUrl,
          portfolioUrl,
        })
        .where(eq(users.id, userId))
        .returning();

      res.json(updated[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Impossible de mettre à jour le profil.' });
    }
  });

  // Follow user
  app.post('/api/users/:id/follow', requireAuth, async (req: AuthRequest, res) => {
    try {
      const targetId = Number(req.params.id);
      const { followerName } = req.body;
      const targetUsers = await db.select().from(users).where(eq(users.id, targetId)).limit(1);
      if (!targetUsers[0]) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }
      const newCount = targetUsers[0].followersCount + 1;
      const updated = await db
        .update(users)
        .set({ followersCount: newCount })
        .where(eq(users.id, targetId))
        .returning();

      await db.insert(notifications).values({
        userId: targetId,
        type: 'follower',
        title: 'Nouveau follower',
        message: `${followerName || 'Un membre AFRIKDEV'} suit désormais votre profil.`,
        link: `/profil/${targetUsers[0].username}`,
        isRead: false,
      });

      res.json(updated[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors du suivi.' });
    }
  });

  // Create a new Project
  app.post('/api/projects', requireAuth, async (req: AuthRequest, res) => {
    try {
      const {
        title,
        description,
        imageUrl,
        authorId,
        authorName,
        authorUsername,
        technologies,
        country,
        category,
        repoUrl,
        demoUrl,
      } = req.body;

      const created = await db
        .insert(projects)
        .values({
          title,
          description,
          imageUrl: imageUrl || '/src/assets/images/project_fintech_africa_1791476205058.jpg',
          authorId: Number(authorId),
          authorName,
          authorUsername,
          technologies,
          country,
          category: category || 'Développement Web',
          repoUrl: repoUrl || 'https://github.com/afrikdev',
          demoUrl: demoUrl || 'https://afrikdev.africa',
          likesCount: 1,
          viewsCount: 12,
          collaboratorsCount: 1,
          isVerified: true,
          isFeatured: false,
        })
        .returning();

      res.json(created[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de la publication du projet.' });
    }
  });

  // Like a Project
  app.post('/api/projects/:id/like', requireAuth, async (req: AuthRequest, res) => {
    try {
      const projectId = Number(req.params.id);
      const existing = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
      if (!existing[0]) return res.status(404).json({ error: 'Projet introuvable' });

      const updated = await db
        .update(projects)
        .set({
          likesCount: existing[0].likesCount + 1,
          viewsCount: existing[0].viewsCount + 3,
        })
        .where(eq(projects.id, projectId))
        .returning();

      await db.insert(notifications).values({
        userId: existing[0].authorId,
        type: 'like',
        title: 'Nouveau like sur votre projet',
        message: `Votre projet "${existing[0].title}" a reçu un nouveau soutien de la communauté.`,
        link: '/projets',
        isRead: false,
      });

      res.json(updated[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors du like.' });
    }
  });

  // Create Collaboration / Opportunity or Request
  app.post('/api/collaborations', requireAuth, async (req: AuthRequest, res) => {
    try {
      const {
        projectId,
        projectTitle,
        senderId,
        senderName,
        receiverId,
        roleNeeded,
        skillsRequired,
        description,
      } = req.body;

      const created = await db
        .insert(collaborations)
        .values({
          projectId: projectId ? Number(projectId) : null,
          projectTitle,
          senderId: Number(senderId),
          senderName,
          receiverId: receiverId ? Number(receiverId) : null,
          roleNeeded,
          skillsRequired,
          description,
          status: receiverId ? 'pending' : 'open',
          progress: 30,
          teamMembersJson: JSON.stringify([senderName]),
        })
        .returning();

      if (receiverId) {
        await db.insert(notifications).values({
          userId: Number(receiverId),
          type: 'collaboration',
          title: 'Nouvelle demande de collaboration',
          message: `${senderName} vous invite à collaborer sur "${projectTitle}" (${roleNeeded}).`,
          link: '/dashboard',
          isRead: false,
        });
      }

      res.json(created[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de la création de la collaboration.' });
    }
  });

  // Accept / Decline Collaboration
  app.patch('/api/collaborations/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const collabId = Number(req.params.id);
      const { status, memberName, progress } = req.body;
      const existing = await db
        .select()
        .from(collaborations)
        .where(eq(collaborations.id, collabId))
        .limit(1);

      if (!existing[0]) return res.status(404).json({ error: 'Collaboration introuvable' });

      let members: string[] = [];
      try {
        members = JSON.parse(existing[0].teamMembersJson);
      } catch {
        members = [existing[0].senderName];
      }

      if (status === 'accepted' && memberName && !members.includes(memberName)) {
        members.push(memberName);
      }

      const updated = await db
        .update(collaborations)
        .set({
          status: status || existing[0].status,
          progress: typeof progress === 'number' ? progress : existing[0].progress,
          teamMembersJson: JSON.stringify(members),
        })
        .where(eq(collaborations.id, collabId))
        .returning();

      await db.insert(notifications).values({
        userId: existing[0].senderId,
        type: 'collaboration',
        title: `Collaboration ${status === 'accepted' ? 'acceptée' : 'mise à jour'}`,
        message: `Le statut de "${existing[0].projectTitle}" a été mis à jour (${status}).`,
        link: '/dashboard',
        isRead: false,
      });

      res.json(updated[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur de mise à jour de la collaboration.' });
    }
  });

  // Create Article
  app.post('/api/articles', requireAuth, async (req: AuthRequest, res) => {
    try {
      const {
        title,
        excerpt,
        content,
        coverImage,
        authorId,
        authorName,
        authorAvatar,
        category,
        readTime,
      } = req.body;

      const created = await db
        .insert(articles)
        .values({
          title,
          excerpt,
          content,
          coverImage: coverImage || '/src/assets/images/hero_afrikdev_team_1791476192526.jpg',
          authorId: Number(authorId),
          authorName,
          authorAvatar: authorAvatar || '/src/assets/images/avatar_dev_amina_1791476226662.jpg',
          category: category || 'Articles',
          readTime: readTime || '5 min',
          viewsCount: 15,
          likesCount: 1,
          commentsCount: 0,
          isPublished: true,
        })
        .returning();

      res.json(created[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de la publication de l’article.' });
    }
  });

  // Like or Comment Article
  app.post('/api/articles/:id/like', requireAuth, async (req: AuthRequest, res) => {
    try {
      const articleId = Number(req.params.id);
      const existing = await db.select().from(articles).where(eq(articles.id, articleId)).limit(1);
      if (!existing[0]) return res.status(404).json({ error: 'Article introuvable' });

      const updated = await db
        .update(articles)
        .set({
          likesCount: existing[0].likesCount + 1,
          viewsCount: existing[0].viewsCount + 2,
        })
        .where(eq(articles.id, articleId))
        .returning();

      res.json(updated[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors du like.' });
    }
  });

  app.post('/api/articles/:id/comments', requireAuth, async (req: AuthRequest, res) => {
    try {
      const articleId = Number(req.params.id);
      const { userId, userName, userAvatar, content } = req.body;

      const created = await db
        .insert(articleComments)
        .values({
          articleId,
          userId: Number(userId),
          userName,
          userAvatar: userAvatar || '/src/assets/images/avatar_dev_amina_1791476226662.jpg',
          content,
        })
        .returning();

      const existing = await db.select().from(articles).where(eq(articles.id, articleId)).limit(1);
      if (existing[0]) {
        await db
          .update(articles)
          .set({ commentsCount: existing[0].commentsCount + 1 })
          .where(eq(articles.id, articleId));

        await db.insert(notifications).values({
          userId: existing[0].authorId,
          type: 'comment',
          title: 'Nouveau commentaire sur votre article',
          message: `${userName} a commenté "${existing[0].title}".`,
          link: '/articles',
          isRead: false,
        });
      }

      res.json(created[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de l’ajout du commentaire.' });
    }
  });

  // Join Challenge
  app.post('/api/challenges/:id/join', requireAuth, async (req: AuthRequest, res) => {
    try {
      const challengeId = Number(req.params.id);
      const { userId, userName, country, projectName } = req.body;
      const existing = await db
        .select()
        .from(challenges)
        .where(eq(challenges.id, challengeId))
        .limit(1);

      if (!existing[0]) return res.status(404).json({ error: 'Challenge introuvable' });

      let leaderboard: any[] = [];
      try {
        leaderboard = JSON.parse(existing[0].leaderboardJson);
      } catch {
        leaderboard = [];
      }

      if (!leaderboard.some((item) => item.name === userName)) {
        leaderboard.push({
          rank: leaderboard.length + 1,
          name: userName,
          country: country || 'Sénégal',
          score: 85,
          project: projectName || 'Solution Innovation Africa',
        });
      }

      const updated = await db
        .update(challenges)
        .set({
          participantsCount: existing[0].participantsCount + 1,
          leaderboardJson: JSON.stringify(leaderboard),
        })
        .where(eq(challenges.id, challengeId))
        .returning();

      if (userId) {
        await db.insert(notifications).values({
          userId: Number(userId),
          type: 'challenge',
          title: 'Inscription au challenge confirmée',
          message: `Vous participez désormais à "${existing[0].title}". Bonne chance !`,
          link: '/challenges',
          isRead: false,
        });
      }

      res.json(updated[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de la participation au challenge.' });
    }
  });

  // Create Challenge (Admin)
  app.post('/api/challenges', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { title, category, description, deadline, rewards, rules } = req.body;
      const created = await db
        .insert(challenges)
        .values({
          title,
          category: category || 'Hackathon',
          description,
          deadline,
          participantsCount: 1,
          rewards,
          rules,
          status: 'active',
          leaderboardJson: JSON.stringify([]),
        })
        .returning();

      res.json(created[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de la création du challenge.' });
    }
  });

  // Send Private Message
  app.post('/api/messages', requireAuth, async (req: AuthRequest, res) => {
    try {
      const {
        senderId,
        senderName,
        senderAvatar,
        receiverId,
        receiverName,
        receiverAvatar,
        content,
      } = req.body;

      const sId = Number(senderId);
      const rId = Number(receiverId);
      const key = sId < rId ? `${sId}_${rId}` : `${rId}_${sId}`;

      const created = await db
        .insert(messages)
        .values({
          conversationKey: key,
          senderId: sId,
          senderName,
          senderAvatar: senderAvatar || '/src/assets/images/avatar_dev_amina_1791476226662.jpg',
          receiverId: rId,
          receiverName,
          receiverAvatar: receiverAvatar || '/src/assets/images/avatar_dev_kofi_1791476235659.jpg',
          content,
          isRead: false,
        })
        .returning();

      await db.insert(notifications).values({
        userId: rId,
        type: 'message',
        title: `Nouveau message de ${senderName}`,
        message: content.slice(0, 90),
        link: '/messagerie',
        isRead: false,
      });

      res.json(created[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de l’envoi du message.' });
    }
  });

  // Delete Conversation
  app.delete('/api/messages/conversation/:key', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { key } = req.params;
      await db.delete(messages).where(eq(messages.conversationKey, key));
      res.json({ deleted: true });
    } catch (error: any) {
      res.status(500).json({ error: 'Impossible de supprimer la conversation.' });
    }
  });

  // Mark Notification Read
  app.patch('/api/notifications/:id/read', requireAuth, async (req: AuthRequest, res) => {
    try {
      const notifId = Number(req.params.id);
      const updated = await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, notifId))
        .returning();
      res.json(updated[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur de mise à jour de la notification.' });
    }
  });

  // Toggle Favorite
  app.post('/api/favorites/toggle', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { userId, itemType, itemId } = req.body;
      const existing = await db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.userId, Number(userId)),
            eq(favorites.itemType, itemType),
            eq(favorites.itemId, Number(itemId))
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db.delete(favorites).where(eq(favorites.id, existing[0].id));
        return res.json({ favorited: false });
      } else {
        const created = await db
          .insert(favorites)
          .values({
            userId: Number(userId),
            itemType,
            itemId: Number(itemId),
          })
          .returning();
        return res.json({ favorited: true, favorite: created[0] });
      }
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de la gestion des favoris.' });
    }
  });

  // Contact Form Submission
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
      }
      const created = await db
        .insert(contactSubmissions)
        .values({ name, email, subject, message })
        .returning();
      res.json(created[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de l’envoi du message de contact.' });
    }
  });

  // Create Moderation Report
  app.post('/api/reports', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { reporterId, reporterName, targetType, targetId, targetName, reason } = req.body;
      const created = await db
        .insert(reports)
        .values({
          reporterId: Number(reporterId),
          reporterName,
          targetType,
          targetId: Number(targetId),
          targetName,
          reason,
          status: 'pending',
          adminAction: 'Signalement enregistré pour revue modérateur',
        })
        .returning();
      res.json(created[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de l’envoi du signalement.' });
    }
  });

  // Admin Moderation & Management Endpoints
  app.patch('/api/admin/users/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const userId = Number(req.params.id);
      const { status, isVerified, role } = req.body;
      const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!existing[0]) return res.status(404).json({ error: 'Utilisateur introuvable' });

      const updated = await db
        .update(users)
        .set({
          status: status ?? existing[0].status,
          isVerified: typeof isVerified === 'boolean' ? isVerified : existing[0].isVerified,
          role: role ?? existing[0].role,
        })
        .where(eq(users.id, userId))
        .returning();
      res.json(updated[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Action administrateur échouée.' });
    }
  });

  app.delete('/api/admin/users/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const userId = Number(req.params.id);
      await db.delete(users).where(eq(users.id, userId));
      res.json({ deleted: true });
    } catch (error: any) {
      res.status(500).json({ error: 'Suppression impossible (utilisateur lié à des projets).' });
    }
  });

  app.patch('/api/admin/projects/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const projectId = Number(req.params.id);
      const { isVerified, isFeatured } = req.body;
      const existing = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
      if (!existing[0]) return res.status(404).json({ error: 'Projet introuvable' });

      const updated = await db
        .update(projects)
        .set({
          isVerified: typeof isVerified === 'boolean' ? isVerified : existing[0].isVerified,
          isFeatured: typeof isFeatured === 'boolean' ? isFeatured : existing[0].isFeatured,
        })
        .where(eq(projects.id, projectId))
        .returning();
      res.json(updated[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Mise à jour du projet échouée.' });
    }
  });

  app.delete('/api/admin/projects/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const projectId = Number(req.params.id);
      await db.delete(collaborations).where(eq(collaborations.projectId, projectId));
      await db.delete(projects).where(eq(projects.id, projectId));
      res.json({ deleted: true });
    } catch (error: any) {
      res.status(500).json({ error: 'Suppression du projet échouée.' });
    }
  });

  app.patch('/api/admin/articles/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const articleId = Number(req.params.id);
      const { isPublished } = req.body;
      const updated = await db
        .update(articles)
        .set({ isPublished: Boolean(isPublished) })
        .where(eq(articles.id, articleId))
        .returning();
      res.json(updated[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Mise à jour de l’article échouée.' });
    }
  });

  app.delete('/api/admin/articles/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const articleId = Number(req.params.id);
      await db.delete(articleComments).where(eq(articleComments.articleId, articleId));
      await db.delete(articles).where(eq(articles.id, articleId));
      res.json({ deleted: true });
    } catch (error: any) {
      res.status(500).json({ error: 'Suppression de l’article échouée.' });
    }
  });

  app.patch('/api/admin/reports/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const reportId = Number(req.params.id);
      const { status, adminAction } = req.body;
      const updated = await db
        .update(reports)
        .set({ status, adminAction })
        .where(eq(reports.id, reportId))
        .returning();
      res.json(updated[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Action de modération échouée.' });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AFRIKDEV Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
