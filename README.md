# 🌲 Natours RESTful API

A complete, production-ready REST API for a tour booking application. Built with Node.js, Express, and MongoDB, this backend system handles everything from advanced user authentication and role-based authorization to geospatial mapping and secure payment processing.

## 🛠 Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Security:** JWT, Bcryptjs, Helmet, Express-Rate-Limit, Data Sanitization
* **Payments:** Stripe API
* **Emailing:** Nodemailer / SendGrid

## ✨ Key Features

### 🔐 Authentication & Authorization
* JWT-based authentication (Login, Signup, Password Reset)
* Role-based access control (Admin, Lead Guide, Guide, User)
* Secure password hashing using Bcrypt
* Password reset workflow via secure email tokens

### 🛡️ Advanced Security
* Protection against NoSQL query injection
* Protection against Cross-Site Scripting (XSS)
* Request rate limiting to prevent Brute Force & DOS attacks
* HTTP Parameter Pollution prevention

### 🗺️ Database & Geospatial Queries
* Advanced CRUD operations utilizing MongoDB aggregation pipelines
* Mongoose middleware (Document, Query, Aggregate, and Model hooks)
* Geospatial queries to calculate distances and find tours within a specific radius of a user's location

### 💳 Payments & Integrations
* Full integration with the Stripe API for secure checkout processing
* Mapbox API integration for frontend location rendering

---

## 💻 Local Setup & Installation

If you would like to run this project locally, follow these steps:

**1. Clone the repository**
```bash
git clone [https://github.com/FadyRafat0/Natours-API.git](https://github.com/FadyRafat0/Natours-API.git)
cd Natours-API
