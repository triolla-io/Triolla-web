---
name: revive-server
description: |
  Revives the production server when Coolify is unreachable or a build crashed.
  TRIGGER when user says: "revive server", "server crashed", "coolify is down",
  "coolify is unreachable", "build crashed", "disk is full", "server is broken".
---

# Skill: Revive Server

Run the revive script on the remote server via SSH, then report results.

## Steps

1. Run:
```bash
ssh root@178.104.133.110 "bash -s" < .claude/scripts/revive-server.sh
```

2. Report to the user:
   - Disk space before and after cleanup
   - Which build containers were stopped
   - Whether Redis was unblocked
   - Whether coolify-db was restarted
   - Final Coolify health check result (`OK` or still unhealthy)

## Server Details
- Host: `178.104.133.110`
- User: `root`
- Script: `.claude/scripts/revive-server.sh`

## What the script does
1. Checks disk space
2. Stops stuck build containers (any container that isn't a known Coolify service or the app)
3. Prunes stopped containers to free disk
4. Unblocks Redis (`stop-writes-on-bgsave-error no`) — Redis locks itself when disk was full
5. Starts `coolify-db` (Postgres) if it's missing — it crashes when disk fills and doesn't auto-restart
6. Restarts Coolify to reconnect to the database
7. Runs health check on `http://localhost:8000/api/health`