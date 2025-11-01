/**
 * Modelo de Receitas
 * 
 * Gerencia todas as receitas financeiras do sistema
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true
  },

  categoria: {
    type: String,
    required: true,
    enum: ['venda_milhas', 'servico', 'bonus', 'cashback', 'outra'],
    index: true
  },

  valor: {
    type: Number,
    required: [true, 'Valor é obrigatório'],
    min: [0, 'Valor deve ser maior ou igual a zero']
  },

  data: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },

  formaPagamento: {
    type: String,
    enum: ['dinheiro', 'pix', 'transferencia', 'boleto', 'cartao_credito', 'cartao_debito'],
    required: true
  },

  contaBancaria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BankAccount'
  },

  // Vínculo com movimentação de milhas
  vinculoMovimento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movement'
  },

  // Vínculo com cliente
  vinculoCliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },

  nomeCliente: String,

  status: {
    type: String,
    required: true,
    enum: ['pendente', 'recebido', 'cancelado'],
    default: 'pendente',
    index: true
  },

  dataRecebimento: Date,

  comprovante: String,

  observacoes: String,

  // Recorrência (para receitas recorrentes)
  recorrente: {
    type: Boolean,
    default: false
  },

  recorrencia: {
    tipo: String,
    enum: ['mensal', 'trimestral', 'semestral', 'anual'],
    proximaData: Date
  },

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
  },

  tags: [String]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compostos
incomeSchema.index({ usuario: 1, data: -1 });
incomeSchema.index({ categoria: 1, status: 1 });
incomeSchema.index({ data: 1, status: 1 });

// Virtual para verificar se está atrasado
incomeSchema.virtual('atrasado').get(function() {
  if (this.status === 'pendente' && this.data < new Date()) {
    return true;
  }
  return false;
});

// Método para marcar como recebido
incomeSchema.methods.marcarRecebido = function() {
  this.status = 'recebido';
  this.dataRecebimento = new Date();
  return this.save();
};

// Método para cancelar
incomeSchema.methods.cancelar = function() {
  this.status = 'cancelado';
  return this.save();
};

// Statics para queries comuns
incomeSchema.statics.porPeriodo = function(dataInicio, dataFim, filtros = {}) {
  return this.find({
    data: { $gte: dataInicio, $lte: dataFim },
    ...filtros
  }).sort({ data: -1 });
};

incomeSchema.statics.totalPorCategoria = async function(dataInicio, dataFim) {
  return this.aggregate([
    {
      $match: {
        data: { $gte: dataInicio, $lte: dataFim },
        status: 'recebido'
      }
    },
    {
      $group: {
        _id: '$categoria',
        total: { $sum: '$valor' },
        quantidade: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } }
  ]);
};

incomeSchema.statics.pendentes = function() {
  return this.find({ status: 'pendente' }).sort({ data: 1 });
};

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;

