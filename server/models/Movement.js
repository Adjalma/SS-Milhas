/**
 * Modelo de Movimentações
 * 
 * Gerencia todas as movimentações de milhas do sistema:
 * - Compras (entrada, bonificada)
 * - Vendas
 * - Transferências (entre contas, entre pessoas)
 * - Passagens
 * - Saídas manuais
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  // Tipo de movimentação
  tipo: {
    type: String,
    required: [true, 'Tipo de movimentação é obrigatório'],
    enum: {
      values: ['compra', 'venda', 'transferencia', 'passagem', 'saida_manual', 'agendamento'],
      message: '{VALUE} não é um tipo válido'
    },
    index: true
  },

  // Subtipo para classificação detalhada
  subtipo: {
    type: String,
    enum: ['entrada', 'bonificada', 'entre_contas', 'entre_pessoas', 'familiar', 'outra']
  },

  // Origem da movimentação
  origem: {
    tipo: {
      type: String,
      enum: ['account', 'pessoa', 'externa', 'sistema'],
      required: true
    },
    referencia: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'origem.tipo'
    },
    nome: String, // Nome descritivo para exibição
    cpf: String
  },

  // Destino da movimentação
  destino: {
    tipo: {
      type: String,
      enum: ['account', 'pessoa', 'externa', 'cliente', 'sistema']
    },
    referencia: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'destino.tipo'
    },
    nome: String,
    cpf: String
  },

  // Informações do programa
  programa: {
    type: String,
    required: [true, 'Programa é obrigatório'],
    index: true
  },

  programaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  },

  // Quantidade de milhas
  quantidade: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: [1, 'Quantidade deve ser maior que zero']
  },

  // Valores financeiros
  valor: {
    type: Number,
    required: [true, 'Valor é obrigatório'],
    min: [0, 'Valor não pode ser negativo']
  },

  custoMilha: {
    type: Number,
    default: function() {
      return this.quantidade > 0 ? (this.valor / this.quantidade) : 0;
    }
  },

  // Taxas associadas
  taxas: {
    transferencia: { type: Number, default: 0 },
    embarque: { type: Number, default: 0 },
    servico: { type: Number, default: 0 },
    outra: { type: Number, default: 0 }
  },

  valorTotal: {
    type: Number,
    default: function() {
      const totalTaxas = 
        (this.taxas?.transferencia || 0) +
        (this.taxas?.embarque || 0) +
        (this.taxas?.servico || 0) +
        (this.taxas?.outra || 0);
      return this.valor + totalTaxas;
    }
  },

  // Status da movimentação
  status: {
    type: String,
    required: true,
    enum: ['pendente', 'processando', 'concluida', 'cancelada', 'erro'],
    default: 'pendente',
    index: true
  },

  // Informações de agendamento
  agendamento: {
    dataExecucao: Date,
    executado: {
      type: Boolean,
      default: false
    },
    tentativas: {
      type: Number,
      default: 0
    },
    ultimaTentativa: Date,
    erro: String
  },

  // Metadados adicionais
  metadados: {
    cpfUtilizado: String,
    numeroReserva: String,
    localizador: String,
    observacoes: String,
    comprovante: String,
    
    // Para passagens
    origem: String,
    destino: String,
    dataVoo: Date,
    horario: String,
    classe: String,
    
    // Para vendas
    cliente: String,
    lucro: Number,
    margemLucro: Number
  },

  // Informações financeiras
  financeiro: {
    contaBancaria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BankAccount'
    },
    formaPagamento: {
      type: String,
      enum: ['dinheiro', 'pix', 'transferencia', 'boleto', 'cartao_credito', 'cartao_debito']
    },
    parcelas: {
      type: Number,
      default: 1,
      min: 1
    },
    dataVencimento: Date,
    dataPagamento: Date
  },

  // Usuário responsável
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Account associado (se aplicável)
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    index: true
  },

  // Transação relacionada (se houver)
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },

  // Data da movimentação
  dataMovimentacao: {
    type: Date,
    default: Date.now,
    index: true
  },

  // Histórico de alterações
  historico: [{
    data: {
      type: Date,
      default: Date.now
    },
    status: String,
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    observacao: String
  }]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compostos para queries otimizadas
movementSchema.index({ tipo: 1, status: 1 });
movementSchema.index({ usuario: 1, dataMovimentacao: -1 });
movementSchema.index({ programa: 1, dataMovimentacao: -1 });
movementSchema.index({ 'agendamento.dataExecucao': 1, 'agendamento.executado': 1 });

// Virtual para calcular lucro (se for venda)
movementSchema.virtual('lucroCalculado').get(function() {
  if (this.tipo === 'venda' && this.metadados?.lucro) {
    return this.metadados.lucro;
  }
  return 0;
});

// Middleware pre-save para atualizar valores calculados
movementSchema.pre('save', function(next) {
  // Calcular custo por milha
  if (this.quantidade > 0) {
    this.custoMilha = this.valor / this.quantidade;
  }

  // Calcular valor total com taxas
  const totalTaxas = 
    (this.taxas?.transferencia || 0) +
    (this.taxas?.embarque || 0) +
    (this.taxas?.servico || 0) +
    (this.taxas?.outra || 0);
  this.valorTotal = this.valor + totalTaxas;

  // Adicionar ao histórico se status mudou
  if (this.isModified('status')) {
    this.historico.push({
      status: this.status,
      usuario: this.usuario,
      observacao: `Status alterado para: ${this.status}`
    });
  }

  next();
});

// Método para processar movimentação
movementSchema.methods.processar = async function() {
  try {
    this.status = 'processando';
    await this.save();

    // Aqui viria a lógica de processamento específica por tipo
    // Por enquanto, apenas marca como concluída
    
    this.status = 'concluida';
    if (this.agendamento) {
      this.agendamento.executado = true;
    }
    
    await this.save();
    return { success: true, message: 'Movimentação processada com sucesso' };
    
  } catch (error) {
    this.status = 'erro';
    if (this.agendamento) {
      this.agendamento.erro = error.message;
      this.agendamento.tentativas += 1;
      this.agendamento.ultimaTentativa = new Date();
    }
    await this.save();
    throw error;
  }
};

// Método para cancelar movimentação
movementSchema.methods.cancelar = async function(motivo, usuarioId) {
  if (this.status === 'concluida') {
    throw new Error('Não é possível cancelar uma movimentação já concluída');
  }

  this.status = 'cancelada';
  this.historico.push({
    status: 'cancelada',
    usuario: usuarioId,
    observacao: motivo || 'Movimentação cancelada'
  });

  await this.save();
  return { success: true, message: 'Movimentação cancelada com sucesso' };
};

// Statics para queries comuns
movementSchema.statics.buscarPorPeriodo = function(dataInicio, dataFim, filtros = {}) {
  return this.find({
    dataMovimentacao: {
      $gte: dataInicio,
      $lte: dataFim
    },
    ...filtros
  }).sort({ dataMovimentacao: -1 });
};

movementSchema.statics.estatisticas = async function(filtros = {}) {
  const stats = await this.aggregate([
    { $match: filtros },
    {
      $group: {
        _id: '$tipo',
        total: { $sum: 1 },
        quantidadeTotal: { $sum: '$quantidade' },
        valorTotal: { $sum: '$valor' }
      }
    }
  ]);

  return stats;
};

movementSchema.statics.pendentes = function() {
  return this.find({
    status: { $in: ['pendente', 'processando'] }
  }).sort({ dataMovimentacao: 1 });
};

movementSchema.statics.agendadas = function() {
  return this.find({
    'agendamento.executado': false,
    'agendamento.dataExecucao': { $gte: new Date() },
    status: { $ne: 'cancelada' }
  }).sort({ 'agendamento.dataExecucao': 1 });
};

const Movement = mongoose.model('Movement', movementSchema);

module.exports = Movement;

