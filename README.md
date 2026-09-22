# Warehouse Management System Backend (Goal)

Backend API for a Warehouse Management System (WMS), built with **Node.js, Express.js, TypeScript, Prisma, and PostgreSQL**.

The system provides APIs for managing users, products, warehouses, inventory, suppliers, purchase orders, shipments, and inventory transactions.

## Tech Stack

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| Node.js    | JavaScript runtime           |
| TypeScript | Backend programming language |
| Express.js | REST API framework           |
| PostgreSQL | Relational database          |
| Prisma     | ORM and database toolkit     |
| JWT        | Authentication               |
| bcrypt     | Password hashing             |

## Project Structure

```text
backend/
├── src/
│   ├── generated/
│   │   └── ...                 # Generated Prisma Client
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── inventory.controller.ts
│   │   ├── warehouse.controller.ts
│   │   ├── supplier.controller.ts
│   │   ├── purchase-order.controller.ts
│   │   └── shipment.controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── inventory.routes.ts
│   │   ├── warehouse.routes.ts
│   │   ├── supplier.routes.ts
│   │   ├── purchase-order.routes.ts
│   │   ├── shipment.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── inventory.service.ts
│   │   ├── warehouse.service.ts
│   │   ├── supplier.service.ts
│   │   ├── purchase-order.service.ts
│   │   └── shipment.service.ts
│   │
│   ├── config/
│   │   └── database.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── password.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│
├── .env
├── .env.example
├── prisma.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Architecture

The backend follows a layered architecture:

```text
Client / Frontend
       │
       ▼
    Routes
       │
       ▼
  Controllers
       │
       ▼
   Services
       │
       ▼
    Prisma
       │
       ▼
  PostgreSQL
```

### Routes

Routes define the API endpoints.

Example:

```text
GET  /api/products
POST /api/products
GET  /api/products/:id
PUT  /api/products/:id
DELETE /api/products/:id
```

### Controllers

Controllers receive HTTP requests and return HTTP responses.

They handle things such as:

* Request parameters
* Request body
* HTTP status codes
* Calling services
* Returning JSON responses

### Services

Services contain the main business logic.

For example, the inventory service handles:

* Receiving stock
* Shipping stock
* Stock adjustments
* Stock transfers
* Inventory history

Keeping business logic in services prevents controllers from becoming too large.

### Prisma

Prisma is the database toolkit used between the TypeScript application and PostgreSQL.

```text
TypeScript
    ↓
Prisma Client
    ↓
PostgreSQL
```

The database structure is defined in:

```text
prisma/schema.prisma
```

Prisma can then generate a type-safe client for the application.

### PostgreSQL

PostgreSQL stores the actual warehouse data.

The database will contain tables/models for:

```text
Users
Roles
Products
Categories
Warehouses
Locations
Inventory
Inventory Transactions
Suppliers
Purchase Orders
Receiving Orders
Shipments
Audit Logs
```

## Main Features

### 1. Authentication & Authorization

The system supports user authentication and role-based access.

Roles:

```text
Admin
Warehouse Manager
Staff
Viewer
```

Authentication uses:

```text
JWT
+
bcrypt
```

Passwords are stored as hashes rather than plain text.

### 2. Product Management

Products can contain information such as:

```text
Product
├── Name
├── SKU
├── Barcode
├── Category
├── Description
├── Minimum Stock
└── Status
```

Supported operations:

```text
Create
Read
Update
Delete / Deactivate
```

### 3. Inventory Management

Inventory tracks the current quantity of products.

Supported operations:

```text
Stock In
Stock Out
Stock Adjustment
Stock Transfer
Inventory History
Low Stock Detection
```

Every stock-changing operation should create an inventory transaction.

Example:

```text
Product: Keyboard
Previous Stock: 50

Receive: +20

New Stock: 70
```

Transaction:

```text
RECEIVE
Quantity: +20
```

This provides an audit trail of inventory changes.

### 4. Warehouse Management

Warehouses contain physical storage locations.

```text
Warehouse
└── Zone
    └── Shelf
        └── Location
            └── Product
```

Example:

```text
Main Warehouse
└── Zone A
    └── Shelf A01
        └── A01-01
            └── Keyboard
```

### 5. Suppliers

Suppliers store information about companies that provide products.

Example information:

```text
Supplier
├── Name
├── Contact
├── Email
├── Phone
└── Address
```

### 6. Purchase Orders

Purchase orders are used to request products from suppliers.

```text
Purchase Order
├── Supplier
├── Order Date
├── Status
└── Items
    ├── Product
    ├── Quantity
    └── Price
```

A purchase order can later be connected to the receiving process.

### 7. Receiving

Receiving records products arriving at the warehouse.

Example:

```text
Purchase Order
      ↓
Receiving Order
      ↓
Verify Quantity
      ↓
Add Inventory
      ↓
Inventory Transaction
```

### 8. Shipping

Shipping handles products leaving the warehouse.

Typical workflow:

```text
Create Shipment
      ↓
Pick Products
      ↓
Pack Products
      ↓
Ship
      ↓
Reduce Inventory
      ↓
Create Inventory Transaction
```

### 9. Reports

The API can provide information for:

```text
Inventory Report
Stock Movement Report
Receiving Report
Shipping Report
Low Stock Report
```

## API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Users

```text
GET /api/users
GET /api/users/:id
```

### Products

```text
GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

### Inventory

```text
GET  /api/inventory
POST /api/inventory/receive
POST /api/inventory/ship
POST /api/inventory/adjust
POST /api/inventory/transfer
GET  /api/inventory/transactions
```

### Warehouses

```text
GET /api/warehouses
GET /api/locations
```

### Purchase Orders

```text
GET  /api/purchase-orders
POST /api/purchase-orders
```

### Shipments

```text
GET  /api/shipments
POST /api/shipments
```

### Reports

```text
GET /api/reports/inventory
GET /api/reports/stock-movement
```

## Database Design

The database is managed using Prisma.

Main relationships:

```text
User
 │
 └── Role

Product
 ├── Category
 └── Inventory

Warehouse
 └── Location
      └── Inventory

Supplier
 └── PurchaseOrder
      └── PurchaseOrderItem
           └── Product

ReceivingOrder
 └── ReceivingItem
      └── Product

Shipment
 └── ShipmentItem
      └── Product

Product
 └── InventoryTransaction
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/warehouse_db"

JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"

PORT=5000
```

Do not commit `.env` to Git.

Create `.env.example` instead:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/warehouse_db"

JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"

PORT=5000
```

## Installation

Clone or open the project:

```powershell
cd backend
```

Install dependencies:

```powershell
npm install
```

Install Prisma dependencies if they are not already installed:

```powershell
npm install @prisma/client
npm install -D prisma
```

Install authentication dependencies:

```powershell
npm install jsonwebtoken bcrypt
npm install -D @types/jsonwebtoken @types/bcrypt
```

Install environment variable support:

```powershell
npm install dotenv
```

## PostgreSQL Setup

Create a PostgreSQL database:

```text
warehouse_db
```

Make sure PostgreSQL is running.

Then configure:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/warehouse_db"
```

## Prisma Setup

Generate the Prisma Client:

```powershell
npx prisma generate
```

Create the first migration:

```powershell
npx prisma migrate dev --name init
```

After changing `schema.prisma`, create another migration:

```powershell
npx prisma migrate dev --name describe_your_change
```

Open Prisma Studio to inspect the database:

```powershell
npx prisma studio
```

## Development

Start the development server:

```powershell
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

Test the server:

```text
GET http://localhost:5000
```

## Build

Compile TypeScript:

```powershell
npm run build
```

The compiled files will be placed in:

```text
dist/
```

Start the production build:

```powershell
npm start
```

## NPM Scripts

The project uses the following scripts:

```json
{
  "scripts": {
    "dev": "tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

Run them with:

```powershell
npm run dev
npm run build
npm start
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Inventory Transaction Rule

Inventory changes should not directly modify stock without recording why the change happened.

For example:

```text
Stock = 100

Receive 20
        ↓
Stock = 120
        ↓
Create InventoryTransaction
        ↓
Type = RECEIVE
Quantity = +20
```

For shipping:

```text
Stock = 120

Ship 10
        ↓
Stock = 110
        ↓
Create InventoryTransaction
        ↓
Type = SHIP
Quantity = -10
```

This makes it possible to answer:

```text
Why did the stock change?
Who changed it?
When did it change?
How much changed?
What type of transaction was it?
```

## Security

The backend should follow these security practices:

* Hash passwords using bcrypt.
* Never store plain-text passwords.
* Use JWT for authenticated API requests.
* Protect private routes with authentication middleware.
* Use role-based authorization for restricted operations.
* Validate request data.
* Keep secrets in `.env`.
* Never commit `.env` to Git.
* Record important warehouse operations in audit logs.

## Git

Recommended `.gitignore`:

```gitignore
# Dependencies
node_modules/

# Build output
dist/

# Environment variables
.env

# Prisma generated files if not committed
# src/generated/

# Logs
*.log

# VS Code
.vscode/
```

Whether `src/generated/` should be ignored depends on how the team handles Prisma generated code. If the project generates it during setup/build, ignoring it is usually appropriate.

## Development Flow

Typical development workflow:

```text
1. Define database model
        ↓
2. Update prisma/schema.prisma
        ↓
3. Run Prisma migration
        ↓
4. Generate Prisma Client
        ↓
5. Create service
        ↓
6. Create controller
        ↓
7. Create route
        ↓
8. Test API
        ↓
9. Connect frontend
```

Example for adding a new product feature:

```text
schema.prisma
      ↓
Product model
      ↓
product.service.ts
      ↓
product.controller.ts
      ↓
product.routes.ts
      ↓
REST API
      ↓
Frontend
```

## Project Goal

The goal of this project is to provide a structured backend for managing warehouse operations through a REST API.

The backend is designed to support:

```text
Authentication
      +
Product Management
      +
Inventory Management
      +
Warehouse Management
      +
Purchasing
      +
Receiving
      +
Shipping
      +
Reporting
      +
Audit Logging
```

The system can later be connected to a web frontend or other client applications through the REST API.
