/**
 * Rotas de Contas - Sistema de Gestão de Milhas
 * 
 * Define todas as rotas relacionadas à gestão de contas de programas
 * de fidelidade, incluindo CRUD, controle de CPFs e sincronização.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

const Account = require('../models/Account');
const { authMiddleware, requireOwnership } = require('../middleware/auth');
const { asyncHandler, createError, sanitizeInput } = require('../middleware/errorHandler');

const router = express.Router();

// ==================== CONFIGURAÇÃO DE UPLOAD ====================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/accounts/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'account-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: function (req, file, cb) {
    // Permitir apenas imagens e PDFs
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

const createAccountValidation = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('programa')
    .isIn([
      'latam-pass', 'smiles', 'tudoazul', 'american-express', 'mastercard',
      'visa', 'banco-do-brasil', 'itau', 'bradesco', 'santander', 'caixa',
      'hsbc', 'outros'
    ])
    .withMessage('Programa inválido'),
  
  body('numeroConta')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Número da conta é obrigatório'),
  
  body('documento')
    .trim()
    .isLength({ min: 11, max: 18 })
    .withMessage('Documento deve ter entre 11 e 18 caracteres'),
  
  body('nomeCompleto')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome completo deve ter entre 2 e 200 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  
  body('telefone')
    .optional()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (xx) xxxxx-xxxx'),
  
  body('saldoAtual')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Saldo deve ser um número positivo')
];

const updateAccountValidation = [
  body('nome')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  
  body('telefone')
    .optional()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (xx) xxxxx-xxxx'),
  
  body('saldoAtual')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Saldo deve ser um número positivo')
];

const addCPFValidation = [
  body('cpf')
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    .withMessage('CPF deve estar no formato xxx.xxx.xxx-xx'),
  
  body('nome')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome deve ter entre 2 e 200 caracteres')
];

// ==================== ROTAS ====================

/**
 * @route   GET /api/accounts
 * @desc    Listar todas as contas do usuário
 * @access  Private
 */
router.get('/',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { 
      programa, 
      status, 
      categoria, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Construir filtros
    const filters = { usuario: req.user._id };
    
    if (programa) filters.programa = programa;
    if (status) filters.status = status;
    if (categoria) filters.categoria = categoria;
    if (search) {
      filters.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { numeroConta: { $regex: search, $options: 'i' } },
        { nomeCompleto: { $regex: search, $options: 'i' } }
      ];
    }

    // Configurar ordenação
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Configurar paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Executar consulta
    const accounts = await Account.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('usuario', 'nome email');

    const total = await Account.countDocuments(filters);

    // Calcular estatísticas das contas
    const stats = await Account.aggregate([
      { $match: { usuario: req.user._id } },
      {
        $group: {
          _id: null,
          totalContas: { $sum: 1 },
          contasAtivas: {
            $sum: { $cond: [{ $eq: ['$status', 'ativa'] }, 1, 0] }
          },
          saldoTotal: { $sum: '$saldoAtual' },
          mediaSaldo: { $avg: '$saldoAtual' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        accounts,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: total,
          limit: parseInt(limit)
        },
        stats: stats[0] || {
          totalContas: 0,
          contasAtivas: 0,
          saldoTotal: 0,
          mediaSaldo: 0
        }
      }
    });
  })
);

/**
 * @route   GET /api/accounts/:id
 * @desc    Obter conta específica
 * @access  Private
 */
router.get('/:id',
  authMiddleware,
  requireOwnership('id'),
  asyncHandler(async (req, res) => {
    const account = await Account.findById(req.params.id)
      .populate('usuario', 'nome email');

    if (!account) {
      throw createError('Conta não encontrada', 404, 'ACCOUNT_NOT_FOUND');
    }

    // Calcular estatísticas da conta
    const statistics = account.obterEstatisticas();

    res.json({
      success: true,
      data: {
        account,
        statistics
      }
    });
  })
);

/**
 * @route   POST /api/accounts
 * @desc    Criar nova conta
 * @access  Private
 */
router.post('/',
  authMiddleware,
  sanitizeInput,
  createAccountValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400, 'VALIDATION_ERROR');
    }

    const {
      nome,
      programa,
      tipoConta,
      numeroConta,
      documento,
      nomeCompleto,
      email,
      telefone,
      dataNascimento,
      saldoAtual,
      detalhesPrograma,
      configuracoes
    } = req.body;

    // Verificar se já existe conta com mesmo número
    const existingAccount = await Account.findOne({
      usuario: req.user._id,
      numeroConta,
      programa
    });

    if (existingAccount) {
      throw createError('Já existe uma conta com este número para este programa', 400, 'ACCOUNT_EXISTS');
    }

    // Criar conta
    const account = new Account({
      usuario: req.user._id,
      nome,
      programa,
      tipoConta: tipoConta || 'pessoa-fisica',
      numeroConta,
      documento,
      nomeCompleto,
      email,
      telefone,
      dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
      saldoAtual: saldoAtual || 0,
      detalhesPrograma: detalhesPrograma || {},
      criadoPor: req.user._id,
      ...configuracoes
    });

    await account.save();

    // Adicionar conquista por criar primeira conta
    const userAccountsCount = await Account.countDocuments({ usuario: req.user._id });
    if (userAccountsCount === 1) {
      req.user.adicionarConquista(
        'primeira-conta',
        'Primeira Conta',
        'Você criou sua primeira conta no sistema!',
        50
      );
    }

    res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso',
      data: { account }
    });
  })
);

/**
 * @route   PUT /api/accounts/:id
 * @desc    Atualizar conta
 * @access  Private
 */
router.put('/:id',
  authMiddleware,
  requireOwnership('id'),
  sanitizeInput,
  updateAccountValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400, 'VALIDATION_ERROR');
    }

    const account = req.resource;
    const updates = req.body;

    // Remover campos que não podem ser atualizados
    delete updates.usuario;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    // Atualizar conta
    Object.assign(account, updates);
    account.modificadoPor = req.user._id;
    account.versao += 1;

    await account.save();

    res.json({
      success: true,
      message: 'Conta atualizada com sucesso',
      data: { account }
    });
  })
);

/**
 * @route   DELETE /api/accounts/:id
 * @desc    Deletar conta
 * @access  Private
 */
router.delete('/:id',
  authMiddleware,
  requireOwnership('id'),
  asyncHandler(async (req, res) => {
    const account = req.resource;

    // Verificar se há transações associadas
    const Transaction = require('../models/Transaction');
    const transactionCount = await Transaction.countDocuments({ conta: account._id });
    
    if (transactionCount > 0) {
      throw createError(
        'Não é possível deletar conta com transações associadas',
        400,
        'ACCOUNT_HAS_TRANSACTIONS'
      );
    }

    await Account.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Conta deletada com sucesso'
    });
  })
);

/**
 * @route   POST /api/accounts/:id/sync
 * @desc    Sincronizar saldo da conta
 * @access  Private
 */
router.post('/:id/sync',
  authMiddleware,
  requireOwnership('id'),
  asyncHandler(async (req, res) => {
    const account = req.resource;
    const { novoSaldo, motivo } = req.body;

    if (novoSaldo === undefined || novoSaldo === null) {
      throw createError('Novo saldo é obrigatório', 400, 'SALDO_REQUIRED');
    }

    if (novoSaldo < 0) {
      throw createError('Saldo não pode ser negativo', 400, 'INVALID_SALDO');
    }

    // Atualizar saldo
    await account.atualizarSaldo(novoSaldo, motivo || 'Sincronização manual');

    // Atualizar timestamp de última sincronização
    account.credenciais.ultimaSincronizacao = new Date();
    await account.save();

    res.json({
      success: true,
      message: 'Saldo sincronizado com sucesso',
      data: {
        saldoAnterior: account.saldoAnterior,
        saldoAtual: account.saldoAtual,
        diferenca: account.saldoAtual - account.saldoAnterior
      }
    });
  })
);

/**
 * @route   POST /api/accounts/:id/cpfs
 * @desc    Adicionar CPF ao controle
 * @access  Private
 */
router.post('/:id/cpfs',
  authMiddleware,
  requireOwnership('id'),
  sanitizeInput,
  addCPFValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400, 'VALIDATION_ERROR');
    }

    const account = req.resource;
    const { cpf, nome, observacoes } = req.body;

    // Verificar se CPF pode ser usado
    if (!account.podeUsarCPF(cpf)) {
      throw createError('CPF não pode ser utilizado (limite atingido ou bloqueado)', 400, 'CPF_NOT_AVAILABLE');
    }

    // Adicionar CPF
    await account.adicionarCPF(cpf, nome, observacoes);

    res.json({
      success: true,
      message: 'CPF adicionado com sucesso',
      data: {
        cpf,
        nome,
        quantidadeEmissoes: account.controleCPFs.cpfsUtilizados.find(c => c.cpf === cpf).quantidadeEmissoes
      }
    });
  })
);

/**
 * @route   GET /api/accounts/:id/cpfs
 * @desc    Listar CPFs da conta
 * @access  Private
 */
router.get('/:id/cpfs',
  authMiddleware,
  requireOwnership('id'),
  asyncHandler(async (req, res) => {
    const account = req.resource;

    res.json({
      success: true,
      data: {
        cpfs: account.controleCPFs.cpfsUtilizados,
        limiteEmissoes: account.controleCPFs.limiteEmissoes,
        alertaEmissoes: account.controleCPFs.alertaEmissoes,
        cpfPrincipal: account.controleCPFs.cpfPrincipal
      }
    });
  })
);

/**
 * @route   PUT /api/accounts/:id/cpfs/:cpfId
 * @desc    Atualizar CPF
 * @access  Private
 */
router.put('/:id/cpfs/:cpfId',
  authMiddleware,
  requireOwnership('id'),
  sanitizeInput,
  asyncHandler(async (req, res) => {
    const account = req.resource;
    const { cpfId } = req.params;
    const updates = req.body;

    const cpfIndex = account.controleCPFs.cpfsUtilizados.findIndex(c => c._id.toString() === cpfId);
    
    if (cpfIndex === -1) {
      throw createError('CPF não encontrado', 404, 'CPF_NOT_FOUND');
    }

    // Atualizar CPF
    Object.assign(account.controleCPFs.cpfsUtilizados[cpfIndex], updates);
    await account.save();

    res.json({
      success: true,
      message: 'CPF atualizado com sucesso',
      data: { cpf: account.controleCPFs.cpfsUtilizados[cpfIndex] }
    });
  })
);

/**
 * @route   POST /api/accounts/:id/alerts
 * @desc    Adicionar alerta à conta
 * @access  Private
 */
router.post('/:id/alerts',
  authMiddleware,
  requireOwnership('id'),
  sanitizeInput,
  asyncHandler(async (req, res) => {
    const account = req.resource;
    const { tipo, titulo, mensagem, prioridade } = req.body;

    if (!tipo || !titulo || !mensagem) {
      throw createError('Tipo, título e mensagem são obrigatórios', 400, 'MISSING_REQUIRED_FIELDS');
    }

    await account.adicionarAlerta(tipo, titulo, mensagem, prioridade);

    res.json({
      success: true,
      message: 'Alerta adicionado com sucesso'
    });
  })
);

/**
 * @route   GET /api/accounts/:id/alerts
 * @desc    Listar alertas da conta
 * @access  Private
 */
router.get('/:id/alerts',
  authMiddleware,
  requireOwnership('id'),
  asyncHandler(async (req, res) => {
    const account = req.resource;

    res.json({
      success: true,
      data: {
        alertas: account.alertas,
        total: account.alertas.length,
        naoLidos: account.alertas.filter(a => !a.lido).length
      }
    });
  })
);

/**
 * @route   PUT /api/accounts/:id/alerts/:alertId/read
 * @desc    Marcar alerta como lido
 * @access  Private
 */
router.put('/:id/alerts/:alertId/read',
  authMiddleware,
  requireOwnership('id'),
  asyncHandler(async (req, res) => {
    const account = req.resource;
    const { alertId } = req.params;

    const alertIndex = account.alertas.findIndex(a => a._id.toString() === alertId);
    
    if (alertIndex === -1) {
      throw createError('Alerta não encontrado', 404, 'ALERT_NOT_FOUND');
    }

    account.alertas[alertIndex].lido = true;
    await account.save();

    res.json({
      success: true,
      message: 'Alerta marcado como lido'
    });
  })
);

/**
 * @route   POST /api/accounts/:id/upload
 * @desc    Upload de arquivo para conta
 * @access  Private
 */
router.post('/:id/upload',
  authMiddleware,
  requireOwnership('id'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw createError('Arquivo é obrigatório', 400, 'FILE_REQUIRED');
    }

    const account = req.resource;
    const { tipo, descricao } = req.body;

    // Adicionar arquivo aos comprovantes
    const comprovante = {
      tipo: tipo || 'outros',
      nome: req.file.originalname,
      url: `/uploads/accounts/${req.file.filename}`,
      tamanho: req.file.size,
      dataUpload: new Date()
    };

    if (descricao) {
      comprovante.descricao = descricao;
    }

    // Aqui você adicionaria o comprovante à conta
    // Por enquanto, apenas retornamos as informações do arquivo

    res.json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      data: {
        file: {
          id: req.file.filename,
          name: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype,
          url: `/uploads/accounts/${req.file.filename}`
        },
        comprovante
      }
    });
  })
);

/**
 * @route   GET /api/accounts/stats/overview
 * @desc    Estatísticas gerais das contas
 * @access  Private
 */
router.get('/stats/overview',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const stats = await Account.aggregate([
      { $match: { usuario: req.user._id } },
      {
        $group: {
          _id: null,
          totalContas: { $sum: 1 },
          contasAtivas: {
            $sum: { $cond: [{ $eq: ['$status', 'ativa'] }, 1, 0] }
          },
          saldoTotal: { $sum: '$saldoAtual' },
          mediaSaldo: { $avg: '$saldoAtual' },
          totalCPFs: { $sum: { $size: '$controleCPFs.cpfsUtilizados' } }
        }
      }
    ]);

    // Estatísticas por programa
    const statsByProgram = await Account.aggregate([
      { $match: { usuario: req.user._id } },
      {
        $group: {
          _id: '$programa',
          count: { $sum: 1 },
          saldoTotal: { $sum: '$saldoAtual' },
          mediaSaldo: { $avg: '$saldoAtual' }
        }
      },
      { $sort: { saldoTotal: -1 } }
    ]);

    // Contas próximas da expiração
    const expirando = await Account.find({
      usuario: req.user._id,
      'pontosExpirando.proximaExpiracao': { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    }).select('nome programa pontosExpirando');

    res.json({
      success: true,
      data: {
        geral: stats[0] || {
          totalContas: 0,
          contasAtivas: 0,
          saldoTotal: 0,
          mediaSaldo: 0,
          totalCPFs: 0
        },
        porPrograma: statsByProgram,
        expirando: expirando.map(account => ({
          id: account._id,
          nome: account.nome,
          programa: account.programa,
          pontosExpirando: account.pontosExpirando.quantidadeExpiracao,
          dataExpiracao: account.pontosExpirando.proximaExpiracao
        }))
      }
    });
  })
);

module.exports = router;
