/**
 * Servidor Principal - Sistema de Gestão de Milhas Aéreas
 * 
 * Este é o ponto de entrada do backend do sistema de gestão de milhas.
 * Configura todas as rotas, middlewares, conexão com banco de dados
 * e inicializa o servidor Express.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
require('dotenv').config();

// Importar modelos
require('./models/User');
require('./models/Account');
require('./models/CPFControl');

// Importar rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');
const dashboardRoutes = require('./routes/dashboard');
const reportRoutes = require('./routes/reports');
const notificationRoutes = require('./routes/notifications');
const programRoutes = require('./routes/programs');
const cpfControlRoutes = require('./routes/cpfControl');

// Importar middlewares
const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARES DE SEGURANÇA ====================

// Helmet para headers de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configurado para permitir apenas origens específicas
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ss-milhas.vercel.app', 'https://ss-milhas.com.br', 'https://www.ss-milhas.com.br'] 
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting para prevenir ataques
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite de 100 requests por IP
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Sanitização contra NoSQL injection
app.use(mongoSanitize());

// ==================== MIDDLEWARES GERAIS ====================

// Compressão de respostas
app.use(compression());

// Logging de requisições
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Parsing de JSON e URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== CONEXÃO COM BANCO DE DADOS ====================

// Função para criar usuário padrão
const createDefaultUser = async () => {
  try {
    const bcrypt = require('bcryptjs');
    
    // Usar o modelo User existente
    const User = require('./models/User');

    // Verificar se já existe usuário admin
    const existingUser = await User.findOne({ email: 'admin@ssmilhas.com' });
    if (existingUser) {
      console.log('✅ Usuário admin já existe');
      return;
    }

    // Criar Account padrão primeiro
    const Account = mongoose.model('Account', new mongoose.Schema({
      nome: { type: String, required: true },
      email: { type: String, required: true },
      ativo: { type: Boolean, default: true }
    }, { timestamps: true }));

    let account = await Account.findOne({ email: 'admin@ssmilhas.com' });
    if (!account) {
      account = new Account({
        nome: 'Conta Principal',
        email: 'admin@ssmilhas.com'
      });
      await account.save();
    }

    // Criar usuário admin
    const adminUser = new User({
      nome: 'Administrador',
      email: 'admin@ssmilhas.com',
      senha: 'admin123', // Será hasheada automaticamente pelo middleware
      role: 'admin',
      accountId: account._id,
      status: 'ativo',
      permissions: {
        financeiro: true,
        valores: true,
        relatorios: true,
        monitoramento: true,
        cadastros: true
      }
    });

    await adminUser.save();
    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: admin@ssmilhas.com');
    console.log('🔑 Senha: admin123');

  } catch (error) {
    console.error('❌ Erro ao criar usuário padrão:', error.message);
  }
};

const connectDB = async () => {
  try {
    console.log('🔍 MONGODB_URI:', process.env.MONGODB_URI ? 'DEFINIDA' : 'NÃO DEFINIDA');
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gestao-milhas', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    
    // Criar usuário padrão se não existir
    await createDefaultUser();
    
    // Configurar eventos do mongoose
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro na conexão MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔒 Conexão MongoDB fechada');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error);
    process.exit(1);
  }
};

// ==================== ROTAS DA API ====================

// Rota de health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Rota para criar usuário admin manualmente
app.post('/api/create-admin', async (req, res) => {
  try {
    const User = require('./models/User');
    
    // Verificar se já existe
    const existingUser = await User.findOne({ email: 'admin@ssmilhas.com' });
    if (existingUser) {
      return res.json({
        success: true,
        message: 'Usuário admin já existe',
        credentials: {
          email: 'admin@ssmilhas.com',
          senha: 'admin123'
        }
      });
    }

    // Criar Account
    const Account = mongoose.model('Account', new mongoose.Schema({
      nome: { type: String, required: true },
      email: { type: String, required: true },
      ativo: { type: Boolean, default: true }
    }, { timestamps: true }));

    let account = await Account.findOne({ email: 'admin@ssmilhas.com' });
    if (!account) {
      account = new Account({
        nome: 'Conta Principal',
        email: 'admin@ssmilhas.com'
      });
      await account.save();
    }

    // Criar usuário admin
    const adminUser = new User({
      nome: 'Administrador',
      email: 'admin@ssmilhas.com',
      senha: 'admin123',
      role: 'admin',
      accountId: account._id,
      status: 'ativo',
      permissions: {
        financeiro: true,
        valores: true,
        relatorios: true,
        monitoramento: true,
        cadastros: true
      }
    });

    await adminUser.save();
    
    res.json({
      success: true,
      message: 'Usuário admin criado com sucesso!',
      credentials: {
        email: 'admin@ssmilhas.com',
        senha: 'admin123'
      }
    });

  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário admin',
      error: error.message
    });
  }
});

// Rotas públicas (sem autenticação)
console.log('Registrando rotas de autenticação...');
app.use('/api/auth', authRoutes);
console.log('Rotas de autenticação registradas com sucesso!');

// Rotas protegidas (com autenticação)
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/usuarios', authMiddleware, require('./routes/users'));
app.use('/api/accounts', authMiddleware, accountRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/programs', authMiddleware, programRoutes);
app.use('/api/cpf-control', authMiddleware, cpfControlRoutes);

// Rota para servir o frontend em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// ==================== MIDDLEWARE DE ERRO ====================

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// ==================== INICIALIZAÇÃO DO SERVIDOR ====================

const startServer = async () => {
  try {
    // Conectar ao banco de dados
    await connectDB();
    
    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`
🚀 Servidor iniciado com sucesso!
📍 Porta: ${PORT}
🌍 Ambiente: ${process.env.NODE_ENV || 'development'}
🔗 API: http://localhost:${PORT}/api
📊 Health Check: http://localhost:${PORT}/api/health
⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}
      `);
    });

    // Configurar graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n📡 Recebido sinal ${signal}. Iniciando shutdown graceful...`);
      
      server.close(() => {
        console.log('🔒 Servidor HTTP fechado');
        mongoose.connection.close(false, () => {
          console.log('🔒 Conexão MongoDB fechada');
          process.exit(0);
        });
      });

      // Force close após 10 segundos
      setTimeout(() => {
        console.error('⚠️ Forçando shutdown após timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

module.exports = app;
