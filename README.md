# Echoes API

Send messages, videos, photos, and voice notes to your future self. Choose a date — the API delivers it back to you when the time comes.

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Nodemailer for delivery
- node-cron for scheduling
- Multer for media uploads

## Getting started

```bash
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

## API endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register a new account |
| POST | /api/auth/login | Login and get tokens |
| POST | /api/auth/refresh | Refresh access token |
| POST | /api/auth/logout | Logout |

### Echoes
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/echoes | Create a text echo |
| GET | /api/echoes | List all your echoes |
| GET | /api/echoes/:id | Get a single echo |
| PUT | /api/echoes/:id | Update a pending echo |
| DELETE | /api/echoes/:id | Cancel a pending echo |

### Media
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/media/upload | Upload a photo, video, or voice note |

## Example — create a text echo

```json
POST /api/echoes
Authorization: Bearer <token>

{
  "type": "text",
  "content": "Hey future me, I hope you crushed those goals.",
  "deliverAt": "2027-01-01T09:00:00.000Z",
  "title": "New year message"
}
```

## Project structure

```
src/
  config/        → DB connection
  controllers/   → Route logic
  middleware/    → Auth, upload, error handling
  models/        → User & Echo schemas
  routes/        → API routes
  services/      → Scheduler & delivery
```
