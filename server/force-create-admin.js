const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://adjalmaaguiar_db_user:CcMDXsRwp5y4sb87@clusterssmilhas.irdechh.mongodb.net/?retryWrites=true&w=majority&appName=ClusterSSMilhas';

async function forceCreateAdmin() {
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado!');

    // Definir schema diretamente
    const userSchema = new mongoose.Schema({
      nome: String,
      email: String,
      senha: String,
      role: String,
      status: String,
      emailVerified: Boolean,
      createdAt: Date,
      updatedAt: Date
    });

    const User = mongoose.model('User', userSchema);

    // Deletar usuário existente
    await User.deleteOne({ email: 'admin@ssmilhas.com' });
    console.log('🗑️ Usuário antigo removido');

    // Criar hash da senha
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('123456', salt);
    console.log('🔐 Senha hashada');

    // Criar usuário admin
    const adminUser = new User({
      nome: 'Administrador',
      email: 'admin@ssmilhas.com',
      senha: hashedPassword,
      role: 'admin',
      status: 'ativo',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await adminUser.save();
    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: admin@ssmilhas.com');
    console.log('🔑 Senha: 123456');

    // Verificar se foi salvo
    const users = await User.find();
    console.log('📊 Total de usuários:', users.length);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexão fechada');
  }
}

forceCreateAdmin();
