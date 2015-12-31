# Make recipes specific for managing git-repos

check_hook := https://raw.githubusercontent.com/Alhadis/Snippets/master/shell/check-version.sh

# Installs some git-hooks to prevent hasty version-committing
git-hooks:
	@hash node 2>&- || { >&2 echo "These hooks require Node.js to run."; exit 2; }
	@curl -s $(check_hook) > .git/hooks/commit-msg
	@chmod +x .git/hooks/commit-msg
