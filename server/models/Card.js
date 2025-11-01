/**
 * Modelo de Cartão
 * 
 * Gerencia cartões de crédito/débito do sistema
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do cartão é obrigatório'],
    trim: true
  },

  bandeira: {
    type: String,
    required: [true, 'Bandeira é obrigatória'],
    enum: ['visa', 'mastercard', 'elo', 'american_express', 'hipercard', 'dinners', 'outra']
  },

  numero: {
    type: String,
    required: [true, 'Últimos 4 dígitos são obrigatórios'],
    trim: true,
    minlength: 4,
    maxlength: 4
  },

  titular: {
    type: String,
    required: [true, 'Titular é obrigatório']
  },

  validade: {
    type: String,
    required: [true, 'Validade é obrigatória'],
    match: /^(0[1-9]|1[0-2])\/\d{2}$/
  },

  tipo: {
    type: String,
    required: true,
    enum: ['credito', 'debito', 'multiplo'],
    default: 'credito'
  },

  limite: {
    type: Number,
    default: 0
  },

  limiteDisponivel: {
    type: Number,
    default: 0
  },

  diaFechamento: {
    type: Number,
    min: 1,
    max: 31
  },

  diaVencimento: {
    type: Number,
    min: 1,
    max: 31
  },

  // Programa de pontos/milhas vinculado
  programa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  },

  pontosPorReal: {
    type: Number,
    default: 0
  },

  ativo: {
    type: Boolean,
    default: true,
    index: true
  },

  principal: {
    type: Boolean,
    default: false
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
cardSchema.index({ usuario: 1, ativo: 1 });
cardSchema.index({ bandeira: 1 });

// Virtual para cartão mascarado
cardSchema.virtual('numeroMascarado').get(function() {
  return `**** **** **** ${this.numero}`;
});

// Virtual para verificar se está vencido
cardSchema.virtual('vencido').get(function() {
  const [mes, ano] = this.validade.split('/');
  const dataValidade = new Date(`20${ano}`, parseInt(mes) - 1, 1);
  return dataValidade < new Date();
});

// Método para calcular pontos de uma compra
cardSchema.methods.calcularPontos = function(valor) {
  if (this.pontosPorReal > 0) {
    return Math.floor(valor * this.pontosPorReal);
  }
  return 0;
};

// Método para atualizar limite disponível
cardSchema.methods.atualizarLimite = function(valor, tipo = 'debito') {
  if (tipo === 'debito') {
    this.limiteDisponivel -= valor;
  } else {
    this.limiteDisponivel += valor;
  }
  return this.save();
};

// Static para buscar cartão principal
cardSchema.statics.principal = function(usuarioId) {
  return this.findOne({ usuario: usuarioId, principal: true, ativo: true });
};

// Static para buscar cartões ativos
cardSchema.statics.ativos = function(usuarioId) {
  return this.find({ usuario: usuarioId, ativo: true }).sort({ principal: -1, nome: 1 });
};

// Static para buscar por programa
cardSchema.statics.porPrograma = function(programaId) {
  return this.find({ programa: programaId, ativo: true });
};

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;

