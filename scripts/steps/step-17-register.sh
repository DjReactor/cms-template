#!/bin/bash
. /opt/sf-template/scripts/steps/shared.sh
SLUG=$1; [ -z "$SLUG" ] && exit_fail "Usage: $0 SLUG"
mark_step_running "$SLUG" "17_register"

STATE=$(read_state "$SLUG")
DOMAIN=$(echo "$STATE" | jq -r '.input.domain')
BUSINESS_NAME=$(echo "$STATE" | jq -r '.input.business_name')
BO_EMAIL=$(echo "$STATE" | jq -r '.input.bo_email')
NEXTJS_PORT=$(echo "$STATE" | jq -r '.ports.nextjs_port')
PB_PORT=$(echo "$STATE" | jq -r '.ports.pb_port')
VERSION=$(echo "$STATE" | jq -r '.runtime.template_version')
TEMPLATE=$(echo "$STATE" | jq -r '.input.template')
NICHE=$(echo "$STATE" | jq -r '.input.niche // ""')
CHANNEL=$(echo "$STATE" | jq -r '.input.channel')
INTERNAL_SECRET=$(echo "$STATE" | jq -r '.secrets.internal_secret')
SSL_ISSUED=$(echo "$STATE" | jq -r '.runtime.ssl_issued')

# Authenticate to Super Admin PocketBase
SA_TOKEN=$(pb_authenticate "$SF_SUPERADMIN_PB_URL" \
  "$SF_SUPERADMIN_PB_ADMIN_EMAIL" "$SF_SUPERADMIN_PB_ADMIN_PASSWORD")

if [ -z "$SA_TOKEN" ]; then
  mark_step_failed "$SLUG" "17_register" "Cannot reach Super Admin PocketBase"
  exit_fail "Super Admin PocketBase unreachable"
fi

RECORD=$(pb_api "$SA_TOKEN" POST \
  "${SF_SUPERADMIN_PB_URL}/api/collections/instances/records" \
  "{
    \"slug\": \"$SLUG\",
    \"domain\": \"$DOMAIN\",
    \"business_name\": $(echo "$BUSINESS_NAME" | jq -Rs .),
    \"bo_email\": \"$BO_EMAIL\",
    \"nextjs_port\": $NEXTJS_PORT,
    \"pb_port\": $PB_PORT,
    \"current_version\": \"$VERSION\",
    \"active_template\": \"$TEMPLATE\",
    \"niche\": \"$NICHE\",
    \"channel\": \"$CHANNEL\",
    \"status\": \"active\",
    \"ssl_enabled\": $SSL_ISSUED,
    \"health_ok\": true,
    \"last_health_check\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
    \"internal_secret\": \"$INTERNAL_SECRET\",
    \"modules\": {\"blog\":false,\"retell\":false,\"reviews\":false,\"analytics\":false,\"crm\":true},
    \"deployed_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
  }")

RECORD_ID=$(echo "$RECORD" | jq -r '.id // empty')
[ -z "$RECORD_ID" ] && \
  { ERR=$(echo "$RECORD" | jq -r '.message // "Unknown"'); mark_step_failed "$SLUG" "17_register" "$ERR"; exit_fail "Registry write failed: $ERR"; }

set_state "$SLUG" ".runtime.superadmin_record_id = \"$RECORD_ID\""
mark_step_ok "$SLUG" "17_register"
ok "Instance registered in Super Admin (record: $RECORD_ID)"
