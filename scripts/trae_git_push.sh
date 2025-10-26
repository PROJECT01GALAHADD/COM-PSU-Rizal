#!/usr/bin/env bash
# Example helper script (do NOT commit secrets). This demonstrates a safe runtime pattern:
# - Use TRAE_GITHUB_PAT (env) for HTTPS pushes
# - Fallback to SSH using TRAE_SSH_PRIVATE_KEY (env)
# Usage:
#   export TRAE_GITHUB_PAT="...(from secret store)..."
#   export TRAE_SSH_PRIVATE_KEY="...(contents of private key)..."
#   ./scripts/trae_git_push.sh "feature/branch-name" "Commit message" path/to/files
set -euo pipefail

BRANCH="${1:-task-unknown}"
COMMIT_MSG="${2:-'trae: update files'}"
FILES="${3:-.}"

REPO_HTTP="https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal.git"
REPO_SSH="git@github.com:PROJECT01GALAHADD/COM-PSU-Rizal.git"
WORKDIR="$(mktemp -d)"
echo "Using temp workdir: $WORKDIR"
cd "$WORKDIR"

# Configure git user (override with environment variables if provided)
GIT_USER_NAME="${GIT_USER_NAME:-trae-bot}"
GIT_USER_EMAIL="${GIT_USER_EMAIL:-trae-bot@example.com}"
git config --global user.name "$GIT_USER_NAME"
git config --global user.email "$GIT_USER_EMAIL"

# Clone using HTTPS with PAT if available
if [ -n "${TRAE_GITHUB_PAT:-}" ]; then
  echo "Attempting HTTPS clone with PAT..."
  # Note: Avoid printing PAT or writing it to logs.
  AUTH_REPO="${REPO_HTTP/https:\/\//https:\/\/${TRAE_GITHUB_PAT}@}"
  if git clone --depth=1 --branch main "$AUTH_REPO" repo 2>/dev/null; then
    echo "Cloned via HTTPS."
    cd repo
    git checkout -b "$BRANCH"
    cp -r "$OLDPWD/$FILES" . || true
    git add -A
    git commit -m "$COMMIT_MSG" || echo "No changes to commit."
    # Push
    git push -u origin "$BRANCH"
    echo "Pushed via HTTPS."
    exit 0
  else
    echo "HTTPS clone/push failed. Will attempt SSH fallback."
  fi
else
  echo "TRAE_GITHUB_PAT not set; skipping HTTPS attempt."
fi

# SSH fallback
if [ -n "${TRAE_SSH_PRIVATE_KEY:-}" ]; then
  echo "Attempting SSH fallback..."
  mkdir -p ~/.ssh
  chmod 700 ~/.ssh
  # Write private key to a file with correct permissions
  echo "$TRAE_SSH_PRIVATE_KEY" > ~/.ssh/trae_deploy_key
  chmod 600 ~/.ssh/trae_deploy_key

  # Optional: populate known_hosts to avoid prompts. Use GitHub's public host key.
  if [ -n "${TRAE_SSH_KNOWN_HOSTS:-}" ]; then
    echo "$TRAE_SSH_KNOWN_HOSTS" > ~/.ssh/known_hosts
  else
    # Try to add github.com automatically (best-effort)
    ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts 2>/dev/null || true
  fi
  chmod 644 ~/.ssh/known_hosts

  # Use SSH with the private key via GIT_SSH_COMMAND to avoid global SSH agent changes
  export GIT_SSH_COMMAND="ssh -i ~/.ssh/trae_deploy_key -o UserKnownHostsFile=~/.ssh/known_hosts -o IdentitiesOnly=yes"

  if git clone --depth=1 --branch main "$REPO_SSH" repo 2>/dev/null; then
    echo "Cloned via SSH."
    cd repo
    git checkout -b "$BRANCH"
    cp -r "$OLDPWD/$FILES" . || true
    git add -A
    git commit -m "$COMMIT_MSG" || echo "No changes to commit."
    git push -u origin "$BRANCH"
    echo "Pushed via SSH."
    exit 0
  else
    echo "SSH clone/push also failed."
    exit 2
  fi
else
  echo "TRAE_SSH_PRIVATE_KEY not set. Cannot attempt SSH fallback."
  exit 1
fi