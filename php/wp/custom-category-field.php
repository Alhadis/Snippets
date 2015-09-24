<?php

	/** Runs after outputting the Add New Category form */
	add_action('category_add_form_fields', 'dd_add_category');
	function dd_add_category($taxonomy){
		?> 
<div class="form-field">
	<label for="isolate-category"><?php _ex('Name of Field', 'Taxonomy Slug', T_DOMAIN); ?></label>
	<p><label style="color: #666;"><input style="display: inline-block; width: auto; border: none; padding-left: 0.5em;" type="checkbox" name="isolate-category" id="isolate-category" value="1" /> <?php _e('Whether to exclude posts in this category from main news feed. RSS feeds will be unaffected.', T_DOMAIN); ?></label></p>
</div>
		<?php
	}




	/** Runs after the standard Edit Category fields have been added to the page */
	add_action('category_edit_form_fields', 'dd_edit_category');
	function dd_edit_category($tag){
		global $dd_iso_cats;
		$checked	=	in_array($tag->term_id, $dd_iso_cats);
	?> 
		<tr>
			<th scope="row" valign="top"><label for="isolate-category"><?php _ex('Name of Field', 'Taxonomy Description', T_DOMAIN); ?></label></th>
			<td><label class="description"><input type="checkbox" name="isolate-category" id="isolate-category" value="1"<?php checked($checked, true); ?> />
			<?php _e('Description of Field', T_DOMAIN); ?></label></td>
		</tr>
		<?php
	}


	/** Stores the submitted Category info as an Option */
	add_action('created_term', 'dd_update_term', 15, 3);
	add_action('edited_term', 'dd_update_term', 15, 3);
	function dd_update_term($term_id, $tt_id = NULL, $taxonomy = NULL){
		$a	=	get_option('isolated_categories', array());

		$_POST['isolate-category']	?
			array_push($a, $term_id) :
			array_remove_value($a, $term_id);

		update_option('isolated_categories', array_unique($a));
	}