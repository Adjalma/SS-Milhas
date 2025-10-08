const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    enum: ['Nacional', 'Internacional', 'Bancário', 'Hotel', 'Varejo', 'Outros']
  },
  tipo: {
    type: String,
    required: true,
    enum: ['aéreo', 'bancário', 'hotel', 'varejo', 'outro']
  },
  limiteCPF: {
    type: Number,
    default: null, // null = sem limite
    min: 0
  },
  tipoPeriodo: {
    type: String,
    enum: ['ano-calendario', 'fixo', 'beneficiarios', 'sem-limite'],
    default: 'sem-limite'
  },
  descricao: {
    type: String,
    required: true
  },
  regras: {
    type: String,
    default: ''
  },
  ativo: {
    type: Boolean,
    default: true
  },
  logo: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  parceiros: [{
    type: String
  }],
  observacoes: {
    type: String,
    default: ''
  },
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

// Index para busca rápida
programSchema.index({ nome: 'text', categoria: 1, tipo: 1 });

const Program = mongoose.model('Program', programSchema);

module.exports = Program;

