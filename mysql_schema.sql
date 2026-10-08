-- =====================================================================
-- AFRIKDEV — La communauté numérique africaine
-- Script complet de base de données MySQL 8.0+ (UTF8MB4)
-- « Construire l’Afrique numérique, un projet à la fois. »
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `afrikdev_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `afrikdev_db`;

-- 1. Table des utilisateurs / talents
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uid` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `first_name` VARCHAR(120) NOT NULL,
  `last_name` VARCHAR(120) NOT NULL,
  `username` VARCHAR(120) NOT NULL,
  `avatar` TEXT NOT NULL,
  `bio` TEXT NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `profession` VARCHAR(150) NOT NULL,
  `specialty` VARCHAR(120) NOT NULL,
  `technologies` TEXT NOT NULL,
  `skills` TEXT NOT NULL,
  `experience_level` VARCHAR(60) NOT NULL,
  `availability` VARCHAR(80) NOT NULL,
  `experiences_json` LONGTEXT NOT NULL,
  `certifications_json` LONGTEXT NOT NULL,
  `github_url` VARCHAR(255) NOT NULL,
  `linkedin_url` VARCHAR(255) NOT NULL,
  `portfolio_url` VARCHAR(255) NOT NULL,
  `role` VARCHAR(32) NOT NULL DEFAULT 'member',
  `status` VARCHAR(32) NOT NULL DEFAULT 'active',
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `is_online` TINYINT(1) NOT NULL DEFAULT 1,
  `profile_views` INT NOT NULL DEFAULT 120,
  `followers_count` INT NOT NULL DEFAULT 24,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_uid_unique` (`uid`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table des projets
CREATE TABLE IF NOT EXISTS `projects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `image_url` TEXT NOT NULL,
  `author_id` BIGINT UNSIGNED NOT NULL,
  `author_name` VARCHAR(150) NOT NULL,
  `author_username` VARCHAR(120) NOT NULL,
  `technologies` TEXT NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `category` VARCHAR(120) NOT NULL,
  `repo_url` VARCHAR(255) NOT NULL,
  `demo_url` VARCHAR(255) NOT NULL,
  `likes_count` INT NOT NULL DEFAULT 0,
  `views_count` INT NOT NULL DEFAULT 0,
  `collaborators_count` INT NOT NULL DEFAULT 1,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 1,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_projects_author` (`author_id`),
  CONSTRAINT `fk_projects_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table des collaborations & opportunités
CREATE TABLE IF NOT EXISTS `collaborations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` BIGINT UNSIGNED NULL,
  `project_title` VARCHAR(255) NOT NULL,
  `sender_id` BIGINT UNSIGNED NOT NULL,
  `sender_name` VARCHAR(150) NOT NULL,
  `receiver_id` BIGINT UNSIGNED NULL,
  `role_needed` VARCHAR(150) NOT NULL,
  `skills_required` TEXT NOT NULL,
  `description` TEXT NOT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'open',
  `progress` INT NOT NULL DEFAULT 25,
  `team_members_json` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_collab_sender` (`sender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table des articles / tutoriels / guides
CREATE TABLE IF NOT EXISTS `articles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `cover_image` TEXT NOT NULL,
  `author_id` BIGINT UNSIGNED NOT NULL,
  `author_name` VARCHAR(150) NOT NULL,
  `author_avatar` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `read_time` VARCHAR(40) NOT NULL,
  `views_count` INT NOT NULL DEFAULT 0,
  `likes_count` INT NOT NULL DEFAULT 0,
  `comments_count` INT NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_articles_author` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table des commentaires d'articles
CREATE TABLE IF NOT EXISTS `article_comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `user_name` VARCHAR(150) NOT NULL,
  `user_avatar` TEXT NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comments_article` (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table des challenges & hackathons
CREATE TABLE IF NOT EXISTS `challenges` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `deadline` VARCHAR(100) NOT NULL,
  `participants_count` INT NOT NULL DEFAULT 0,
  `rewards` TEXT NOT NULL,
  `rules` TEXT NOT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'active',
  `leaderboard_json` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table de la messagerie privée
CREATE TABLE IF NOT EXISTS `messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_key` VARCHAR(100) NOT NULL,
  `sender_id` BIGINT UNSIGNED NOT NULL,
  `sender_name` VARCHAR(150) NOT NULL,
  `sender_avatar` TEXT NOT NULL,
  `receiver_id` BIGINT UNSIGNED NOT NULL,
  `receiver_name` VARCHAR(150) NOT NULL,
  `receiver_avatar` TEXT NOT NULL,
  `content` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `is_blocked` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_messages_conv` (`conversation_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table des notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `type` VARCHAR(60) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `link` VARCHAR(255) NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table des signalements & modération
CREATE TABLE IF NOT EXISTS `reports` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reporter_id` BIGINT UNSIGNED NOT NULL,
  `reporter_name` VARCHAR(150) NOT NULL,
  `target_type` VARCHAR(60) NOT NULL,
  `target_id` BIGINT UNSIGNED NOT NULL,
  `target_name` VARCHAR(255) NOT NULL,
  `reason` TEXT NOT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'pending',
  `admin_action` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Table des messages de contact
CREATE TABLE IF NOT EXISTS `contact_submissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Table des favoris
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `item_type` VARCHAR(60) NOT NULL,
  `item_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_fav_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
