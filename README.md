# 🔗 Shortify

### A modern full-stack URL shortener with custom aliases, link management, authentication, expiry controls, and detailed click analytics.

<p align="center">
  <strong>⚡ Shorten • 🔐 Secure • 📊 Analyze • 🚀 Share</strong>
</p>

<p align="center">
  <a href="https://github.com/amankumarpiyush04/shortify">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" />
  </a>
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

---

## ✨ What is Shortify?

**Shortify** is a full-stack URL shortening and analytics platform designed to make long URLs easier to share while providing useful insights into how those links are being used.

Users can create short links, choose custom aliases, set expiration dates, manage their links, and monitor click activity through an analytics dashboard.

The application combines a **React + Tailwind CSS frontend** with a **Node.js + Express REST API** and a **PostgreSQL database**.

Shortify also includes authentication, protected dashboards, click tracking, and detailed analytics such as browsers, operating systems, devices, referrers, and click trends.

---

# 🚀 Key Features

| Feature                         | Description                                                |
| ------------------------------- | ---------------------------------------------------------- |
| 🔗 **URL Shortening**           | Convert long URLs into compact shareable links             |
| 🎯 **Custom Aliases**           | Create memorable short URLs such as `/githubtest`          |
| ⏳ **Link Expiration**           | Set an expiration date and time for short links            |
| 🔐 **Authentication**           | JWT-based user registration and login                      |
| 👤 **Personal Link Management** | View and manage links created by your account              |
| 📊 **Click Analytics**          | Track total clicks and click activity over time            |
| 🌐 **Browser Analytics**        | Identify browsers used to access links                     |
| 💻 **Device Analytics**         | Track desktop, mobile, and other device types              |
| 🖥️ **OS Analytics**            | Analyze operating systems used by visitors                 |
| 🔎 **Referrer Tracking**        | Track where link visitors are coming from                  |
| 📈 **Analytics Dashboard**      | Visualize link performance and engagement                  |
| 📋 **Search & Filters**         | Search, sort, and filter your shortened URLs               |
| 📋 **One-Click Copy**           | Quickly copy generated short links                         |
| 🚀 **Fast Redirects**           | Redirect visitors from short URLs to original destinations |
| 🛡️ **URL Validation**          | Validate URLs and prevent invalid input                    |
| 🚫 **Reserved Aliases**         | Protect system routes from conflicting custom aliases      |
| 🎨 **Modern UI**                | Dark SaaS-style responsive interface                       |
| 🖱️ **Interactive Background**  | Subtle mouse-responsive grid and wave effect               |

---

# 🛠️ Tech Stack

### Frontend

<p>
<img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white" />
</p>

### Backend

<p>
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/REST_API-005571?style=flat-square" />
<img src="https://img.shields.io/badge/JWT-Authentication-black?style=flat-square&logo=jsonwebtokens" />
</p>

### Database & Data

<p>
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/node--postgres-336791?style=flat-square&logo=postgresql&logoColor=white" />
</p>

### Development Tools

<p>
<img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" />
<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" />
<img src="https://img.shields.io/badge/VS_Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white" />
</p>

---

# 🏗️ Application Architecture

```text
                         ┌──────────────────────┐
                         │       👤 User        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   ⚛️ React + Vite    │
                         │      Frontend        │
                         └──────────┬───────────┘
                                    │
                              REST API / HTTP
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   🟢 Node.js +       │
                         │      Express         │
                         │      Backend         │
                         └──────────┬───────────┘
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                         ▼                     ▼
                ┌────────────────┐    ┌─────────────────┐
                │  Authentication│    │  URL Management │
                │     JWT        │    │   & Redirects   │
                └────────────────┘    └────────┬────────┘
                                               │
                                               ▼
                                      ┌────────────────┐
                                      │  PostgreSQL    │
                                      │    Database    │
                                      └───────┬────────┘
                                              │
                         ┌────────────────────┼────────────────────┐
                         │                    │                    │
                         ▼                    ▼                    ▼
                  ┌────────────┐       ┌────────────┐       ┌────────────┐
                  │ Short URLs │       │ URL Clicks │       │   Users    │
                  │   Data     │       │ Analytics  │       │   & Auth   │
                  └────────────┘       └────────────┘       └────────────┘
```

---

# 🔄 URL Shortening Flow

```text
                    User enters long URL
                             │
                             ▼
                  ┌────────────────────┐
                  │   React Frontend   │
                  └─────────┬──────────┘
                            │
                       POST /api/urls
                            │
                            ▼
                  ┌────────────────────┐
                  │ Express API Server │
                  └─────────┬──────────┘
                            │
                    Validate URL
                            │
                            ▼
                  ┌────────────────────┐
                  │ Generate / Validate│
                  │    Short Code     │
                  └─────────┬──────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │    PostgreSQL      │
                  │   short_urls      │
                  └─────────┬──────────┘
                            │
                            ▼
                    Return short URL
                            │
                            ▼
                  https://domain/code
```

---

# 📊 Redirect & Analytics Flow

```text
             Visitor opens short URL
                       │
                       ▼
              /:shortCode
                       │
                       ▼
             ┌──────────────────┐
             │ Find short URL   │
             │ in PostgreSQL    │
             └────────┬─────────┘
                      │
                 Link valid?
                  /        \
                YES         NO
                 │           │
                 ▼           ▼
        ┌────────────────┐   404
        │ Record click   │
        │ information    │
        └───────┬────────┘
                │
                ├── IP Address
                ├── User Agent
                ├── Referrer
                └── Timestamp
                │
                ▼
        Increment click_count
                │
                ▼
        Redirect to original URL
                │
                ▼
             🎯 Destination
```

---

# 🔐 Authentication Flow

```text
              👤 User
                 │
        ┌────────┴────────┐
        │                 │
      Login            Register
        │                 │
        └────────┬────────┘
                 ▼
        ┌─────────────────┐
        │ Express Auth API│
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Validate User   │
        │ & Credentials   │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Generate JWT    │
        └────────┬────────┘
                 │
                 ▼
        React AuthContext
                 │
                 ▼
          Store Session
                 │
                 ▼
       Protected Application
```

---

# 📈 Analytics

Shortify records click information for each shortened URL.

The analytics system can provide information such as:

```text
                    📊 URL Analytics
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
     Total Clicks     Click Timeline     Referrers
          │                │                │
          ▼                ▼                ▼
      Browsers        Operating Systems    Devices
```

### Tracked Data

* Total click count
* Click timestamps
* Browser information
* Operating system
* Device type
* Referrer
* URL creation date
* URL expiration date
* Active / inactive status

---

# 🗄️ Database Structure

```text
                    ┌─────────────────────┐
                    │       users         │
                    ├─────────────────────┤
                    │ id                  │
                    │ name                │
                    │ email               │
                    │ password            │
                    │ created_at          │
                    └──────────┬──────────┘
                               │
                               │ user_id
                               ▼
                    ┌─────────────────────┐
                    │     short_urls      │
                    ├─────────────────────┤
                    │ id                  │
                    │ original_url        │
                    │ short_code          │
                    │ created_at          │
                    │ expires_at          │
                    │ click_count         │
                    │ is_active           │
                    │ user_id             │
                    └──────────┬──────────┘
                               │
                               │ short_url_id
                               ▼
                    ┌─────────────────────┐
                    │     url_clicks      │
                    ├─────────────────────┤
                    │ short_url_id        │
                    │ ip_address          │
                    │ user_agent          │
                    │ referrer            │
                    │ clicked_at          │
                    └─────────────────────┘
```

---

# 📂 Project Structure

```text
shortify/
│
├── 📁 src/
│   │
│   ├── 📁 components/
│   │   ├── Navbar.jsx
│   │   ├── MouseGrid.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   │
│   ├── 📁 context/
│   │   └── AuthContext.jsx
│   │
│   ├── 📁 pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Analytics.jsx
│   │   ├── MyLinks.jsx
│   │   └── ApiDocs.jsx
│   │
│   ├── 📁 utils/
│   │   └── ...
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── 📁 server/
│   │
│   ├── 📁 src/
│   │   ├── 📁 controllers/
│   │   ├── 📁 middleware/
│   │   ├── 📁 routes/
│   │   ├── 📁 db/
│   │   └── server.js
│   │
│   ├── 📄 package.json
│   └── 📄 .env
│
├── 📁 public/
│
├── 📄 package.json
├── 📄 vite.config.js
├── 📄 .gitignore
└── 📄 README.md
```

> The structure above represents the main application organization. Individual files may evolve as the project continues to develop.

---

# ⚡ Run Locally

Want to run Shortify on your own machine?

Follow the steps below.

---

## 1️⃣ Prerequisites

Make sure you have:

* **Node.js 18+**
* **npm**
* **Git**
* **PostgreSQL 14+**
* A PostgreSQL database named `shortify`

Check your installation:

```bash
node -v
npm -v
git --version
psql --version
```

---

# 2️⃣ Clone the Repository

```bash
git clone https://github.com/amankumarpiyush04/shortify.git
```

```bash
cd shortify
```

---

# 🗄️ 3️⃣ PostgreSQL Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE shortify;
```

Connect to it:

```bash
psql -U postgres -d shortify
```

Shortify uses PostgreSQL through the **`pg` Node.js driver**.

The application stores:

* Users
* Short URLs
* Expiration information
* Click counts
* Individual click events
* Analytics metadata

> Prisma is not required to run this project. Database communication is handled using `pg`.

---

# 🔧 4️⃣ Backend Setup

Open a terminal:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create:

```text
server/.env
```

Example configuration:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/shortify
JWT_SECRET=your_jwt_secret
```

> ⚠️ Never upload your real `.env` file or JWT secret to GitHub.

---

# ▶️ 5️⃣ Start Backend

From the `server` directory:

```bash
npm run dev
```

The API will normally run at:

```text
http://localhost:5000
```

Test the API:

```text
http://localhost:5000/
```

Expected response:

```json
{
  "message": "Shortify API is running"
}
```

Health check:

```text
http://localhost:5000/api/health
```

---

# 🎨 6️⃣ Frontend Setup

Open a **new terminal**.

From the project root:

```bash
cd shortify
```

Install dependencies:

```bash
npm install
```

If the frontend requires an environment variable, configure it according to the project's `.env.example` / source configuration.

For local development, the frontend communicates with:

```text
http://localhost:5000
```

---

# ▶️ 7️⃣ Start Frontend

```bash
npm run dev
```

Vite will provide a local URL, normally:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# 🖥️ Run Everything

You need **two terminals**.

### Terminal 1 — Backend

```bash
cd shortify/server
npm install
npm run dev
```

### Terminal 2 — Frontend

```bash
cd shortify
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 🔌 API Overview

| Method | Endpoint                       | Access                 | Purpose                  |
| ------ | ------------------------------ | ---------------------- | ------------------------ |
| `GET`  | `/`                            | Public                 | API status               |
| `GET`  | `/api/health`                  | Public                 | Health check             |
| `POST` | `/api/urls`                    | Public / Optional Auth | Create short URL         |
| `GET`  | `/api/urls`                    | Protected              | Get user's links         |
| `GET`  | `/api/urls/analytics/overview` | Protected              | Overall analytics        |
| `GET`  | `/api/urls/:id/analytics`      | Protected              | Individual URL analytics |
| `GET`  | `/:shortCode`                  | Public                 | Redirect to original URL |

---

# 🎯 Custom Aliases

Shortify allows users to create custom short codes.

Example:

```text
Original URL:
https://github.com/amankumarpiyush04

Custom Alias:
githubtest
```

Result:

```text
https://your-domain.com/githubtest
```

Aliases are validated before being stored.

Reserved routes such as:

```text
api
health
admin
login
register
dashboard
```

cannot be used as custom aliases.

Duplicate aliases are also prevented through database constraints.

---

# ⏳ URL Expiration

Users can optionally configure an expiration time for their links.

```text
Create Link
     │
     ▼
Set expiration
     │
     ▼
Store expires_at
     │
     ▼
Link remains active
     │
     ▼
Expiration reached
     │
     ▼
Link becomes unavailable
```

This allows temporary links to be created without manually deleting them later.

---

# 🔎 Link Management

Authenticated users can manage their shortened URLs from **My Links**.

Available functionality includes:

* Search by short code
* Search by original URL
* Sort links
* Filter by status
* View click counts
* Copy short links
* Open short links
* View expiration information
* Refresh link data

---

# 🧪 Development Workflow

```text
Clone Repository
       ↓
Install Dependencies
       ↓
Create PostgreSQL Database
       ↓
Configure Environment Variables
       ↓
Start Backend
       ↓
Start Frontend
       ↓
Create Account
       ↓
Create Short URL
       ↓
Share Link
       ↓
Track Clicks
       ↓
Analyze Performance
       ↓
🚀 Shortify
```

---

# 📜 Available Scripts

### Frontend

| Command           | Purpose                       |
| ----------------- | ----------------------------- |
| `npm install`     | Install dependencies          |
| `npm run dev`     | Start Vite development server |
| `npm run build`   | Create production build       |
| `npm run preview` | Preview production build      |

### Backend

| Command       | Purpose                  |
| ------------- | ------------------------ |
| `npm install` | Install dependencies     |
| `npm run dev` | Start development server |
| `npm start`   | Start production server  |

---

# 🔐 Security

Shortify uses several mechanisms to protect application functionality.

### Authentication

JWT-based authentication is used for protected application routes.

### Protected Resources

Authenticated endpoints verify the user's token before returning private link and analytics data.

### Input Validation

Shortify validates:

* URL format
* HTTP/HTTPS protocol
* Custom alias format
* Reserved aliases
* Duplicate aliases
* Expiration values

### Environment Variables

Sensitive credentials are stored outside the source code.

Never commit:

```text
.env
.env.local
```

Never expose:

* Database passwords
* JWT secrets
* Production credentials
* Private API keys

If a secret is accidentally pushed to GitHub:

1. Rotate the credential immediately.
2. Remove it from the repository.
3. Clean Git history if necessary.
4. Replace it with a new secret.

---

# 🚧 Future Improvements

The project is actively evolving.

Planned improvements include:

```text
☐ QR Code Generation
☐ Redis Caching
☐ Rate Limiting
☐ Advanced Analytics
☐ Better Mobile Experience
☐ Production Deployment
☐ Custom Domains
☐ Link Management Improvements
☐ API Key Management
☐ Public API Documentation
```

---

# 🌍 Deployment

Shortify is designed to be deployable as a separate frontend and backend application.

A production deployment can follow this architecture:

```text
                     🌐 Internet
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
       React Frontend          Express Backend
              │                       │
              │                ┌──────┴──────┐
              │                │             │
              │                ▼             ▼
              │          PostgreSQL      Analytics
              │
              └───────────────┬─────────────┘
                              │
                              ▼
                         Shortify API
```

---

# 💡 Why I Built This

Shortify was built as a practical full-stack project to understand how a production-style web application handles:

* REST APIs
* Authentication
* PostgreSQL
* Database relationships
* URL routing
* Redirect systems
* Analytics collection
* Protected resources
* Frontend state management
* API integration
* Data visualization
* Responsive UI design

The goal was not just to create a URL shortener, but to build a complete application around the core concept.

---

# 📌 Project Status

### 🟢 Active Development

Core functionality is implemented, including:

* URL shortening
* Custom aliases
* URL expiration
* Authentication
* Protected routes
* Dashboard
* Link management
* Search and filtering
* Click tracking
* Individual URL analytics
* Browser analytics
* Operating-system analytics
* Device analytics
* Referrer analytics
* Interactive frontend UI

Additional features and production deployment are planned.

---

# 👨‍💻 Author

### Aman Kumar Piyush

**Engineering Student | Full-Stack Developer**

<p>
<a href="https://github.com/amankumarpiyush04">
<img src="https://img.shields.io/badge/GitHub-amankumarpiyush04-black?style=for-the-badge&logo=github" />
</a>
</p>

---

<p align="center">
  ⭐ If you found this project interesting, consider giving it a star!
</p>

<p align="center">
  <strong>Built with curiosity, code & caffeine ☕</strong>
</p>
