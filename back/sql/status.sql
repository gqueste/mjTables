CREATE TABLE `status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `status` (libelle) VALUES ('Recrute');
INSERT INTO `status` (libelle) VALUES ('Places disponibles');
INSERT INTO `status` (libelle) VALUES ('Complete');
INSERT INTO `status` (libelle) VALUES ('En pause');
INSERT INTO `status` (libelle) VALUES ('Arretee');