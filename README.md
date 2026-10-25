# E-Commerce Application

A full-stack e-commerce platform built with **Next.js, TypeScript, Node.js, Express.js, and PostgreSQL**. The application provides customer shopping functionality, order management, and vendor tools for managing products through a modular monorepo architecture.

## Features

- **Authentication:** User login, registration, and protected routes.
- **Product Catalog:** Browse products, view product details, and explore available categories.
- **Shopping & Checkout:** Manage cart items and proceed through the checkout flow.
- **Order Management:** View orders and access individual order details.
- **Vendor Dashboard:** Create, update, and bulk-upload products, and manage vendor orders.
- **REST API:** Separate backend modules for authentication, users, products, categories, orders, payments, and analytics.
- **Form Validation:** Client-side form handling and validation using React Hook Form and Zod.
- **Database Integration:** Store and retrieve application data using PostgreSQL and Prisma ORM.

## Tech Stack

| Layer              | Technologies                             |
| ------------------ | ---------------------------------------- |
| Frontend           | Next.js, React, TypeScript, Tailwind CSS |
| Backend            | Node.js, Express.js                      |
| Database           | PostgreSQL, Neon                         |
| ORM                | Prisma                                   |
| Forms & Validation | React Hook Form, Zod                     |
| API Communication  | Axios                                    |
| Monorepo           | pnpm, Turborepo                          |
| Deployment         | Vercel, Render                           |

## Architecture

The project is organized as a monorepo with separate applications and a shared database package.

```text
ecommerce-application/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express.js REST API
├── packages/
│   └── database/     # Shared Prisma database package
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── turbo.json
```

## Getting Started

### Prerequisites

- Node.js
- pnpm
- PostgreSQL database or a Neon database instance

### Installation

```bash
git clone https://github.com/prince4panwar/Ecommerce-Application.git
cd Ecommerce-Application
pnpm install
```

Configure the required environment variables for the frontend, backend, and database. For the frontend, set the API base URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Use the environment variable names expected by the backend and Prisma configuration for database connectivity and authentication secrets.

Start the applications using the development scripts defined in the respective `package.json` files.

## Deployment

- **Frontend:** Vercel
- **Backend API:** Render
- **Database:** Neon PostgreSQL

The deployed frontend communicates with the backend through the configured API URL.

## Repository

[View the source code on GitHub](https://github.com/prince4panwar/Ecommerce-Application)
