import { relations } from 'drizzle-orm';
import { boolean, int, mysqlTable, serial, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

// 1. Users / Talents Table (MySQL)
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  uid: varchar('uid', { length: 191 }).notNull().unique(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  firstName: varchar('first_name', { length: 120 }).notNull(),
  lastName: varchar('last_name', { length: 120 }).notNull(),
  username: varchar('username', { length: 120 }).notNull().unique(),
  avatar: text('avatar').notNull(),
  bio: text('bio').notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  profession: varchar('profession', { length: 150 }).notNull(),
  specialty: varchar('specialty', { length: 120 }).notNull(),
  technologies: text('technologies').notNull(),
  skills: text('skills').notNull(),
  experienceLevel: varchar('experience_level', { length: 60 }).notNull(),
  availability: varchar('availability', { length: 80 }).notNull(),
  experiencesJson: text('experiences_json').notNull(),
  certificationsJson: text('certifications_json').notNull(),
  githubUrl: varchar('github_url', { length: 255 }).notNull(),
  linkedinUrl: varchar('linkedin_url', { length: 255 }).notNull(),
  portfolioUrl: varchar('portfolio_url', { length: 255 }).notNull(),
  role: varchar('role', { length: 32 }).default('member').notNull(),
  status: varchar('status', { length: 32 }).default('active').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  isOnline: boolean('is_online').default(true).notNull(),
  profileViews: int('profile_views').default(120).notNull(),
  followersCount: int('followers_count').default(24).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Projects Table (MySQL)
export const projects = mysqlTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  authorId: int('author_id').notNull(),
  authorName: varchar('author_name', { length: 150 }).notNull(),
  authorUsername: varchar('author_username', { length: 120 }).notNull(),
  technologies: text('technologies').notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  category: varchar('category', { length: 120 }).notNull(),
  repoUrl: varchar('repo_url', { length: 255 }).notNull(),
  demoUrl: varchar('demo_url', { length: 255 }).notNull(),
  likesCount: int('likes_count').default(0).notNull(),
  viewsCount: int('views_count').default(0).notNull(),
  collaboratorsCount: int('collaborators_count').default(1).notNull(),
  isVerified: boolean('is_verified').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Collaborations & Opportunities Table (MySQL)
export const collaborations = mysqlTable('collaborations', {
  id: serial('id').primaryKey(),
  projectId: int('project_id'),
  projectTitle: varchar('project_title', { length: 255 }).notNull(),
  senderId: int('sender_id').notNull(),
  senderName: varchar('sender_name', { length: 150 }).notNull(),
  receiverId: int('receiver_id'),
  roleNeeded: varchar('role_needed', { length: 150 }).notNull(),
  skillsRequired: text('skills_required').notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 40 }).default('open').notNull(),
  progress: int('progress').default(25).notNull(),
  teamMembersJson: text('team_members_json').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Articles / News / Tutorials Table (MySQL)
export const articles = mysqlTable('articles', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  coverImage: text('cover_image').notNull(),
  authorId: int('author_id').notNull(),
  authorName: varchar('author_name', { length: 150 }).notNull(),
  authorAvatar: text('author_avatar').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  readTime: varchar('read_time', { length: 40 }).notNull(),
  viewsCount: int('views_count').default(0).notNull(),
  likesCount: int('likes_count').default(0).notNull(),
  commentsCount: int('comments_count').default(0).notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Article Comments Table (MySQL)
export const articleComments = mysqlTable('article_comments', {
  id: serial('id').primaryKey(),
  articleId: int('article_id').notNull(),
  userId: int('user_id').notNull(),
  userName: varchar('user_name', { length: 150 }).notNull(),
  userAvatar: text('user_avatar').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Challenges & Hackathons Table (MySQL)
export const challenges = mysqlTable('challenges', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description').notNull(),
  deadline: varchar('deadline', { length: 100 }).notNull(),
  participantsCount: int('participants_count').default(0).notNull(),
  rewards: text('rewards').notNull(),
  rules: text('rules').notNull(),
  status: varchar('status', { length: 40 }).default('active').notNull(),
  leaderboardJson: text('leaderboard_json').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Messages Table (MySQL)
export const messages = mysqlTable('messages', {
  id: serial('id').primaryKey(),
  conversationKey: varchar('conversation_key', { length: 100 }).notNull(),
  senderId: int('sender_id').notNull(),
  senderName: varchar('sender_name', { length: 150 }).notNull(),
  senderAvatar: text('sender_avatar').notNull(),
  receiverId: int('receiver_id').notNull(),
  receiverName: varchar('receiver_name', { length: 150 }).notNull(),
  receiverAvatar: text('receiver_avatar').notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  isBlocked: boolean('is_blocked').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 8. Notifications Table (MySQL)
export const notifications = mysqlTable('notifications', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull(),
  type: varchar('type', { length: 60 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  link: varchar('link', { length: 255 }).notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 9. Moderation Reports & Audit Logs Table (MySQL)
export const reports = mysqlTable('reports', {
  id: serial('id').primaryKey(),
  reporterId: int('reporter_id').notNull(),
  reporterName: varchar('reporter_name', { length: 150 }).notNull(),
  targetType: varchar('target_type', { length: 60 }).notNull(),
  targetId: int('target_id').notNull(),
  targetName: varchar('target_name', { length: 255 }).notNull(),
  reason: text('reason').notNull(),
  status: varchar('status', { length: 40 }).default('pending').notNull(),
  adminAction: text('admin_action').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 10. Contact Submissions Table (MySQL)
export const contactSubmissions = mysqlTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  email: varchar('email', { length: 191 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 11. User Favorites Table (MySQL)
export const favorites = mysqlTable('favorites', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull(),
  itemType: varchar('item_type', { length: 60 }).notNull(),
  itemId: int('item_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  articles: many(articles),
}));
