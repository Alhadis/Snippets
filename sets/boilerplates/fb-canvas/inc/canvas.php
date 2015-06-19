<?php

	#	Mobile/desktop redirection
	include 'main.php';

	meta_tags();

?><script>top.location.href	=	"<?= $mobile ? $base_url : ($fb_page.'/?sk=app_'.$app_id) ?>";</script>