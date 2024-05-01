-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mer. 01 mai 2024 à 12:48
-- Version du serveur : 10.6.17-MariaDB
-- Version de PHP : 8.1.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `biau7663_acrosstheroad`
--

-- --------------------------------------------------------

--
-- Structure de la table `pageComponents`
--

CREATE TABLE `pageComponents` (
  `id` int(11) NOT NULL,
  `pageId` varchar(50) DEFAULT NULL,
  `componentType` varchar(50) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `componentData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`componentData`))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `pageImports`
--

CREATE TABLE `pageImports` (
  `pageId` varchar(50) DEFAULT NULL,
  `import` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `login_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `logout_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`session_id`, `user_id`, `login_time`, `logout_time`) VALUES
(1, 3, '2024-01-25 14:05:37', '2024-01-26 02:05:37'),
(2, 6, '2024-02-05 19:28:14', '2024-02-06 07:28:14'),
(3, 6, '2024-02-05 19:30:46', '2024-02-06 07:30:46'),
(4, 6, '2024-02-05 19:30:58', '2024-02-06 07:30:58'),
(5, 6, '2024-02-05 19:41:06', '2024-02-06 07:41:06'),
(6, 8, '2024-02-05 19:57:40', '2024-02-06 07:57:40'),
(7, 8, '2024-02-05 19:59:20', '2024-02-06 07:59:20'),
(8, 8, '2024-02-05 20:12:40', '2024-02-06 08:12:40'),
(9, 8, '2024-02-05 20:25:30', '2024-02-06 08:25:30'),
(10, 8, '2024-02-05 20:46:57', '2024-02-06 08:46:57'),
(11, 8, '2024-02-05 21:02:11', '2024-02-06 09:02:11'),
(12, 8, '2024-02-05 21:07:56', '2024-02-06 09:07:56'),
(13, 8, '2024-02-05 21:09:08', '2024-02-06 09:09:08'),
(14, 8, '2024-02-05 21:32:03', '2024-02-06 09:32:03'),
(15, 8, '2024-02-06 05:52:19', '2024-02-06 17:52:19'),
(16, 8, '2024-02-06 06:13:12', '2024-02-06 18:13:12'),
(17, 8, '2024-02-06 06:13:16', '2024-02-06 18:13:16'),
(18, 8, '2024-02-06 06:13:21', '2024-02-06 18:13:21'),
(19, 8, '2024-02-06 11:06:18', '2024-02-06 23:06:18'),
(20, 8, '2024-02-06 11:07:01', '2024-02-06 23:07:01'),
(21, 8, '2024-02-06 19:41:32', '2024-02-07 07:41:32'),
(22, 8, '2024-02-06 20:33:48', '2024-02-07 08:33:48'),
(23, 8, '2024-02-06 20:35:55', '2024-02-07 08:35:55'),
(24, 8, '2024-02-06 20:36:55', '2024-02-07 08:36:55'),
(25, 10, '2024-02-08 08:37:40', '2024-02-08 20:37:40'),
(26, 8, '2024-02-25 08:04:59', '2024-02-25 20:04:59'),
(27, 8, '2024-02-25 08:06:04', '2024-02-25 20:06:04'),
(28, 8, '2024-03-07 15:13:53', '2024-03-08 03:13:53'),
(29, 13, '2024-03-19 13:59:05', '2024-03-20 01:59:05'),
(30, 14, '2024-04-24 14:34:54', '2024-04-25 02:34:54'),
(31, 8, '2024-04-24 19:02:40', '2024-04-25 07:02:40'),
(32, 8, '2024-04-24 19:02:47', '2024-04-25 07:02:47'),
(33, 14, '2024-04-24 19:03:39', '2024-04-25 07:03:39'),
(34, 8, '2024-04-24 19:03:51', '2024-04-25 07:03:51'),
(35, 14, '2024-04-24 19:04:16', '2024-04-25 07:04:16'),
(36, 5, '2024-04-24 19:48:29', '2024-04-25 07:48:29'),
(37, 8, '2024-04-24 20:41:43', '2024-04-25 08:41:43'),
(38, 8, '2024-04-24 21:04:13', '2024-04-25 09:04:13'),
(39, 8, '2024-04-24 21:04:50', '2024-04-25 09:04:50'),
(40, 8, '2024-04-24 21:32:12', '0000-00-00 00:00:00'),
(41, 8, '2024-04-24 21:32:29', '0000-00-00 00:00:00'),
(42, 8, '2024-04-24 21:41:36', '0000-00-00 00:00:00'),
(43, 8, '2024-04-24 21:51:14', '0000-00-00 00:00:00'),
(44, 8, '2024-04-24 21:52:55', '0000-00-00 00:00:00'),
(45, 8, '2024-04-28 12:24:02', '0000-00-00 00:00:00'),
(46, 8, '2024-04-28 12:29:31', '0000-00-00 00:00:00'),
(47, 8, '2024-04-28 13:32:48', '0000-00-00 00:00:00'),
(48, 8, '2024-04-28 13:33:02', '0000-00-00 00:00:00'),
(49, 8, '2024-04-28 13:40:43', '0000-00-00 00:00:00'),
(50, 8, '2024-04-28 13:43:14', '0000-00-00 00:00:00'),
(51, 8, '2024-04-28 13:47:04', '0000-00-00 00:00:00'),
(52, 8, '2024-04-28 13:47:15', '0000-00-00 00:00:00'),
(53, 8, '2024-04-28 13:47:35', '0000-00-00 00:00:00'),
(54, 8, '2024-04-28 13:47:40', '0000-00-00 00:00:00'),
(55, 8, '2024-04-28 14:18:02', '0000-00-00 00:00:00'),
(56, 8, '2024-04-28 14:19:00', '0000-00-00 00:00:00'),
(57, 8, '2024-04-28 14:57:29', '0000-00-00 00:00:00'),
(58, 8, '2024-04-28 14:57:59', '0000-00-00 00:00:00'),
(59, 8, '2024-04-28 14:58:10', '0000-00-00 00:00:00'),
(60, 8, '2024-04-28 14:59:44', '0000-00-00 00:00:00'),
(61, 8, '2024-04-28 15:00:35', '0000-00-00 00:00:00'),
(62, 5, '2024-04-28 15:01:17', '0000-00-00 00:00:00'),
(63, 5, '2024-04-28 15:05:09', '0000-00-00 00:00:00'),
(64, 5, '2024-04-28 15:05:25', '0000-00-00 00:00:00'),
(65, 5, '2024-04-28 15:07:13', '0000-00-00 00:00:00'),
(66, 5, '2024-04-28 15:07:30', '0000-00-00 00:00:00'),
(67, 5, '2024-04-28 15:07:38', '0000-00-00 00:00:00'),
(68, 5, '2024-04-28 15:24:13', '0000-00-00 00:00:00'),
(69, 5, '2024-04-28 15:24:26', '0000-00-00 00:00:00'),
(70, 5, '2024-04-28 15:27:49', '0000-00-00 00:00:00'),
(71, 5, '2024-04-28 15:31:41', '0000-00-00 00:00:00'),
(72, 8, '2024-04-28 15:31:49', '0000-00-00 00:00:00'),
(73, 8, '2024-04-28 15:41:20', '0000-00-00 00:00:00'),
(74, 8, '2024-04-28 15:41:27', '0000-00-00 00:00:00'),
(75, 8, '2024-04-28 15:43:32', '0000-00-00 00:00:00'),
(76, 5, '2024-04-28 15:43:53', '0000-00-00 00:00:00'),
(77, 5, '2024-04-28 15:45:16', '0000-00-00 00:00:00'),
(78, 8, '2024-04-28 15:47:12', '0000-00-00 00:00:00'),
(79, 5, '2024-04-28 15:47:19', '0000-00-00 00:00:00'),
(80, 5, '2024-04-28 15:49:32', '0000-00-00 00:00:00'),
(81, 8, '2024-04-28 15:54:03', '0000-00-00 00:00:00'),
(82, 8, '2024-04-28 15:54:49', '0000-00-00 00:00:00'),
(83, 8, '2024-04-28 16:17:34', '0000-00-00 00:00:00'),
(84, 8, '2024-04-28 16:25:34', '0000-00-00 00:00:00'),
(85, 8, '2024-04-28 16:36:25', '0000-00-00 00:00:00'),
(86, 8, '2024-04-28 16:37:37', '0000-00-00 00:00:00'),
(87, 8, '2024-04-28 16:39:00', '0000-00-00 00:00:00'),
(88, 8, '2024-04-28 16:41:07', '0000-00-00 00:00:00'),
(89, 8, '2024-04-28 16:51:34', '0000-00-00 00:00:00'),
(90, 8, '2024-04-28 16:52:21', '0000-00-00 00:00:00'),
(91, 8, '2024-04-28 16:53:51', '0000-00-00 00:00:00'),
(92, 8, '2024-04-28 16:54:01', '0000-00-00 00:00:00'),
(93, 8, '2024-04-28 17:00:26', '0000-00-00 00:00:00'),
(94, 8, '2024-04-28 17:00:41', '0000-00-00 00:00:00'),
(95, 8, '2024-04-28 17:03:04', '0000-00-00 00:00:00'),
(96, 8, '2024-04-28 17:03:09', '0000-00-00 00:00:00'),
(97, 8, '2024-04-28 17:16:25', '0000-00-00 00:00:00'),
(98, 8, '2024-04-28 17:16:46', '0000-00-00 00:00:00'),
(99, 8, '2024-04-28 17:17:23', '0000-00-00 00:00:00'),
(100, 8, '2024-04-28 17:22:06', '0000-00-00 00:00:00'),
(101, 8, '2024-04-28 17:23:25', '0000-00-00 00:00:00'),
(102, 8, '2024-04-28 18:19:05', '0000-00-00 00:00:00'),
(103, 8, '2024-04-28 18:19:25', '0000-00-00 00:00:00'),
(104, 8, '2024-04-28 18:20:23', '0000-00-00 00:00:00'),
(105, 8, '2024-04-28 18:21:24', '0000-00-00 00:00:00'),
(106, 8, '2024-04-28 18:22:42', '0000-00-00 00:00:00'),
(107, 8, '2024-04-28 18:25:26', '0000-00-00 00:00:00'),
(108, 8, '2024-04-28 21:14:21', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `mail` varchar(255) NOT NULL,
  `phonenumber` varchar(20) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `photo_profil` blob DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `is_logged_in` tinyint(1) DEFAULT 0,
  `tier_id` int(11) DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Déchargement des données de la table `Users`
--

INSERT INTO `Users` (`id`, `lastname`, `firstname`, `birthday`, `mail`, `phonenumber`, `password`, `photo_profil`, `reset_token`, `reset_token_expires`, `is_logged_in`, `tier_id`) VALUES
(1, 'BIZIEN', 'Aurélien', '0000-00-00', 'aurelienbizien@outlook.com', '0000000', '04d4a0f2f960ce813583fbad56b491540faa4b54a73041e79d41c0677f516bdd', NULL, NULL, NULL, 0, 1),
(3, 'BIZIEN', 'Aurélien', '0000-00-00', 'test@outlook.com', '0000000', '04d4a0f2f960ce813583fbad56b491540faa4b54a73041e79d41c0677f516bdd', NULL, NULL, NULL, 1, 3),
(5, 'noella', 'ikirezi', '1988-02-13', 'noellaikirezi@gmail.com', '0783654004', '69cb1bdce8cb1408c7918516c8daba6105c2fc55cd7b5d55152e8ebcfa67962d', NULL, NULL, NULL, 1, 1),
(6, 'Anna', 'TEST', '2023-05-11', 'toto@gmail.com', '0673373629', '69cb1bdce8cb1408c7918516c8daba6105c2fc55cd7b5d55152e8ebcfa67962d', NULL, NULL, NULL, 1, 3),
(8, 'kiki', 'nana', '2023-11-30', 'kiki@gmail.com', '0673373629', '69cb1bdce8cb1408c7918516c8daba6105c2fc55cd7b5d55152e8ebcfa67962d', NULL, NULL, NULL, 1, 1),
(9, 'BIZIEN', 'Aurélien', '2024-02-08', 'aurelienbizien@outlook.test', '0784442204', '7546df0d5385f6a05d11c5a0388a5736466f31d5ab210fe486f377bd648459a5', NULL, NULL, NULL, 0, 3),
(10, 'test', 'test32', '2004-03-03', 'aurelientest@test.test', '000000000000', '7546df0d5385f6a05d11c5a0388a5736466f31d5ab210fe486f377bd648459a5', NULL, NULL, NULL, 1, 3),
(11, 'IKIREZI', 'Noëlla', '1998-03-07', 'testo@gmail.com', '0783654004', '69cb1bdce8cb1408c7918516c8daba6105c2fc55cd7b5d55152e8ebcfa67962d', NULL, NULL, NULL, 0, 3),
(13, 'BIZIEN', 'Aurélien', '2004-03-03', 'testtamere@outlook.com', '0000000000', '7546df0d5385f6a05d11c5a0388a5736466f31d5ab210fe486f377bd648459a5', NULL, NULL, NULL, 1, 3),
(14, 'test', 'tester', '1998-01-12', 'tester@gmail.com', '0783654004', '69cb1bdce8cb1408c7918516c8daba6105c2fc55cd7b5d55152e8ebcfa67962d', NULL, NULL, NULL, 1, 3);

-- --------------------------------------------------------

--
-- Structure de la table `websitePages`
--

CREATE TABLE `websitePages` (
  `id` varchar(50) NOT NULL,
  `formData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`formData`))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `pageComponents`
--
ALTER TABLE `pageComponents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pageId` (`pageId`);

--
-- Index pour la table `pageImports`
--
ALTER TABLE `pageImports`
  ADD KEY `pageId` (`pageId`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- Index pour la table `websitePages`
--
ALTER TABLE `websitePages`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `pageComponents`
--
ALTER TABLE `pageComponents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `pageComponents`
--
ALTER TABLE `pageComponents`
  ADD CONSTRAINT `pageComponents_ibfk_1` FOREIGN KEY (`pageId`) REFERENCES `websitePages` (`id`);

--
-- Contraintes pour la table `pageImports`
--
ALTER TABLE `pageImports`
  ADD CONSTRAINT `pageImports_ibfk_1` FOREIGN KEY (`pageId`) REFERENCES `websitePages` (`id`);

--
-- Contraintes pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
