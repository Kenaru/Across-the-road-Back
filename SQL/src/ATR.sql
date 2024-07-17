-- Création de la table Users
CREATE TABLE Users (
    id INT PRIMARY KEY,
    Nom VARCHAR(255),
    Prénom VARCHAR(255),
    Date_naissance DATE,
    Mail VARCHAR(255) UNIQUE,
    Numéro_téléphone VARCHAR(20),
    Password VARCHAR(64), -- Stockage du hachage SHA-256
    Photo_profil BLOB,
    Permission ENUM('_dev', 'superadmin', 'admin', 'support', 'president', 'membresAsso', 'user')
);

CREATE TABLE tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(200) NOT NULL
);


-- Création de la table AssoTable
CREATE TABLE AssoTable (
    id INT PRIMARY KEY,
    Nom VARCHAR(255),
    Description VARCHAR(1000),
    categoryID INT,
    Contact_Mail VARCHAR(255),
    Adresse VARCHAR(255),
    Pays VARCHAR(255),
    Numéro_téléphone VARCHAR(20)
);

-- Création de la table AssoLead
CREATE TABLE AssoLead (
    PresidentID INT,
    Nom_asso INT
);

-- Création de la table AssoWebsite
CREATE TABLE AssoWebsite (
    id INT PRIMARY KEY,
    Nom_Asso INT,
    URL VARCHAR(255),
    CreateDate DATETIME,
    LastupDate DATETIME,
    Desc_asso VARCHAR(1000)
);

-- Création de la table Category
CREATE TABLE Category (
    ID INT PRIMARY KEY,
    Nom VARCHAR(255),
    Description VARCHAR(1000)
);


-- Clé étrangère pour lier AssoTable à la table Category
ALTER TABLE AssoTable
ADD CONSTRAINT FK_Category
FOREIGN KEY (categoryID) REFERENCES Category(ID);

-- Clé étrangère pour lier AssoLead à la table Users (Président)
ALTER TABLE AssoLead
ADD CONSTRAINT FK_President
FOREIGN KEY (PresidentID) REFERENCES Users(id);

-- Clé étrangère pour lier AssoLead à la table AssoTable (Nom_asso)
ALTER TABLE AssoLead
ADD CONSTRAINT FK_Nom_asso
FOREIGN KEY (Nom_asso) REFERENCES AssoTable(id);

-- Clé étrangère pour lier AssoWebsite à la table AssoTable (Nom_Asso)
ALTER TABLE AssoWebsite
ADD CONSTRAINT FK_Nom_Asso
FOREIGN KEY (Nom_Asso) REFERENCES AssoTable(id);
