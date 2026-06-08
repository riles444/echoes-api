# Echoes RPG API

> *"The past is not gone. It is waiting to be heard."*

Backend API for **Echoes** — a fantasy RPG where players collect ancient memories called Echoes to unlock forgotten powers and defeat the Void King before he erases history.

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication

## Getting started

```bash
npm install
cp .env.example .env
# Fill in MONGODB_URI and JWT_SECRET
npm run seed     # seed echoes, enemies, companions
npm run dev      # start dev server
```

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Get current user |

### Character
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/characters | Create character (choose class) |
| GET  | /api/characters | Get your character |
| POST | /api/characters/level-up | Level up |
| POST | /api/characters/move | Travel to a location |
| POST | /api/characters/choice | Make a story choice |
| DELETE | /api/characters | Delete character |

### Echoes
| Method | Route | Description |
|--------|-------|-------------|
| GET  | /api/echoes | List all echoes |
| GET  | /api/echoes/great | Track the Seven Great Echoes |
| GET  | /api/echoes/:id | Get echo details |
| POST | /api/echoes/:id/collect | Absorb an echo |

### Enemies
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/enemies | Enemies at your current location |
| GET | /api/enemies/all | All enemies |
| GET | /api/enemies/:id | Enemy details |

### Companions
| Method | Route | Description |
|--------|-------|-------------|
| GET  | /api/companions | All companions + recruit status |
| GET  | /api/companions/:id | Companion details |
| POST | /api/companions/:id/recruit | Recruit a companion |

### Battles
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/battles | Start a battle |
| POST | /api/battles/:id/turn | Take a turn (attack / echo / flee) |
| GET  | /api/battles/:id | Get battle state |
| GET  | /api/battles/history | Battle history |

## Classes
| Class | Strength |
|-------|----------|
| Echo Knight | Highest HP & defense |
| Echo Mage | Powerful magic & Echo abilities |
| Echo Ranger | Fastest, high attack |
| Echo Healer | Support & restoration |

## Locations
- Whispering Forest
- Crystal Desert
- Forgotten Kingdom
- Echo Caverns
- The City of Memories

## The Seven Great Echoes
Collect all 7 to unlock the power needed to defeat the Void King.
