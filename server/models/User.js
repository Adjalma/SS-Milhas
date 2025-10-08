/**
 * Modelo de Usuário - Sistema de Gestão de Milhas
 * 
 * Define a estrutura do usuário no sistema, incluindo autenticação,
 * perfil, configurações e relacionamentos com outras entidades.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // ==================== DADOS BÁSICOS ====================
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
    select: false // Não retornar senha por padrão
  },
  
  telefone: {
    type: String,
    trim: true,
    match: [/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (xx) xxxxx-xxxx']
  },
  
  // ==================== PERFIL E CONFIGURAÇÕES ====================
  avatar: {
    type: String,
    default: null
  },
  
  role: {
    type: String,
    enum: ['admin', 'auxiliar', 'owner'],
    default: 'auxiliar'
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  permissions: {
    financeiro: {
      type: Boolean,
      default: false
    },
    valores: {
      type: Boolean,
      default: false
    },
    relatorios: {
      type: Boolean,
      default: false
    },
    monitoramento: {
      type: Boolean,
      default: true
    },
    cadastros: {
      type: Boolean,
      default: false
    }
  },
  
  status: {
    type: String,
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo'
  },
  
  // ==================== CONFIGURAÇÕES DE NOTIFICAÇÃO ====================
  notificacoes: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    promocoes: {
      type: Boolean,
      default: true
    },
    alertas: {
      type: Boolean,
      default: true
    }
  },
  
  // ==================== CONFIGURAÇÕES DO SISTEMA ====================
  configuracoes: {
    moeda: {
      type: String,
      default: 'BRL',
      enum: ['BRL', 'USD', 'EUR']
    },
    fusoHorario: {
      type: String,
      default: 'America/Sao_Paulo'
    },
    tema: {
      type: String,
      default: 'light',
      enum: ['light', 'dark', 'auto']
    },
    idioma: {
      type: String,
      default: 'pt-BR',
      enum: ['pt-BR', 'en-US', 'es-ES']
    }
  },
  
  // ==================== DADOS FINANCEIROS ====================
  dadosFinanceiros: {
    cpf: {
      type: String,
      trim: true,
      match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato xxx.xxx.xxx-xx']
    },
    cnpj: {
      type: String,
      trim: true,
      match: [/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ deve estar no formato xx.xxx.xxx/xxxx-xx']
    },
    endereco: {
      cep: String,
      logradouro: String,
      numero: String,
      complemento: String,
      bairro: String,
      cidade: String,
      estado: String,
      pais: { type: String, default: 'Brasil' }
    }
  },
  
  // ==================== ESTATÍSTICAS ====================
  estatisticas: {
    totalContas: {
      type: Number,
      default: 0
    },
    totalMilhas: {
      type: Number,
      default: 0
    },
    totalTransacoes: {
      type: Number,
      default: 0
    },
    valorTotalInvestido: {
      type: Number,
      default: 0
    },
    ultimoLogin: {
      type: Date,
      default: null
    },
    loginCount: {
      type: Number,
      default: 0
    }
  },
  
  // ==================== METAS E GAMIFICAÇÃO ====================
  metas: [{
    titulo: String,
    descricao: String,
    tipo: {
      type: String,
      enum: ['milhas', 'valor', 'transacoes', 'economia']
    },
    valorMeta: Number,
    valorAtual: { type: Number, default: 0 },
    dataInicio: Date,
    dataFim: Date,
    status: {
      type: String,
      enum: ['ativa', 'concluida', 'cancelada'],
      default: 'ativa'
    },
    criadoEm: { type: Date, default: Date.now }
  }],
  
  conquistas: [{
    tipo: String,
    titulo: String,
    descricao: String,
    dataConquista: { type: Date, default: Date.now },
    pontos: { type: Number, default: 0 }
  }],
  
  pontos: {
    type: Number,
    default: 0
  },
  
  nivel: {
    type: Number,
    default: 1
  },
  
  // ==================== TOKENS E RECUPERAÇÃO ====================
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now, expires: 604800 } // 7 dias
  }],
  
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  emailVerificationToken: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  // ==================== AUDITORIA ====================
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  modificadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== ÍNDICES ====================
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'dadosFinanceiros.cpf': 1 });
userSchema.index({ createdAt: -1 });

// ==================== VIRTUALS ====================
userSchema.virtual('nomeCompleto').get(function() {
  return this.nome;
});

userSchema.virtual('iniciais').get(function() {
  return this.nome
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

// ==================== MIDDLEWARES ====================

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Atualizar estatísticas antes de salvar
userSchema.pre('save', function(next) {
  if (this.isModified('estatisticas.ultimoLogin')) {
    this.estatisticas.loginCount += 1;
  }
  next();
});

// ==================== MÉTODOS DE INSTÂNCIA ====================

// Verificar senha
userSchema.methods.verificarSenha = async function(senhaCandidata) {
  return await bcrypt.compare(senhaCandidata, this.senha);
};

// Gerar token JWT
userSchema.methods.gerarTokenJWT = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Gerar refresh token
userSchema.methods.gerarRefreshToken = function() {
  const refreshToken = jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );
  
  this.refreshTokens.push({ token: refreshToken });
  return refreshToken;
};

// Limpar refresh tokens expirados
userSchema.methods.limparRefreshTokens = function() {
  this.refreshTokens = this.refreshTokens.filter(
    token => token.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
};

// Verificar se usuário pode realizar ação
userSchema.methods.podeRealizarAcao = function(acao) {
  const permissoes = {
    user: ['read', 'create', 'update_own'],
    manager: ['read', 'create', 'update', 'delete_own'],
    admin: ['read', 'create', 'update', 'delete', 'manage_users']
  };
  
  return permissoes[this.role]?.includes(acao) || false;
};

// Calcular nível baseado em pontos
userSchema.methods.calcularNivel = function() {
  const pontosNecessarios = [0, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000];
  let nivel = 1;
  
  for (let i = 0; i < pontosNecessarios.length; i++) {
    if (this.pontos >= pontosNecessarios[i]) {
      nivel = i + 1;
    } else {
      break;
    }
  }
  
  this.nivel = nivel;
  return nivel;
};

// Adicionar conquista
userSchema.methods.adicionarConquista = function(tipo, titulo, descricao, pontos = 0) {
  // Verificar se já possui esta conquista
  const jaPossui = this.conquistas.some(c => c.tipo === tipo);
  if (jaPossui) return false;
  
  this.conquistas.push({
    tipo,
    titulo,
    descricao,
    pontos
  });
  
  this.pontos += pontos;
  this.calcularNivel();
  
  return true;
};

// ==================== MÉTODOS ESTÁTICOS ====================

// Buscar por email
userSchema.statics.buscarPorEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Buscar usuários ativos
userSchema.statics.buscarAtivos = function() {
  return this.find({ status: 'ativo' });
};

// Estatísticas gerais
userSchema.statics.obterEstatisticas = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsuarios: { $sum: 1 },
        usuariosAtivos: {
          $sum: { $cond: [{ $eq: ['$status', 'ativo'] }, 1, 0] }
        },
        totalPontos: { $sum: '$pontos' },
        mediaPontos: { $avg: '$pontos' }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsuarios: 0,
    usuariosAtivos: 0,
    totalPontos: 0,
    mediaPontos: 0
  };
};

module.exports = mongoose.model('User', userSchema);
