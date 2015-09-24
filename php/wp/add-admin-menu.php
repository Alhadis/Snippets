<?php

add_action('admin_menu', function(){
	$name		=	'Manage Mailing List';
	$menu_id	=	'export-mailing-list';

	add_management_page($name, $name, 'export', $menu_id, function(){
		?> 
		<h2>Manage Mailing List</h2>
		<hr />

		<p>Etc</p>
		<?php
	});
});