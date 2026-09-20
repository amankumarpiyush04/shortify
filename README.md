# Shortify — URL Shortener & Analytics Platform

Shortify is a full-stack URL shortening and analytics platform built to turn long, complicated URLs into clean, memorable links while providing detailed insights into how those links are being used.

The project combines a modern React frontend with a Node.js/Express backend and PostgreSQL database. It includes authentication, custom aliases, link expiration, click tracking, analytics, link management, and a responsive dark SaaS-style interface.

---

## What is Shortify?

Sharing long URLs can be messy and difficult to manage.

Shortify provides a simple workflow:

Long URL
   ↓
Create a Short Link
   ↓
Share it anywhere
   ↓
Track every click
   ↓
Understand your audience

Example:

https://example.com/some/really/long/path
                    ↓
             https://shortify.app/abc123

Users can create short links instantly and, when authenticated, manage and analyze their links from a personal dashboard.

---

## Features

### URL Shortening
- Generate short URLs from long URLs
- Automatic short-code generation
- HTTP/HTTPS URL validation
- Fast redirection

### Custom Aliases
Users can create memorable aliases instead of randomly generated codes.

Example:

https://shortify.app/github
https://shortify.app/portfolio
https://shortify.app/myproject

The application also validates aliases and prevents reserved routes and duplicate aliases.

### Link Expiration
Links can optionally have an expiration date.

Expired links are automatically treated as inactive and cannot continue functioning as normal redirects.

### Authentication
Shortify includes JWT-based authentication.

Authenticated users can:
- Create and manage their links
- View their links
- Access analytics
- View dashboard statistics
- Track individual link performance

Unauthenticated users can still create short URLs.

### Click Tracking
Every redirect can record useful information such as:

- Click count
- Timestamp
- IP address
- User agent
- Referrer

This data is used to build the analytics system.

### Analytics

Shortify provides analytics for individual URLs, including:

- Total clicks
- Click activity over time
- Top referrers
- Browser breakdown
- Operating-system breakdown
- Device breakdown

### Link Management

The My Links section allows users to:

- Search URLs
- Filter links by status
- Sort links
- Copy short URLs
- Open short URLs
- View click counts
- Check expiration status
- Refresh link data

### Modern UI

The frontend uses a minimal dark SaaS aesthetic with:

- Responsive layouts
- Smooth animations
- Interactive navigation
- Motion-based UI transitions
- Interactive background grid
- Mouse-responsive wave distortion
- Subtle cursor comet effect
- Clean dashboards and analytics cards

The goal was to keep the interface visually interesting without sacrificing usability.

---

# Tech Stack

## Frontend

- React
- React Router
- Tailwind CSS
- Motion
- JavaScript
- Vite

## Backend

- Node.js
- Express.js
- JWT Authentication
- REST API

## Database

- PostgreSQL
- pg (node-postgres)

## Development

- VS Code
- Git
- GitHub
- Nodemon

---

# Project Architecture

The application is divided into two main parts:

```text
SHORTIFY
│
├── frontend
│   │
│   ├── src
│   │   ├── components
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── MouseGrid.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── MyLinks.jsx
│   │   │   └── ApiDocs.jsx
│   │   │
│   │   ├── utils
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server
│   │
│   ├── src
│   │   ├── controllers
│   │   │   ├── auth.controller.js
│   │   │   └── url.controller.js
│   │   │
│   │   ├── middleware
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── routes
│   │   │   ├── auth.routes.js
│   │   │   └── url.routes.js
│   │   │
│   │   ├── db
│   │   │   └── database.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
