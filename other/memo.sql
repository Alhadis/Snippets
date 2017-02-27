# Count how many entries are in a table
SELECT COUNT(*) FROM table;

# Querying rows whose IDs are included in a predetermined set
SELECT users_id, max(date) from `TABLE` WHERE users_id in (1,2,3,4,5) GROUP BY 1

# Results from last week
SELECT * FROM entries WHERE submitted BETWEEN date_sub(now(), INTERVAL 1 WEEK) and now();

# INNER JOIN example
SELECT
	users.*,
	groups.*

	FROM            users
	INNER JOIN      groups
		WHERE       groups.id = 1
		ORDER BY    users.id;
