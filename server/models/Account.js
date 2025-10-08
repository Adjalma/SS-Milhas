/**
 * Modelo de Conta Principal
 * 
 * Representa uma conta principal que pode ter até 3 usuários:
 * - 1 Owner (proprietário)
 * - 1 Admin (administrador)
 * - 2 Auxiliares (monitoramento)
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da conta é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  
  plano: {
    type: String,
    enum: ['basico', 'premium', 'enterprise'],
    default: 'basico'
  },
  
  limiteUsuarios: {
    type: Number,
    default: 3 // 1 owner + 1 admin + 2 auxiliares
  },
  
  usuariosAtivos: {
    type: Number,
    default: 0
  },
  
  configuracoes: {
    timezone: {
      type: String,
      default: 'America/Sao_Paulo'
    },
    moeda: {
      type: String,
      default: 'BRL'
    },
    idioma: {
      type: String,
      default: 'pt-BR'
    }
  },
  
  status: {
    type: String,
    enum: ['ativo', 'inativo', 'suspenso', 'trial'],
    default: 'trial'
  },
  
  dataExpiracao: {
    type: Date,
    default: function() {
      // Trial de 30 dias
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  },
  
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  usuarios: [{
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'auxiliar']
    },
    adicionadoEm: {
      type: Date,
      default: Date.now
    },
    adicionadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  estatisticas: {
    totalMilhas: {
      type: Number,
      default: 0
    },
    totalContas: {
      type: Number,
      default: 0
    },
    totalTransacoes: {
      type: Number,
      default: 0
    },
    ultimaAtividade: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
accountSchema.index({ owner: 1 });
accountSchema.index({ status: 1 });
accountSchema.index({ 'usuarios.usuario': 1 });

// Virtual para verificar se pode adicionar usuários
accountSchema.virtual('podeAdicionarUsuario').get(function() {
  return this.usuariosAtivos < this.limiteUsuarios;
});

// Virtual para contar usuários por role
accountSchema.virtual('contagemUsuarios').get(function() {
  const contagem = {
    owner: 0,
    admin: 0,
    auxiliar: 0
  };
  
  this.usuarios.forEach(user => {
    contagem[user.role]++;
  });
  
  return contagem;
});

// Middleware para atualizar contagem de usuários
accountSchema.pre('save', function(next) {
  this.usuariosAtivos = this.usuarios.length;
  next();
});

// Método para adicionar usuário
accountSchema.methods.adicionarUsuario = function(usuarioId, role, adicionadoPor) {
  if (!this.podeAdicionarUsuario) {
    throw new Error('Limite de usuários atingido');
  }
  
  // Verificar se já existe um usuário com esse role
  if (role === 'owner' || role === 'admin') {
    const existeRole = this.usuarios.some(user => user.role === role);
    if (existeRole) {
      throw new Error(`Já existe um usuário com role ${role}`);
    }
  }
  
  // Verificar limite de auxiliares
  if (role === 'auxiliar') {
    const auxiliares = this.usuarios.filter(user => user.role === 'auxiliar').length;
    if (auxiliares >= 2) {
      throw new Error('Limite de auxiliares atingido (máximo 2)');
    }
  }
  
  this.usuarios.push({
    usuario: usuarioId,
    role: role,
    adicionadoEm: new Date(),
    adicionadoPor: adicionadoPor
  });
  
  return this.save();
};

// Método para remover usuário
accountSchema.methods.removerUsuario = function(usuarioId) {
  const usuarioIndex = this.usuarios.findIndex(user => user.usuario.toString() === usuarioId.toString());
  
  if (usuarioIndex === -1) {
    throw new Error('Usuário não encontrado na conta');
  }
  
  const usuario = this.usuarios[usuarioIndex];
  
  // Não permitir remover o owner
  if (usuario.role === 'owner') {
    throw new Error('Não é possível remover o proprietário da conta');
  }
  
  this.usuarios.splice(usuarioIndex, 1);
  return this.save();
};

// Método para verificar permissões
accountSchema.methods.verificarPermissoes = function(usuarioId, permissao) {
  const usuario = this.usuarios.find(user => user.usuario.toString() === usuarioId.toString());
  
  if (!usuario) {
    return false;
  }
  
  // Owner tem todas as permissões
  if (usuario.role === 'owner') {
    return true;
  }
  
  // Admin tem permissões financeiras
  if (usuario.role === 'admin') {
    return ['financeiro', 'valores', 'relatorios', 'monitoramento', 'cadastros'].includes(permissao);
  }
  
  // Auxiliar tem apenas monitoramento
  if (usuario.role === 'auxiliar') {
    return permissao === 'monitoramento';
  }
  
  return false;
};

// Método para obter usuários por role
accountSchema.methods.obterUsuariosPorRole = function(role) {
  return this.usuarios.filter(user => user.role === role);
};

// Método para verificar se conta está ativa
accountSchema.methods.isAtiva = function() {
  return this.status === 'ativo' || (this.status === 'trial' && this.dataExpiracao > new Date());
};

module.exports = mongoose.model('Account', accountSchema);