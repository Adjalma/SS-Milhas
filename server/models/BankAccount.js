/**
 * Modelo de Conta Bancária
 * 
 * Gerencia contas bancárias do sistema
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da conta é obrigatório'],
    trim: true
  },

  banco: {
    type: String,
    required: [true, 'Banco é obrigatório']
  },

  agencia: {
    type: String,
    required: [true, 'Agência é obrigatória']
  },

  conta: {
    type: String,
    required: [true, 'Número da conta é obrigatório']
  },

  digito: String,

  tipo: {
    type: String,
    required: true,
    enum: ['corrente', 'poupanca', 'pagamento'],
    default: 'corrente'
  },

  titular: {
    type: String,
    required: [true, 'Titular é obrigatório']
  },

  cpfCnpj: {
    type: String,
    required: [true, 'CPF/CNPJ é obrigatório']
  },

  saldoAtual: {
    type: Number,
    default: 0
  },

  saldoInicial: {
    type: Number,
    default: 0
  },

  limite: Number,

  ativo: {
    type: Boolean,
    default: true,
    index: true
  },

  principal: {
    type: Boolean,
    default: false
  },

  // Configurações de integração bancária (futuro)
  integracao: {
    ativa: { type: Boolean, default: false },
    tipo: String, // 'api', 'ofx', 'manual'
    ultimaSync: Date,
    credenciais: mongoose.Schema.Types.Mixed
  },

  observacoes: String,

  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    index: true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
bankAccountSchema.index({ usuario: 1, ativo: 1 });
bankAccountSchema.index({ banco: 1, agencia: 1, conta: 1 });

// Virtual para conta completa
bankAccountSchema.virtual('contaCompleta').get(function() {
  return `${this.banco} - Ag: ${this.agencia} - CC: ${this.conta}${this.digito ? '-' + this.digito : ''}`;
});

// Método para atualizar saldo
bankAccountSchema.methods.atualizarSaldo = function(valor, tipo = 'credito') {
  if (tipo === 'credito') {
    this.saldoAtual += valor;
  } else {
    this.saldoAtual -= valor;
  }
  return this.save();
};

// Método para sincronizar saldo
bankAccountSchema.methods.sincronizar = async function() {
  // Aqui viria a lógica de integração bancária
  this.integracao.ultimaSync = new Date();
  return this.save();
};

// Static para buscar conta principal
bankAccountSchema.statics.principal = function(usuarioId) {
  return this.findOne({ usuario: usuarioId, principal: true, ativo: true });
};

// Static para buscar contas ativas
bankAccountSchema.statics.ativas = function(usuarioId) {
  return this.find({ usuario: usuarioId, ativo: true }).sort({ principal: -1, nome: 1 });
};

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;

