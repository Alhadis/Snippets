<?php
	
	preg_replace('#(^\W+|\W+$)#', '', preg_replace('#(?<!^)[\W]+(?!$)#', '-', strtolower($string)))