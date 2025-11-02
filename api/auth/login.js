/**
 * Login API - Vercel Serverless
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let cachedClient = null;

async function connectDB() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = client;
  return client;
}

// Helper para parsear body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse body
    const body = req.body || await parseBody(req);
    const { email, senha } = body;

    console.log('🔍 Login attempt:', { email, hasPassword: !!senha });

    if (!email || !senha) {
      return res.status(400).json({ 
        success: false,
        message: 'Email e senha são obrigatórios' 
      });
    }

    // Conectar ao banco
    const client = await connectDB();
    const db = client.db('ss_milhas');
    const usersCollection = db.collection('users');

    // Buscar usuário
    const user = await usersCollection.findOne({ 
      email: email.toLowerCase(), 
      ativo: true 
    });

    console.log('👤 User found:', !!user);

    if (!user) {
      console.log('❌ User not found or inactive');
      return res.status(401).json({ 
        success: false,
        message: 'Credenciais inválidas' 
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);
    console.log('🔒 Password valid:', senhaValida);

    if (!senhaValida) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciais inválidas' 
      });
    }

    // Verificar JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured!');
      return res.status(500).json({ 
        success: false,
        message: 'Configuração do servidor incompleta' 
      });
    }

    // Gerar token
    const token = jwt.sign(
      { 
        id: user._id.toString(), 
        email: user.email,
        role: user.role || 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Atualizar último login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { ultimoLogin: new Date() } }
    );

    console.log('✅ Login successful');

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        user: {
          id: user._id.toString(),
          nome: user.nome,
          email: user.email,
          role: user.role || 'user'
        }
      }
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro ao processar login',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

