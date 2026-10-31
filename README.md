# ShopSphere 🛍️

A full-stack e-commerce application built with **React + Vite** (frontend) and **Spring Boot** (backend).

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, React Router v6, Axios |
| Backend   | Spring Boot 3, Spring Security, JWT |
| Database  | MySQL 8                             |
| Auth      | JWT (HS256)                         |

---

## Features

- User registration & login with JWT authentication
- Browse, search, and filter products by category
- Product detail page with quantity selector
- Shopping cart (add, update, remove items)
- Checkout and order placement
- Order history for users
- Admin dashboard with stats
- Admin: full product CRUD + category management
- Admin: view and update order statuses
- Role-based route protection (USER / ADMIN)

---

## Project Structure

```
ShopSphere/
├── frontend/       # React + Vite app (port 5173)
├── backend/        # Spring Boot app (port 8080)
├── database/       # SQL schema + seed data
└── docs/           # API documentation
```

---

## Setup & Run

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.8+

### 1. Database
```sql
-- Run in MySQL client
source database/schema.sql
```

### 2. Backend
```bash
cd backend

# Update DB credentials in src/main/resources/application.properties
# spring.datasource.username=root
# spring.datasource.password=your_password

./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Default Accounts

| Role  | Email                    | Password    |
|-------|--------------------------|-------------|
| Admin | admin@shopsphere.com     | password123 |
| User  | john@example.com         | password123 |

---

## API Docs

See [docs/API_Documentation.md](docs/API_Documentation.md) for full API reference.
