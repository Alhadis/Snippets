<?php



add_action("personal_options_update", "dd_update_user_options");
function dd_update_user_options($id){
	update_user_meta($id, "display_language", $_POST["display_language"]);
}


add_action("personal_options", "dd_user_options");
function dd_user_options($user){
	$lang   = get_available_languages();
	$value  = get_user_meta($user->ID, "display_language", true);
?> 
	<tr>
		<td><label for="display_language" style="font-size: 13px">Display Language:</label></td>
		<td>
			<select id="display_language" name="display_language" style="width: 15em"><?php
				if(!$lang["en"]) array_push($lang, "en");
				
				foreach($lang as $l) :
			?> 
				<option value="<?php echo $l ?>"<?php selected($value, $l) ?>><?php _e(("nl_NL" == $l) ? 'Dutch' : locale_get_display_name($l)); ?></option><?php
				endforeach;
			?> 
			</select>
		</td>
	</tr>
<?php

}
