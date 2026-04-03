# 3D Print Platform

Production-ready 3D Printing Services web platform with a separated frontend and backend architecture.

## Project Structure

```
3d-print-platform/
├── client/          # React + Vite frontend
└── server/          # Node.js + Express backend
```

## Prerequisites

- Node.js 18+
- npm 9+

## Server Setup and Run

1. Open terminal and move to the server folder:
   - `cd server`
2. Install dependencies:
   - `npm install`
3. Configure environment variables by creating or editing `.env`:

```
PORT=5000
ADMIN_TOKEN=admin-secret-123
CLIENT_ORIGIN=http://localhost:5173
```

4. Start backend server:
   - `node src/app.js`

Server runs at `http://localhost:5000`.

## Client Setup and Run

1. Open a second terminal and move to the client folder:
   - `cd client`
2. Install dependencies:
   - `npm install`
3. Create `.env` (or copy from `.env.example`) and set:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ADMIN_TOKEN=admin-secret-123
```

4. Start frontend:
   - `npm run dev`

Client runs at `http://localhost:5173`.

## API Documentation

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Fetch all predefined products (optional query: `category`) |
| GET | `/api/products/:id` | Fetch single product by ID |
| POST | `/api/orders/predefined` | Place order for predefined products |
| POST | `/api/orders/custom` | Submit custom order with file upload |
| GET | `/api/admin/orders` | Get all orders (admin token required) |
| PATCH | `/api/admin/orders/:id/status` | Update order status (admin token required) |

## Notes

- Allowed custom file upload extensions: `.stl`, `.obj`, `.3mf`
- Uploaded files are stored in `server/uploads`
- Admin routes accept token via `x-admin-token` header or `Authorization: Bearer <token>`
- Cart state persists in browser local storage

## Vercel Deployment

- Frontend-only project: set Vercel Root Directory to `client`
- Backend-only project: set Vercel Root Directory to `server`
- Create separate Vercel projects for `client` and `server`
- Do not create a separate Vercel project for the repo-level `api` folder
- Leave `Install Command`, `Build Command`, and `Output Directory` empty in the Vercel dashboard for both projects
- For a separate frontend Vercel project, set `VITE_API_BASE_URL` to your deployed server URL plus `/api`
- For a separate backend Vercel project, set `CLIENT_ORIGIN` to your deployed frontend URL
