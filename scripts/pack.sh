#!/bin/bash
set -e
cd "$(dirname "$0")/.."
OUT="ficpulse.zip"
rm -f "$OUT"
zip -r "$OUT" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".git/*" \
  -x "*.db" \
  -x "*.db-journal" \
  -x ".env" \
  -x "ficpulse.zip" \
  -x "src/generated/prisma/*"
echo "Created $OUT ($(du -h "$OUT" | cut -f1))"
