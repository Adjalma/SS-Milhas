/**
 * Rotas de Notificações - Sistema de Gestão de Milhas
 * 
 * Define todas as rotas relacionadas ao sistema de notificações,
 * alertas, configurações e histórico.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const express = require('express');
const { body, validationResult } = require('express-validator');

const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { asyncHandler, createError, sanitizeInput } = require('../middleware/errorHandler');
const emailService = require('../services/emailService');

const router = express.Router();

// ==================== VALIDAÇÕES ====================

const notificationSettingsValidation = [
  body('email')
    .optional()
    .isBoolean()
    .withMessage('Email deve ser um valor booleano'),
  
  body('push')
    .optional()
    .isBoolean()
    .withMessage('Push deve ser um valor booleano'),
  
  body('sms')
    .optional()
    .isBoolean()
    .withMessage('SMS deve ser um valor booleano'),
  
  body('promocoes')
    .optional()
    .isBoolean()
    .withMessage('Promoções deve ser um valor booleano'),
  
  body('alertas')
    .optional()
    .isBoolean()
    .withMessage('Alertas deve ser um valor booleano')
];

const createNotificationValidation = [
  body('tipo')
    .isIn(['info', 'warning', 'error', 'success', 'promocao'])
    .withMessage('Tipo de notificação inválido'),
  
  body('titulo')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Título deve ter entre 3 e 100 caracteres'),
  
  body('mensagem')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Mensagem deve ter entre 10 e 500 caracteres'),
  
  body('prioridade')
    .optional()
    .isIn(['baixa', 'media', 'alta', 'critica'])
    .withMessage('Prioridade inválida')
];

// ==================== ROTAS ====================

/**
 * @route   GET /api/notifications
 * @desc    Listar notificações do usuário
 * @access  Private
 */
router.get('/',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { 
      tipo, 
      lida, 
      prioridade,
      page = 1, 
      limit = 20,
      sortBy = 'data',
      sortOrder = 'desc'
    } = req.query;

    // Buscar alertas das contas
    const alertasContas = await Account.aggregate([
      { $match: { usuario: req.user._id } },
      { $unwind: '$alertas' },
      {
        $project: {
          tipo: '$alertas.tipo',
          titulo: '$alertas.titulo',
          mensagem: '$alertas.mensagem',
          data: '$alertas.data',
          prioridade: '$alertas.prioridade',
          lida: '$alertas.lido',
          conta: '$nome',
          programa: '$programa',
          contaId: '$_id'
        }
      }
    ]);

    // Aplicar filtros
    let notificacoes = alertasContas;

    if (tipo) {
      notificacoes = notificacoes.filter(n => n.tipo === tipo);
    }

    if (lida !== undefined) {
      const lidaBool = lida === 'true';
      notificacoes = notificacoes.filter(n => n.lida === lidaBool);
    }

    if (prioridade) {
      notificacoes = notificacoes.filter(n => n.prioridade === prioridade);
    }

    // Ordenar
    notificacoes.sort((a, b) => {
      const aDate = new Date(a.data);
      const bDate = new Date(b.data);
      return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    });

    // Paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedNotifications = notificacoes.slice(skip, skip + parseInt(limit));

    // Estatísticas
    const estatisticas = {
      total: notificacoes.length,
      naoLidas: notificacoes.filter(n => !n.lida).length,
      criticas: notificacoes.filter(n => n.prioridade === 'critica' && !n.lida).length,
      porTipo: {}
    };

    notificacoes.forEach(notif => {
      estatisticas.porTipo[notif.tipo] = (estatisticas.porTipo[notif.tipo] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        notificacoes: paginatedNotifications,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(notificacoes.length / parseInt(limit)),
          count: notificacoes.length,
          limit: parseInt(limit)
        },
        estatisticas
      }
    });
  })
);

/**
 * @route   GET /api/notifications/unread
 * @desc    Contar notificações não lidas
 * @access  Private
 */
router.get('/unread',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const alertasNaoLidos = await Account.aggregate([
      { $match: { usuario: req.user._id } },
      { $unwind: '$alertas' },
      { $match: { 'alertas.lido': false } },
      {
        $group: {
          _id: '$alertas.prioridade',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = alertasNaoLidos.reduce((sum, item) => sum + item.count, 0);
    const criticas = alertasNaoLidos.find(item => item._id === 'critica')?.count || 0;

    res.json({
      success: true,
      data: {
        total,
        criticas,
        porPrioridade: alertasNaoLidos.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  })
);

/**
 * @route   PUT /api/notifications/:notificationId/read
 * @desc    Marcar notificação como lida
 * @access  Private
 */
router.put('/:notificationId/read',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const { contaId } = req.body;

    if (!contaId) {
      throw createError('ID da conta é obrigatório', 400, 'CONTA_ID_REQUIRED');
    }

    // Verificar se a conta pertence ao usuário
    const conta = await Account.findOne({ _id: contaId, usuario: req.user._id });
    if (!conta) {
      throw createError('Conta não encontrada', 404, 'ACCOUNT_NOT_FOUND');
    }

    // Encontrar e marcar alerta como lido
    const alertaIndex = conta.alertas.findIndex(alerta => 
      alerta._id.toString() === notificationId
    );

    if (alertaIndex === -1) {
      throw createError('Notificação não encontrada', 404, 'NOTIFICATION_NOT_FOUND');
    }

    conta.alertas[alertaIndex].lido = true;
    await conta.save();

    res.json({
      success: true,
      message: 'Notificação marcada como lida'
    });
  })
);

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Marcar todas as notificações como lidas
 * @access  Private
 */
router.put('/read-all',
  authMiddleware,
  asyncHandler(async (req, res) => {
    await Account.updateMany(
      { usuario: req.user._id },
      { $set: { 'alertas.$[].lido': true } }
    );

    res.json({
      success: true,
      message: 'Todas as notificações foram marcadas como lidas'
    });
  })
);

/**
 * @route   GET /api/notifications/settings
 * @desc    Obter configurações de notificação
 * @access  Private
 */
router.get('/settings',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const user = req.user;

    res.json({
      success: true,
      data: {
        notificacoes: user.notificacoes,
        configuracoes: user.configuracoes
      }
    });
  })
);

/**
 * @route   PUT /api/notifications/settings
 * @desc    Atualizar configurações de notificação
 * @access  Private
 */
router.put('/settings',
  authMiddleware,
  sanitizeInput,
  notificationSettingsValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400, 'VALIDATION_ERROR');
    }

    const user = req.user;
    const updates = req.body;

    // Atualizar configurações de notificação
    user.notificacoes = { ...user.notificacoes, ...updates };
    await user.save();

    res.json({
      success: true,
      message: 'Configurações de notificação atualizadas com sucesso',
      data: {
        notificacoes: user.notificacoes
      }
    });
  })
);

/**
 * @route   POST /api/notifications/test
 * @desc    Enviar notificação de teste
 * @access  Private
 */
router.post('/test',
  authMiddleware,
  sanitizeInput,
  createNotificationValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400, 'VALIDATION_ERROR');
    }

    const { tipo, titulo, mensagem, prioridade = 'media', canais = ['email'] } = req.body;

    // Enviar por email se habilitado
    if (canais.includes('email') && user.notificacoes.email) {
      try {
        await emailService.sendNotificationEmail(
          req.user.email,
          titulo,
          mensagem,
          tipo
        );
      } catch (error) {
        console.error('Erro ao enviar email de teste:', error);
      }
    }

    // Adicionar alerta à primeira conta (para teste)
    const primeiraConta = await Account.findOne({ usuario: req.user._id });
    if (primeiraConta) {
      await primeiraConta.adicionarAlerta(tipo, titulo, mensagem, prioridade);
    }

    res.json({
      success: true,
      message: 'Notificação de teste enviada com sucesso',
      data: {
        canais,
        enviado: true
      }
    });
  })
);

/**
 * @route   GET /api/notifications/alerts/system
 * @desc    Alertas do sistema
 * @access  Private
 */
router.get('/alerts/system',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const alertas = [];

    // ==================== PONTOS EXPIRANDO ====================
    const pontosExpirando = await Account.find({
      usuario: req.user._id,
      'pontosExpirando.proximaExpiracao': {
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    pontosExpirando.forEach(conta => {
      const diasParaExpiracao = Math.ceil(
        (conta.pontosExpirando.proximaExpiracao - new Date()) / (1000 * 60 * 60 * 24)
      );

      alertas.push({
        tipo: 'warning',
        titulo: 'Pontos Expirando',
        mensagem: `${conta.nome}: ${conta.pontosExpirando.quantidadeExpiracao.toLocaleString('pt-BR')} pontos expiram em ${diasParaExpiracao} dias`,
        prioridade: diasParaExpiracao <= 7 ? 'alta' : 'media',
        data: new Date(),
        conta: conta.nome,
        programa: conta.programa,
        automatico: true
      });
    });

    // ==================== SALDOS BAIXOS ====================
    const saldosBaixos = await Account.find({
      usuario: req.user._id,
      status: 'ativa',
      saldoAtual: { $lt: 1000 }
    });

    saldosBaixos.forEach(conta => {
      alertas.push({
        tipo: 'warning',
        titulo: 'Saldo Baixo',
        mensagem: `${conta.nome}: Saldo atual de ${conta.saldoAtual.toLocaleString('pt-BR')} pontos`,
        prioridade: conta.saldoAtual < 100 ? 'alta' : 'media',
        data: new Date(),
        conta: conta.nome,
        programa: conta.programa,
        automatico: true
      });
    });

    // ==================== CPFs PRÓXIMOS DO LIMITE ====================
    const cpfsProximoLimite = await Account.find({
      usuario: req.user._id,
      'controleCPFs.cpfsUtilizados': {
        $elemMatch: {
          quantidadeEmissoes: { $gte: { $subtract: ['$controleCPFs.limiteEmissoes', 2] } }
        }
      }
    });

    cpfsProximoLimite.forEach(conta => {
      const cpfProximo = conta.controleCPFs.cpfsUtilizados.find(cpf => 
        cpf.quantidadeEmissoes >= conta.controleCPFs.limiteEmissoes - 2
      );

      alertas.push({
        tipo: 'warning',
        titulo: 'CPF Próximo do Limite',
        mensagem: `${conta.nome}: CPF ${cpfProximo.cpf} com ${cpfProximo.quantidadeEmissoes}/${conta.controleCPFs.limiteEmissoes} emissões`,
        prioridade: 'alta',
        data: new Date(),
        conta: conta.nome,
        programa: conta.programa,
        automatico: true
      });
    });

    // ==================== TRANSAÇÕES PENDENTES ====================
    const transacoesPendentes = await Transaction.countDocuments({
      usuario: req.user._id,
      status: 'pendente'
    });

    if (transacoesPendentes > 0) {
      alertas.push({
        tipo: 'info',
        titulo: 'Transações Pendentes',
        mensagem: `Você tem ${transacoesPendentes} transação(ões) pendente(s)`,
        prioridade: 'media',
        data: new Date(),
        automatico: true
      });
    }

    // Ordenar por prioridade e data
    alertas.sort((a, b) => {
      const prioridades = { critica: 4, alta: 3, media: 2, baixa: 1 };
      if (prioridades[a.prioridade] !== prioridades[b.prioridade]) {
        return prioridades[b.prioridade] - prioridades[a.prioridade];
      }
      return new Date(b.data) - new Date(a.data);
    });

    res.json({
      success: true,
      data: {
        alertas,
        total: alertas.length,
        criticos: alertas.filter(a => a.prioridade === 'critica').length,
        altos: alertas.filter(a => a.prioridade === 'alta').length
      }
    });
  })
);

/**
 * @route   POST /api/notifications/subscribe
 * @desc    Inscrever-se em notificações push
 * @access  Private
 */
router.post('/subscribe',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys) {
      throw createError('Endpoint e keys são obrigatórios', 400, 'MISSING_PUSH_DATA');
    }

    const user = req.user;
    
    // Aqui você salvaria as informações de push notification
    // Por exemplo, em uma coleção separada ou no modelo User
    if (!user.pushSubscriptions) {
      user.pushSubscriptions = [];
    }

    // Verificar se já existe
    const existingSubscription = user.pushSubscriptions.find(sub => 
      sub.endpoint === endpoint
    );

    if (!existingSubscription) {
      user.pushSubscriptions.push({
        endpoint,
        keys,
        createdAt: new Date()
      });
      
      await user.save();
    }

    res.json({
      success: true,
      message: 'Inscrição em notificações push realizada com sucesso'
    });
  })
);

/**
 * @route   DELETE /api/notifications/unsubscribe
 * @desc    Cancelar inscrição em notificações push
 * @access  Private
 */
router.delete('/unsubscribe',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { endpoint } = req.body;

    if (!endpoint) {
      throw createError('Endpoint é obrigatório', 400, 'ENDPOINT_REQUIRED');
    }

    const user = req.user;
    
    if (user.pushSubscriptions) {
      user.pushSubscriptions = user.pushSubscriptions.filter(sub => 
        sub.endpoint !== endpoint
      );
      await user.save();
    }

    res.json({
      success: true,
      message: 'Inscrição em notificações push cancelada com sucesso'
    });
  })
);

module.exports = router;
