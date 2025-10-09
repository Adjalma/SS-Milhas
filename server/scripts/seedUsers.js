const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Schema de usuário
const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  ativo: { type: Boolean, default: true },
  ultimoLogin: Date,
  tentativasLogin: { type: Number, default: 0 },
  bloqueado: { type: Boolean, default: false },
  dataBloqueio: Date
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

async function seedUsers() {
  try {
    console.log('🔗 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Verificar se já existe usuário
    const existingUser = await User.findOne({ email: 'admin@ssmilhas.com' });
    if (existingUser) {
      console.log('⚠️ Usuário admin já existe');
      return;
    }

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = new User({
      nome: 'Administrador',
      email: 'admin@ssmilhas.com',
      senha: hashedPassword,
      role: 'admin',
      ativo: true
    });

    await adminUser.save();
    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: admin@ssmilhas.com');
    console.log('🔑 Senha: admin123');

    // Criar usuário teste
    const testUser = new User({
      nome: 'Usuário Teste',
      email: 'teste@ssmilhas.com',
      senha: hashedPassword,
      role: 'user',
      ativo: true
    });

    await testUser.save();
    console.log('✅ Usuário teste criado com sucesso!');
    console.log('📧 Email: teste@ssmilhas.com');
    console.log('🔑 Senha: admin123');

  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Conexão MongoDB fechada');
  }
}

seedUsers();
