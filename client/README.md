# Todolist Bloom — Fullstack Productivity Application

Bloom is a fullstack productivity web application built with React, Node.js, and PostgreSQL.

It aims to bring task management, scheduling, goal tracking, and personal organization into a single customizable dashboard.

**Status:** In development

## Features

The following features are planned:

**Task Management**
- Create, update, complete, and delete tasks.
- Set priorities and deadlines.
- View tasks in monthly and weekly calendars.
- Receive scheduled email reminders.

**Productivity**
- Daily task overview and progress tracking.
- Weekly and monthly goals.
- Habit tracking and quick notes.
- Daily motivational messages.

**Dashboard Customization**
- Reposition widgets using drag-and-drop.
- Customize widget colors and borders.
- Add or remove decorative elements.
- Save individual dashboard preferences.

**User Management**
- User registration and login.
- Private, user-specific data.
- Protected API endpoints.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, CSS, Vite |
| Backend (planned) | Node.js, Express |
| Database (planned) | PostgreSQL |
| Version Control | Git, GitHub |

## Architecture

The project is organized into separate frontend and backend applications.

- **Frontend:** React components for the dashboard, calendar, and interactive widgets.
- **Backend:** Express REST API responsible for authentication, task management, and application logic.
- **Database:** PostgreSQL for storing users, tasks, goals, notes, and dashboard preferences.

The backend and database have not yet been implemented.

### Project Structure

```text
Todolist/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
├── .gitignore
└── README.md
```

A `server/` directory will be added during backend development.

## Getting Started

### Requirements

- Node.js
- npm
- Git

### Installation

```bash
git clone https://github.com/clarafritz/Todolist.git
cd Todolist/client
npm install
npm run dev
```

Open the local URL provided by Vite.

Backend installation instructions will be added once the API is implemented.

## Security

The application will be developed with particular attention to authentication, authorization, and data protection.

Planned security measures include:

- Password hashing using a suitable password-hashing algorithm.
- Server-side input validation.
- Parameterized SQL queries.
- Authorization checks to prevent access to other users' data.
- Secure management of environment variables and application secrets.
- Basic security testing of authentication and API endpoints.

Implementation details and test results will be documented as development progresses.

## Development Roadmap

- [x] Initialize React application with Vite.
- [ ] Build dashboard layout and reusable components.
- [ ] Implement task management and calendar.
- [ ] Develop Express REST API.
- [ ] Set up PostgreSQL database.
- [ ] Implement authentication and authorization.
- [ ] Add productivity widgets.
- [ ] Implement dashboard customization.
- [ ] Add automated email reminders.
- [ ] Test, secure, and deploy the application.

## Future Improvements

- Progressive Web App support.
- Potential iOS application.

---

This project is being developed as part of my fullstack development portfolio, with a focus on application architecture and web security.