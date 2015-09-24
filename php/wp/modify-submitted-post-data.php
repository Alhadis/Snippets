<?php

# Processes newly submitted post data before it's written to the database
add_filter('wp_insert_post_data', function($data, $postarr = NULL){
	

}, 1, 99);
