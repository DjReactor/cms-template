#!/bin/bash
. /opt/sf-template/scripts/steps/shared.sh
SLUG=$1; [ -z "$SLUG" ] && exit_fail "Usage: $0 SLUG"
mark_step_running "$SLUG" "08_build_artifact"

BASE="/opt/sf-instances/${SLUG}"
VERSION=$(cat "$BASE/.sf-version")
CACHE_FILE="/opt/sf-build-cache/v${VERSION}/build.tar.gz"

if [ -f "$CACHE_FILE" ]; then
  info "Using cached build artifact: v${VERSION}"
  tar -xzf "$CACHE_FILE" -C "$BASE/" 2>&1
  [ ${PIPESTATUS[0]} -ne 0 ] && \
    { mark_step_failed "$SLUG" "08_build_artifact" "Failed to extract build artifact"; exit_fail "tar extraction failed"; }
  SOURCE="cache"
else
  info "No cached artifact for v${VERSION}. Copying from master template .next/..."
  [ ! -d "/opt/sf-template/.next" ] && \
    { mark_step_failed "$SLUG" "08_build_artifact" "Master template .next/ missing"; exit_fail "Master template has no .next/ directory. Run a build first."; }
  rsync -a /opt/sf-template/.next/ "$BASE/.next/" 2>&1
  [ ${PIPESTATUS[0]} -ne 0 ] && \
    { mark_step_failed "$SLUG" "08_build_artifact" "rsync of .next/ failed"; exit_fail "rsync failed"; }
  SOURCE="master"
fi

mark_step_ok "$SLUG" "08_build_artifact"
ok "Build artifact deployed (source: $SOURCE)"
info "Version: $VERSION"
