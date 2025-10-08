/**
 * Script de Migração de Usuários
 * 
 * Migra usuários existentes para o novo sistema de contas
 * e permissões baseadas em roles.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importar modelos
const User = require('../models/User');
const Account = require('../models/Account');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ss-milhas';

async function migrateUsers() {
  try {
    console.log('🔄 Iniciando migração de usuários...');
    
    // Conectar ao MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
    
    // Buscar todos os usuários existentes
    const existingUsers = await User.find({});
    console.log(`📊 Encontrados ${existingUsers.length} usuários para migrar`);
    
    if (existingUsers.length === 0) {
      console.log('ℹ️ Nenhum usuário encontrado para migração');
      return;
    }
    
    // Criar conta principal para o primeiro usuário (que será o owner)
    const firstUser = existingUsers[0];
    
    // Verificar se já existe uma conta
    let mainAccount = await Account.findOne({ owner: firstUser._id });
    
    if (!mainAccount) {
      console.log('🏢 Criando conta principal...');
      
      // Criar conta principal
      mainAccount = new Account({
        nome: `${firstUser.nome} - Conta Principal`,
        plano: 'premium',
        owner: firstUser._id,
        usuarios: [{
          usuario: firstUser._id,
          role: 'owner',
          adicionadoEm: new Date()
        }]
      });
      
      await mainAccount.save();
      console.log('✅ Conta principal criada');
    }
    
    // Migrar usuários
    for (let i = 0; i < existingUsers.length; i++) {
      const user = existingUsers[i];
      console.log(`🔄 Migrando usuário ${i + 1}/${existingUsers.length}: ${user.nome}`);
      
      // Definir role baseado no role atual
      let newRole = 'auxiliar';
      if (user.role === 'admin' || user.role === 'manager') {
        newRole = 'admin';
      } else if (i === 0) {
        newRole = 'owner';
      }
      
      // Definir permissões baseadas no role
      let permissions = {
        financeiro: false,
        valores: false,
        relatorios: false,
        monitoramento: true,
        cadastros: false
      };
      
      if (newRole === 'owner' || newRole === 'admin') {
        permissions = {
          financeiro: true,
          valores: true,
          relatorios: true,
          monitoramento: true,
          cadastros: true
        };
      }
      
      // Atualizar usuário
      await User.findByIdAndUpdate(user._id, {
        role: newRole,
        accountId: mainAccount._id,
        permissions: permissions
      });
      
      // Adicionar usuário à conta se não for o owner
      if (newRole !== 'owner') {
        try {
          await mainAccount.adicionarUsuario(user._id, newRole, firstUser._id);
        } catch (error) {
          console.log(`⚠️ Usuário ${user.nome} já está na conta ou limite atingido`);
        }
      }
      
      console.log(`✅ Usuário ${user.nome} migrado como ${newRole}`);
    }
    
    // Atualizar estatísticas da conta
    const updatedAccount = await Account.findById(mainAccount._id);
    updatedAccount.usuariosAtivos = updatedAccount.usuarios.length;
    await updatedAccount.save();
    
    console.log('🎉 Migração concluída com sucesso!');
    console.log(`📊 Conta: ${updatedAccount.nome}`);
    console.log(`👥 Usuários ativos: ${updatedAccount.usuariosAtivos}/${updatedAccount.limiteUsuarios}`);
    
    // Mostrar resumo
    const users = await User.find({ accountId: mainAccount._id });
    const roleCount = {
      owner: users.filter(u => u.role === 'owner').length,
      admin: users.filter(u => u.role === 'admin').length,
      auxiliar: users.filter(u => u.role === 'auxiliar').length
    };
    
    console.log('\n📈 Resumo da Conta:');
    console.log(`👑 Proprietários: ${roleCount.owner}`);
    console.log(`🔧 Administradores: ${roleCount.admin}`);
    console.log(`👥 Auxiliares: ${roleCount.auxiliar}`);
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  } finally {
    // Fechar conexão
    await mongoose.connection.close();
    console.log('🔌 Conexão com MongoDB fechada');
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateUsers()
    .then(() => {
      console.log('✅ Script de migração executado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro no script de migração:', error);
      process.exit(1);
    });
}

module.exports = { migrateUsers };
