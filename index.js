const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://library-management-frontend-ruby.vercel.app/",
  "https://library-management-frontend-git-main-nguyen-quang-nams-projects.vercel.app/",
  "https://library-management-frontend-6brewhvlu.vercel.app/",
];

// CORS configuration
app.use(cors({
  origin: 'https://localhost:5173',
  credentials: true,
})
  // cors({
  //   origin: function (origin, callback) {
  //     // Allow requests with no origin (like mobile apps, curl, postman)
  //     if (!origin) return callback(null, true);

  //     // Check if origin is in allowedOrigins or is a vercel.app domain
  //     if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
  //       return callback(null, true);
  //     }

  //     // Reject requests from other origins
  //     return callback(new Error("Not allowed by CORS"));
  //   },
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization']
  // })
);

// Handle preflight requests
// app.options(
//   "*",
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
//         return callback(null, true);
//       }
//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
//   })
// );

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

// Routes
const bookRoute = require('./routes/book.route.js')
const roleRoute = require('./routes/role.route.js')
const MajorRoute = require('./routes/major.route.js')
const userRoute = require('./routes/user.route.js')
const borrowTicketRoute = require('./routes/borrowticket.route.js')

app.use('/books', bookRoute);
app.use('/roles', roleRoute);
app.use('/majors', MajorRoute);
app.use('/users', userRoute);
app.use('/borrow-tickets', borrowTicketRoute);

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('[✅] MongoDB connected'))
  .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[🚀] Server running on http://localhost:${PORT}`);
});