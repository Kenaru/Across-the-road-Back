-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : ven. 26 jan. 2024 à 11:01
-- Version du serveur : 10.6.16-MariaDB
-- Version de PHP : 8.1.26

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
-- Structure de la table `Admin_Group`
--

CREATE TABLE `Admin_Group` (
  `id` int(11) NOT NULL,
  `id_owner` int(11) DEFAULT NULL,
  `id_site` int(11) DEFAULT NULL,
  `group_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Admin_Group_Link`
--

CREATE TABLE `Admin_Group_Link` (
  `id` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_owner` int(11) DEFAULT NULL,
  `id_site` int(11) DEFAULT NULL,
  `id_admin_group` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `AssoLead`
--

CREATE TABLE `AssoLead` (
  `PresidentID` int(11) NOT NULL,
  `Nom_asso` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `AssoTable`
--

CREATE TABLE `AssoTable` (
  `id` int(11) NOT NULL,
  `Nom` varchar(255) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `categoryID` int(11) DEFAULT NULL,
  `Contact_Mail` varchar(255) DEFAULT NULL,
  `Adresse` varchar(255) DEFAULT NULL,
  `Pays` varchar(255) DEFAULT NULL,
  `Numéro_téléphone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `AssoWebsite`
--

CREATE TABLE `AssoWebsite` (
  `id` int(11) NOT NULL,
  `Nom_Asso` int(11) DEFAULT NULL,
  `URL` varchar(255) DEFAULT NULL,
  `CreateDate` datetime DEFAULT NULL,
  `LastupDate` datetime DEFAULT NULL,
  `Desc_asso` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Category`
--

CREATE TABLE `Category` (
  `ID` int(11) NOT NULL,
  `Nom` varchar(255) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Color`
--

CREATE TABLE `Color` (
  `id` int(11) NOT NULL,
  `html_ref` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Contact`
--

CREATE TABLE `Contact` (
  `id` int(11) NOT NULL,
  `id_owner` int(11) NOT NULL,
  `id_site` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `mail` varchar(50) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Event`
--

CREATE TABLE `Event` (
  `id` int(11) NOT NULL,
  `id_owner` int(11) DEFAULT NULL,
  `id_site` int(11) DEFAULT NULL,
  `name` varchar(250) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Owner`
--

CREATE TABLE `Owner` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `mail` varchar(50) NOT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `password_hash` varchar(100) NOT NULL,
  `id_user` int(11) NOT NULL
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
(1, 3, '2024-01-25 14:05:37', '2024-01-26 02:05:37');

-- --------------------------------------------------------

--
-- Structure de la table `Site`
--

CREATE TABLE `Site` (
  `id` int(11) NOT NULL,
  `id_owner` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `activity` varchar(500) NOT NULL,
  `id_theme` int(11) NOT NULL,
  `id_category` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Social_Media`
--

CREATE TABLE `Social_Media` (
  `id` int(11) NOT NULL,
  `id_owner` int(11) DEFAULT NULL,
  `id_site` int(11) DEFAULT NULL,
  `linkedin_link` varchar(250) DEFAULT NULL,
  `instagram_link` varchar(250) DEFAULT NULL,
  `facebook_link` varchar(250) DEFAULT NULL,
  `x_link` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Style`
--

CREATE TABLE `Style` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Theme`
--

CREATE TABLE `Theme` (
  `id` int(11) NOT NULL,
  `id_style` int(11) NOT NULL,
  `id_color` int(11) NOT NULL,
  `id_typography` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Typography`
--

CREATE TABLE `Typography` (
  `id` int(11) NOT NULL,
  `typography_name` varchar(50) NOT NULL,
  `typography_link` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
  `is_logged_in` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Déchargement des données de la table `Users`
--

INSERT INTO `Users` (`id`, `lastname`, `firstname`, `birthday`, `mail`, `phonenumber`, `password`, `photo_profil`, `reset_token`, `reset_token_expires`, `is_logged_in`) VALUES
(1, 'BIZIEN', 'Aurélien', '0000-00-00', 'aurelienbizien@outlook.com', '0000000', '04d4a0f2f960ce813583fbad56b491540faa4b54a73041e79d41c0677f516bdd', NULL, NULL, NULL, 0),
(3, 'BIZIEN', 'Aurélien', '0000-00-00', 'test@outlook.com', '0000000', '04d4a0f2f960ce813583fbad56b491540faa4b54a73041e79d41c0677f516bdd', NULL, NULL, NULL, 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Admin_Group`
--
ALTER TABLE `Admin_Group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_owner` (`id_owner`,`id_site`);

--
-- Index pour la table `Admin_Group_Link`
--
ALTER TABLE `Admin_Group_Link`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_owner` (`id_owner`,`id_site`,`id_admin_group`);

--
-- Index pour la table `AssoLead`
--
ALTER TABLE `AssoLead`
  ADD PRIMARY KEY (`PresidentID`),
  ADD KEY `Nom_asso` (`Nom_asso`);

--
-- Index pour la table `AssoTable`
--
ALTER TABLE `AssoTable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryID` (`categoryID`);

--
-- Index pour la table `AssoWebsite`
--
ALTER TABLE `AssoWebsite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Nom_Asso` (`Nom_Asso`);

--
-- Index pour la table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`ID`);

--
-- Index pour la table `Color`
--
ALTER TABLE `Color`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Contact`
--
ALTER TABLE `Contact`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mail` (`mail`),
  ADD KEY `id_owner` (`id_owner`,`id_site`);

--
-- Index pour la table `Event`
--
ALTER TABLE `Event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_owner` (`id_owner`,`id_site`);

--
-- Index pour la table `Owner`
--
ALTER TABLE `Owner`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mail` (`mail`),
  ADD KEY `id_user` (`id_user`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `Site`
--
ALTER TABLE `Site`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_owner` (`id_owner`),
  ADD KEY `id_theme` (`id_theme`),
  ADD KEY `id_category` (`id_category`);

--
-- Index pour la table `Social_Media`
--
ALTER TABLE `Social_Media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_owner` (`id_owner`,`id_site`);

--
-- Index pour la table `Style`
--
ALTER TABLE `Style`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Theme`
--
ALTER TABLE `Theme`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_style` (`id_style`),
  ADD KEY `id_color` (`id_color`),
  ADD KEY `id_typography` (`id_typography`);

--
-- Index pour la table `tokens`
--
ALTER TABLE Tokens
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `Typography`
--
ALTER TABLE `Typography`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Admin_Group`
--
ALTER TABLE `Admin_Group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Admin_Group_Link`
--
ALTER TABLE `Admin_Group_Link`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `AssoLead`
--
ALTER TABLE `AssoLead`
  MODIFY `PresidentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `AssoTable`
--
ALTER TABLE `AssoTable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `AssoWebsite`
--
ALTER TABLE `AssoWebsite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Category`
--
ALTER TABLE `Category`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `tokens`
--
ALTER TABLE Tokens
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Admin_Group`
--
ALTER TABLE `Admin_Group`
  ADD CONSTRAINT `Admin_Group_ibfk_1` FOREIGN KEY (`id_owner`,`id_site`) REFERENCES `Site` (`id_owner`, `id`);

--
-- Contraintes pour la table `Admin_Group_Link`
--
ALTER TABLE `Admin_Group_Link`
  ADD CONSTRAINT `Admin_Group_Link_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `Admin_Group_Link_ibfk_2` FOREIGN KEY (`id_owner`,`id_site`,`id_admin_group`) REFERENCES `Admin_Group` (`id_owner`, `id_site`, `id`);

--
-- Contraintes pour la table `AssoLead`
--
ALTER TABLE `AssoLead`
  ADD CONSTRAINT `AssoLead_ibfk_1` FOREIGN KEY (`PresidentID`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `AssoLead_ibfk_2` FOREIGN KEY (`Nom_asso`) REFERENCES `Site` (`id`);

--
-- Contraintes pour la table `AssoTable`
--
ALTER TABLE `AssoTable`
  ADD CONSTRAINT `AssoTable_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `Category` (`ID`);

--
-- Contraintes pour la table `AssoWebsite`
--
ALTER TABLE `AssoWebsite`
  ADD CONSTRAINT `AssoWebsite_ibfk_1` FOREIGN KEY (`Nom_Asso`) REFERENCES `AssoTable` (`id`);

--
-- Contraintes pour la table `Contact`
--
ALTER TABLE `Contact`
  ADD CONSTRAINT `Contact_ibfk_1` FOREIGN KEY (`id_owner`,`id_site`) REFERENCES `Site` (`id_owner`, `id`);

--
-- Contraintes pour la table `Event`
--
ALTER TABLE `Event`
  ADD CONSTRAINT `Event_ibfk_1` FOREIGN KEY (`id_owner`,`id_site`) REFERENCES `Site` (`id_owner`, `id`);

--
-- Contraintes pour la table `Owner`
--
ALTER TABLE `Owner`
  ADD CONSTRAINT `Owner_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`);

--
-- Contraintes pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

--
-- Contraintes pour la table `Site`
--
ALTER TABLE `Site`
  ADD CONSTRAINT `Site_ibfk_1` FOREIGN KEY (`id_owner`) REFERENCES `Owner` (`id`),
  ADD CONSTRAINT `Site_ibfk_2` FOREIGN KEY (`id_theme`) REFERENCES `Theme` (`id`),
  ADD CONSTRAINT `Site_ibfk_3` FOREIGN KEY (`id_category`) REFERENCES `Category` (`ID`);

--
-- Contraintes pour la table `Social_Media`
--
ALTER TABLE `Social_Media`
  ADD CONSTRAINT `Social_Media_ibfk_1` FOREIGN KEY (`id_owner`,`id_site`) REFERENCES `Site` (`id_owner`, `id`);

--
-- Contraintes pour la table `Theme`
--
ALTER TABLE `Theme`
  ADD CONSTRAINT `Theme_ibfk_1` FOREIGN KEY (`id_style`) REFERENCES `Style` (`id`),
  ADD CONSTRAINT `Theme_ibfk_2` FOREIGN KEY (`id_color`) REFERENCES `Color` (`id`),
  ADD CONSTRAINT `Theme_ibfk_3` FOREIGN KEY (`id_typography`) REFERENCES `Typography` (`id`);

--
-- Contraintes pour la table `tokens`
--
ALTER TABLE Tokens
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
