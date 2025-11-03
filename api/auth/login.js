/**
 * Login API - Vercel Serverless (VERSÃO SIMPLIFICADA)
 */

const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let cachedClient = null;

async function connectDB() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Método não permitido' 
    });
  }

  try {
    console.log('🔍 Login request received');
    
    // Get body (Vercel já parseia automaticamente)
    const { email, senha } = req.body || {};
    
    console.log('📧 Email:', email);
    console.log('🔐 Has password:', !!senha);

    // Validar campos obrigatórios
    if (!email || !senha) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ 
        success: false,
        message: 'Email e senha são obrigatórios' 
      });
    }

    // Verificar variáveis de ambiente
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI não configurado');
      return res.status(500).json({ 
        success: false,
        message: 'Erro de configuração do servidor (MONGODB_URI)' 
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET não configurado');
      return res.status(500).json({ 
        success: false,
        message: 'Erro de configuração do servidor (JWT_SECRET)' 
      });
    }

    console.log('🔌 Conectando ao banco...');
    
    // Conectar ao MongoDB
    const client = await connectDB();
    const db = client.db('ss_milhas');
    const usersCollection = db.collection('users');

    console.log('👤 Buscando usuário:', email.toLowerCase());

    // Buscar usuário
    const user = await usersCollection.findOne({ 
      email: email.toLowerCase()
    });

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return res.status(401).json({ 
        success: false,
        message: 'Credenciais inválidas' 
      });
    }

    console.log('✅ Usuário encontrado:', user._id);

    // Verificar se usuário está ativo
    if (user.ativo === false) {
      console.log('❌ Usuário inativo');
      return res.status(401).json({ 
        success: false,
        message: 'Usuário inativo' 
      });
    }

    console.log('🔒 Verificando senha...');

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      console.log('❌ Senha inválida');
      return res.status(401).json({ 
        success: false,
        message: 'Credenciais inválidas' 
      });
    }

    console.log('✅ Senha válida');
    console.log('🎫 Gerando token...');

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user._id.toString(), 
        email: user.email,
        role: user.role || 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token gerado');

    // Atualizar último login
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          ultimoLogin: new Date(),
          ultimoLoginIP: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
        } 
      }
    );

    console.log('✅ Login realizado com sucesso');

    // Retornar sucesso
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
    console.error('❌ ERRO NO LOGIN:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    return res.status(500).json({ 
      success: false,
      message: 'Erro interno ao processar login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
