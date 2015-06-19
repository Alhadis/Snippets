<?php

	#	Main configuration file
	date_default_timezone_set('Australia/Melbourne');



	$namespace		=	'namespace';
	$base_url		=	'https://' . $namespace . '.your-fb-app-host.com/';
	$canvas_url		=	'https://apps.facebook.com/' . $namespace;
	$app_id			=	'###############';
	$app_secret		=	'################################';
	$app_title		=	'Title of Your Facebook Canvas App';
	$fb_page		=	'https://www.facebook.com/PageToAddFinishedAppTo';
	$use_min		=	TRUE;


	#	Social sharing messages
	$fb_share_title			=	'Title When Shared On Timeline';
	$fb_share_caption		=	'';
	$fb_share_description	=
	$tw_share				=	'Descriptive text displayed when app is shared on timeline';


	#	Database credentials
	$db_host			=	'localhost';
	$db_username		=	'root';
	$db_password		=	'root';
	$db_database		=	'database-name';
	$db_table			=	'table-name';
	$db_charset			=	'utf8mb4';



	#	App-specific
	$uploads_dir		=	'tmp/cache/';

