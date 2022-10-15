#!/bin/sh

curl -s https://api.oasisscan.com/mainnet/validator/list?pageSize=500 | \
  jq '{
    dump_timestamp: (now * 1000 | floor),
    dump_timestamp_iso: (now | strftime("%Y-%m-%dT%H:%M:%SZ")),
    list: .data.list
  }' \
  >| "$(dirname "$0")/../src/vendors/oasisscan/dump_validators.json"
