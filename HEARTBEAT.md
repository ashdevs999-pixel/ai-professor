# HEARTBEAT.md

# Periodic reminder system

## Every Heartbeat (when polled):

1. Check `memory/reminders-state.json` for last reminder timestamp
2. If 2+ hours since last reminder AND outstanding items exist → Send brief reminder
3. Update timestamp after reminding

## Outstanding Items (check these):

(none currently - all completed)

## Reminder Format:

When reminding, send:
"⏰ Reminder: [X] outstanding item(s) pending. Say 'details' for more info."

## State File:

Track in: `memory/reminders-state.json`
