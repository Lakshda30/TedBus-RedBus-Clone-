require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const routeRoutes = require('./routes/route');
const bookingRoutes = require('./routes/booking');
const customerRoutes = require('./routes/customer');
const busRoutes = require('./routes/bus');  
const paymentRoutes = require('./routes/payment');

let passport, GoogleStrategy;
try {
  passport = require('passport');
  GoogleStrategy = require('passport-google-oauth20').Strategy;
} catch (e) {
  passport = { use: () => {}, initialize: () => ((req,res,next)=>next()), authenticate: () => ((req,res,next)=>next()) };
}

if (GoogleStrategy) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      // Usually find or create user here
      return cb(null, profile);
    }
  ));
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH']
  },
  path: '/socket.io'
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    if (!userId) return;
    socket.join(String(userId));
  });
});

const postRoutes = require('./routes/posts');
const reviewRoutes = require('./routes/reviews');

const notificationRoutes = require('./routes/notification');
const {
  retryFailedNotifications,
  sendUpcomingJourneyReminders
} = require('./services/notification.service');

app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.use('/api/posts', postRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// ✅ THEN use routes

app.use('/api/routes', routeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/payments', paymentRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/redbus')
  .then(() => {
    console.log('MongoDB connected');

    setInterval(() => {
      retryFailedNotifications(io).catch(err => console.error('Notification retry job failed', err));
    }, 5 * 60 * 1000);

    setInterval(() => {
      sendUpcomingJourneyReminders(io).catch(err => console.error('Journey reminder job failed', err));
    }, 30 * 60 * 1000);
  })
  .catch(err => console.log(err));

const PORT = Number(process.env.PORT || 5000);

function startServer(port) {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy. Attempting to free it...`);
      const { exec } = require('child_process');
      if (process.platform === 'win32') {
        exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
          const lines = stdout.split('\n');
          const line = lines.find(l => l.includes(`:${port}`) && l.includes('LISTENING'));
          if (line) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            exec(`taskkill /F /PID ${pid}`, (killErr) => {
              if (!killErr) {
                console.log(`Killed stale process ${pid} on port ${port}. Retrying...`);
                setTimeout(() => startServer(port), 1000);
              }
            });
          }
        });
      } else {
        console.error(`Please kill the process using port ${port} manually.`);
      }
    } else {
      console.error(err);
    }
  });
}

startServer(PORT);
