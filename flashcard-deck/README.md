# Interactive Flashcard Deck

A full-stack MERN (MongoDB, Express, React, Node.js) web application where users create interactive flashcards that go through an admin review pipeline. Admins can inspect, rate, accept, or decline cards, and users receive real-time notifications about their submissions.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Default Credentials](#default-credentials)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Application Workflow](#application-workflow)
- [Screenshots](#screenshots)

---

## Features

### User Module
- User registration and login with JWT authentication
- Create, edit, and delete flashcards
- Submit flashcards for admin review
- View card status (Pending / Accepted / Declined)
- Interactive flip-card preview with CSS 3D animations
- Self-test mode for accepted cards
- Shuffle deck feature
- Receive notifications when admin reviews a card

### Admin Module
- Admin login (no registration — seeded in database)
- Dashboard with analytics (total cards, pending, accepted, declined, average rating)
- Filter and search cards by status, category, and keyword
- View full card details including submitter info
- Star rating system (1–5)
- Add feedback comments
- Accept or decline cards
- Automatic user notification on review

### Interactive Features
- **Flip Animation** — Click to flip between question and answer using CSS 3D transforms
- **Self Test Mode** — Practice accepted cards in a flip-card modal
- **Shuffle Deck** — Randomize card order for practice
- **Progress Tracker** — See stats on how many cards are pending, accepted, or declined

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, React Router 6, Axios     |
| Backend  | Node.js, Express.js                 |
| Database | MongoDB with Mongoose               |
| Auth     | JWT (JSON Web Tokens), bcryptjs     |
| Build    | Vite 5                              |
| Styling  | Custom CSS (responsive)             |

---

## Project Structure

```
flashcard-deck/
├── client/                          # React frontend (Vite)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js            # Navigation bar with notification badge
│   │   ├── context/
│   │   │   └── AuthContext.js        # Global auth state (JWT)
│   │   ├── pages/
│   │   │   ├── Login.js             # User login page
│   │   │   ├── Register.js          # User registration page
│   │   │   ├── UserDashboard.js     # User dashboard with cards & stats
│   │   │   ├── CreateCard.js        # Create new flashcard form
│   │   │   ├── EditCard.js          # Edit existing flashcard form
│   │   │   ├── Notifications.js     # User notifications inbox
│   │   │   ├── AdminLogin.js        # Admin login page
│   │   │   ├── AdminDashboard.js    # Admin dashboard with filters
│   │   │   └── AdminCardReview.js   # Admin card review & rating page
│   │   ├── services/
│   │   │   └── api.js              # Axios instance & API functions
│   │   ├── App.jsx                  # Root component with routing
│   │   ├── App.css                  # Global styles
│   │   └── index.jsx                # Entry point
│   ├── index.html                   # Vite HTML entry
│   ├── package.json
│   └── vite.config.js               # Vite config with proxy
│
├── server/                          # Express.js backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # User register, login, getMe
│   │   ├── cardController.js        # Flashcard CRUD + stats
│   │   ├── adminController.js       # Admin login, dashboard, review
│   │   └── notificationController.js # Notification CRUD
│   ├── middleware/
│   │   └── auth.js                  # JWT verification + admin guard
│   ├── models/
│   │   ├── User.js                  # User schema (bcrypt pre-save hook)
│   │   ├── Admin.js                 # Admin schema (bcrypt pre-save hook)
│   │   ├── Flashcard.js             # Flashcard schema with status tracking
│   │   └── Notification.js          # Notification schema
│   ├── routes/
│   │   ├── auth.js                  # /api/auth/*
│   │   ├── cards.js                 # /api/cards/*
│   │   ├── admin.js                 # /api/admin/*
│   │   └── notifications.js         # /api/notifications/*
│   ├── .env                         # Environment variables
│   ├── index.js                     # Server entry point
│   ├── seed.js                      # Seeds admin account
│   └── package.json
```

---

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local instance or MongoDB Atlas)
- **npm** or **yarn**

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd flashcard-deck
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create or edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flashcard-deck
JWT_SECRET=flashcard_deck_secret_key_2024_secure
```

### 5. Seed the admin account

```bash
cd ../server
npm run seed
```

This creates the admin account and a demo user account in MongoDB. **Run this only once.**

---

## Running the Application

You need **two terminals** open simultaneously.

### Terminal 1 — Backend Server

```bash
cd server
npm start
```

Server runs at **http://localhost:5000**

### Terminal 2 — Frontend (Vite)

```bash
cd client
npm start
```

Frontend runs at **http://localhost:3000**

Vite automatically proxies all `/api` requests to the backend at port 5000.

---

## Default Credentials

### Admin (pre-seeded)

| Field    | Value                |
|----------|----------------------|
| Email    | admin@flashcard.com  |
| Password | admin123             |

### User (pre-seeded demo user)

| Field    | Value                |
|----------|----------------------|
| Name     | Demo User            |
| Email    | user@flashcard.com   |
| Password | user123              |

You can also register a new account via the **Register** page.

---

## API Endpoints

### Authentication

| Method | Endpoint            | Auth  | Description         |
|--------|---------------------|-------|---------------------|
| POST   | `/api/auth/register`| Public| Register new user   |
| POST   | `/api/auth/login`   | Public| User login          |
| GET    | `/api/auth/me`      | User  | Get current user    |

### Flashcards (User)

| Method | Endpoint           | Auth | Description              |
|--------|--------------------|------|--------------------------|
| POST   | `/api/cards`       | User | Create a new card        |
| GET    | `/api/cards/my`    | User | Get all user's cards     |
| GET    | `/api/cards/stats` | User | Get user card stats      |
| GET    | `/api/cards/:id`   | User | Get card by ID           |
| PUT    | `/api/cards/:id`   | User | Update card (pending)    |
| DELETE | `/api/cards/:id`   | User | Delete card              |

### Admin

| Method | Endpoint                   | Auth  | Description                    |
|--------|----------------------------|-------|--------------------------------|
| POST   | `/api/admin/login`         | Public| Admin login                    |
| GET    | `/api/admin/dashboard`     | Admin | Dashboard stats                |
| GET    | `/api/admin/cards`         | Admin | All cards (filterable)         |
| GET    | `/api/admin/cards/:id`     | Admin | Card details                   |
| PUT    | `/api/admin/cards/:id/review`| Admin | Accept/decline + rate card  |

### Notifications (User)

| Method | Endpoint                       | Auth | Description              |
|--------|--------------------------------|------|--------------------------|
| GET    | `/api/notifications`           | User | Get all notifications    |
| GET    | `/api/notifications/unread-count` | User | Get unread count     |
| PUT    | `/api/notifications/:id/read`  | User | Mark notification as read|
| PUT    | `/api/notifications/read-all`  | User | Mark all as read         |

---

## Database Models

### User
```json
{
  "name": "String (required, 2-50 chars)",
  "email": "String (required, unique, lowercase)",
  "password": "String (required, min 6 chars, bcrypt hashed)",
  "role": "'user'",
  "createdAt": "Date"
}
```

### Admin
```json
{
  "email": "String (required, unique)",
  "password": "String (required, bcrypt hashed)",
  "role": "'admin'",
  "createdAt": "Date"
}
```

### Flashcard
```json
{
  "userId": "ObjectId (ref: User, required)",
  "title": "String (required, max 100)",
  "category": "String (enum: JavaScript, Python, React, Node.js, CSS, HTML, Database, DevOps, Other)",
  "question": "String (required, max 500)",
  "answer": "String (required, max 1000)",
  "difficulty": "String (enum: Easy, Medium, Hard)",
  "tags": "[String]",
  "animationType": "String (enum: flip, slide, zoom, fade)",
  "status": "String (enum: pending, accepted, declined, default: pending)",
  "adminRating": "Number (0-5)",
  "adminFeedback": "String (max 500)",
  "submittedAt": "Date",
  "reviewedAt": "Date"
}
```

### Notification
```json
{
  "userId": "ObjectId (ref: User, required)",
  "cardId": "ObjectId (ref: Flashcard, required)",
  "message": "String (required)",
  "type": "String (enum: accepted, declined, rated)",
  "isRead": "Boolean (default: false)",
  "createdAt": "Date"
}
```

---

## Application Workflow

```
1. User registers / logs in
        │
2. User creates a flashcard
        │
3. Card is submitted (status: pending)
        │
4. Admin sees card in dashboard queue
        │
5. Admin opens card → views details + preview
        │
6. Admin rates (1-5 stars) + adds feedback
        │
7. Admin clicks Accept or Decline
        │
8. Notification is sent to the user
        │
9. User sees notification in inbox
```

### User Flow
```
Register → Login → Dashboard → Create Card → Submit → View Status → Get Notification
```

### Admin Flow
```
Login → Dashboard → Filter/Search Cards → Review Card → Rate → Accept/Decline → User Notified
```

---

## Card Statuses

| Status    | Meaning                                    |
|-----------|--------------------------------------------|
| `pending` | Awaiting admin review (default on create)  |
| `accepted`| Approved by admin                          |
| `declined`| Rejected by admin with feedback            |

---

## Creative Features

| Feature          | Description                                                 |
|------------------|-------------------------------------------------------------|
| Flip Animation   | 3D CSS transform to flip between question and answer        |
| Self Test Mode   | Practice accepted cards in a fullscreen flip-card modal     |
| Shuffle Deck     | Randomize card order for variety in practice                |
| Star Rating      | 1-5 star interactive rating on card review                  |
| Notification Badge | Real-time unread count in the navbar                     |
| Card Filters     | Admin can filter by status, category, and search keyword    |
| Tags             | Users can add tags to categorize cards further              |

---

## Development Notes

- Passwords are hashed with **bcrypt** (10 salt rounds) via Mongoose `pre('save')` hooks
- JWT tokens expire after **30 days**
- Cards can only be edited/deleted when status is `pending`
- Admin account is seeded — no registration endpoint for admin
- Vite dev server proxies `/api` to `http://localhost:5000`
