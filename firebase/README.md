# Spin the Wheel — Firebase Backend

## Quick start (emulators)
```bash
cd firebase
npm i
npm run build
# Terminal A: start emulators
npm run serve
# Terminal B: seed config
npm run seed
```
Project id is set to `demo-spin-the-wheel` via `.firebaserc`. The frontend connects to `127.0.0.1` emulators in `__DEV__`.

## Cloud Functions
- `spinWheel(clientRequestId)` — server-authoritative spin with **weighted random**, **cooldown**, and **idempotency** (same `clientRequestId` returns the same result if retried).
- `getHistory()` — returns last 100 spins for the signed-in user.

## Firestore
- `wheelConfig/default`: `{ cooldownSec, segments[8] }` with `{ label, weight, color }`.
- `spins/{id}`: `{ uid, clientRequestId, winningIndex, prizeLabel, createdAt, nextAllowedAt }`.

## Security Rules
- Clients **read** `wheelConfig/*`; cannot mutate.
- Clients **read** their own `spins` docs; **cannot write**. Only functions write spins using Admin SDK.

## Testing
- `npm test` runs Jest unit tests (sample test covers weighted selection sanity).
- Add more tests for cooldown logic by stubbing time.