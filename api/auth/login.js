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
    const client = await connectDB();
    const db = client.db('ss_milhas');
    const usersCollection = db.collection('users');

    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ 
        success: false,
        message: 'Email e senha são obrigatórios' 
      });
    }

    // Buscar usuário
    const user = await usersCollection.findOne({ 
      email: email.toLowerCase(), 
      ativo: true 
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciais inválidas' 
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciais inválidas' 
      });
    }

    // Gerar token
    const token = jwt.sign(
      { 
        id: user._id.toString(), 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Atualizar último login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { ultimoLogin: new Date() } }
    );

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        user: {
          id: user._id.toString(),
          nome: user.nome,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro ao processar login',
      error: error.message 
    });
  }
};

