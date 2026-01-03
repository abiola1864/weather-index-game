require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

app.set('trust proxy', 1);






const PORT = process.env.PORT || 3000;

// ===== SECURITY MIDDLEWARE - FIXED CSP =====
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'",
        "http://localhost:3000",
        "http://localhost:5500",
        "http://localhost:5501",
        "https://weather-index-game.onrender.com",
        "https://*.onrender.com",
        "https://cdnjs.cloudflare.com"  // ✅ FIXED: Added for service worker
      ],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      workerSrc: ["'self'", "blob:"],
    },
  },
}));

// ===== RATE LIMITING =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// ===== CORS =====
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5500',
      'http://localhost:5501',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5501',
      'https://weather-index-game.onrender.com',
      'https://*.onrender.com'
    ];
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('⚠️  Origin not allowed by CORS:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

app.options('*', cors());

// ===== BODY PARSER =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== STATIC FILES =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== LOGGING MIDDLEWARE =====
// ===== CACHE CONTROL - OFFLINE FRIENDLY =====
app.use((req, res, next) => {
  // For HTML files: no browser cache (but service worker will still cache them)
  if (req.url.endsWith('.html') || req.url === '/') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  // For JS/CSS: allow short browser cache (service worker overrides when offline)
  else if (req.url.endsWith('.js') || req.url.endsWith('.css')) {
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  // For images/fonts: longer cache
  else if (req.url.match(/\.(jpg|jpeg|png|gif|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
  }
  
  next();
});

// Then your existing static middleware
app.use(express.static(path.join(__dirname, 'public')));


// ===== FIX DATABASE INDEXES ON STARTUP =====
async function fixDatabaseIndexes() {
  try {
    const db = mongoose.connection.db;
    const respondentsCollection = db.collection('respondents');
    
    console.log('🔧 Checking database indexes...');
    
    const indexes = await respondentsCollection.indexes();
    console.log('📋 Current indexes:', indexes.map(idx => idx.name));
    
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
  }
}

// ===== DATABASE CONNECTION =====
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB Atlas connected successfully');
    console.log('📍 Database:', mongoose.connection.name);
    
    await fixDatabaseIndexes();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⏳ Retrying connection in 10 seconds...');
    setTimeout(connectDB, 10000);
  }
};

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
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});





// ===== GET COMMUNITIES =====
app.get('communities', async (req, res) => {
    try {
        console.log('📋 Fetching communities...');
        const communities = await CommunityAssignment.find({})
            .select('communityName district treatmentGroup')
            .sort({ district: 1, communityName: 1 });
        
        console.log(`✅ Returning ${communities.length} communities`);
        res.json({ success: true, data: communities });
    } catch (error) {
        console.error('❌ Communities error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== CREATE RESPONDENT =====
app.post('respondent/create', async (req, res) => {
    try {
        console.log('👤 Creating respondent...');
        const respondent = new Respondent(req.body);
        await respondent.save();
        
        console.log(`✅ Created respondent: ${respondent._id}`);
        res.json({ 
            success: true, 
            data: {
                _id: respondent._id,
                treatmentGroup: respondent.treatmentGroup
            }
        });
    } catch (error) {
        console.error('❌ Respondent error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== START SESSION =====
app.post('/session/start', async (req, res) => {
    try {
        console.log('🎮 Starting session...');
        const session = new GameSession(req.body);
        await session.save();
        
        console.log(`✅ Created session: ${session._id}`);
        res.json({ 
            success: true, 
            data: { sessionId: session._id }
        });
    } catch (error) {
        console.error('❌ Session error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add more routes as needed...







// ===== SERVE SERVICE WORKER =====
app.get('/service-worker.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'service-worker.js'));
});

// ===== SERVE FRONTEND =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  console.log('❌ 404 Not Found:', req.path);
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.path 
  });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('❌ Server Error:');
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack,
      details: err.toString()
    })
  });
});

// ===== START SERVER =====
const startServer = async () => {
  await connectDB();
  
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🌾 ========================================');
    console.log('🚀 Weather Index Insurance Game Server');
    console.log('🌾 ========================================');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`🌐 Public URL: https://weather-index-game.onrender.com`);
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
// ===== GRACEFUL SHUTDOWN =====
process.on('SIGTERM', () => {
  console.log('');
  console.log('⚠️  SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {  // ❌ OLD API
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
    mongoose.connection.close().then(() => {  // ✅ NEW API but missing error handling
      console.log('✅ MongoDB connection closed');
      console.log('👋 Server shutdown complete');
      process.exit(0);
    });
  });
});
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
};

startServer();

module.exports = app;