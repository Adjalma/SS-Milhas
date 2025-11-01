/**
 * Modelo de Transações Agendadas
 * 
 * Gerencia agendamentos recorrentes de movimentações
 * - Agendamento único
 * - Recorrência diária, semanal, mensal
 * - Histórico de execuções
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const scheduledTransactionSchema = new mongoose.Schema({
  // Título descritivo
  titulo: {
    type: String,
    required: [true, 'Título é obrigatório']
  },

  descricao: String,

  // Tipo de movimentação que será criada
  tipoMovimentacao: {
    type: String,
    required: true,
    enum: ['compra', 'venda', 'transferencia', 'passagem', 'saida_manual']
  },

  // Template da movimentação que será criada
  templateMovimentacao: {
    tipo: String,
    subtipo: String,
    origem: {
      tipo: String,
      referencia: mongoose.Schema.Types.ObjectId,
      nome: String
    },
    destino: {
      tipo: String,
      referencia: mongoose.Schema.Types.ObjectId,
      nome: String
    },
    programa: String,
    programaId: mongoose.Schema.Types.ObjectId,
    quantidade: Number,
    valor: Number,
    taxas: {
      transferencia: Number,
      embarque: Number,
      servico: Number
    },
    metadados: mongoose.Schema.Types.Mixed,
    financeiro: {
      contaBancaria: mongoose.Schema.Types.ObjectId,
      formaPagamento: String,
      parcelas: Number
    }
  },

  // Configuração de recorrência
  recorrencia: {
    tipo: {
      type: String,
      required: true,
      enum: ['unica', 'diaria', 'semanal', 'mensal', 'anual'],
      default: 'unica'
    },
    
    // Intervalo (ex: a cada 2 dias, a cada 3 semanas)
    intervalo: {
      type: Number,
      default: 1,
      min: 1
    },

    // Para recorrência semanal (0 = Domingo, 6 = Sábado)
    diasSemana: {
      type: [Number],
      validate: {
        validator: function(dias) {
          return dias.every(dia => dia >= 0 && dia <= 6);
        },
        message: 'Dias da semana devem estar entre 0 (Domingo) e 6 (Sábado)'
      }
    },

    // Para recorrência mensal (dia do mês: 1-31)
    diaDoMes: {
      type: Number,
      min: 1,
      max: 31
    },

    // Datas de início e fim
    dataInicio: {
      type: Date,
      required: true,
      default: Date.now
    },

    dataFim: Date,

    // Número máximo de execuções (opcional)
    maxExecucoes: Number
  },

  // Próxima execução programada
  proximaExecucao: {
    type: Date,
    required: true,
    index: true
  },

  // Última execução
  ultimaExecucao: Date,

  // Status do agendamento
  ativo: {
    type: Boolean,
    default: true,
    index: true
  },

  // Pausado temporariamente
  pausado: {
    type: Boolean,
    default: false
  },

  motivoPausa: String,

  // Contador de execuções
  totalExecucoes: {
    type: Number,
    default: 0
  },

  // Usuário criador
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Account associado
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    index: true
  },

  // Histórico de execuções
  historico: [{
    data: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['sucesso', 'erro', 'cancelado', 'pulado']
    },
    movimentoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movement'
    },
    erro: String,
    observacao: String
  }],

  // Configurações de notificação
  notificacoes: {
    antesExecucao: {
      type: Boolean,
      default: false
    },
    tempoAntecedencia: {
      type: Number, // em minutos
      default: 60
    },
    aposExecucao: {
      type: Boolean,
      default: true
    },
    emErro: {
      type: Boolean,
      default: true
    }
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compostos
scheduledTransactionSchema.index({ ativo: 1, proximaExecucao: 1 });
scheduledTransactionSchema.index({ usuario: 1, ativo: 1 });
scheduledTransactionSchema.index({ tipoMovimentacao: 1, ativo: 1 });

// Virtual para verificar se deve executar
scheduledTransactionSchema.virtual('deveExecutar').get(function() {
  if (!this.ativo || this.pausado) return false;
  if (this.recorrencia.dataFim && new Date() > this.recorrencia.dataFim) return false;
  if (this.recorrencia.maxExecucoes && this.totalExecucoes >= this.recorrencia.maxExecucoes) return false;
  return new Date() >= this.proximaExecucao;
});

// Método para calcular próxima execução
scheduledTransactionSchema.methods.calcularProximaExecucao = function() {
  const { tipo, intervalo, diasSemana, diaDoMes } = this.recorrencia;
  const agora = new Date();
  let proxima = new Date(this.proximaExecucao || this.recorrencia.dataInicio);

  switch (tipo) {
    case 'unica':
      // Execução única, não há próxima
      this.ativo = false;
      return null;

    case 'diaria':
      proxima.setDate(proxima.getDate() + intervalo);
      break;

    case 'semanal':
      // Se não especificou dias da semana, adiciona 7 * intervalo dias
      if (!diasSemana || diasSemana.length === 0) {
        proxima.setDate(proxima.getDate() + (7 * intervalo));
      } else {
        // Encontra o próximo dia da semana válido
        let diasParaAdicionar = 1;
        let diaAtual = proxima.getDay();
        
        while (diasParaAdicionar <= 7) {
          const proximoDia = (diaAtual + diasParaAdicionar) % 7;
          if (diasSemana.includes(proximoDia)) {
            proxima.setDate(proxima.getDate() + diasParaAdicionar);
            break;
          }
          diasParaAdicionar++;
        }
      }
      break;

    case 'mensal':
      if (diaDoMes) {
        proxima.setMonth(proxima.getMonth() + intervalo);
        proxima.setDate(Math.min(diaDoMes, new Date(proxima.getFullYear(), proxima.getMonth() + 1, 0).getDate()));
      } else {
        proxima.setMonth(proxima.getMonth() + intervalo);
      }
      break;

    case 'anual':
      proxima.setFullYear(proxima.getFullYear() + intervalo);
      break;
  }

  // Verificar se passou da data final
  if (this.recorrencia.dataFim && proxima > this.recorrencia.dataFim) {
    this.ativo = false;
    return null;
  }

  // Verificar limite de execuções
  if (this.recorrencia.maxExecucoes && this.totalExecucoes >= this.recorrencia.maxExecucoes) {
    this.ativo = false;
    return null;
  }

  this.proximaExecucao = proxima;
  return proxima;
};

// Método para executar agendamento
scheduledTransactionSchema.methods.executar = async function() {
  try {
    const Movement = mongoose.model('Movement');

    // Criar movimentação baseada no template
    const novaMovimentacao = new Movement({
      ...this.templateMovimentacao,
      usuario: this.usuario,
      accountId: this.accountId,
      agendamento: {
        dataExecucao: new Date(),
        executado: true
      },
      status: 'processando'
    });

    await novaMovimentacao.save();

    // Atualizar histórico
    this.historico.push({
      data: new Date(),
      status: 'sucesso',
      movimentoId: novaMovimentacao._id,
      observacao: 'Movimentação criada com sucesso'
    });

    this.ultimaExecucao = new Date();
    this.totalExecucoes += 1;

    // Calcular próxima execução
    this.calcularProximaExecucao();

    await this.save();

    return {
      success: true,
      movimento: novaMovimentacao,
      message: 'Agendamento executado com sucesso'
    };

  } catch (error) {
    // Registrar erro no histórico
    this.historico.push({
      data: new Date(),
      status: 'erro',
      erro: error.message,
      observacao: 'Falha na execução do agendamento'
    });

    // Calcular próxima tentativa mesmo em caso de erro
    this.calcularProximaExecucao();
    
    await this.save();

    throw error;
  }
};

// Método para pausar agendamento
scheduledTransactionSchema.methods.pausar = function(motivo) {
  this.pausado = true;
  this.motivoPausa = motivo || 'Pausado pelo usuário';
  return this.save();
};

// Método para retomar agendamento
scheduledTransactionSchema.methods.retomar = function() {
  this.pausado = false;
  this.motivoPausa = null;
  
  // Se a próxima execução já passou, recalcula
  if (this.proximaExecucao < new Date()) {
    this.calcularProximaExecucao();
  }
  
  return this.save();
};

// Método para cancelar agendamento
scheduledTransactionSchema.methods.cancelar = function(motivo) {
  this.ativo = false;
  this.historico.push({
    data: new Date(),
    status: 'cancelado',
    observacao: motivo || 'Agendamento cancelado pelo usuário'
  });
  return this.save();
};

// Static para buscar agendamentos prontos para executar
scheduledTransactionSchema.statics.prontoParaExecutar = function() {
  return this.find({
    ativo: true,
    pausado: false,
    proximaExecucao: { $lte: new Date() }
  }).sort({ proximaExecucao: 1 });
};

// Static para buscar agendamentos por usuário
scheduledTransactionSchema.statics.porUsuario = function(usuarioId, ativos = true) {
  const query = { usuario: usuarioId };
  if (ativos !== null) {
    query.ativo = ativos;
  }
  return this.find(query).sort({ proximaExecucao: 1 });
};

// Middleware pre-save para garantir próxima execução
scheduledTransactionSchema.pre('save', function(next) {
  if (this.isNew && !this.proximaExecucao) {
    this.proximaExecucao = this.recorrencia.dataInicio || new Date();
  }
  next();
});

const ScheduledTransaction = mongoose.model('ScheduledTransaction', scheduledTransactionSchema);

module.exports = ScheduledTransaction;

