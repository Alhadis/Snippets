<?php


/** Customised Walker class used to insert additional DOM elements into navigation menus. */
class Scratch_Walker extends Walker_Nav_Menu{
	
	/** Text to append to the links of elements with adjacent submenus */
	var $disclosure = '<em class="disclosure"></em>';


	/** Number of top-level nav items */
	var $top_count  = 0;


	/** Number of additional leading indentations to apply to each line */
	var $start_tab  = 2;



	function has_subnav($item){
		setup_postdata($item);
		$count = count(get_posts(array(
			'meta_key'   => '_menu_item_menu_item_parent',
			'meta_value' => $item->ID,
			'post_type'  => 'nav_menu_item'
		)));
		return $count > 0;
	}




	function start_el(&$output, $item, $depth = 0, $args = array(), $id = 0){
		$args      = (object) $args;
		$has_kids  = $this->has_subnav($item);

		# Top-level element
		if($depth == 0){
			$this->top_count++;
			$args->link_after = '';
		}

		# Submenu element
		else $args->link_after = ($has_kids ? $this->disclosure : '');
		
		if($has_kids){
			$indent        = str_repeat("\t", ($depth + 1)*4);
			$args->before  = PHP_EOL . $indent . '<div>' . PHP_EOL . $indent . "\t";
		}

		else $args->before = '<div>';

		$output .= str_repeat("\t", ($depth ? $depth * 2 : 0) + ($depth + 1)+$this->start_tab);
		parent::start_el($output, $item, $depth, $args);
	}



	function end_el(&$output, $item, $depth = 0, $args = array()){

		/** Closing an item that had a subnavigation menu */
		if($this->has_subnav($item)){
			$indent   = str_repeat("\t", (($depth + 1)*4)-1);
			$output  .= PHP_EOL . $indent . "\t</div>" . PHP_EOL . $indent . '</li>' . PHP_EOL;
		}
		
		else $output .= '</div></li>';
		$output      .= PHP_EOL;
	}


	function start_lvl(&$output, $depth = 0, $args = array()){
		$amount = 3 * ($depth + 1) + $this->start_tab + ($depth ? 1 : 0);

		if($depth > 1)
			$amount += $depth - 1;
		
		$indent  = str_repeat("\t", $amount);
		$output .= PHP_EOL . $indent . '<div class="submenu">' . PHP_EOL . $indent . "\t<ul>" . PHP_EOL;
	}


	function end_lvl(&$output, $depth = 0, $args = array()){
		$amount = 3 * ($depth + 1) + $this->start_tab + ($depth ? 1 : 0);

		if($depth > 1)
			$amount += $depth-1;

		$indent  = str_repeat("\t", $amount);
		$output .= $indent . "\t</ul>\n\n" . $indent . "\t<div class=\"padding\"></div>";

		if($depth > 0)
			$output .= PHP_EOL . $indent . "\t<div class=\"buffer\"></div>";

		$output .= PHP_EOL . $indent . '</div>';
	}
}
