CREATE TABLE `frequences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `frequences` (libelle) VALUES ('Mercredi Semaine paire');
INSERT INTO `frequences` (libelle) VALUES ('Vendredi Semaine impaire');
INSERT INTO `frequences` (libelle) VALUES ('Mercredi Semaine paire');
INSERT INTO `frequences` (libelle) VALUES ('Vendredi Semaine impaire');
INSERT INTO `frequences` (libelle) VALUES ('Occasionnelle');
INSERT INTO `frequences` (libelle) VALUES ('One Shots');