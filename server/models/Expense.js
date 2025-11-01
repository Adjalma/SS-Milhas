/**
 * Modelo de Despesas
 * 
 * Gerencia todas as despesas financeiras do sistema
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true
  },

  categoria: {
    type: String,
    required: true,
    enum: ['compra_milhas', 'taxa', 'salario', 'infraestrutura', 'marketing', 'servico', 'outra'],
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

  // Vínculo com fornecedor
  vinculoFornecedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },

  nomeFornecedor: String,

  status: {
    type: String,
    required: true,
    enum: ['pendente', 'pago', 'cancelado', 'atrasado'],
    default: 'pendente',
    index: true
  },

  dataPagamento: Date,
  dataVencimento: Date,

  comprovante: String,

  // Parcelamento
  parcelado: {
    type: Boolean,
    default: false
  },

  parcelas: {
    total: Number,
    atual: Number,
    valor: Number
  },

  // Recorrência
  recorrente: {
    type: Boolean,
    default: false
  },

  recorrencia: {
    tipo: String,
    enum: ['mensal', 'trimestral', 'semestral', 'anual'],
    proximaData: Date
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
  },

  tags: [String]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compostos
expenseSchema.index({ usuario: 1, data: -1 });
expenseSchema.index({ categoria: 1, status: 1 });
expenseSchema.index({ data: 1, status: 1 });
expenseSchema.index({ dataVencimento: 1, status: 1 });

// Virtual para verificar se está atrasado
expenseSchema.virtual('atrasado').get(function() {
  if (this.status === 'pendente' && this.dataVencimento && this.dataVencimento < new Date()) {
    return true;
  }
  return false;
});

// Virtual para valor total (se parcelado)
expenseSchema.virtual('valorTotal').get(function() {
  if (this.parcelado && this.parcelas) {
    return this.parcelas.total * this.parcelas.valor;
  }
  return this.valor;
});

// Middleware para atualizar status de atrasado
expenseSchema.pre('save', function(next) {
  if (this.status === 'pendente' && this.dataVencimento && this.dataVencimento < new Date()) {
    this.status = 'atrasado';
  }
  next();
});

// Método para marcar como pago
expenseSchema.methods.marcarPago = function() {
  this.status = 'pago';
  this.dataPagamento = new Date();
  return this.save();
};

// Método para cancelar
expenseSchema.methods.cancelar = function() {
  this.status = 'cancelado';
  return this.save();
};

// Statics para queries comuns
expenseSchema.statics.porPeriodo = function(dataInicio, dataFim, filtros = {}) {
  return this.find({
    data: { $gte: dataInicio, $lte: dataFim },
    ...filtros
  }).sort({ data: -1 });
};

expenseSchema.statics.totalPorCategoria = async function(dataInicio, dataFim) {
  return this.aggregate([
    {
      $match: {
        data: { $gte: dataInicio, $lte: dataFim },
        status: 'pago'
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

expenseSchema.statics.pendentes = function() {
  return this.find({ status: { $in: ['pendente', 'atrasado'] } }).sort({ dataVencimento: 1 });
};

expenseSchema.statics.vencendoEm = function(dias) {
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() + dias);
  
  return this.find({
    status: 'pendente',
    dataVencimento: { $lte: dataLimite, $gte: new Date() }
  }).sort({ dataVencimento: 1 });
};

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;

