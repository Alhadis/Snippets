<?php


# Create any custom database tables used by the theme.
add_action('after_switch_theme', function(){
	global $wpdb;
	$table_name = 'mwsc_subscribers';

	if(!$wpdb->query('SHOW TABLES LIKE "' . $table_name . '"')){
		$wpdb->query('CREATE TABLE `' . $table_name . '` (
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`email` text,
	`submitted` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	`ip` varchar(45) DEFAULT NULL,
	`user_agent` text,
	PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;');
	}
});
