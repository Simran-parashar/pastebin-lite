Pastebin Lite

A lightweight Pastebin-like application built as a take-home assignment for a **Full Stack Developer** role.

This project allows users to create text pastes that can be shared via a unique URL and automatically expire after a limited number of views.

---

Tech Stack

Frontend
  Next.js (App Router)
  React
  TypeScript

Backend
  Next.js API Routes
  Redis (Upstash)

Database
  Upstash Redis (REST API)

Deployment
  Vercel


API Endpoints

 Health Check
  ```http
   GET /api/healthz
Returns 200 OK if the server and Redis connection are healthy.


Create Paste
  POST /api/pastes

Request Body
{
  "content": "Hello World",
  "max_views": 3
}

Response
{
  "id": "abc12345",
  "url": "http://localhost:3000/p/abc12345"
}
Creates a new paste and returns a unique ID and shareable URL.


Get Paste
  GET /api/pastes/{id}


Returns the paste content if it exists and has not expired.
If the paste exceeds the maximum allowed views, it returns 404.

Frontend Routes

  Home Page
  /
  Allows users to create a new paste.

View Paste Page
  /p/{id}
Displays the paste content.
Each paste automatically expires after reaching the maximum number of views.

Local Setup
1️. Install dependencies
  npm install

2️. Run development server
  npm run dev


The application will be available at:
  http://localhost:3000

 Environment Variables

Create a .env.local file in the project root:

UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
NEXT_PUBLIC_BASE_URL=http://localhost:3000

 Deployment

The project is deployed on Vercel.
Deployment Steps

1. Push the project to GitHub
2. Import the repository into Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy 