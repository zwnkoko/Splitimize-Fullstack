# Splitimize

A full-stack bill-splitting application that uses OCR and AI to extract receipt items and intelligently split payments among users.

**Live Demo:** https://splitimize.zawko.dev

## 🎯 Features

- **OCR Receipt Parsing**: Upload receipt images and extract items automatically using Tesseract.js & OCR.space
- **AI-Powered Extraction**: Google Gemini LLM processes extracted text to identify items and prices
- **Easy Bill Splitting**: Split bills by item or equally among participants
- **Authentication**: OAuth integration with Google and GitHub via better-auth
- **Demo Mode**: Try the app instantly without signing up
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode Support**: Built-in theme switching

## 🏗️ Architecture

This is a **monorepo** project with three packages:

```
Splitimize-Fullstack/
├── frontend-nextjs/        # Next.js 15 React frontend
├── backend-express/        # Express.js TypeScript backend
├── shared/                 # Shared TypeScript types & schemas
└── package.json           # Workspace configuration
```

## 📁 Project Structure

```
frontend-nextjs/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utilities and client libraries
├── hooks/           # Custom React hooks
├── contexts/        # React contexts
├── config/          # Configuration files
└── public/          # Static assets

backend-express/
├── src/
│   ├── app.ts       # Express app setup
│   ├── server.ts    # Server entry point
│   ├── routes/      # API routes
│   ├── controllers/ # Request handlers
│   ├── services/    # Business logic
│   ├── models/      # Data models
│   ├── middleware/  # Custom middleware
│   └── lib/         # Utilities
├── prisma/
│   └── schema.prisma # Database schema
└── generated/       # Generated files (Prisma client, etc.)

shared/
└── src/
    ├── schema/      # Shared types and schemas
    └── index.ts     # Exports
```

### Tech Stack

**Frontend:**

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Shadcn components
- TanStack React Query
- better-auth (auth client)

**Backend:**

- Express.js
- TypeScript
- PostgreSQL with Prisma ORM
- better-auth (auth server)
- Tesseract.js (OCR) & OCR.space (API)
- Google Gemini LLM

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL database
- Google OAuth credentials
- GitHub OAuth credentials (optional)
- Google Gemini API key

### Environment Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/zwnkoko/Splitimize-Fullstack.git
   cd Splitimize-Fullstack
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   **Backend (.env file in `backend-express/`):**

   ```bash
   cp backend-express/.env.example backend-express/.env
   ```

   **Frontend (.env.local file in `frontend-nextjs/`):**

   ```bash
   cp frontend-nextjs/.env.example frontend-nextjs/.env.local
   ```

   Fill in your credentials in both `.env` files (see sections below).

4. **Database Setup:**
   ```bash
   cd backend-express
   npx prisma migrate dev
   cd ..
   ```

### Development

Start both frontend and backend in development mode:

```bash
npm run dev
```

This runs:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

Or run individually:

```bash
npm run dev:frontend   # Frontend only
npm run dev:backend    # Backend only
npm run dev:shared     # Watch shared package changes
```

### Production Build

```bash
npm run build:frontend
npm run build:backend
```

Then start:

```bash
npm run start --workspace=frontend-nextjs
npm run start --workspace=backend-express
```

## 📋 Environment Variables

### Backend (`backend-express/.env`)

See `backend-express/.env.example` for the complete template.

**Required:**

- `BETTER_AUTH_SECRET` - Secret used by better-auth for signing
- `BETTER_AUTH_URL` - Public URL of the auth server (usually backend URL)
- `DATABASE_URL` - PostgreSQL connection string
- `FRONTEND_URL` - Frontend URL (for CORS and OAuth redirect)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `GEMINI_API_KEY` - Google Gemini API key (for post-OCR parsing)
- `OCR_SPACE_API_KEY` - OCR.space API key (for image text extraction)

**Optional:**

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (default: development)

### Frontend (`frontend-nextjs/.env.local`)

See `frontend-nextjs/.env.example` for the complete template.

**Required:**

- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL

## 🔐 Setting Up OAuth

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Secret to your `.env`

### GitHub OAuth

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:3001/api/auth/callback/github` (development)
   - `https://your-domain.com/api/auth/callback/github` (production)
4. Copy the Client ID and Secret to your `.env`

## 🔄 Key Workflows

### Upload & Parse Receipt

1. User uploads receipt image (JPG, PNG, HEIC)
2. Frontend compresses image and sends to backend
3. Backend extracts text using Tesseract.js
4. Google Generative AI parses the extracted text
5. Frontend displays extracted items for confirmation/editing
6. User can split by item or equally

### Authentication

- **OAuth Flow**: Google/GitHub → better-auth → PostgreSQL
- **Session Management**: HTTP-only cookies
- **Demo Mode**: Local storage flag for quick testing

## 🧪 Testing

Run tests:

```bash
npm run test --workspace=frontend-nextjs
npm run test:watch --workspace=frontend-nextjs
```

## 👨‍💻 Author

**Zaw Ko** - [GitHub](https://github.com/zwnkoko) | [Portfolio](https://zawko.dev)

---
