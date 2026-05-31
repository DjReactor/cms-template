#!/bin/bash
. /opt/sf-template/scripts/steps/shared.sh
SLUG=$1; [ -z "$SLUG" ] && exit_fail "Usage: $0 SLUG"
mark_step_running "$SLUG" "10_run_migrations"

BASE="/opt/sf-instances/${SLUG}"
PB_PORT=$(echo "$(read_state $SLUG)" | jq -r '.ports.pb_port')

fuser -k "${PB_PORT}/tcp" 2>/dev/null || true; sleep 1

info "Running pending migrations..."
"$BASE/pocketbase" migrate up \
  --dir "$BASE/pb_data" \
  --automigrate 2>&1
RC=$?

[ $RC -ne 0 ] && { mark_step_failed "$SLUG" "10_run_migrations" "migrate up exited $RC"; exit_fail "Migrations failed"; }

mark_step_ok "$SLUG" "10_run_migrations"
MIGRATION_COUNT=$(ls "$BASE/pb_migrations/"*.js 2>/dev/null | wc -l)
ok "Migrations complete ($MIGRATION_COUNT migration files)"
