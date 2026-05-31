#!/bin/bash
. /opt/sf-template/scripts/steps/shared.sh
SLUG=$1; [ -z "$SLUG" ] && exit_fail "Usage: $0 SLUG"

STATE=$(read_state "$SLUG")
STATUS=$(echo "$STATE" | jq -r '.steps."17_register".status')
[ "$STATUS" = "verified" ] && exit_ok "Already verified"
[ "$STATUS" = "pending" ]  && exit_fail "Step not run yet"

RECORD_ID=$(echo "$STATE" | jq -r '.runtime.superadmin_record_id // ""')
ERRORS=()

[ -z "$RECORD_ID" ] || [ "$RECORD_ID" = "null" ] && \
  ERRORS+=("No record ID in state file — registration may have failed")

if [ -n "$RECORD_ID" ] && [ "$RECORD_ID" != "null" ]; then
  SA_TOKEN=$(pb_authenticate "$SF_SUPERADMIN_PB_URL" \
    "$SF_SUPERADMIN_PB_ADMIN_EMAIL" "$SF_SUPERADMIN_PB_ADMIN_PASSWORD")
  [ -z "$SA_TOKEN" ] && ERRORS+=("Cannot reach Super Admin PocketBase")

  if [ -n "$SA_TOKEN" ]; then
    RECORD=$(pb_api "$SA_TOKEN" GET \
      "${SF_SUPERADMIN_PB_URL}/api/collections/instances/records/${RECORD_ID}")
    R_SLUG=$(echo "$RECORD" | jq -r '.slug // ""')
    [ "$R_SLUG" != "$SLUG" ] && ERRORS+=("Record slug mismatch: got '$R_SLUG', expected '$SLUG'")
  fi
fi

if [ ${#ERRORS[@]} -gt 0 ]; then
  mark_step_verify_failed "$SLUG" "17_register" "$(printf '%s\n' "${ERRORS[@]}")"
  fail "Registration verification failed:"; printf '  %s\n' "${ERRORS[@]}" >&2; exit 1
fi

mark_step_verified "$SLUG" "17_register"
ok "Instance record verified in Super Admin (ID: $RECORD_ID)"
