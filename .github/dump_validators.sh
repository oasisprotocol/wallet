#!/bin/sh

curl -s https://nexus.oasis.io/v1/consensus/validators?limit=500 |
  jq '{
    dump_timestamp: (now * 1000 | floor),
    dump_timestamp_iso: (now | strftime("%Y-%m-%dT%H:%M:%SZ")),
    list: .validators
  }' \
    >|"$(dirname "$0")/../src/vendors/nexus/dump_validators.json"
