# Zëri Im (My Voice)

Anonymous storytelling space for **SHFK Penestia** students — React + Tailwind CSS + Framer Motion, with a **MySQL** backend (Express).

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MySQL](https://www.mysql.com/) 8+ (local or remote)

## Setup

1. **Install dependencies**

   ```bash
   cd "C:\Users\User\OneDrive\Desktop\zeri im"
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and set your MySQL credentials and advocate password:

   ```bash
   copy .env.example .env
   ```

   | Variable | Description |
   |----------|-------------|
   | `MYSQL_*` | Database connection |
   | `ADVOCATE_PASSWORD` | Password for `/advocate` dashboard |
   | `JWT_SECRET` | Long random string for advocate sessions |
   | `CLIENT_ORIGIN` | Frontend URL (default `http://localhost:5173`) |

3. **Create database tables**

   ```bash
   npm run db:setup
   ```

4. **Run development**

   ```bash
   npm run dev
   ```

   - App: [http://localhost:5173](http://localhost:5173)
   - API: [http://localhost:3001](http://localhost:3001)

## Production build

```bash
npm run build
npm run preview
```

Serve `dist/` behind your web server and run `node server/index.js` with production `CLIENT_ORIGIN` and secure env vars.

## Features

- **Hero**, **share form** (1000 chars, categories, public/private), **public wall** (masonry, filters, “Edhe unë”, replies)
- **Advocate dashboard** at `/advocate` — all stories including private; approve/hide/delete; priority flag for self-harm keywords
- **Moderation**: public posts start as `pending`; basic profanity/name lists; rate limit (5 stories/hour per browser fingerprint)
- **Albanian UI** with English toggle

## School contacts

Replace placeholder phone/email in `src/i18n/translations.js` (`helpPhone`, `helpEmail`, `selfHarmHelp`).
