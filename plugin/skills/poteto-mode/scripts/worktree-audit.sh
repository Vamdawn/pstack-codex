#!/usr/bin/env bash
# Report Git, PR/MR, and explicitly supplied recent-use evidence for worktrees.
#
# Usage: worktree-audit.sh [-b|--base <ref>] [--remote <name> | --url <url>]
#                          [--recent-worktree <absolute-path>]... [repo-path]
# The base defaults to the selected remote's HEAD, main, or master, then local
# main or master. It is compared against local refs. Fetch separately if needed.
set -u -o pipefail

base=""
forge_options=()
recent_worktrees=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    -b|--base|--remote|--url|--recent-worktree)
      [ "$#" -ge 2 ] && [ -n "$2" ] || { printf 'error: %s needs a value\n' "$1" >&2; exit 2; }
      case "$1" in
        -b|--base) base="$2" ;;
        --recent-worktree) recent_worktrees+=("$(cd -- "$2" 2>/dev/null && pwd -P || printf '%s' "$2")") ;;
        *) forge_options+=("$1" "$2") ;;
      esac
      shift 2
      ;;
    -h|--help) sed -n '2,/^set -u/p' "$0" | sed '$d; s/^# \{0,1\}//'; exit 0 ;;
    -*) printf 'error: unknown option: %s\n' "$1" >&2; exit 2 ;;
    *) break ;;
  esac
done
[ "$#" -le 1 ] || { printf 'error: provide at most one repo path\n' >&2; exit 2; }

scripts_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd) || exit 1
repo="${1:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -n "$repo" ] && cd -- "$repo" && git rev-parse --git-dir >/dev/null 2>&1   || { printf 'error: pass a Git repo path\n' >&2; exit 1; }

forge=""
if command -v bun >/dev/null 2>&1 && command -v jq >/dev/null 2>&1; then
  forge=$(bun "$scripts_dir/forge/forge" resolve ${forge_options[@]+"${forge_options[@]}"} 2>/dev/null) || forge=""
fi
remote_name=""
if [ -n "$forge" ]; then
  remote_name=$(printf '%s\n' "$forge" | jq -r '.remote // empty')
fi
if [ -z "$remote_name" ] && [ "${#forge_options[@]}" -eq 0 ]; then
  remote_name=$(git config --get "branch.$(git branch --show-current).remote" 2>/dev/null || true)
  if [ -z "$remote_name" ] && git remote get-url origin >/dev/null 2>&1; then
    remote_name=origin
  fi
fi

if [ -z "$base" ]; then
  base_refs=(refs/heads/main refs/heads/master)
  if [ -n "$remote_name" ] && [ "$remote_name" != "." ]; then
    base_refs=("refs/remotes/$remote_name/HEAD" "refs/remotes/$remote_name/main" "refs/remotes/$remote_name/master" "${base_refs[@]}")
  fi
  for candidate in "${base_refs[@]}"; do
    if git rev-parse --verify --quiet --end-of-options "$candidate^{commit}" >/dev/null; then
      base="$candidate"
      break
    fi
  done
fi
if [ -z "$base" ] || ! base_sha=$(git rev-parse --verify --quiet --end-of-options "$base^{commit}"); then
  printf 'error: base ref unavailable; pass --base <ref>\n' >&2
  exit 1
fi

changes=""
if [ -n "$forge" ]; then
  provider=$(printf '%s\n' "$forge" | jq -r '.provider')
  forge_host=$(printf '%s\n' "$forge" | jq -r '.host')
  project=$(printf '%s\n' "$forge" | jq -r '.project')
  if [ "$provider" = github ] && raw=$(GH_HOST="$forge_host" gh pr list --repo "$forge_host/$project" --author '@me' --state all --limit 1000 --json number,state,headRefName,headRefOid,isDraft 2>/dev/null); then
    changes=$(printf '%s\n' "$raw" | jq -c '[.[] | {number, head: .headRefName, sha: .headRefOid, state: (if .isDraft and .state == "OPEN" then "draft" else (.state | ascii_downcase) end)}]') || changes=""
  elif [ "$provider" = gitlab ]; then
    project_id=$(jq -rn --arg project "$project" '$project | @uri')
    if raw=$(glab api --hostname "$forge_host" --method GET --paginate --output json "projects/$project_id/merge_requests?scope=all&per_page=100" 2>/dev/null); then
      changes=$(printf '%s\n' "$raw" | jq -c '[.[] | {number: .iid, head: .source_branch, sha: .sha, state: (if .state == "opened" then (if .draft then "draft" else "open" end) else .state end)}]') || changes=""
    fi
  fi
fi
[ -n "$changes" ] || printf 'warn: PR/MR status unavailable for the selected remote\n' >&2

now=$(date +%s)
printf '# base: %s (%s)\n' "$base" "$base_sha"
printf 'SIZE\tAGE\tMERGED\tDIRTY\tREMOTE\tPR_OR_MR\tRECENT_USE\tREVIEW\tWORKTREE\n'

git worktree list --porcelain -z | {
  first_worktree=yes
  while IFS= read -r -d '' field; do
    case "$field" in worktree\ *) worktree="${field#worktree }" ;; *) continue ;; esac
    if [ "$first_worktree" = yes ]; then
      first_worktree=no
      continue
    fi

    size=$(du -sh "$worktree" 2>/dev/null | awk '{print $1}')
    head=$(git -C "$worktree" rev-parse --verify HEAD 2>/dev/null || true)
    head_time=$(git -C "$worktree" log -1 --format='%ct' HEAD 2>/dev/null || true)
    age=unknown
    if [ -n "$head_time" ]; then age="$(( (now - head_time) / 86400 ))d"; fi
    merged=unknown
    if [ -n "$head" ]; then
      if git merge-base --is-ancestor "$head" "$base_sha"; then merged=YES; else merged=no; fi
    fi

    if ! edited=$(git -C "$worktree" status --porcelain --untracked-files=normal 2>/dev/null); then dirty=unknown
    elif [ -z "$edited" ]; then dirty=clean
    elif printf '%s\n' "$edited" | grep -qv '^??'; then
      dirty="wip:$(printf '%s\n' "$edited" | grep -cv '^??')"
    else
      dirty="scratch:$(printf '%s\n' "$edited" | grep -c '^??')"
    fi

    branch=$(git -C "$worktree" symbolic-ref --quiet --short HEAD 2>/dev/null || true)
    push_state=unknown
    if [ -z "$branch" ] && [ -n "$head" ]; then push_state=detached
    elif [ -n "$branch" ] && [ -n "$remote_name" ] && [ "$remote_name" != "." ]; then
      tracking_ref="refs/remotes/$remote_name/$branch"
      push_state=no-remote-ref
      if tracked=$(git rev-parse --verify --quiet "$tracking_ref^{commit}"); then
        push_state=unknown
        if distance=$(git rev-list --left-right --count "$tracked...$head" 2>/dev/null); then
          read -r behind ahead <<< "$distance"
          if [ "$behind" -eq 0 ] && [ "$ahead" -eq 0 ]; then push_state=pushed
          elif [ "$behind" -eq 0 ]; then push_state="ahead:$ahead"
          elif [ "$ahead" -eq 0 ]; then push_state="behind:$behind"
          else push_state="diverged:+$ahead/-$behind"; fi
        fi
      fi
    fi

    change=unknown
    if [ -n "$changes" ] && [ -n "$branch" ]; then
      change=$(printf '%s\n' "$changes" | jq -r --arg b "$branch" --arg sha "$head" '
        [.[] | select(.head == $b)] as $matches
        | ([$matches[] | select(.state == "open" or .state == "draft")]
          + [$matches[] | select(.sha == $sha and .state != "open" and .state != "draft")]) as $relevant
        | if ($relevant | length) == 1 then "#\($relevant[0].number)/\($relevant[0].state)"
          elif ($relevant | length) > 1 then "multiple"
          elif ($matches | length) > 0 then "unknown"
          else "none-found" end'
      ) || change=unknown
    fi

    recent=unknown
    for recent_path in ${recent_worktrees[@]+"${recent_worktrees[@]}"}; do
      if [ "$recent_path" = "$worktree" ]; then recent=reported-recent; break; fi
    done

    case "$dirty:$change:$recent" in
      wip:*|scratch:*) review=hold-local-edits ;;
      unknown:*) review=verify-worktree ;;
      *:*/open:*|*:*/draft:*|*:multiple:*) review=hold-active-review ;;
      *:reported-recent) review=verify-recent-use ;;
      *) if [ "$merged" = YES ] || [[ "$change" == */merged ]]; then
           review=check-before-cleanup
         else review=check-unmerged; fi ;;
    esac

    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n'       "${size:-?}" "$age" "$merged" "$dirty" "$push_state" "$change" "$recent" "$review" "$worktree"
  done
} | sort -t $'\t' -k1,1hr
