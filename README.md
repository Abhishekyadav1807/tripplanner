# 🧭 Trip Itinerary Generator AI

An intelligent MERN-stack web application that allows users to upload travel booking documents (flights, hotels, transport tickets as PDFs/images), automatically extracts date, destination, and reference numbers using Google Gemini AI, and builds structured, interactive day-by-day travel itineraries with customizable scheduling and public sharing pages.

---

## 🌟 Key Features

1. **JWT Authentication:** Complete security loops for signing up and logging in, protecting personal dashboards and itinerary edit suites.
2. **File Processing Uploader:** Memory-buffered PDF and image upload pipelines built using Multer.
3. **Multimodal Document Processing:** Integrates Google Gemini AI to analyze file texts and images, extracting names, flights, check-ins, and dates in JSON format.
4. **AI-Powered Itinerary generation:** Builds customizable day-by-day sightseeing activities, travel transitions, and local advice based on uploaded credentials.
5. **Interactive Schedule Editor:** Allows travelers to manually add, edit, or delete activities directly inside a responsive vertical timeline.
6. **One-Click Public Sharing:** Generates secure shareable URLs. Anyone with the link can view a public read-only dashboard of the trip.
7. **Print & PDF Export:** Integrated styling layouts for browser print-actions to save itineraries offline.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router DOM, Lucide Icons, Vanilla CSS Design System (Custom variables, responsive timeline, glassmorphic themes)
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Multer, jsonwebtoken, bcryptjs, `@google/generative-ai`

---

## 📁 Directory Layout

```text
trip-itinerary-generator/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Controller modules (auth, itineraries)
│   │   ├── middleware/      # Protected authentication and upload filters
│   │   ├── models/          # User & Itinerary Mongoose models
│   │   ├── routes/          # Express API route mapping
│   │   ├── services/        # Gemini API client integration
│   │   └── server.js        # Main API entry script
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Navbar, Timeline, Guard)
│   │   ├── pages/           # Pages (Dashboard, Login, Upload, Details)
│   │   ├── services/        # Fetch API service layers
│   │   ├── utils/           # Date formatting utility functions
│   │   ├── App.jsx          # Route mapping and session contexts
│   │   ├── main.jsx         # App mounting entry script
│   │   └── index.css        # CSS variables & layouts
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas connection)
- Google Gemini API Key

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file in the `backend/` folder and insert your credentials:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/trip-itinerary
   JWT_SECRET=super_secret_trip_jwt_key_987654321
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`*

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Create a `.env` file in the `frontend/` folder and define your backend API base URL:
   * **Local Development Example:**
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```
   * **Production Deployment Example:**
     ```env
     VITE_API_URL=https://api.yourdomain.com/api
     ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client dashboard will open on `http://localhost:5173`*

---

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT
- `GET /api/auth/me` - Fetch authenticated user profile

### Itineraries
- `POST /api/itineraries/upload` - Send PDF/Image travel receipt, returns Gemini parsed details
- `POST /api/itineraries/generate` - Generates and saves a full itinerary to DB
- `GET /api/itineraries` - Get all saved itineraries for the logged-in user
- `GET /api/itineraries/:id` - Fetch details for a specific itinerary
- `PUT /api/itineraries/:id` - Edit title, destination, dates, or day activities list
- `DELETE /api/itineraries/:id` - Remove itinerary permanently
- `POST /api/itineraries/:id/share` - Toggle public link status (returns public `shareId`)
- `GET /api/itineraries/public/:shareId` - Public read-only itinerary retrieval (No Auth)
