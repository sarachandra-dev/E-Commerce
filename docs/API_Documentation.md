# ShopSphere API Documentation

Base URL: `http://localhost:8080/api`

---

## Authentication

### POST /auth/register
Register a new user.
```json
{ "name": "John", "email": "john@example.com", "password": "password123" }
```
Response: `{ "token": "...", "name": "John", "email": "...", "role": "USER" }`

### POST /auth/login
```json
{ "email": "john@example.com", "password": "password123" }
```
Response: `{ "token": "...", "name": "John", "email": "...", "role": "USER" }`

---

## Products (Public)

### GET /products
Get all products. Optional query params: `?search=keyword`, `?categoryId=1`

### GET /products/{id}
Get product by ID.

---

## Categories (Public)

### GET /categories
Get all categories.

---

## Cart (Authenticated)

> All cart endpoints require `Authorization: Bearer <token>`

### GET /cart
Get current user's cart.

### POST /cart/items
```json
{ "productId": 1, "quantity": 2 }
```

### PUT /cart/items/{itemId}?quantity=3
Update item quantity. Set to 0 to remove.

### DELETE /cart/items/{itemId}
Remove item from cart.

---

## Orders (Authenticated)

### POST /orders
Place an order from current cart.
```json
{ "address": "123 Main St, City, Country" }
```

### GET /orders
Get current user's orders.

---

## Admin (ADMIN role required)

### POST /admin/products
### PUT /admin/products/{id}
```json
{ "name": "...", "description": "...", "price": 29.99, "stock": 100, "imageUrl": "...", "categoryId": 1 }
```

### DELETE /admin/products/{id}

### POST /admin/categories
```json
{ "name": "Electronics" }
```

### GET /admin/orders
Get all orders.

### PUT /admin/orders/{id}/status
```json
{ "status": "SHIPPED" }
```
Valid statuses: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

---

## Default Credentials (from seed data)
- Admin: `admin@shopsphere.com` / `password123`
- User: `john@example.com` / `password123`
