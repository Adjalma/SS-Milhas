/**
 * Rotas de Movimentações
 * 
 * Endpoints para gerenciar todas as movimentações de milhas
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const Movement = require('../models/Movement');
const ScheduledTransaction = require('../models/ScheduledTransaction');
const { body, query, validationResult } = require('express-validator');

// ==================== VALIDAÇÕES ====================

const validateMovement = [
  body('tipo').isIn(['compra', 'venda', 'transferencia', 'passagem', 'saida_manual', 'agendamento'])
    .withMessage('Tipo inválido'),
  body('programa').notEmpty().withMessage('Programa é obrigatório'),
  body('quantidade').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que zero'),
  body('valor').isFloat({ min: 0 }).withMessage('Valor deve ser maior ou igual a zero'),
  body('origem.tipo').notEmpty().withMessage('Tipo de origem é obrigatório'),
  body('usuario').optional().isMongoId().withMessage('ID de usuário inválido')
];

const validateScheduled = [
  body('titulo').notEmpty().withMessage('Título é obrigatório'),
  body('tipoMovimentacao').isIn(['compra', 'venda', 'transferencia', 'passagem', 'saida_manual'])
    .withMessage('Tipo de movimentação inválido'),
  body('recorrencia.tipo').isIn(['unica', 'diaria', 'semanal', 'mensal', 'anual'])
    .withMessage('Tipo de recorrência inválido'),
  body('recorrencia.dataInicio').isISO8601().withMessage('Data de início inválida')
];

// Middleware para validar erros
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// ==================== MOVIMENTAÇÕES ====================

/**
 * GET /api/movements
 * Listar movimentações com filtros
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Página inválida'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limite inválido'),
  query('tipo').optional().isString(),
  query('status').optional().isString(),
  query('programa').optional().isString(),
  query('dataInicio').optional().isISO8601(),
  query('dataFim').optional().isISO8601()
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      tipo,
      status,
      programa,
      dataInicio,
      dataFim,
      usuario
    } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (tipo) filtros.tipo = tipo;
    if (status) filtros.status = status;
    if (programa) filtros.programa = programa;
    if (usuario) filtros.usuario = usuario;

    if (dataInicio || dataFim) {
      filtros.dataMovimentacao = {};
      if (dataInicio) filtros.dataMovimentacao.$gte = new Date(dataInicio);
      if (dataFim) filtros.dataMovimentacao.$lte = new Date(dataFim);
    }

    // Executar query com paginação
    const skip = (page - 1) * limit;
    
    const [movements, total] = await Promise.all([
      Movement.find(filtros)
        .sort({ dataMovimentacao: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('usuario', 'nome email')
        .populate('programaId', 'nome logo')
        .lean(),
      Movement.countDocuments(filtros)
    ]);

    res.json({
      success: true,
      movements,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar movimentações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar movimentações',
      error: error.message
    });
  }
});

/**
 * GET /api/movements/:id
 * Buscar movimentação por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id)
      .populate('usuario', 'nome email')
      .populate('programaId', 'nome logo categoria')
      .populate('accountId', 'nome programa saldo');

    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Movimentação não encontrada'
      });
    }

    res.json({
      success: true,
      movement
    });

  } catch (error) {
    console.error('Erro ao buscar movimentação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar movimentação',
      error: error.message
    });
  }
});

/**
 * POST /api/movements
 * Criar nova movimentação
 */
router.post('/', validateMovement, handleValidationErrors, async (req, res) => {
  try {
    const movementData = {
      ...req.body,
      usuario: req.body.usuario || req.user?.id
    };

    const movement = new Movement(movementData);
    await movement.save();

    // Popular dados antes de retornar
    await movement.populate('usuario', 'nome email');
    await movement.populate('programaId', 'nome logo');

    res.status(201).json({
      success: true,
      message: 'Movimentação criada com sucesso',
      movement
    });

  } catch (error) {
    console.error('Erro ao criar movimentação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar movimentação',
      error: error.message
    });
  }
});

/**
 * PUT /api/movements/:id
 * Atualizar movimentação
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const movement = await Movement.findById(id);
    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Movimentação não encontrada'
      });
    }

    // Não permitir atualizar movimentações concluídas
    if (movement.status === 'concluida' && req.body.status !== 'cancelada') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível atualizar movimentação concluída'
      });
    }

    // Atualizar campos
    Object.assign(movement, req.body);
    await movement.save();

    await movement.populate('usuario', 'nome email');
    await movement.populate('programaId', 'nome logo');

    res.json({
      success: true,
      message: 'Movimentação atualizada com sucesso',
      movement
    });

  } catch (error) {
    console.error('Erro ao atualizar movimentação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar movimentação',
      error: error.message
    });
  }
});

/**
 * DELETE /api/movements/:id
 * Deletar movimentação
 */
router.delete('/:id', async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id);
    
    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Movimentação não encontrada'
      });
    }

    // Não permitir deletar movimentações concluídas
    if (movement.status === 'concluida') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível deletar movimentação concluída. Use cancelar.'
      });
    }

    await movement.deleteOne();

    res.json({
      success: true,
      message: 'Movimentação deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar movimentação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar movimentação',
      error: error.message
    });
  }
});

/**
 * POST /api/movements/:id/process
 * Processar movimentação pendente
 */
router.post('/:id/process', async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id);
    
    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Movimentação não encontrada'
      });
    }

    if (movement.status !== 'pendente') {
      return res.status(400).json({
        success: false,
        message: `Movimentação com status ${movement.status} não pode ser processada`
      });
    }

    const resultado = await movement.processar();
    await movement.populate('usuario', 'nome email');

    res.json(resultado);

  } catch (error) {
    console.error('Erro ao processar movimentação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar movimentação',
      error: error.message
    });
  }
});

/**
 * POST /api/movements/:id/cancel
 * Cancelar movimentação
 */
router.post('/:id/cancel', [
  body('motivo').optional().isString()
], async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id);
    
    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Movimentação não encontrada'
      });
    }

    const resultado = await movement.cancelar(req.body.motivo, req.user?.id);
    await movement.populate('usuario', 'nome email');

    res.json(resultado);

  } catch (error) {
    console.error('Erro ao cancelar movimentação:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao cancelar movimentação'
    });
  }
});

/**
 * GET /api/movements/stats
 * Estatísticas de movimentações
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const { dataInicio, dataFim, usuario } = req.query;

    const filtros = {};
    if (usuario) filtros.usuario = usuario;
    if (dataInicio || dataFim) {
      filtros.dataMovimentacao = {};
      if (dataInicio) filtros.dataMovimentacao.$gte = new Date(dataInicio);
      if (dataFim) filtros.dataMovimentacao.$lte = new Date(dataFim);
    }

    const stats = await Movement.estatisticas(filtros);

    // Estatísticas por status
    const porStatus = await Movement.aggregate([
      { $match: filtros },
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 }
        }
      }
    ]);

    // Estatísticas por programa
    const porPrograma = await Movement.aggregate([
      { $match: filtros },
      {
        $group: {
          _id: '$programa',
          total: { $sum: 1 },
          quantidadeTotal: { $sum: '$quantidade' },
          valorTotal: { $sum: '$valor' }
        }
      },
      { $sort: { quantidadeTotal: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      stats: {
        porTipo: stats,
        porStatus,
        porPrograma
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message
    });
  }
});

/**
 * GET /api/movements/pending
 * Listar movimentações pendentes
 */
router.get('/pending/list', async (req, res) => {
  try {
    const movements = await Movement.pendentes()
      .populate('usuario', 'nome email')
      .populate('programaId', 'nome logo');

    res.json({
      success: true,
      movements,
      total: movements.length
    });

  } catch (error) {
    console.error('Erro ao listar pendentes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar pendentes',
      error: error.message
    });
  }
});

// ==================== AGENDAMENTOS ====================

/**
 * GET /api/movements/scheduled
 * Listar agendamentos
 */
router.get('/scheduled/list', async (req, res) => {
  try {
    const { ativo, usuario } = req.query;

    const filtros = {};
    if (ativo !== undefined) filtros.ativo = ativo === 'true';
    if (usuario) filtros.usuario = usuario;

    const scheduled = await ScheduledTransaction.find(filtros)
      .sort({ proximaExecucao: 1 })
      .populate('usuario', 'nome email')
      .lean();

    res.json({
      success: true,
      scheduled,
      total: scheduled.length
    });

  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar agendamentos',
      error: error.message
    });
  }
});

/**
 * POST /api/movements/schedule
 * Criar agendamento
 */
router.post('/schedule', validateScheduled, handleValidationErrors, async (req, res) => {
  try {
    const scheduledData = {
      ...req.body,
      usuario: req.body.usuario || req.user?.id
    };

    const scheduled = new ScheduledTransaction(scheduledData);
    await scheduled.save();

    await scheduled.populate('usuario', 'nome email');

    res.status(201).json({
      success: true,
      message: 'Agendamento criado com sucesso',
      scheduled
    });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar agendamento',
      error: error.message
    });
  }
});

/**
 * GET /api/movements/schedule/:id
 * Buscar agendamento por ID
 */
router.get('/schedule/:id', async (req, res) => {
  try {
    const scheduled = await ScheduledTransaction.findById(req.params.id)
      .populate('usuario', 'nome email');

    if (!scheduled) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    res.json({
      success: true,
      scheduled
    });

  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar agendamento',
      error: error.message
    });
  }
});

/**
 * PUT /api/movements/schedule/:id
 * Atualizar agendamento
 */
router.put('/schedule/:id', async (req, res) => {
  try {
    const scheduled = await ScheduledTransaction.findById(req.params.id);
    
    if (!scheduled) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    Object.assign(scheduled, req.body);
    
    // Recalcular próxima execução se mudou a recorrência
    if (req.body.recorrencia) {
      scheduled.calcularProximaExecucao();
    }

    await scheduled.save();
    await scheduled.populate('usuario', 'nome email');

    res.json({
      success: true,
      message: 'Agendamento atualizado com sucesso',
      scheduled
    });

  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar agendamento',
      error: error.message
    });
  }
});

/**
 * DELETE /api/movements/schedule/:id
 * Deletar agendamento
 */
router.delete('/schedule/:id', async (req, res) => {
  try {
    const scheduled = await ScheduledTransaction.findByIdAndDelete(req.params.id);
    
    if (!scheduled) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Agendamento deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar agendamento',
      error: error.message
    });
  }
});

/**
 * POST /api/movements/schedule/:id/pause
 * Pausar agendamento
 */
router.post('/schedule/:id/pause', [
  body('motivo').optional().isString()
], async (req, res) => {
  try {
    const scheduled = await ScheduledTransaction.findById(req.params.id);
    
    if (!scheduled) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    await scheduled.pausar(req.body.motivo);

    res.json({
      success: true,
      message: 'Agendamento pausado com sucesso',
      scheduled
    });

  } catch (error) {
    console.error('Erro ao pausar agendamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao pausar agendamento',
      error: error.message
    });
  }
});

/**
 * POST /api/movements/schedule/:id/resume
 * Retomar agendamento
 */
router.post('/schedule/:id/resume', async (req, res) => {
  try {
    const scheduled = await ScheduledTransaction.findById(req.params.id);
    
    if (!scheduled) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    await scheduled.retomar();

    res.json({
      success: true,
      message: 'Agendamento retomado com sucesso',
      scheduled
    });

  } catch (error) {
    console.error('Erro ao retomar agendamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao retomar agendamento',
      error: error.message
    });
  }
});

/**
 * POST /api/movements/schedule/:id/execute
 * Executar agendamento manualmente
 */
router.post('/schedule/:id/execute', async (req, res) => {
  try {
    const scheduled = await ScheduledTransaction.findById(req.params.id);
    
    if (!scheduled) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    const resultado = await scheduled.executar();

    res.json({
      success: true,
      message: 'Agendamento executado com sucesso',
      ...resultado
    });

  } catch (error) {
    console.error('Erro ao executar agendamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar agendamento',
      error: error.message
    });
  }
});

/**
 * GET /api/movements/scheduled/ready
 * Listar agendamentos prontos para executar
 */
router.get('/scheduled/ready', async (req, res) => {
  try {
    const scheduled = await ScheduledTransaction.prontoParaExecutar()
      .populate('usuario', 'nome email');

    res.json({
      success: true,
      scheduled,
      total: scheduled.length
    });

  } catch (error) {
    console.error('Erro ao listar agendamentos prontos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar agendamentos prontos',
      error: error.message
    });
  }
});

module.exports = router;

