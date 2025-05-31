const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Define allowed origins - REMOVE TRAILING SLASHES!
const allowedOrigins = [
  "http://localhost:5173",
  "https://management-library-frontend.vercel.app",
  "https://management-library-frontend-git-main-nguyen-quang-nams-projects.vercel.app", 
  "https://management-library-frontend-axpr2i2qu.vercel.app"
];

// CORS configuration with better logging
app.use(cors({
  origin: function (origin, callback) {
    console.log(`🔍 CORS Check - Origin: ${origin}`);
    
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) {
      console.log('✅ No origin - allowing request');
      return callback(null, true);
    }

    // Check if origin is in allowedOrigins or matches domain patterns
    if (allowedOrigins.includes(origin) || 
        /\.vercel\.app$/.test(origin) || 
        /\.onrender\.com$/.test(origin)) {
      console.log('✅ Origin allowed');
      return callback(null, true);
    }

    console.log('❌ Origin rejected');
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // This is crucial for cookies!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Cookie parser MUST come before routes
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Add middleware to log cookies for debugging
app.use((req, res, next) => {
  console.log('🍪 Cookies received:', req.cookies);
  console.log('📝 Headers:', req.headers);
  next();
});

// Routes
const bookRoute = require('./routes/book.route.js');
const roleRoute = require('./routes/role.route.js');
const MajorRoute = require('./routes/major.route.js');
const userRoute = require('./routes/user.route.js');
const borrowTicketRoute = require('./routes/borrowticket.route.js');

app.use('/books', bookRoute);
app.use('/roles', roleRoute);
app.use('/majors', MajorRoute);
app.use('/users', userRoute);
app.use('/borrow-tickets', borrowTicketRoute);

// Error handling middleware for CORS errors
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS Error",
      message: "Origin not allowed"
    });
  }
  next(err);
});

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('[✅] MongoDB connected'))
  .catch(err => console.error('[❌] MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[🚀] Server running on http://localhost:${PORT}`);
});