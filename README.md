# Sneaker Drop 

Limited edition sneaker drop where stock moves in real time. Users reserve a unit and can hold it for 60 seconds, and complete the purchase before the hold expires. Live stock counts notified to every connected browser and a guarantee that the last unit can only ever be sold once.

**Stack:** React 19 + TypeScript + Vite · Node.js + Express · PostgreSQL + Prisma · Socket.io

**Live app:** https://sneaker-drop.hossain-ahamed.com
**API:** https://api.sneaker-drop.hossain-ahamed.com

---

## Running locally

**Prerequisites:** Node.js 20+, a running PostgreSQL instance.

### Backend

```bash
cd backend
npm install
cp .env.sample .env
npm run db:migrate
npm run dev
```

`backend/.env`:

```ini
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/sneaker-drop
PORT=5500
CORS_ORIGIN=http://localhost:5501
```

### Frontend

```bash
cd frontend
npm install
cp .env.sample .env
npm run dev
```

`frontend/.env`:

```ini
VITE_API_URL=http://localhost:5500/api/v1
VITE_SOCKET_URL=http://localhost:5500
VITE_APP_NAME=Sneaker Drop
```

Production

```bash
cd backend
npm run db:generate
npm run db:deploy 
npm run build
npm start
```

---

## Database schema

**User** `id`, `username` (unique), `name`, `created_at`.

**Drop** `id`, `name`, `price`, `total_stock`, `available_stock`, `starts_at`, `created_at`.

**Reservation** `id`, `status` (`ACTIVE`  `COMPLETED`  `EXPIRED`), `expires_at`, `created_at`,
`user_id`, `drop_id`.

**Purchase**  `id`, `purchased_at`, `user_id`, `drop_id`, `reservation_id` (unique).

Flow: a user reserves an item → `Drop.available_stock` decremented by one and `Reservation` is created. Complete it
in time → `Purchase`is created→reservation goes `EXPIRED` and the unit returns to
`available_stock`.

---

## Creating a drop

Create drops by POSTing to the API:

**`POST /api/v1/drops`**

```json
{
  "name": "Air Jordan 1",
  "price": 220,
  "total_stock": 100,
  "starts_at": "2026-12-01T10:00:00Z"
}
```

`available_stock` is initialized to `total_stock`. A drop which`starts_at`in the future cannot be reserved. 

---

## Architecture: the 60-second expiration

Expiry is handled in **Postgres.** as database is the single source of truth.

Two things work together:

**1. The purchase check.** Completing a purchase is a conditional update:

```sql
UPDATE "Reservation" SET status = 'COMPLETED'
WHERE id = $1 AND status = 'ACTIVE' AND expires_at > now()
```

An expired hold can never be purchased, **regardless of whether anything has swept it yet**.
Correctness does not depend on a timer.

**2. The sweep.** A background loop (`reservation.scheduler.ts`) ticks every 5 seconds, takes a batch
of up to 100 `ACTIVE` reservations whose `expires_at` has passed, and for each one  in its own
transaction and marks it `EXPIRED`, returns the unit to `available_stock`, and broadcasts
`stock:updated`. So the sweep's only job is **returning stock**, not enforcing the deadline

---

## Concurrency: preventing a double-claim on the last unit

**The rule: never read stock and then write it.** 

```ts
const drop = await findDrop(id);
if (drop.available_stock > 0) { 
  await decrementStock(id); 
}
```

Instead the condition and the mutation are a **single statement**:

```sql
UPDATE "Drop" SET available_stock = available_stock - 1
WHERE id = $1 AND available_stock > 0
RETURNING available_stock
```

Postgres holds a row lock for the duration of the `UPDATE`. Concurrent writers serialize on that lock
and each re-evaluates `available_stock > 0` against the value it now sees not one read earlier. When
the last unit goes:

- **rows returned** → you won, `RETURNING` gives back the new stock level
- **zero rows** → you lost the race → `409 Out of stock`

The same conditional-update shape guards the other transitions: restoring stock is capped by
`available_stock < total_stock`, and a purchase racing the expiry sweep on the same reservation both
require `status = 'ACTIVE'`, so only one can match.

**Transactions.** Reserve (claim stock + insert reservation) and purchase (flip the reservation +
insert the purchase row) each run in one transaction via `lib/unitOfWork.ts`, so they commit or roll
back together. Socket events are emitted **after** commit, never inside the transaction, so a
rolled-back reservation can never reach clients.

---

## Real-time layer

`lib/socket.ts` is a feature-agnostic transport connections and rooms only. Each feature owns its
own event:

| Event                     | Emitted when              | Payload                                                  |
| ------------------------- | ------------------------- | -------------------------------------------------------- |
| `stock:updated`         | reserve, expire, purchase | `{ drop_id, available_stock }`                         |
| `activity:new-purchase` | purchase                  | `{ drop_id, drop_name, purchased_at, name, username }` |

Clients join one room per visible drop (`drop:<id>`), so a browser only receives traffic for drops it
is actually looking at.

On the frontend, socket events are folded into the TanStack Query cache (`setQueryData`) rather than
component state, so a live push and a refetch take the same render path and cannot disagree.

Stock only moves on **reserve** (−1) and **expire** (+1). A purchase converts a unit that is already
held, so it does not move the number again.

---

## Identity

There are no passwords  the spec needed a Users table for the activity feed, not a login system. But
identity is still resolved server-side, never trusted from the client.

- **Sign up** (`POST /users`) creates the account (username + display name) and sets an **httpOnly**
  cookie holding the user id.
- **Sign in** (`POST /users/signin`) takes just a username and re-issues that cookie, so a returning
  browser picks up its own purchase history instead of becoming a new shopper. An unknown username
  returns 404, which the dialog turns into a prompt to sign up instead.
- An `identifyUser` middleware resolves the cookie into `req.userId`. **Reserve and purchase do not
  accept `user_id` in the request body at all**  a client cannot act as another user.
- A cookie pointing at a deleted user returns 404 *and* clears itself, so a stale cookie self-heals.

Username uniqueness is enforced by the Postgres `@unique` constraint rather than a read-then-write
availability check  same reason as the stock decrement, only the constraint is race-safe.

> **Two-window demo:** an httpOnly cookie is shared across a browser's normal windows — use one normal
> window and one incognito window to act as two shoppers.

---

## Project structure

**Backend :  modular monolith.** One folder per feature (`drop`, `reservation`, `purchase`, `user`),
each with its own route / controller / validation / service / business / repository layer. Prisma is
touched only in the repository; cross-feature calls go through the callee's service.

```
backend/src/
  features/<name>/    route · controller · validation · service · business · repository
  lib/                prisma, socket, unitOfWork
  middlewares/        validateRequest, identifyUser, error handling
  prisma/             schema + migrations
```

**Frontend :  feature-sliced.** Same ownership idea: each feature owns its api, socket subscription,
components and types.

```
frontend/src/
  app/                config, layouts, providers, routes
  features/<name>/    api · socket · components · pages · store · types
  shared/             axios instance, queryClient, socket transport
```

Every backend read/write goes through a TanStack Query hook — no component fetches directly. Zustand
holds only what Query cannot own (which drops this browser is holding). The whole request→response
chain is `snake_case`, matching the database columns, so one field name survives from DB column to
React prop with no mapper layer.
