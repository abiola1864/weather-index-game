require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== SECURITY MIDDLEWARE =====
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
    },
  },
}));

// ===== RATE LIMITING =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// ===== CORS - FIXED CONFIGURATION =====
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // List of allowed origins for development
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5500',
      'http://localhost:5501',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5501'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('⚠️  Origin not allowed by CORS:', origin);
      // Still allow in development
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

// Handle preflight requests
app.options('*', cors());

// ===== BODY PARSER =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== STATIC FILES =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== LOGGING MIDDLEWARE (Development) =====
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ===== FIX DATABASE INDEXES ON STARTUP =====
async function fixDatabaseIndexes() {
  try {
    const db = mongoose.connection.db;
    const respondentsCollection = db.collection('respondents');
    
    console.log('🔧 Checking database indexes...');
    
    // Get current indexes
    const indexes = await respondentsCollection.indexes();
    
    // Check if old unique index exists
    const hasOldUniqueIndex = indexes.some(idx => 
      idx.name === 'householdId_1' && idx.unique === true
    );
    
    if (hasOldUniqueIndex) {
      console.log('⚠️  Found old unique index on householdId');
      console.log('🗑️  Dropping old index...');
      
      await respondentsCollection.dropIndex('householdId_1');
      
      console.log('✅ Old unique index dropped successfully!');
      console.log('✅ Multiple respondents per household now allowed');
    } else {
      console.log('✅ Database indexes are correct');
    }
  } catch (error) {
    console.error('⚠️  Error checking indexes:', error.message);
    // Don't crash the server if index check fails
  }
}

// ===== DATABASE CONNECTION =====
const connectDB = async () => {
  try {
    // Remove deprecated options
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    console.log('✅ MongoDB Atlas connected successfully');
    console.log('📍 Database:', mongoose.connection.name);
    
    // Fix indexes after successful connection
    await fixDatabaseIndexes();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⏳ Retrying connection in 10 seconds...');
    setTimeout(connectDB, 10000);
  }
};

// MongoDB event listeners
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established');
});

// ===== ROUTES =====
const gameRoutes = require('./src/routes/gameRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ===== SERVE FRONTEND =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.path 
  });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===== START SERVER =====
const startServer = async () => {
  await connectDB();
  
  const server = app.listen(PORT, () => {
    console.log('');
    console.log('🌾 ========================================');
    console.log('🚀 Weather Index Insurance Game Server');
    console.log('🌾 ========================================');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
    console.log('🌾 ========================================');
    console.log('');
    console.log('📊 Available endpoints:');
    console.log('   GET  /                          - Game Interface');
    console.log('   GET  /api/health                - Health Check');
    console.log('');
    console.log('   🎮 Game Endpoints:');
    console.log('   POST /api/game/respondent/create');
    console.log('   POST /api/game/session/start');
    console.log('   POST /api/game/round/save');
    console.log('   POST /api/game/knowledge/submit');
    console.log('');
    console.log('   👨‍💼 Admin Endpoints:');
    console.log('   GET  /api/admin/sessions        - View all sessions');
    console.log('   GET  /api/admin/statistics      - View statistics');
    console.log('   GET  /api/admin/households      - View all households');
    console.log('   GET  /api/admin/export/csv      - Export sessions CSV');
    console.log('   GET  /api/admin/export/rounds-csv - Export rounds CSV');
    console.log('🌾 ========================================');
    console.log('');
    console.log('✨ Ready to accept connections!');
    console.log('');
  });

  // ===== GRACEFUL SHUTDOWN =====
  process.on('SIGTERM', () => {
    console.log('');
    console.log('⚠️  SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('✅ HTTP server closed');
      mongoose.connection.close(false, () => {
        console.log('✅ MongoDB connection closed');
        console.log('👋 Server shutdown complete');
        process.exit(0);
      });
    });
  });

  process.on('SIGINT', () => {
    console.log('');
    console.log('⚠️  SIGINT received. Shutting down gracefully...');
    server.close(() => {
      console.log('✅ HTTP server closed');
      mongoose.connection.close(false, () => {
        console.log('✅ MongoDB connection closed');
        console.log('👋 Server shutdown complete');
        process.exit(0);
      });
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
};

// Start the server
startServer();

module.exports = app;