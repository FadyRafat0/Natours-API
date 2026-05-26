# 🌲 Natours RESTful API

A complete, production-ready REST API for a tour booking application. Built with Node.js, Express, and MongoDB, this backend system handles everything from advanced user authentication and role-based authorization to geospatial mapping and secure payment processing.

## � What This API Does

The **Natours API** is a RESTful backend for a nature tour booking platform. It provides:

- **🏔️ Tour Management** - Create, read, update, and delete tour listings with advanced filtering, sorting, and pagination
- **👥 User Management** - Register, manage user accounts, profiles, and role-based permissions (Admin, Guide, User)
- **⭐ Reviews & Ratings** - Allow users to review and rate tours with a 1-5 star system
- **🔐 Authentication** - Secure JWT-based login, signup, and password reset functionality
- **💳 Bookings & Payments** - Stripe integration for secure tour booking and payment processing
- **📍 Geospatial Features** - Find tours within a specific radius of user locations

**Base URL:** `{BASE_URL}/api/v1`

All requests require JWT authentication in the `Authorization` header for protected endpoints.

## �🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Security:** JWT, Bcryptjs, Helmet, Express-Rate-Limit, Data Sanitization
- **Payments:** Stripe API
- **Emailing:** Nodemailer / SendGrid

## ✨ Key Features

### 🔐 Authentication & Authorization

- JWT-based authentication (Login, Signup, Password Reset)
- Role-based access control (Admin, Lead Guide, Guide, User)
- Secure password hashing using Bcrypt
- Password reset workflow via secure email tokens

### 🛡️ Advanced Security

- Protection against NoSQL query injection
- Protection against Cross-Site Scripting (XSS)
- Request rate limiting to prevent Brute Force & DOS attacks
- HTTP Parameter Pollution prevention

### 🗺️ Database & Geospatial Queries

- Advanced CRUD operations utilizing MongoDB aggregation pipelines
- Mongoose middleware (Document, Query, Aggregate, and Model hooks)
- Geospatial queries to calculate distances and find tours within a specific radius of a user's location

### 💳 Payments & Integrations

- Full integration with the Stripe API for secure checkout processing
- Mapbox API integration for frontend location rendering

### ⭐ Reviews & Ratings

- Complete reviews system with ratings (1-5 scale)
- User reviews linked to specific tours
- Unique constraint to prevent duplicate reviews per user-tour pair

---

## 📖 API Documentation

**Full API Documentation:** [Postman Documentation](https://documenter.getpostman.com/view/52064834/2sBXwmQY28#intro)

The API includes comprehensive endpoints for:

- User authentication and management
- Tour CRUD operations and filtering
- Advanced search, sorting, and pagination
- Review creation and management
- Booking and payment processing

---

## 💻 Local Setup & Installation

If you would like to run this project locally, follow these steps:

**1. Clone the repository**

```bash
git clone https://github.com/FadyRafat0/Natours-API.git
cd Natours-API
```
