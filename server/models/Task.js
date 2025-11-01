/**
 * Modelo de Tarefas
 * 
 * Sistema de gestão de tarefas e Kanban
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },

  descricao: {
    type: String,
    trim: true
  },

  responsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  prioridade: {
    type: String,
    required: true,
    enum: ['baixa', 'media', 'alta', 'urgente'],
    default: 'media',
    index: true
  },

  status: {
    type: String,
    required: true,
    enum: ['pendente', 'em_andamento', 'concluida', 'cancelada', 'bloqueada'],
    default: 'pendente',
    index: true
  },

  categoria: {
    type: String,
    enum: ['compras', 'vendas', 'transferencias', 'passagens', 'relatorios', 'financeiro', 'geral', 'outra'],
    default: 'geral'
  },

  tags: [String],

  dataVencimento: {
    type: Date,
    index: true
  },

  dataConclusao: Date,

  dataInicio: Date,

  estimativa: {
    type: String, // '2h', '1d', '30m'
    trim: true
  },

  tempoGasto: {
    type: Number, // em minutos
    default: 0
  },

  // Subtarefas
  subtarefas: [{
    descricao: {
      type: String,
      required: true
    },
    concluida: {
      type: Boolean,
      default: false
    },
    dataConclusao: Date
  }],

  // Anexos
  anexos: [{
    nome: String,
    url: String,
    tipo: String,
    tamanho: Number,
    dataUpload: {
      type: Date,
      default: Date.now
    }
  }],

  // Comentários
  comentarios: [{
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    texto: String,
    data: {
      type: Date,
      default: Date.now
    }
  }],

  // Vínculo com outras entidades
  vinculoMovimento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movement'
  },

  vinculoTransacao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },

  vinculoConta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },

  // Posição no Kanban
  kanban: {
    coluna: {
      type: String,
      enum: ['pendente', 'em_andamento', 'concluida'],
      default: 'pendente'
    },
    posicao: {
      type: Number,
      default: 0
    }
  },

  observacoes: String,

  // Recorrência
  recorrente: {
    type: Boolean,
    default: false
  },

  recorrencia: {
    tipo: String,
    enum: ['diaria', 'semanal', 'mensal'],
    intervalo: Number,
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
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compostos
taskSchema.index({ responsavel: 1, status: 1 });
taskSchema.index({ usuario: 1, status: 1 });
taskSchema.index({ dataVencimento: 1, status: 1 });
taskSchema.index({ prioridade: 1, status: 1 });
taskSchema.index({ 'kanban.coluna': 1, 'kanban.posicao': 1 });

// Virtual para verificar se está atrasada
taskSchema.virtual('atrasada').get(function() {
  if (this.status !== 'concluida' && this.status !== 'cancelada' && this.dataVencimento) {
    return this.dataVencimento < new Date();
  }
  return false;
});

// Virtual para porcentagem de conclusão das subtarefas
taskSchema.virtual('progressoSubtarefas').get(function() {
  if (!this.subtarefas || this.subtarefas.length === 0) return 100;
  
  const concluidas = this.subtarefas.filter(s => s.concluida).length;
  return Math.round((concluidas / this.subtarefas.length) * 100);
});

// Virtual para dias restantes
taskSchema.virtual('diasRestantes').get(function() {
  if (!this.dataVencimento || this.status === 'concluida' || this.status === 'cancelada') return null;
  
  const hoje = new Date();
  const diff = this.dataVencimento.getTime() - hoje.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
});

// Método para concluir tarefa
taskSchema.methods.concluir = function() {
  this.status = 'concluida';
  this.dataConclusao = new Date();
  this.kanban.coluna = 'concluida';
  return this.save();
};

// Método para cancelar tarefa
taskSchema.methods.cancelar = function(motivo) {
  this.status = 'cancelada';
  if (motivo) {
    this.observacoes = (this.observacoes || '') + '\n' + `Cancelada: ${motivo}`;
  }
  return this.save();
};

// Método para iniciar tarefa
taskSchema.methods.iniciar = function() {
  this.status = 'em_andamento';
  this.dataInicio = new Date();
  this.kanban.coluna = 'em_andamento';
  return this.save();
};

// Método para adicionar comentário
taskSchema.methods.adicionarComentario = function(usuarioId, texto) {
  this.comentarios.push({
    usuario: usuarioId,
    texto,
    data: new Date()
  });
  return this.save();
};

// Método para adicionar subtarefa
taskSchema.methods.adicionarSubtarefa = function(descricao) {
  this.subtarefas.push({
    descricao,
    concluida: false
  });
  return this.save();
};

// Método para marcar subtarefa como concluída
taskSchema.methods.concluirSubtarefa = function(index) {
  if (this.subtarefas && this.subtarefas[index]) {
    this.subtarefas[index].concluida = true;
    this.subtarefas[index].dataConclusao = new Date();
  }
  return this.save();
};

// Statics para queries comuns
taskSchema.statics.porResponsavel = function(responsavelId, status = null) {
  const query = { responsavel: responsavelId };
  if (status) query.status = status;
  return this.find(query).sort({ prioridade: -1, dataVencimento: 1 });
};

taskSchema.statics.atrasadas = function(usuarioId) {
  return this.find({
    $or: [{ responsavel: usuarioId }, { usuario: usuarioId }],
    status: { $nin: ['concluida', 'cancelada'] },
    dataVencimento: { $lt: new Date() }
  }).sort({ dataVencimento: 1 });
};

taskSchema.statics.vencendoEm = function(dias, usuarioId) {
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() + dias);
  
  return this.find({
    $or: [{ responsavel: usuarioId }, { usuario: usuarioId }],
    status: { $nin: ['concluida', 'cancelada'] },
    dataVencimento: { $lte: dataLimite, $gte: new Date() }
  }).sort({ dataVencimento: 1 });
};

taskSchema.statics.porStatus = function(status, usuarioId) {
  return this.find({
    $or: [{ responsavel: usuarioId }, { usuario: usuarioId }],
    status
  }).sort({ prioridade: -1, createdAt: -1 });
};

taskSchema.statics.kanbanView = async function(usuarioId) {
  const colunas = ['pendente', 'em_andamento', 'concluida'];
  const result = {};

  for (const coluna of colunas) {
    result[coluna] = await this.find({
      $or: [{ responsavel: usuarioId }, { usuario: usuarioId }],
      'kanban.coluna': coluna
    })
    .sort({ 'kanban.posicao': 1, createdAt: -1 })
    .populate('responsavel', 'nome email avatar')
    .populate('vinculoMovimento', 'tipo quantidade')
    .populate('vinculoConta', 'nome programa');
  }

  return result;
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

