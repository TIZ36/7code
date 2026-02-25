#!/bin/bash
set -euo pipefail

TYPES=(feat fix docs style refactor perf test chore revert)

usage() {
  cat <<'EOF'
Usage: commitgit -<type> "message"

Types:
  feat      New feature
  fix       Bug fix
  docs      Documentation only
  style     Code style (formatting, no logic change)
  refactor  Code refactor (no feature/fix)
  perf      Performance improvement
  test      Add or update tests
  chore     Build, CI, tooling, deps
  revert    Revert a previous commit

Options:
  -s <scope>   Optional scope, e.g. -s api
  -b           Include breaking change marker (!)
  -h           Show this help

Examples:
  commitgit -feat "add user auth"
  commitgit -fix -s parser "handle nil input"
  commitgit -feat -b -s api "new response format"
  commitgit -refactor "simplify tree traversal"
EOF
  exit 0
}

[[ $# -eq 0 ]] && usage

TYPE="" MSG="" SCOPE="" BREAKING=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) usage ;;
    -s)        SCOPE="$2"; shift 2 ;;
    -b)        BREAKING="!"; shift ;;
    -*)
      candidate="${1#-}"
      matched=false
      for t in "${TYPES[@]}"; do
        if [[ "$candidate" == "$t" ]]; then
          TYPE="$t"
          matched=true
          break
        fi
      done
      if $matched; then
        shift
      else
        echo "Error: unknown type '-$candidate'"
        echo "Valid types: ${TYPES[*]}"
        exit 1
      fi
      ;;
    *)
      MSG="$1"; shift ;;
  esac
done

if [[ -z "$TYPE" ]]; then
  echo "Error: commit type is required"
  echo "Valid types: ${TYPES[*]}"
  exit 1
fi

if [[ -z "$MSG" ]]; then
  echo "Error: commit message is required"
  echo "Usage: commitgit -$TYPE \"your message\""
  exit 1
fi

PREFIX="$TYPE"
[[ -n "$SCOPE" ]] && PREFIX="${PREFIX}(${SCOPE})"
PREFIX="${PREFIX}${BREAKING}"

COMMIT_MSG="${PREFIX}: ${MSG}"

STAGED=$(git diff --cached --name-only 2>/dev/null)
if [[ -z "$STAGED" ]]; then
  echo "No staged files. Staging all changes..."
  git add -A
  STAGED=$(git diff --cached --name-only 2>/dev/null)
  if [[ -z "$STAGED" ]]; then
    echo "Nothing to commit."
    exit 0
  fi
fi

echo ""
echo "  $COMMIT_MSG"
echo ""
echo "  Files:"
git diff --cached --stat | sed 's/^/    /'
echo ""

read -rp "  Confirm? [Y/n] " answer
answer=${answer:-Y}
if [[ "$answer" =~ ^[Yy]$ ]]; then
  git commit -m "$COMMIT_MSG"
  echo ""
  echo "  Done."
else
  echo "  Aborted."
  exit 1
fi
