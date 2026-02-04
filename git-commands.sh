#!/usr/bin/env bash
set -euo pipefail

# Usage (VS Code integrated terminal):
# 1) Open VS Code and open the integrated terminal (View → Terminal or Ctrl+`)
# 2) Confirm the terminal's shell shown on the right of the terminal tab:
#    - If "Git Bash" or using WSL: run `./git-commands.sh` (you may need: chmod +x git-commands.sh)
#    - If "PowerShell" (default on Windows): run `bash ./git-commands.sh`
#    - If "Command Prompt (cmd.exe)": run `bash ./git-commands.sh` (requires Git for Windows)
# 3) Alternatively, paste individual commands from this script into the terminal.
#
# Note: Run these commands from the repository root: d:\CODING\game\project

# 1) Show current status
git status

# 2) Verify .env and dist are ignored
echo "Check ignore rules for .env and dist:"
git check-ignore -v .env dist || echo "Not ignored (or not matched)."

# 3) If .env or dist were accidentally tracked, untrack them (keeps local copy)
git rm --cached .env 2>/dev/null || true
git rm -r --cached dist 2>/dev/null || true

# 4) Renormalize line endings if you added .gitattributes recently
git add --renormalize .

# 5) Stage only the files you want in the repo (do NOT add .env or dist)
git add .gitattributes .gitignore package.json vercel.json .env.example

# If you want to add this helper script to the repo, uncomment:
git add git-commands.sh

# 6) Commit (skip if there's nothing to commit)
if ! git diff --cached --quiet; then
  git commit -m "Prepare project for Vercel: add config, normalize EOL, ignore local files"
else
  echo "Nothing to commit (staged changes empty)."
fi

# 7) Push branch
git push -u origin vercel-deploy
