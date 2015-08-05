CREATE TABLE `tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mj` int(11) NOT NULL,
  `game` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `frequence` int(11) NOT NULL,
  `nbJoueurs` int(11) NOT NULL,
  `nbJoueursTotal` int(11) NOT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mj`) REFERENCES `users` (`id`),
  FOREIGN KEY (`game`) REFERENCES `games` (`id`),
  FOREIGN KEY (`status`) REFERENCES `status` (`id`),
  FOREIGN KEY (`frequence`) REFERENCES `frequences` (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
