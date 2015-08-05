CREATE TABLE `users_tables` (
  `user_id` int(11) NOT NULL,
  `table_id` int(11) NOT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
