const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://management-library-frontend.vercel.app",
  "https://management-library-frontend-git-main-nguyen-quang-nams-projects.vercel.app", 
  "https://management-library-frontend-axpr2i2qu.vercel.app"
];

// Enhanced CORS configuration with detailed logging
app.use(cors({
  origin: function (origin, callback) {
    console.log(`\n🔍 CORS DEBUG:`);
    console.log(`   - Request Origin: "${origin}"`);
    console.log(`   - Origin type: ${typeof origin}`);
    console.log(`   - Allowed Origins:`, allowedOrigins);
    
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) {
      console.log('   ✅ No origin - allowing request');
      return callback(null, true);
    }

    // Check exact match first
    if (allowedOrigins.includes(origin)) {
      console.log('   ✅ Exact match found - allowing');
      return callback(null, true);
    }

    // Check domain patterns
    if (/\.vercel\.app$/.test(origin) || /\.onrender\.com$/.test(origin)) {
      console.log('   ✅ Domain pattern match - allowing');
      return callback(null, true);
    }

    console.log('   ❌ Origin rejected - not in allowed list');
    console.log(`   ❌ Failed checks:`);
    console.log(`      - Exact match: ${allowedOrigins.includes(origin)}`);
    console.log(`      - Vercel pattern: ${/\.vercel\.app$/.test(origin)}`);
    console.log(`      - Render pattern: ${/\.onrender\.com$/.test(origin)}`);
    
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Cookie parser MUST come before routes
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Enhanced middleware to log everything
app.use((req, res, next) => {
  console.log(`\n📝 REQUEST DEBUG:`);
  console.log(`   - Method: ${req.method}`);
  console.log(`   - URL: ${req.url}`);
  console.log(`   - Origin Header: "${req.headers.origin}"`);
  console.log(`   - Host Header: "${req.headers.host}"`);
  console.log(`   - User-Agent: "${req.headers['user-agent']}"`);
  console.log(`   - Cookies:`, req.cookies);
  console.log(`   - All Headers:`, JSON.stringify(req.headers, null, 2));
  next();
});

// Test endpoint for debugging
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working!',
    origin: req.headers.origin,
    cookies: req.cookies 
  });
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
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Enhanced error handling
app.use((err, req, res, next) => {
  console.log(`\n❌ ERROR HANDLER:`);
  console.log(`   - Error message: "${err.message}"`);
  console.log(`   - Request origin: "${req.headers.origin}"`);
  
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS Error",
      message: "Origin not allowed",
      receivedOrigin: req.headers.origin,
      allowedOrigins: allowedOrigins
    });
  }
  
  console.error('   - Full error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('[✅] MongoDB connected'))
  .catch(err => console.error('[❌] MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[🚀] Server running on http://localhost:${PORT}`);
  console.log(`[🔧] Allowed origins:`, allowedOrigins);
});