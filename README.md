# Atlas

A two-person expense-splitting and personal budgeting app for partners who share some expenses and keep others separate. Expenses are logged via a Telegram bot using natural language and viewed through a React web dashboard.

---

## Monorepo Structure

```
Atlas/
├── apps/
│   ├── bot/          # Telegram bot (Node.js + TypeScript)
│   └── web/          # React SPA (Vite + TanStack)
├── firebase/         # Firestore rules, indexes, firebase.json
├── docs/             # Product scoping and requirements
└── pnpm-workspace.yaml
```

## Tech Stack

| Layer | Technology |
|---|---|
| Package manager | pnpm workspaces |
| Bot runtime | Node.js, TypeScript, `node-telegram-bot-api` |
| Web framework | React 18, Vite 5, TailwindCSS 4 |
| Routing | TanStack Router (file-based) |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod |
| Backend | Firebase (Firestore + Auth) |
| Bot–Firebase | Firebase Admin SDK |
| Web–Firebase | Firebase Client SDK v10 |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- A Firebase project with Firestore and Authentication enabled
- A Telegram bot token (via [@BotFather](https://t.me/BotFather))

### Install

```bash
pnpm install
```

### Environment Variables

**`apps/bot/.env`** (copy from `.env.example`):

```env
TELEGRAM_BOT_TOKEN=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

**`apps/web/.env.local`** (copy from `.env.example`):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Development

Run both apps concurrently from the root:

```bash
pnpm dev:web   # Vite dev server (web)
pnpm dev:bot   # tsx watch (bot)
```

Or run them individually:

```bash
cd apps/web && pnpm dev
cd apps/bot  && pnpm dev
```

Type-check all packages:

```bash
pnpm typecheck
```

---

## How It Works

1. **Log an expense** — Send a message to the Telegram bot:
   - `we spent $50 dinner` → shared expense
   - `me spent $12 coffee` → personal expense
2. **Bot parses** the message with a Zod schema and writes the expense to Firestore via the Admin SDK.
3. **Web dashboard** reads from Firestore via the client SDK, displaying shared expenses, personal expenses, and settlement history.
4. **Auth** — Firebase Authentication handles login/signup on the web app.

---

## Firebase

Deploy Firestore rules and indexes:

```bash
cd firebase
firebase deploy --only firestore
```

> **Note:** The default `firestore.rules` denies all access. Update the rules before deploying to production.

---

## Project Status

Early scaffolding. Core infrastructure is in place; feature implementation is in progress.
