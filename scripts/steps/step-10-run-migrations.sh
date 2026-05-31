#!/bin/bash
. /opt/sf-template/scripts/steps/shared.sh
SLUG=$1; [ -z "$SLUG" ] && exit_fail "Usage: $0 SLUG"
mark_step_running "$SLUG" "10_run_migrations"

BASE="/opt/sf-instances/${SLUG}"
PB_PORT=$(echo "$(read_state $SLUG)" | jq -r '.ports.pb_port')

fuser -k "${PB_PORT}/tcp" 2>/dev/null || true; sleep 1

"$BASE/pocketbase" serve --http "127.0.0.1:${PB_PORT}" --dir "$BASE/pb_data" &
PB_PID=$!
trap "kill $PB_PID 2>/dev/null; wait $PB_PID 2>/dev/null" EXIT
wait_for_http "http://127.0.0.1:${PB_PORT}/api/health" 15 2 || \
  { mark_step_failed "$SLUG" "10_run_migrations" "PocketBase failed to start for migrations"; exit_fail "PocketBase won't start"; }

info "Running pending migrations..."
"$BASE/pocketbase" migrate up \
  --dir "$BASE/pb_migrations" \
  --automigrate 2>&1
RC=$?

kill $PB_PID 2>/dev/null; wait $PB_PID 2>/dev/null; trap - EXIT; sleep 1

[ $RC -ne 0 ] && { mark_step_failed "$SLUG" "10_run_migrations" "migrate up exited $RC"; exit_fail "Migrations failed"; }

mark_step_ok "$SLUG" "10_run_migrations"
MIGRATION_COUNT=$(ls "$BASE/pb_migrations/"*.js 2>/dev/null | wc -l)
ok "Migrations complete ($MIGRATION_COUNT migration files)"
