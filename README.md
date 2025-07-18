﻿# JobDekho API

JobDekho is a job finding portal. This repository contains the backend REST API built with Node.js, Express, and MongoDB.

## Features

- User registration and login (JWT authentication)
- Role-based access: user, recruiter, admin
- Profile management (update profile, add/remove skills)
- Job CRUD (create, read, update, delete)
- Job application management
- Admin dashboard: manage users, jobs, applications, activate/deactivate accounts
- Secure password hashing
- Environment-based configuration

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas account (or local MongoDB)

### Installation

```sh
git clone  https://github.com/methreamarnath1/jobdekho.git
cd jobdekho.api
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Running the Server

```sh
npm run dev
```
Server will start at `http://localhost:5000/`

## API Endpoints

### Auth

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT token

### Users

- `GET /api/users/profile` — Get logged-in user's profile
- `PUT /api/users/profile` — Update profile
- `POST /api/users/profile/skills` — Add skill
- `DELETE /api/users/skills/:skill` — Remove skill

### Jobs

- `GET /api/jobs` — List jobs
- `POST /api/jobs` — Create job (recruiter/admin)
- `PUT /api/jobs/:id` — Update job (recruiter/admin)
- `DELETE /api/jobs/:id` — Delete job (recruiter/admin)

### Applications

- `POST /api/applications` — Apply for a job (user)
- `GET /api/applications/my-applications` — Get user's applications
- `GET /api/applications/job/:jobId` — Get applications for a job (recruiter/admin)
- `GET /api/applications/recruiter/all` — Get all applications for recruiter's jobs

### Admin

- `GET /api/admin/dashboard` — Get dashboard statistics
- `GET /api/admin/users` — List all users
- `PUT /api/admin/users/:id/activate` — Activate user
- `PUT /api/admin/users/:id/deactivate` — Deactivate user
- `GET /api/admin/jobs` — List all jobs
- `GET /api/admin/applications` — List all applications

## Testing

- Manual: Use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test endpoints.
- Automated: Run Jest/Supertest tests:
  ```sh
  npm test
  ```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to
