# 🌲 Natours Full-Stack Application

A complete, production-ready tour booking platform. Built with React (Vite) on the frontend and Node.js, Express, and MongoDB on the backend. This system handles everything from advanced user authentication and role-based authorization to geospatial mapping and secure Stripe payment processing.

## 🚀 Live Deployments

- **Frontend Application:** [https://fady-natours.vercel.app](https://fady-natours.vercel.app)
- **Backend API:** [https://fady-natours-api.vercel.app](https://fady-natours-api.vercel.app)
- **API Documentation:** [Postman Documentation](https://documenter.getpostman.com/view/52064834/2sBXwmQY28#intro)

## 🛠 Tech Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** CSS (Vanilla)
- **Routing:** React Router DOM
- **Data Fetching:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Security:** JWT, Bcryptjs, Helmet, Express-Rate-Limit, Data Sanitization
- **Payments:** Stripe API
- **Emailing:** Nodemailer

## ✨ Key Features

- **🏔️ Tour Management** - Create, read, update, and delete tour listings with advanced filtering, sorting, and pagination
- **👥 User Management** - Register, manage user accounts, profiles, and role-based permissions (Admin, Guide, User)
- **⭐ Reviews & Ratings** - Allow users to review and rate tours with a 1-5 star system
- **🔐 Authentication** - Secure JWT-based login, signup, and password reset functionality
- **💳 Bookings & Payments** - Stripe integration for secure tour booking and payment processing
- **📍 Geospatial Features** - Find tours within a specific radius of user locations via Mapbox
- **🛡️ Advanced Security** - Protection against NoSQL query injection, XSS, Brute Force & DOS attacks, and HTTP Parameter Pollution.

---

## 💻 Local Setup & Development

If you would like to run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/FadyRafat0/Natours-API.git
cd Natours-API
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `config.env` file in the `backend` directory with your environment variables:
```env
PORT=2525
NODE_ENV=development
DATABASE=<your_mongodb_uri>
DATABASE_PASSWORD=<your_db_password>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
STRIPE_SECRET_KEY=<your_stripe_secret_key>
STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>
FRONTEND_URL=http://localhost:5173
```

To seed the development database with realistic dummy data and start the server:
```bash
node dev-data/import-dev-data.js --import
npm start
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:2525
```

Start the frontend development server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser!
