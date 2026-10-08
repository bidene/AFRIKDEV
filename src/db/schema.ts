import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 1. Users / Talents Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID or unique user identifier
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  username: text('username').notNull().unique(),
  avatar: text('avatar').notNull(),
  bio: text('bio').notNull(),
  country: text('country').notNull(),
  city: text('city').notNull(),
  profession: text('profession').notNull(),
  specialty: text('specialty').notNull(), // Web, Mobile, IA, Cloud & DevOps, UI/UX, Cybersécurité, Réseaux
  technologies: text('technologies').notNull(), // Comma-separated list e.g. "React,Next.js,TypeScript,Node.js"
  skills: text('skills').notNull(), // Comma-separated list
  experienceLevel: text('experience_level').notNull(), // Junior, Intermédiaire, Senior, Expert
  availability: text('availability').notNull(), // Disponible, Freelance, Ouvert aux projets, En poste
  experiencesJson: text('experiences_json').notNull(), // JSON string of work experiences
  certificationsJson: text('certifications_json').notNull(), // JSON string of certifications
  githubUrl: text('github_url').notNull(),
  linkedinUrl: text('linkedin_url').notNull(),
  portfolioUrl: text('portfolio_url').notNull(),
  role: text('role').default('member').notNull(), // 'member' | 'admin'
  status: text('status').default('active').notNull(), // 'active' | 'suspended'
  isVerified: boolean('is_verified').default(false).notNull(),
  isOnline: boolean('is_online').default(true).notNull(),
  profileViews: integer('profile_views').default(120).notNull(),
  followersCount: integer('followers_count').default(24).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Projects Table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  authorName: text('author_name').notNull(),
  authorUsername: text('author_username').notNull(),
  technologies: text('technologies').notNull(), // Comma-separated
  country: text('country').notNull(),
  category: text('category').notNull(),
  repoUrl: text('repo_url').notNull(),
  demoUrl: text('demo_url').notNull(),
  likesCount: integer('likes_count').default(0).notNull(),
  viewsCount: integer('views_count').default(0).notNull(),
  collaboratorsCount: integer('collaborators_count').default(1).notNull(),
  isVerified: boolean('is_verified').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Collaborations & Opportunities Table
export const collaborations = pgTable('collaborations', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id),
  projectTitle: text('project_title').notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  senderName: text('sender_name').notNull(),
  receiverId: integer('receiver_id').references(() => users.id), // Nullable if public opportunity
  roleNeeded: text('role_needed').notNull(),
  skillsRequired: text('skills_required').notNull(),
  description: text('description').notNull(),
  status: text('status').default('open').notNull(), // 'open' | 'pending' | 'accepted' | 'declined'
  progress: integer('progress').default(25).notNull(),
  teamMembersJson: text('team_members_json').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Articles / News / Tutorials Table
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  coverImage: text('cover_image').notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  authorName: text('author_name').notNull(),
  authorAvatar: text('author_avatar').notNull(),
  category: text('category').notNull(), // Articles, Tutoriels, Astuces, Actualités technologiques, Retours d'expérience, Ressources, Guides
  readTime: text('read_time').notNull(),
  viewsCount: integer('views_count').default(0).notNull(),
  likesCount: integer('likes_count').default(0).notNull(),
  commentsCount: integer('comments_count').default(0).notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Article Comments Table
export const articleComments = pgTable('article_comments', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => articles.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  userName: text('user_name').notNull(),
  userAvatar: text('user_avatar').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Challenges & Hackathons Table
export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(), // Hackathon, Challenge IA, Challenge Web, Challenge Mobile, Challenge Cybersécurité
  description: text('description').notNull(),
  deadline: text('deadline').notNull(),
  participantsCount: integer('participants_count').default(0).notNull(),
  rewards: text('rewards').notNull(),
  rules: text('rules').notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'upcoming' | 'completed'
  leaderboardJson: text('leaderboard_json').notNull(), // JSON array of {rank, name, country, score, project}
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Messages Table
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationKey: text('conversation_key').notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  senderName: text('sender_name').notNull(),
  senderAvatar: text('sender_avatar').notNull(),
  receiverId: integer('receiver_id').references(() => users.id).notNull(),
  receiverName: text('receiver_name').notNull(),
  receiverAvatar: text('receiver_avatar').notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  isBlocked: boolean('is_blocked').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 8. Notifications Table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(), // message, collaboration, follower, like, comment, project_invite, challenge, article
  title: text('title').notNull(),
  message: text('message').notNull(),
  link: text('link').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 9. Moderation Reports & Audit Logs Table
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  reporterId: integer('reporter_id').references(() => users.id).notNull(),
  reporterName: text('reporter_name').notNull(),
  targetType: text('target_type').notNull(), // 'user' | 'project' | 'article' | 'message'
  targetId: integer('target_id').notNull(),
  targetName: text('target_name').notNull(),
  reason: text('reason').notNull(),
  status: text('status').default('pending').notNull(), // 'pending' | 'resolved' | 'dismissed'
  adminAction: text('admin_action').default('').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 10. Contact Messages Table
export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 11. User Favorites Table
export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  itemType: text('item_type').notNull(), // 'project' | 'article' | 'talent'
  itemId: integer('item_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  articles: many(articles),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  author: one(users, {
    fields: [projects.authorId],
    references: [users.id],
  }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
}));
