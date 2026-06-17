require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for local development, adjust for production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic status route
app.get('/', (req, res) => {
  res.json({ message: 'Trip Itinerary Generator API is running...' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/itineraries', itineraryRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  
  // Custom check for Multer/upload errors
  if (err instanceof require('multer').MulterError) {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
