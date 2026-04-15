#!/usr/bin/env bash
# Build a fresh SQLite database from schema + seed.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
DB="${ROOT}/alumni.db"
rm -f "$DB"
sqlite3 "$DB" < "${ROOT}/sql/01_schema.sql"
sqlite3 "$DB" < "${ROOT}/sql/02_seed.sql"
echo "Created ${DB}"
echo "Try: sqlite3 ${DB} 'SELECT * FROM v_alumni_directory;'"
