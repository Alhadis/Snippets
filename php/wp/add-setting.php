<?php

add_action('admin_init', function(){

	add_settings_field('skip-attach', '<label for=\'skip_attachments\'>'.__('Skip Attachment Pages?').'</label>', function(){
		$v	=	get_option('skip_attachments');
		?> 
		<input type='checkbox' id='skip_attachments' name='skip_attachments' value='1'<?php checked($v); ?> />
		<span class='description'>
			<label for='skip_attachments'>If checked, attachment pages will redirect visitors to the actual attached file instead of a metadata page.</label>
		</span>
		<?php
	}, 'reading');

	register_setting('reading', 'skip_attachments');
});



if(get_option('skip_attachments'))
	add_action('template_redirect', function(){
		if(is_attachment()){
			global $post;
			wp_redirect(wp_get_attachment_url($post->ID));
			exit;
		}
	});