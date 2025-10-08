const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Configuração do MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestao-milhas';

async function createAdminUser() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao MongoDB!');

    // Verificar se o usuário admin já existe
    const existingAdmin = await User.findOne({ email: 'admin@ssmilhas.com' });
    
    if (existingAdmin) {
      console.log('Usuário admin já existe!');
      console.log('Email:', existingAdmin.email);
      console.log('Nome:', existingAdmin.nome);
      return;
    }

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('123456', 12);
    
    const adminUser = new User({
      nome: 'Administrador',
      email: 'admin@ssmilhas.com',
      senha: hashedPassword,
      role: 'admin',
      status: 'ativo',
      emailVerificado: true,
      perfil: {
        telefone: '(11) 99999-9999',
        dataNascimento: new Date('1990-01-01'),
        genero: 'outro',
        endereco: {
          cep: '00000-000',
          cidade: 'São Paulo',
          estado: 'SP',
          pais: 'Brasil'
        }
      },
      configuracoes: {
        notificacoes: {
          email: true,
          push: true,
          sms: false
        },
        privacidade: {
          perfilPublico: false,
          compartilharDados: false
        }
      }
    });

    await adminUser.save();
    console.log('Usuário admin criado com sucesso!');
    console.log('Email: admin@ssmilhas.com');
    console.log('Senha: 123456');

  } catch (error) {
    console.error('Erro ao criar usuário admin:', error.message);
    
    if (error.name === 'MongoNetworkError') {
      console.log('\nMongoDB não está rodando. Você precisa:');
      console.log('1. Instalar o MongoDB: https://www.mongodb.com/try/download/community');
      console.log('2. Iniciar o serviço: net start MongoDB');
      console.log('3. Ou usar MongoDB Atlas (nuvem)');
    }
  } finally {
    await mongoose.connection.close();
    console.log('Conexão fechada.');
  }
}

createAdminUser();
