export interface UserProfile {
  id: number;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  bio: string;
  country: string;
  city: string;
  profession: string;
  specialty: string;
  technologies: string;
  skills: string;
  experienceLevel: string;
  availability: string;
  experiencesJson: string;
  certificationsJson: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  role: 'member' | 'admin';
  status: 'active' | 'suspended';
  isVerified: boolean;
  isOnline: boolean;
  profileViews: number;
  followersCount: number;
  createdAt: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  authorId: number;
  authorName: string;
  authorUsername: string;
  technologies: string;
  country: string;
  category: string;
  repoUrl: string;
  demoUrl: string;
  likesCount: number;
  viewsCount: number;
  collaboratorsCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface CollaborationItem {
  id: number;
  projectId: number | null;
  projectTitle: string;
  senderId: number;
  senderName: string;
  receiverId: number | null;
  roleNeeded: string;
  skillsRequired: string;
  description: string;
  status: 'open' | 'pending' | 'accepted' | 'declined';
  progress: number;
  teamMembersJson: string;
  createdAt: string;
}

export interface ArticleItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  category: string;
  readTime: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  isPublished: boolean;
  createdAt: string;
}

export interface ArticleComment {
  id: number;
  articleId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface ChallengeItem {
  id: number;
  title: string;
  category: string;
  description: string;
  deadline: string;
  participantsCount: number;
  rewards: string;
  rules: string;
  status: string;
  leaderboardJson: string;
  createdAt: string;
}

export interface MessageItem {
  id: number;
  conversationKey: string;
  senderId: number;
  senderName: string;
  senderAvatar: string;
  receiverId: number;
  receiverName: string;
  receiverAvatar: string;
  content: string;
  isRead: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReportItem {
  id: number;
  reporterId: number;
  reporterName: string;
  targetType: string;
  targetId: number;
  targetName: string;
  reason: string;
  status: string;
  adminAction: string;
  createdAt: string;
}

export interface FavoriteItem {
  id: number;
  userId: number;
  itemType: string;
  itemId: number;
}
