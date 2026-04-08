# Loan Analysis Backend

Production-ready Express backend for the loan frontend.

## Local setup

1. Open terminal in `backend`
2. Install packages:
   - `npm install`
3. Create env file:
   - copy `.env.example` to `.env`
4. Run server:
   - `npm start`

Default server URL: `http://localhost:5000`

## Environment variables

```env
PORT=5000
CORS_ORIGIN=http://127.0.0.1:5501
JWT_SECRET=replace-with-a-long-random-secret
```

## API endpoints

### Public
- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/loan/predict`

### Protected (Bearer token required)
- `GET /api/dashboard`
- `PUT /api/dashboard`

## Auth flow

1. Login with `POST /api/auth/login`
2. Receive `token` in response
3. Send header on protected endpoints:
   - `Authorization: Bearer <token>`

## Security features

- Passwords stored as bcrypt hashes (`passwordHash`)
- JWT access tokens (8h expiry)
- Helmet security headers
- Rate limiting on auth routes

## Deployment

- Set `CORS_ORIGIN` to your deployed frontend domain
- Set a strong `JWT_SECRET`
- Run with:
  - `npm install`
  - `npm start`
