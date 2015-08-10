CREATE TABLE `vars` (
  `category` enum('Settings','Copy') NOT NULL DEFAULT 'Copy' COMMENT 'Used for internal sorting/filtering. Not used in server-side code.',
  `id` varchar(128) NOT NULL DEFAULT '' COMMENT 'PHP variable name. Loaded into global scope, so beware of overwrites!',
  `value` text,
  `notes` text,
  PRIMARY KEY (`category`,`id`),
  KEY `type` (`category`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
