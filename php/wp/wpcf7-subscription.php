<?php


# Stop Contact Form 7 from actually sending an e-mail.
add_filter('wpcf7_skip_mail', '__return_true');



add_action('wpcf7_before_send_mail', 'mdlz_cf7_before_send');
function mdlz_cf7_before_send($form){
	global $wpdb;

	$wpdb->insert('mdlz_subscribers', array(
		'first_name'        => $_POST['first-name'],
		'last_name'         => $_POST['last-name'],
		'email'             => $_POST['email'],
		'business'          => $_POST['business-name'],
		'job_title'         => $_POST['job-title'],
		'accepted_privacy'  => $_POST['accepted-privacy'],
		'contact_phone'     => (INT) $_POST['contact-phone'],
		'contact_email'     => (INT) $_POST['contact-email'],
		'contact_sms'       => (INT) $_POST['contact-sms'],
		'ip'                => $_SERVER['HTTP_X_FORWARDED_FOR'] ?: $_SERVER['REMOTE_ADDR'],
		'user_agent'        => $_SERVER['HTTP_USER_AGENT']
	));
}


# Only load CF7's assets on pages that're actually using them.
add_filter('wpcf7_load_js',   'mdlz_load_wpcf7_assets');
add_filter('wpcf7_load_css',  'mdlz_load_wpcf7_assets');
function mdlz_load_wpcf7_assets(){
	global $post;
	if(!$post) return FALSE;
	return (FALSE !== strpos($post->post_content, '[contact-form-7'));
}
