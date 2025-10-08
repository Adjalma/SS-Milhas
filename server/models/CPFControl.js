const mongoose = require('mongoose');

const cpfControlSchema = new mongoose.Schema({
  // Identificação
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Dados do CPF
  nome: {
    type: String,
    required: true,
    trim: true
  },
  
  cpf: {
    type: String,
    required: true,
    trim: true
    // Removida validação de formato para permitir diferentes formatos
  },
  
  // Programa associado
  programa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  
  programaNome: {
    type: String,
    required: true
  },
  
  // Dados de controle
  categoria: {
    type: String,
    enum: ['Nacional', 'Internacional', 'Bancário', 'Hotel', 'Varejo', 'Outros'],
    required: true
  },
  
  // Etiqueta - CAMPO PRINCIPAL
  etiqueta: {
    type: String,
    default: '',
    maxlength: 500
  },
  
  // Dados de uso
  cpfUsados: {
    type: Number,
    default: 0,
    min: 0
  },
  
  limiteCPF: {
    type: Number,
    default: null
  },
  
  // Milhas e valores
  milhas: {
    type: Number,
    default: 0
  },
  
  cm: {
    type: Number,
    default: 0
  },
  
  valor: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['ativo', 'bloqueado', 'suspenso', 'verificando', 'inativo'],
    default: 'ativo'
  },
  
  favorito: {
    type: Boolean,
    default: false
  },
  
  // Datas importantes
  dataCadastro: {
    type: Date,
    default: Date.now
  },
  
  dataUltimoUso: {
    type: Date
  },
  
  dataVencimento: {
    type: Date
  },
  
  // Alertas e observações
  alertas: [{
    tipo: String,
    mensagem: String,
    data: {
      type: Date,
      default: Date.now
    }
  }],
  
  observacoes: {
    type: String,
    default: ''
  },
  
  // Histórico de etiquetas (para auditoria)
  historicoEtiquetas: [{
    etiqueta: String,
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    data: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Metadados
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para busca rápida
cpfControlSchema.index({ usuario: 1, programa: 1 });
cpfControlSchema.index({ usuario: 1, cpf: 1 });
cpfControlSchema.index({ usuario: 1, categoria: 1 });
cpfControlSchema.index({ usuario: 1, status: 1 });
cpfControlSchema.index({ nome: 'text', cpf: 'text', etiqueta: 'text' });

// Método para atualizar etiqueta com histórico
cpfControlSchema.methods.atualizarEtiqueta = function(novaEtiqueta, usuarioId) {
  // Adicionar ao histórico se mudou
  if (this.etiqueta !== novaEtiqueta) {
    this.historicoEtiquetas.push({
      etiqueta: this.etiqueta,
      usuario: usuarioId,
      data: new Date()
    });
  }
  
  this.etiqueta = novaEtiqueta;
  this.updatedAt = new Date();
  
  return this.save();
};

// Método para adicionar alerta
cpfControlSchema.methods.adicionarAlerta = function(tipo, mensagem) {
  this.alertas.push({
    tipo,
    mensagem,
    data: new Date()
  });
  
  return this.save();
};

// Método estático para buscar por usuário
cpfControlSchema.statics.buscarPorUsuario = function(usuarioId, filtros = {}) {
  const query = { usuario: usuarioId };
  
  if (filtros.categoria) {
    query.categoria = filtros.categoria;
  }
  
  if (filtros.status) {
    query.status = filtros.status;
  }
  
  if (filtros.programa) {
    query.programa = filtros.programa;
  }
  
  return this.find(query).populate('programa').sort({ nome: 1 });
};

// Método estático para buscar com etiquetas
cpfControlSchema.statics.buscarComEtiquetas = function(usuarioId) {
  return this.find({
    usuario: usuarioId,
    etiqueta: { $ne: '' }
  }).populate('programa').sort({ updatedAt: -1 });
};

const CPFControl = mongoose.model('CPFControl', cpfControlSchema);

module.exports = CPFControl;
