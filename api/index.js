/**
 * API Principal - Vercel Serverless
 * 
 * Handler principal que roteia todas as requisições
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

// Importar rotas
const authRoutes = require('../server/routes/auth');
const movementRoutes = require('../server/routes/movements');
const financialRoutes = require('../server/routes/financial');
const taskRoutes = require('../server/routes/tasks');
const aiRoutes = require('../server/routes/ai');

// Criar app Express
const app = express();

// Middlewares básicos
app.use(helmet());
app.use(cors({
  origin: [
    'https://ss-milhas.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar ao MongoDB (com cache)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = db;
  return db;
}

// Middleware de autenticação
const authMiddleware = require('../server/middleware/auth');

// Registrar rotas
app.use('/api/auth', authRoutes);
app.use('/api/movements', authMiddleware, movementRoutes);
app.use('/api/financial', authMiddleware, financialRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Handler principal para Vercel
module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};

