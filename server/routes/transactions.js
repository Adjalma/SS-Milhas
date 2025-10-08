/**
 * Rotas de Transações - Sistema de Gestão de Milhas
 * 
 * Define todas as rotas relacionadas às transações financeiras
 * e de milhas, incluindo CRUD, análises e relatórios.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const { authMiddleware, requireOwnership } = require('../middleware/auth');
const { asyncHandler, createError, sanitizeInput } = require('../middleware/errorHandler');

const router = express.Router();

// ==================== CONFIGURAÇÃO DE UPLOAD ====================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/transactions/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'transaction-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens e PDFs são permitidos'));
    }
  }
});

// ==================== VALIDAÇÕES ====================

const createTransactionValidation = [
  body('conta')
    .isMongoId()
    .withMessage('ID da conta inválido'),
  
  body('tipo')
    .isIn([
      'compra', 'venda', 'transferencia-entrada', 'transferencia-saida',
      'bonus', 'expiracao', 'cancelamento', 'reembolso', 'taxa', 'outros'
    ])
    .withMessage('Tipo de transação inválido'),
  
  body('categoria')
    .isIn(['comercial', 'pessoal', 'investimento', 'bonificacao', 'correcao', 'administrativo'])
    .withMessage('Categoria inválida'),
  
  body('descricao')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Descrição deve ter entre 5 e 500 caracteres'),
  
  body('quantidade')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Quantidade deve ser um número positivo'),
  
  body('valorUnitario')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Valor unitário deve ser um número positivo'),
  
  body('dataTransacao')
    .optional()
    .isISO8601()
    .withMessage('Data da transação deve estar no formato ISO8601')
];

const updateTransactionValidation = [
  body('descricao')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Descrição deve ter entre 5 e 500 caracteres'),
  
  body('quantidade')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Quantidade deve ser um número positivo'),
  
  body('valorUnitario')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Valor unitário deve ser um número positivo')
];

// ==================== ROTAS ====================

/**
 * @route   GET /api/transactions
 * @desc    Listar transações do usuário
 * @access  Private
 */
router.get('/',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      conta,
      tipo,
      categoria,
      status,
      dataInicio,
      dataFim,
      valorMin,
      valorMax,
      search,
      sortBy = 'dataTransacao',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Construir filtros
    const filters = { usuario: req.user._id };
    
    if (conta) filters.conta = conta;
    if (tipo) filters.tipo = tipo;
    if (categoria) filters.categoria = categoria;
    if (status) filters.status = status;
    
    // Filtros de data
    if (dataInicio || dataFim) {
      filters.dataTransacao = {};
      if (dataInicio) filters.dataTransacao.$gte = new Date(dataInicio);
      if (dataFim) filters.dataTransacao.$lte = new Date(dataFim);
    }
    
    // Filtros de valor
    if (valorMin || valorMax) {
      filters.valorTotal = {};
      if (valorMin) filters.valorTotal.$gte = parseFloat(valorMin);
      if (valorMax) filters.valorTotal.$lte = parseFloat(valorMax);
    }
    
    // Busca por texto
    if (search) {
      filters.$or = [
        { descricao: { $regex: search, $options: 'i' } },
        { 'contraparte.nome': { $regex: search, $options: 'i' } },
        { 'contraparte.documento': { $regex: search, $options: 'i' } },
        { observacoes: { $regex: search, $options: 'i' } }
      ];
    }

    // Configurar ordenação
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Configurar paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Executar consulta
    const transactions = await Transaction.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('conta', 'nome programa numeroConta')
      .populate('usuario', 'nome email');

    const total = await Transaction.countDocuments(filters);

    // Calcular estatísticas das transações
    const stats = await Transaction.aggregate([
      { $match: { usuario: req.user._id } },
      {
        $group: {
          _id: null,
          totalTransacoes: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          quantidadeTotal: { $sum: '$quantidade' },
          lucroTotal: { $sum: '$lucro.valorLiquido' },
          custoTotal: { $sum: '$custos.custoTotal' },
          mediaValor: { $avg: '$valorTotal' },
          mediaQuantidade: { $avg: '$quantidade' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: total,
          limit: parseInt(limit)
        },
        stats: stats[0] || {
          totalTransacoes: 0,
          valorTotal: 0,
          quantidadeTotal: 0,
          lucroTotal: 0,
          custoTotal: 0,
          mediaValor: 0,
          mediaQuantidade: 0
        }
      }
    });
  })
);

/**
 * @route   GET /api/transactions/:id
 * @desc    Obter transação específica
 * @access  Private
 */
router.get('/:id',
  authMiddleware,
  requireOwnership('id', 'usuario'),
  asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id)
      .populate('conta', 'nome programa numeroConta')
      .populate('usuario', 'nome email');

    if (!transaction) {
      throw createError('Transação não encontrada', 404, 'TRANSACTION_NOT_FOUND');
    }

    // Calcular score de qualidade
    transaction.calcularScoreQualidade();
    transaction.gerarRecomendacoes();

    res.json({
      success: true,
      data: { transaction }
    });
  })
);

/**
 * @route   POST /api/transactions
 * @desc    Criar nova transação
 * @access  Private
 */
router.post('/',
  authMiddleware,
  sanitizeInput,
  createTransactionValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400, 'VALIDATION_ERROR');
    }

    const {
      conta,
      tipo,
      categoria,
      descricao,
      quantidade,
      valorUnitario,
      dataTransacao,
      contraparte,
      dadosEspecificos,
      observacoes,
      tags,
      custos,
      dadosIR
    } = req.body;

    // Verificar se a conta pertence ao usuário
    const account = await Account.findOne({ _id: conta, usuario: req.user._id });
    if (!account) {
      throw createError('Conta não encontrada ou não pertence ao usuário', 404, 'ACCOUNT_NOT_FOUND');
    }

    // Criar transação
    const transaction = new Transaction({
      usuario: req.user._id,
      conta,
      tipo,
      categoria,
      descricao,
      quantidade,
      valorUnitario,
      dataTransacao: dataTransacao ? new Date(dataTransacao) : new Date(),
      contraparte: contraparte || {},
      dadosEspecificos: dadosEspecificos || {},
      observacoes,
      tags: tags || [],
      custos: custos || {},
      dadosIR: dadosIR || {},
      criadoPor: req.user._id
    });

    // Validar transação
    const validation = transaction.validar();
    if (!validation.valida) {
      throw createError(`Transação inválida: ${validation.erros.join(', ')}`, 400, 'INVALID_TRANSACTION');
    }

    await transaction.save();

    // Atualizar saldo da conta se necessário
    if (tipo === 'compra' || tipo === 'bonus' || tipo === 'transferencia-entrada') {
      const novoSaldo = account.saldoAtual + quantidade;
      await account.atualizarSaldo(novoSaldo, `Transação: ${descricao}`);
    } else if (tipo === 'venda' || tipo === 'transferencia-saida' || tipo === 'expiracao') {
      const novoSaldo = Math.max(0, account.saldoAtual - quantidade);
      await account.atualizarSaldo(novoSaldo, `Transação: ${descricao}`);
    }

    // Adicionar conquista por primeira transação
    const userTransactionsCount = await Transaction.countDocuments({ usuario: req.user._id });
    if (userTransactionsCount === 1) {
      req.user.adicionarConquista(
        'primeira-transacao',
        'Primeira Transação',
        'Você registrou sua primeira transação!',
        25
      );
    }

    // Popular dados da conta para resposta
    await transaction.populate('conta', 'nome programa numeroConta');

    res.status(201).json({
      success: true,
      message: 'Transação criada com sucesso',
      data: { transaction }
    });
  })
);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Atualizar transação
 * @access  Private
 */
router.put('/:id',
  authMiddleware,
  requireOwnership('id', 'usuario'),
  sanitizeInput,
  updateTransactionValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400, 'VALIDATION_ERROR');
    }

    const transaction = req.resource;
    const updates = req.body;

    // Não permitir alterar alguns campos
    const restrictedFields = ['usuario', '_id', 'createdAt', 'updatedAt', 'criadoPor'];
    restrictedFields.forEach(field => delete updates[field]);

    // Se estiver alterando quantidade ou tipo, recalcular saldo da conta
    const oldQuantidade = transaction.quantidade;
    const oldTipo = transaction.tipo;
    
    if (updates.quantidade !== undefined || updates.tipo !== undefined) {
      const account = await Account.findById(transaction.conta);
      
      // Reverter saldo antigo
      if (oldTipo === 'compra' || oldTipo === 'bonus' || oldTipo === 'transferencia-entrada') {
        const saldoRevertido = Math.max(0, account.saldoAtual - oldQuantidade);
        await account.atualizarSaldo(saldoRevertido, `Correção transação: ${transaction.descricao}`);
      } else if (oldTipo === 'venda' || oldTipo === 'transferencia-saida' || oldTipo === 'expiracao') {
        const saldoRevertido = account.saldoAtual + oldQuantidade;
        await account.atualizarSaldo(saldoRevertido, `Correção transação: ${transaction.descricao}`);
      }
    }

    // Atualizar transação
    Object.assign(transaction, updates);
    transaction.modificadoPor = req.user._id;
    transaction.versao += 1;

    // Validar transação atualizada
    const validation = transaction.validar();
    if (!validation.valida) {
      throw createError(`Transação inválida: ${validation.erros.join(', ')}`, 400, 'INVALID_TRANSACTION');
    }

    await transaction.save();

    // Aplicar novo saldo se necessário
    if (updates.quantidade !== undefined || updates.tipo !== undefined) {
      const account = await Account.findById(transaction.conta);
      const newTipo = updates.tipo || oldTipo;
      const newQuantidade = updates.quantidade || oldQuantidade;
      
      if (newTipo === 'compra' || newTipo === 'bonus' || newTipo === 'transferencia-entrada') {
        const novoSaldo = account.saldoAtual + newQuantidade;
        await account.atualizarSaldo(novoSaldo, `Transação atualizada: ${transaction.descricao}`);
      } else if (newTipo === 'venda' || newTipo === 'transferencia-saida' || newTipo === 'expiracao') {
        const novoSaldo = Math.max(0, account.saldoAtual - newQuantidade);
        await account.atualizarSaldo(novoSaldo, `Transação atualizada: ${transaction.descricao}`);
      }
    }

    res.json({
      success: true,
      message: 'Transação atualizada com sucesso',
      data: { transaction }
    });
  })
);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Deletar transação
 * @access  Private
 */
router.delete('/:id',
  authMiddleware,
  requireOwnership('id', 'usuario'),
  asyncHandler(async (req, res) => {
    const transaction = req.resource;

    // Reverter saldo da conta
    const account = await Account.findById(transaction.conta);
    if (account) {
      if (transaction.tipo === 'compra' || transaction.tipo === 'bonus' || transaction.tipo === 'transferencia-entrada') {
        const novoSaldo = Math.max(0, account.saldoAtual - transaction.quantidade);
        await account.atualizarSaldo(novoSaldo, `Transação deletada: ${transaction.descricao}`);
      } else if (transaction.tipo === 'venda' || transaction.tipo === 'transferencia-saida' || transaction.tipo === 'expiracao') {
        const novoSaldo = account.saldoAtual + transaction.quantidade;
        await account.atualizarSaldo(novoSaldo, `Transação deletada: ${transaction.descricao}`);
      }
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Transação deletada com sucesso'
    });
  })
);

/**
 * @route   POST /api/transactions/:id/upload
 * @desc    Upload de comprovante para transação
 * @access  Private
 */
router.post('/:id/upload',
  authMiddleware,
  requireOwnership('id', 'usuario'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw createError('Arquivo é obrigatório', 400, 'FILE_REQUIRED');
    }

    const transaction = req.resource;
    const { tipo, descricao } = req.body;

    const comprovante = {
      tipo: tipo || 'outros',
      nome: req.file.originalname,
      url: `/uploads/transactions/${req.file.filename}`,
      tamanho: req.file.size,
      dataUpload: new Date()
    };

    if (descricao) {
      comprovante.descricao = descricao;
    }

    transaction.comprovantes.push(comprovante);
    await transaction.save();

    res.json({
      success: true,
      message: 'Comprovante enviado com sucesso',
      data: {
        comprovante,
        totalComprovantes: transaction.comprovantes.length
      }
    });
  })
);

/**
 * @route   GET /api/transactions/stats/overview
 * @desc    Estatísticas gerais das transações
 * @access  Private
 */
router.get('/stats/overview',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { periodo = 'mes' } = req.query;
    
    let dataInicio;
    const agora = new Date();
    
    switch (periodo) {
      case 'semana':
        dataInicio = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'mes':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
        break;
      case 'trimestre':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth() - 2, 1);
        break;
      case 'ano':
        dataInicio = new Date(agora.getFullYear(), 0, 1);
        break;
      default:
        dataInicio = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Estatísticas gerais
    const stats = await Transaction.obterEstatisticasPeriodo(req.user._id, dataInicio, agora);

    // Transações por tipo
    const porTipo = await Transaction.aggregate([
      {
        $match: {
          usuario: req.user._id,
          dataTransacao: { $gte: dataInicio, $lte: agora }
        }
      },
      {
        $group: {
          _id: '$tipo',
          count: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          quantidadeTotal: { $sum: '$quantidade' },
          lucroTotal: { $sum: '$lucro.valorLiquido' }
        }
      },
      { $sort: { valorTotal: -1 } }
    ]);

    // Transações por conta
    const porConta = await Transaction.aggregate([
      {
        $match: {
          usuario: req.user._id,
          dataTransacao: { $gte: dataInicio, $lte: agora }
        }
      },
      {
        $group: {
          _id: '$conta',
          count: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          quantidadeTotal: { $sum: '$quantidade' }
        }
      },
      {
        $lookup: {
          from: 'accounts',
          localField: '_id',
          foreignField: '_id',
          as: 'account'
        }
      },
      { $unwind: '$account' },
      {
        $project: {
          nomeConta: '$account.nome',
          programa: '$account.programa',
          count: 1,
          valorTotal: 1,
          quantidadeTotal: 1
        }
      },
      { $sort: { valorTotal: -1 } }
    ]);

    // Tendência mensal
    const tendencia = await Transaction.analisarTendencias(req.user._id, 12);

    res.json({
      success: true,
      data: {
        periodo: {
          inicio: dataInicio,
          fim: agora,
          tipo: periodo
        },
        geral: stats,
        porTipo,
        porConta,
        tendencia
      }
    });
  })
);

/**
 * @route   GET /api/transactions/analytics/performance
 * @desc    Análise de performance das transações
 * @access  Private
 */
router.get('/analytics/performance',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { meses = 6 } = req.query;
    const dataInicio = new Date();
    dataInicio.setMonth(dataInicio.getMonth() - parseInt(meses));

    // Análise de lucratividade
    const lucratividade = await Transaction.aggregate([
      {
        $match: {
          usuario: req.user._id,
          dataTransacao: { $gte: dataInicio },
          tipo: 'venda'
        }
      },
      {
        $group: {
          _id: null,
          totalVendas: { $sum: 1 },
          valorTotalVendas: { $sum: '$valorTotal' },
          lucroTotal: { $sum: '$lucro.valorLiquido' },
          mediaMargem: { $avg: '$lucro.margemPercentual' },
          melhorMargem: { $max: '$lucro.margemPercentual' },
          piorMargem: { $min: '$lucro.margemPercentual' }
        }
      }
    ]);

    // Top contrapartes
    const topContrapartes = await Transaction.aggregate([
      {
        $match: {
          usuario: req.user._id,
          dataTransacao: { $gte: dataInicio },
          'contraparte.nome': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$contraparte.nome',
          totalTransacoes: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          mediaValor: { $avg: '$valorTotal' }
        }
      },
      { $sort: { valorTotal: -1 } },
      { $limit: 10 }
    ]);

    // Análise sazonal
    const sazonal = await Transaction.aggregate([
      {
        $match: {
          usuario: req.user._id,
          dataTransacao: { $gte: dataInicio }
        }
      },
      {
        $group: {
          _id: {
            mes: { $month: '$dataTransacao' },
            ano: { $year: '$dataTransacao' }
          },
          totalTransacoes: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          quantidadeTotal: { $sum: '$quantidade' }
        }
      },
      { $sort: { '_id.ano': 1, '_id.mes': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        periodo: {
          inicio: dataInicio,
          meses: parseInt(meses)
        },
        lucratividade: lucratividade[0] || {
          totalVendas: 0,
          valorTotalVendas: 0,
          lucroTotal: 0,
          mediaMargem: 0,
          melhorMargem: 0,
          piorMargem: 0
        },
        topContrapartes,
        sazonal
      }
    });
  })
);

/**
 * @route   POST /api/transactions/import
 * @desc    Importar transações em lote
 * @access  Private
 */
router.post('/import',
  authMiddleware,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw createError('Arquivo é obrigatório', 400, 'FILE_REQUIRED');
    }

    // Aqui você implementaria a lógica de importação
    // Por enquanto, apenas retornamos uma resposta de exemplo
    
    res.json({
      success: true,
      message: 'Importação iniciada. Você será notificado quando concluída.',
      data: {
        arquivo: req.file.originalname,
        tamanho: req.file.size,
        status: 'processando'
      }
    });
  })
);

module.exports = router;
