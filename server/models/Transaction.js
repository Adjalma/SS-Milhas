/**
 * Modelo de Transação - Sistema de Gestão de Milhas
 * 
 * Define a estrutura das transações financeiras e de milhas,
 * incluindo compras, vendas, transferências e análises.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // ==================== DADOS BÁSICOS ====================
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuário é obrigatório']
  },
  
  conta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Conta é obrigatória']
  },
  
  tipo: {
    type: String,
    required: [true, 'Tipo da transação é obrigatório'],
    enum: [
      'compra',
      'venda',
      'transferencia-entrada',
      'transferencia-saida',
      'bonus',
      'expiracao',
      'cancelamento',
      'reembolso',
      'taxa',
      'outros'
    ]
  },
  
  categoria: {
    type: String,
    required: true,
    enum: [
      'comercial',
      'pessoal',
      'investimento',
      'bonificacao',
      'correcao',
      'administrativo'
    ]
  },
  
  // ==================== INFORMAÇÕES DA TRANSAÇÃO ====================
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    maxlength: [500, 'Descrição não pode ter mais de 500 caracteres']
  },
  
  quantidade: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: [0, 'Quantidade não pode ser negativa']
  },
  
  valorUnitario: {
    type: Number,
    required: [true, 'Valor unitário é obrigatório'],
    min: [0, 'Valor unitário não pode ser negativo']
  },
  
  valorTotal: {
    type: Number,
    required: [true, 'Valor total é obrigatório']
  },
  
  moeda: {
    type: String,
    default: 'BRL',
    enum: ['BRL', 'USD', 'EUR']
  },
  
  // ==================== DADOS FINANCEIROS ====================
  custos: {
    taxaTransacao: { type: Number, default: 0 },
    taxaTransferencia: { type: Number, default: 0 },
    impostos: { type: Number, default: 0 },
    outrosCustos: { type: Number, default: 0 },
    custoTotal: { type: Number, default: 0 }
  },
  
  lucro: {
    valorBruto: { type: Number, default: 0 },
    valorLiquido: { type: Number, default: 0 },
    margemPercentual: { type: Number, default: 0 }
  },
  
  // ==================== DADOS DE TERCEIROS ====================
  contraparte: {
    nome: String,
    documento: String,
    email: String,
    telefone: String,
    tipo: {
      type: String,
      enum: ['pessoa-fisica', 'pessoa-juridica']
    }
  },
  
  // ==================== DADOS ESPECÍFICOS POR TIPO ====================
  dadosEspecificos: {
    // Para transferências
    contaOrigem: String,
    contaDestino: String,
    motivoTransferencia: String,
    
    // Para compras/vendas
    plataforma: String,
    numeroTransacao: String,
    metodoPagamento: String,
    
    // Para bônus
    programaBonus: String,
    promocao: String,
    validadeBonus: Date,
    
    // Para emissões
    cpfUtilizado: String,
    nomePassageiro: String,
    numeroBilhete: String,
    rota: String,
    dataViagem: Date,
    
    // Para correções
    transacaoOriginal: mongoose.Schema.Types.ObjectId,
    motivoCorrecao: String
  },
  
  // ==================== STATUS E CONTROLE ====================
  status: {
    type: String,
    enum: ['pendente', 'processando', 'concluida', 'cancelada', 'erro'],
    default: 'concluida'
  },
  
  dataTransacao: {
    type: Date,
    required: [true, 'Data da transação é obrigatória'],
    default: Date.now
  },
  
  dataProcessamento: Date,
  dataConclusao: Date,
  
  // ==================== DOCUMENTOS E COMPROVANTES ====================
  comprovantes: [{
    tipo: {
      type: String,
      enum: ['nota-fiscal', 'recibo', 'extrato', 'comprovante-transferencia', 'outros']
    },
    nome: String,
    url: String,
    tamanho: Number,
    dataUpload: { type: Date, default: Date.now }
  }],
  
  // ==================== TAGS E CATEGORIZAÇÃO ====================
  tags: [{
    type: String,
    trim: true
  }],
  
  observacoes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Observações não podem ter mais de 1000 caracteres']
  },
  
  // ==================== DADOS PARA IMPOSTO DE RENDA ====================
  dadosIR: {
    sujeitoIR: { type: Boolean, default: false },
    valorIR: { type: Number, default: 0 },
    mesReferencia: String,
    categoriaIR: {
      type: String,
      enum: ['renda-variavel', 'renda-fixa', 'outros']
    },
    observacoesIR: String
  },
  
  // ==================== ANÁLISE E MÉTRICAS ====================
  analise: {
    scoreQualidade: { type: Number, default: 0 }, // 0-100
    risco: {
      type: String,
      enum: ['baixo', 'medio', 'alto'],
      default: 'baixo'
    },
    impactoSaldo: { type: Number, default: 0 },
    impactoFinanceiro: { type: Number, default: 0 },
    recomendacoes: [String]
  },
  
  // ==================== AUDITORIA ====================
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  modificadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  versao: {
    type: Number,
    default: 1
  },
  
  // ==================== DADOS DE INTEGRAÇÃO ====================
  integracao: {
    origem: {
      type: String,
      enum: ['manual', 'importacao', 'api', 'sincronizacao']
    },
    idExterno: String,
    ultimaSincronizacao: Date,
    dadosOriginais: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== ÍNDICES ====================
transactionSchema.index({ usuario: 1 });
transactionSchema.index({ conta: 1 });
transactionSchema.index({ tipo: 1 });
transactionSchema.index({ dataTransacao: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ valorTotal: -1 });
transactionSchema.index({ 'contraparte.documento': 1 });
transactionSchema.index({ createdAt: -1 });

// ==================== VIRTUALS ====================
transactionSchema.virtual('valorFormatado').get(function() {
  return this.valorTotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: this.moeda
  });
});

transactionSchema.virtual('quantidadeFormatada').get(function() {
  return this.quantidade.toLocaleString('pt-BR');
});

transactionSchema.virtual('custoMilheiro').get(function() {
  if (this.quantidade === 0) return 0;
  return this.valorTotal / this.quantidade;
});

transactionSchema.virtual('lucroFormatado').get(function() {
  return this.lucro.valorLiquido.toLocaleString('pt-BR', {
    style: 'currency',
    currency: this.moeda
  });
});

transactionSchema.virtual('diasDesdeTransacao').get(function() {
  return Math.floor((new Date() - this.dataTransacao) / (1000 * 60 * 60 * 24));
});

// ==================== MIDDLEWARES ====================

// Calcular valores antes de salvar
transactionSchema.pre('save', function(next) {
  // Calcular valor total se não fornecido
  if (!this.valorTotal && this.quantidade && this.valorUnitario) {
    this.valorTotal = this.quantidade * this.valorUnitario;
  }
  
  // Calcular custos totais
  this.custos.custoTotal = 
    this.custos.taxaTransacao + 
    this.custos.taxaTransferencia + 
    this.custos.impostos + 
    this.custos.outrosCustos;
  
  // Calcular lucro
  if (this.tipo === 'venda') {
    this.lucro.valorBruto = this.valorTotal;
    this.lucro.valorLiquido = this.valorTotal - this.custos.custoTotal;
    this.lucro.margemPercentual = this.valorTotal > 0 ? 
      (this.lucro.valorLiquido / this.valorTotal) * 100 : 0;
  } else if (this.tipo === 'compra') {
    this.lucro.valorBruto = 0;
    this.lucro.valorLiquido = -(this.valorTotal + this.custos.custoTotal);
    this.lucro.margemPercentual = 0;
  }
  
  // Atualizar datas de processamento
  if (this.isModified('status')) {
    if (this.status === 'processando' && !this.dataProcessamento) {
      this.dataProcessamento = new Date();
    }
    if (this.status === 'concluida' && !this.dataConclusao) {
      this.dataConclusao = new Date();
    }
  }
  
  next();
});

// ==================== MÉTODOS DE INSTÂNCIA ====================

// Calcular score de qualidade da transação
transactionSchema.methods.calcularScoreQualidade = function() {
  let score = 50; // Base
  
  // Bonificar por comprovantes
  if (this.comprovantes.length > 0) score += 20;
  
  // Bonificar por dados completos da contraparte
  if (this.contraparte.nome && this.contraparte.documento) score += 15;
  
  // Bonificar por observações
  if (this.observacoes && this.observacoes.length > 10) score += 10;
  
  // Bonificar por tags
  if (this.tags.length > 0) score += 5;
  
  // Penalizar por transações muito antigas sem dados
  if (this.diasDesdeTransacao > 365 && this.comprovantes.length === 0) score -= 30;
  
  this.analise.scoreQualidade = Math.max(0, Math.min(100, score));
  return this.analise.scoreQualidade;
};

// Gerar recomendações
transactionSchema.methods.gerarRecomendacoes = function() {
  const recomendacoes = [];
  
  if (this.comprovantes.length === 0) {
    recomendacoes.push('Adicione comprovantes para melhor controle');
  }
  
  if (!this.contraparte.documento) {
    recomendacoes.push('Registre o documento da contraparte');
  }
  
  if (this.tipo === 'venda' && this.lucro.margemPercentual < 10) {
    recomendacoes.push('Margem de lucro baixa - considere reavaliar preço');
  }
  
  if (this.custos.custoTotal > this.valorTotal * 0.1) {
    recomendacoes.push('Custos altos em relação ao valor - otimize taxas');
  }
  
  if (this.diasDesdeTransacao > 30 && this.status === 'pendente') {
    recomendacoes.push('Transação pendente há muito tempo - verifique status');
  }
  
  this.analise.recomendacoes = recomendacoes;
  return recomendacoes;
};

// Validar transação
transactionSchema.methods.validar = function() {
  const erros = [];
  
  if (this.quantidade <= 0) {
    erros.push('Quantidade deve ser maior que zero');
  }
  
  if (this.valorTotal <= 0) {
    erros.push('Valor total deve ser maior que zero');
  }
  
  if (this.tipo === 'transferencia-saida' && !this.dadosEspecificos.contaDestino) {
    erros.push('Conta de destino é obrigatória para transferências');
  }
  
  if (this.tipo === 'venda' && !this.contraparte.documento) {
    erros.push('Documento da contraparte é obrigatório para vendas');
  }
  
  return {
    valida: erros.length === 0,
    erros
  };
};

// ==================== MÉTODOS ESTÁTICOS ====================

// Buscar transações por usuário
transactionSchema.statics.buscarPorUsuario = function(usuarioId, filtros = {}) {
  const query = { usuario: usuarioId };
  
  if (filtros.tipo) query.tipo = filtros.tipo;
  if (filtros.status) query.status = filtros.status;
  if (filtros.dataInicio || filtros.dataFim) {
    query.dataTransacao = {};
    if (filtros.dataInicio) query.dataTransacao.$gte = new Date(filtros.dataInicio);
    if (filtros.dataFim) query.dataTransacao.$lte = new Date(filtros.dataFim);
  }
  
  return this.find(query).populate('conta').sort({ dataTransacao: -1 });
};

// Estatísticas por período
transactionSchema.statics.obterEstatisticasPeriodo = async function(usuarioId, dataInicio, dataFim) {
  const matchStage = {
    usuario: mongoose.Types.ObjectId(usuarioId),
    dataTransacao: {
      $gte: new Date(dataInicio),
      $lte: new Date(dataFim)
    }
  };
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalTransacoes: { $sum: 1 },
        valorTotal: { $sum: '$valorTotal' },
        quantidadeTotal: { $sum: '$quantidade' },
        lucroTotal: { $sum: '$lucro.valorLiquido' },
        custoTotal: { $sum: '$custos.custoTotal' },
        mediaValor: { $avg: '$valorTotal' },
        mediaQuantidade: { $avg: '$quantidade' },
        transacoesPorTipo: {
          $push: {
            tipo: '$tipo',
            valor: '$valorTotal',
            quantidade: '$quantidade'
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalTransacoes: 0,
    valorTotal: 0,
    quantidadeTotal: 0,
    lucroTotal: 0,
    custoTotal: 0,
    mediaValor: 0,
    mediaQuantidade: 0,
    transacoesPorTipo: []
  };
};

// Análise de tendências
transactionSchema.statics.analisarTendencias = async function(usuarioId, meses = 12) {
  const dataInicio = new Date();
  dataInicio.setMonth(dataInicio.getMonth() - meses);
  
  return this.aggregate([
    {
      $match: {
        usuario: mongoose.Types.ObjectId(usuarioId),
        dataTransacao: { $gte: dataInicio }
      }
    },
    {
      $group: {
        _id: {
          ano: { $year: '$dataTransacao' },
          mes: { $month: '$dataTransacao' },
          tipo: '$tipo'
        },
        quantidade: { $sum: '$quantidade' },
        valor: { $sum: '$valorTotal' },
        transacoes: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.ano': 1, '_id.mes': 1 }
    }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);
