CREATE TABLE `table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mj` int(11) NOT NULL,
  `game` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),

) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
