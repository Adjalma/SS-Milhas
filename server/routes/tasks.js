/**
 * Rotas de Tarefas
 * 
 * Sistema completo de gestão de tarefas e Kanban
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { body, query, validationResult } = require('express-validator');

// ==================== TAREFAS ====================

/**
 * GET /api/tasks
 * Listar tarefas
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      prioridade,
      responsavel,
      categoria,
      usuario
    } = req.query;

    const filtros = {};
    
    // Filtrar por usuário ou responsável
    if (usuario) {
      filtros.$or = [{ usuario }, { responsavel: usuario }];
    } else if (responsavel) {
      filtros.responsavel = responsavel;
    }

    if (status) filtros.status = status;
    if (prioridade) filtros.prioridade = prioridade;
    if (categoria) filtros.categoria = categoria;

    const skip = (page - 1) * limit;
    
    const [tasks, total] = await Promise.all([
      Task.find(filtros)
        .sort({ prioridade: -1, dataVencimento: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('responsavel', 'nome email avatar')
        .populate('usuario', 'nome email')
        .lean(),
      Task.countDocuments(filtros)
    ]);

    res.json({
      success: true,
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar tarefas',
      error: error.message
    });
  }
});

/**
 * GET /api/tasks/:id
 * Buscar tarefa por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('responsavel', 'nome email avatar')
      .populate('usuario', 'nome email')
      .populate('comentarios.usuario', 'nome email avatar')
      .populate('vinculoMovimento')
      .populate('vinculoConta', 'nome programa');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    res.json({ success: true, task });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar tarefa',
      error: error.message
    });
  }
});

/**
 * POST /api/tasks
 * Criar tarefa
 */
router.post('/', [
  body('titulo').notEmpty().withMessage('Título é obrigatório'),
  body('responsavel').isMongoId().withMessage('Responsável inválido'),
  body('prioridade').optional().isIn(['baixa', 'media', 'alta', 'urgente'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const task = new Task({
      ...req.body,
      usuario: req.body.usuario || req.user?.id
    });

    await task.save();
    await task.populate('responsavel', 'nome email avatar');

    res.status(201).json({
      success: true,
      message: 'Tarefa criada com sucesso',
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar tarefa',
      error: error.message
    });
  }
});

/**
 * PUT /api/tasks/:id
 * Atualizar tarefa
 */
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('responsavel', 'nome email avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Tarefa atualizada com sucesso',
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar tarefa',
      error: error.message
    });
  }
});

/**
 * DELETE /api/tasks/:id
 * Deletar tarefa
 */
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Tarefa deletada com sucesso'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar tarefa',
      error: error.message
    });
  }
});

// ==================== AÇÕES ====================

/**
 * POST /api/tasks/:id/start
 * Iniciar tarefa
 */
router.post('/:id/start', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    await task.iniciar();
    await task.populate('responsavel', 'nome email avatar');

    res.json({
      success: true,
      message: 'Tarefa iniciada com sucesso',
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao iniciar tarefa',
      error: error.message
    });
  }
});

/**
 * POST /api/tasks/:id/complete
 * Concluir tarefa
 */
router.post('/:id/complete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    await task.concluir();
    await task.populate('responsavel', 'nome email avatar');

    res.json({
      success: true,
      message: 'Tarefa concluída com sucesso',
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao concluir tarefa',
      error: error.message
    });
  }
});

/**
 * POST /api/tasks/:id/cancel
 * Cancelar tarefa
 */
router.post('/:id/cancel', [
  body('motivo').optional().isString()
], async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    await task.cancelar(req.body.motivo);
    await task.populate('responsavel', 'nome email avatar');

    res.json({
      success: true,
      message: 'Tarefa cancelada com sucesso',
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar tarefa',
      error: error.message
    });
  }
});

// ==================== COMENTÁRIOS ====================

/**
 * POST /api/tasks/:id/comments
 * Adicionar comentário
 */
router.post('/:id/comments', [
  body('texto').notEmpty().withMessage('Texto é obrigatório')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    await task.adicionarComentario(req.user?.id || req.body.usuario, req.body.texto);
    await task.populate('comentarios.usuario', 'nome email avatar');

    res.json({
      success: true,
      message: 'Comentário adicionado com sucesso',
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar comentário',
      error: error.message
    });
  }
});

// ==================== SUBTAREFAS ====================

/**
 * POST /api/tasks/:id/subtasks
 * Adicionar subtarefa
 */
router.post('/:id/subtasks', [
  body('descricao').notEmpty().withMessage('Descrição é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    await task.adicionarSubtarefa(req.body.descricao);

    res.json({
      success: true,
      message: 'Subtarefa adicionada com sucesso',
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar subtarefa',
      error: error.message
    });
  }
});

/**
 * PUT /api/tasks/:id/subtasks/:index/complete
 * Concluir subtarefa
 */
router.put('/:id/subtasks/:index/complete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    await task.concluirSubtarefa(parseInt(req.params.index));

    res.json({
      success: true,
      message: 'Subtarefa concluída com sucesso',
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao concluir subtarefa',
      error: error.message
    });
  }
});

// ==================== KANBAN ====================

/**
 * GET /api/tasks/kanban/view
 * Visualização Kanban
 */
router.get('/kanban/view', async (req, res) => {
  try {
    const { usuario } = req.query;
    
    const kanban = await Task.kanbanView(usuario || req.user?.id);

    res.json({
      success: true,
      kanban
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar Kanban',
      error: error.message
    });
  }
});

/**
 * PUT /api/tasks/:id/kanban
 * Mover tarefa no Kanban
 */
router.put('/:id/kanban', [
  body('coluna').isIn(['pendente', 'em_andamento', 'concluida']),
  body('posicao').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    task.kanban.coluna = req.body.coluna;
    task.kanban.posicao = req.body.posicao;

    // Atualizar status baseado na coluna
    if (req.body.coluna === 'em_andamento' && task.status === 'pendente') {
      task.status = 'em_andamento';
      task.dataInicio = new Date();
    } else if (req.body.coluna === 'concluida' && task.status !== 'concluida') {
      task.status = 'concluida';
      task.dataConclusao = new Date();
    } else if (req.body.coluna === 'pendente') {
      task.status = 'pendente';
    }

    await task.save();

    res.json({
      success: true,
      message: 'Tarefa movida com sucesso',
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao mover tarefa',
      error: error.message
    });
  }
});

// ==================== QUERIES ESPECIAIS ====================

/**
 * GET /api/tasks/late/list
 * Listar tarefas atrasadas
 */
router.get('/late/list', async (req, res) => {
  try {
    const { usuario } = req.query;
    
    const tasks = await Task.atrasadas(usuario || req.user?.id)
      .populate('responsavel', 'nome email avatar');

    res.json({
      success: true,
      tasks,
      total: tasks.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar tarefas atrasadas',
      error: error.message
    });
  }
});

/**
 * GET /api/tasks/upcoming
 * Listar tarefas vencendo em X dias
 */
router.get('/upcoming', async (req, res) => {
  try {
    const { dias = 7, usuario } = req.query;
    
    const tasks = await Task.vencendoEm(parseInt(dias), usuario || req.user?.id)
      .populate('responsavel', 'nome email avatar');

    res.json({
      success: true,
      tasks,
      total: tasks.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar tarefas',
      error: error.message
    });
  }
});

/**
 * GET /api/tasks/stats
 * Estatísticas de tarefas
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const { usuario } = req.query;
    const userId = usuario || req.user?.id;

    const [
      total,
      pendentes,
      emAndamento,
      concluidas,
      atrasadas,
      porPrioridade,
      porCategoria
    ] = await Promise.all([
      Task.countDocuments({ $or: [{ usuario: userId }, { responsavel: userId }] }),
      Task.countDocuments({ $or: [{ usuario: userId }, { responsavel: userId }], status: 'pendente' }),
      Task.countDocuments({ $or: [{ usuario: userId }, { responsavel: userId }], status: 'em_andamento' }),
      Task.countDocuments({ $or: [{ usuario: userId }, { responsavel: userId }], status: 'concluida' }),
      Task.countDocuments({
        $or: [{ usuario: userId }, { responsavel: userId }],
        status: { $nin: ['concluida', 'cancelada'] },
        dataVencimento: { $lt: new Date() }
      }),
      Task.aggregate([
        { $match: { $or: [{ usuario: mongoose.Types.ObjectId(userId) }, { responsavel: mongoose.Types.ObjectId(userId) }] } },
        { $group: { _id: '$prioridade', total: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: { $or: [{ usuario: mongoose.Types.ObjectId(userId) }, { responsavel: mongoose.Types.ObjectId(userId) }] } },
        { $group: { _id: '$categoria', total: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        total,
        pendentes,
        emAndamento,
        concluidas,
        atrasadas,
        canceladas: total - pendentes - emAndamento - concluidas,
        porPrioridade,
        porCategoria
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message
    });
  }
});

module.exports = router;

