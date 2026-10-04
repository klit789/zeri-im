CREATE DATABASE IF NOT EXISTS zeri_im CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zeri_im;

CREATE TABLE IF NOT EXISTS stories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  body TEXT NOT NULL,
  category ENUM('ngacmova', 'heshta', 'pashë', 'ide') NOT NULL,
  visibility ENUM('public', 'private') NOT NULL DEFAULT 'public',
  status ENUM('pending', 'approved', 'hidden', 'rejected') NOT NULL DEFAULT 'pending',
  support_count INT UNSIGNED NOT NULL DEFAULT 0,
  flagged_self_harm TINYINT(1) NOT NULL DEFAULT 0,
  flagged_profanity TINYINT(1) NOT NULL DEFAULT 0,
  flagged_names TINYINT(1) NOT NULL DEFAULT 0,
  advocate_read TINYINT(1) NOT NULL DEFAULT 0,
  submitter_hash VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_wall (visibility, status, created_at),
  INDEX idx_advocate (status, advocate_read, flagged_self_harm)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS replies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  story_id INT UNSIGNED NOT NULL,
  body VARCHAR(500) NOT NULL,
  status ENUM('pending', 'approved', 'hidden') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
  INDEX idx_story (story_id, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS story_supports (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  story_id INT UNSIGNED NOT NULL,
  supporter_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_support (story_id, supporter_hash),
  FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
) ENGINE=InnoDB;
