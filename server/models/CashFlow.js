/**
 * Modelo de Fluxo de Caixa
 * 
 * Gerencia o fluxo de caixa consolidado por período
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const cashFlowSchema = new mongoose.Schema({
  periodo: {
    mes: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    ano: {
      type: Number,
      required: true,
      min: 2000
    }
  },

  saldoInicial: {
    type: Number,
    default: 0
  },

  receitas: {
    total: {
      type: Number,
      default: 0
    },
    porCategoria: {
      type: Map,
      of: Number,
      default: {}
    },
    quantidade: {
      type: Number,
      default: 0
    }
  },

  despesas: {
    total: {
      type: Number,
      default: 0
    },
    porCategoria: {
      type: Map,
      of: Number,
      default: {}
    },
    quantidade: {
      type: Number,
      default: 0
    }
  },

  saldoFinal: {
    type: Number,
    default: 0
  },

  lucro: {
    type: Number,
    default: 0
  },

  margemLucro: {
    type: Number,
    default: 0
  },

  // Detalhamento por conta bancária
  porConta: [{
    conta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BankAccount'
    },
    saldoInicial: Number,
    receitas: Number,
    despesas: Number,
    saldoFinal: Number
  }],

  // Métricas adicionais
  metricas: {
    ticketMedioReceita: Number,
    ticketMedioDespesa: Number,
    percentualReceitasPendentes: Number,
    percentualDespesasPendentes: Number
  },

  status: {
    type: String,
    enum: ['provisorio', 'fechado'],
    default: 'provisorio'
  },

  dataFechamento: Date,

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

  observacoes: String

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compostos
cashFlowSchema.index({ 'periodo.ano': 1, 'periodo.mes': 1, usuario: 1 }, { unique: true });
cashFlowSchema.index({ usuario: 1, status: 1 });

// Virtual para período formatado
cashFlowSchema.virtual('periodoFormatado').get(function() {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${meses[this.periodo.mes - 1]}/${this.periodo.ano}`;
});

// Método para calcular valores
cashFlowSchema.methods.calcular = async function() {
  const Income = mongoose.model('Income');
  const Expense = mongoose.model('Expense');

  const dataInicio = new Date(this.periodo.ano, this.periodo.mes - 1, 1);
  const dataFim = new Date(this.periodo.ano, this.periodo.mes, 0, 23, 59, 59);

  // Buscar receitas
  const receitas = await Income.find({
    usuario: this.usuario,
    data: { $gte: dataInicio, $lte: dataFim },
    status: { $ne: 'cancelado' }
  });

  // Buscar despesas
  const despesas = await Expense.find({
    usuario: this.usuario,
    data: { $gte: dataInicio, $lte: dataFim },
    status: { $ne: 'cancelado' }
  });

  // Calcular totais de receitas
  this.receitas.total = receitas.reduce((sum, r) => sum + r.valor, 0);
  this.receitas.quantidade = receitas.length;

  // Calcular por categoria de receitas
  const receitasPorCategoria = {};
  receitas.forEach(r => {
    receitasPorCategoria[r.categoria] = (receitasPorCategoria[r.categoria] || 0) + r.valor;
  });
  this.receitas.porCategoria = receitasPorCategoria;

  // Calcular totais de despesas
  this.despesas.total = despesas.reduce((sum, d) => sum + d.valor, 0);
  this.despesas.quantidade = despesas.length;

  // Calcular por categoria de despesas
  const despesasPorCategoria = {};
  despesas.forEach(d => {
    despesasPorCategoria[d.categoria] = (despesasPorCategoria[d.categoria] || 0) + d.valor;
  });
  this.despesas.porCategoria = despesasPorCategoria;

  // Calcular saldo final e lucro
  this.saldoFinal = this.saldoInicial + this.receitas.total - this.despesas.total;
  this.lucro = this.receitas.total - this.despesas.total;
  
  // Calcular margem de lucro
  if (this.receitas.total > 0) {
    this.margemLucro = (this.lucro / this.receitas.total) * 100;
  } else {
    this.margemLucro = 0;
  }

  // Calcular métricas
  this.metricas.ticketMedioReceita = this.receitas.quantidade > 0 
    ? this.receitas.total / this.receitas.quantidade 
    : 0;
  
  this.metricas.ticketMedioDespesa = this.despesas.quantidade > 0 
    ? this.despesas.total / this.despesas.quantidade 
    : 0;

  // Calcular percentuais pendentes
  const receitasPendentes = receitas.filter(r => r.status === 'pendente');
  const despesasPendentes = despesas.filter(d => d.status === 'pendente');
  
  this.metricas.percentualReceitasPendentes = this.receitas.quantidade > 0
    ? (receitasPendentes.length / this.receitas.quantidade) * 100
    : 0;
  
  this.metricas.percentualDespesasPendentes = this.despesas.quantidade > 0
    ? (despesasPendentes.length / this.despesas.quantidade) * 100
    : 0;

  await this.save();
  return this;
};

// Método para fechar período
cashFlowSchema.methods.fechar = function() {
  this.status = 'fechado';
  this.dataFechamento = new Date();
  return this.save();
};

// Método para reabrir período
cashFlowSchema.methods.reabrir = function() {
  this.status = 'provisorio';
  this.dataFechamento = null;
  return this.save();
};

// Static para buscar ou criar fluxo de caixa
cashFlowSchema.statics.buscarOuCriar = async function(mes, ano, usuarioId) {
  let cashFlow = await this.findOne({
    'periodo.mes': mes,
    'periodo.ano': ano,
    usuario: usuarioId
  });

  if (!cashFlow) {
    // Buscar saldo final do mês anterior
    const mesAnterior = mes === 1 ? 12 : mes - 1;
    const anoAnterior = mes === 1 ? ano - 1 : ano;

    const cashFlowAnterior = await this.findOne({
      'periodo.mes': mesAnterior,
      'periodo.ano': anoAnterior,
      usuario: usuarioId
    });

    cashFlow = new this({
      periodo: { mes, ano },
      usuario: usuarioId,
      saldoInicial: cashFlowAnterior?.saldoFinal || 0
    });

    await cashFlow.save();
  }

  return cashFlow;
};

// Static para obter série histórica
cashFlowSchema.statics.serieHistorica = async function(usuarioId, meses = 12) {
  const agora = new Date();
  const resultado = [];

  for (let i = meses - 1; i >= 0; i--) {
    const data = new Date(agora);
    data.setMonth(data.getMonth() - i);
    
    const cashFlow = await this.buscarOuCriar(
      data.getMonth() + 1,
      data.getFullYear(),
      usuarioId
    );

    await cashFlow.calcular();
    resultado.push(cashFlow);
  }

  return resultado;
};

const CashFlow = mongoose.model('CashFlow', cashFlowSchema);

module.exports = CashFlow;

