/**
 * Rotas de Autenticação - Sistema de Gestão de Milhas
 * 
 * Define todas as rotas relacionadas à autenticação de usuários,
 * incluindo login, registro, recuperação de senha e verificação de email.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { asyncHandler, createError, sanitizeInput } = require('../middleware/errorHandler');
const emailService = require('../services/emailService');

// Importar rate limiters e validações de segurança
const {
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  authDelayMiddleware
} = require('../middleware/security');

const {
  validate,
  authSchemas
} = require('../middleware/validation');

// Importar sistema de logs
const {
  logAuth,
  logSuspiciousActivity
} = require('../utils/logger');

const router = express.Router();

// ==================== VALIDAÇÕES ====================

// Validações para registro
const registerValidation = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
  
  body('telefone')
    .optional()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (xx) xxxxx-xxxx')
];

// Validações para login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

// Validações para recuperação de senha
const passwordResetValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido')
];

// Validações para redefinir senha
const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Token é obrigatório'),
  
  body('novaSenha')
    .isLength({ min: 6 })
    .withMessage('Nova senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Nova senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número')
];

// ==================== ROTAS ====================

/**
 * @route   POST /api/auth/register
 * @desc    Registrar novo usuário
 * @access  Public
 */
router.post('/register', 
  registerLimiter,
  sanitizeInput,
  registerValidation,
  asyncHandler(async (req, res) => {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400, 'VALIDATION_ERROR');
    }

    const { nome, email, senha, telefone } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.buscarPorEmail(email);
    if (existingUser) {
      throw createError('Usuário já existe com este email', 400, 'USER_EXISTS');
    }

    // Criar token de verificação de email
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Criar usuário
    const user = new User({
      nome,
      email,
      senha,
      telefone,
      emailVerificationToken
    });

    await user.save();

    // Enviar email de verificação
    try {
      await emailService.sendVerificationEmail(user.email, emailVerificationToken);
    } catch (emailError) {
      console.error('Erro ao enviar email de verificação:', emailError);
      // Não falhar o registro por causa do email
    }

    // Gerar token JWT
    const token = user.gerarTokenJWT();
    const refreshToken = user.gerarRefreshToken();

    await user.save();

    // Remover dados sensíveis da resposta
    const userResponse = {
      id: user._id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: userResponse,
        token,
        refreshToken
      }
    });
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Fazer login do usuário
 * @access  Public
 */
router.post('/login',
  // loginLimiter, // Temporariamente desabilitado para teste
  sanitizeInput,
  loginValidation,
  asyncHandler(async (req, res) => {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400, 'VALIDATION_ERROR');
    }

    const { email, senha } = req.body;

    // Buscar usuário incluindo senha
    const user = await User.findOne({ email: email.toLowerCase() }).select('+senha');
    
    if (!user) {
      throw createError('Credenciais inválidas', 401, 'INVALID_CREDENTIALS');
    }

    // Verificar senha
    const isPasswordValid = await user.verificarSenha(senha);
    
    if (!isPasswordValid) {
      throw createError('Credenciais inválidas', 401, 'INVALID_CREDENTIALS');
    }

    // Verificar se usuário está ativo
    if (user.status !== 'ativo') {
      throw createError('Usuário inativo ou suspenso', 403, 'USER_INACTIVE');
    }

    // Gerar tokens
    const token = user.gerarTokenJWT();
    const refreshToken = user.gerarRefreshToken();

    // Atualizar último login
    user.estatisticas.ultimoLogin = new Date();
    user.limparRefreshTokens();

    await user.save();

    // Preparar resposta
    const userResponse = {
      id: user._id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      configuracoes: user.configuracoes,
      estatisticas: user.estatisticas,
      nivel: user.nivel,
      pontos: user.pontos
    };

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: userResponse,
        token,
        refreshToken
      }
    });
  })
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Renovar token de acesso
 * @access  Public
 */
router.post('/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError('Refresh token é obrigatório', 400, 'REFRESH_TOKEN_REQUIRED');
    }

    // Verificar refresh token
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'fallback_refresh_secret';
    const decoded = jwt.verify(refreshToken, refreshSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw createError('Refresh token inválido', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Verificar se refresh token está na lista do usuário
    const tokenExists = user.refreshTokens.some(t => t.token === refreshToken);
    
    if (!tokenExists) {
      throw createError('Refresh token inválido', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Gerar novo token de acesso
    const newToken = user.gerarTokenJWT();

    res.json({
      success: true,
      message: 'Token renovado com sucesso',
      data: {
        token: newToken
      }
    });
  })
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verificar email do usuário
 * @access  Public
 */
router.post('/verify-email',
  asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
      throw createError('Token de verificação é obrigatório', 400, 'VERIFICATION_TOKEN_REQUIRED');
    }

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      throw createError('Token de verificação inválido', 400, 'INVALID_VERIFICATION_TOKEN');
    }

    // Verificar email
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    
    // Adicionar conquista de email verificado
    user.adicionarConquista('email-verificado', 'Email Verificado', 'Você verificou seu email com sucesso!', 10);

    await user.save();

    res.json({
      success: true,
      message: 'Email verificado com sucesso'
    });
  })
);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Reenviar email de verificação
 * @access  Public
 */
router.post('/resend-verification',
  passwordResetLimiter,
  sanitizeInput,
  passwordResetValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Email inválido', 400, 'VALIDATION_ERROR');
    }

    const { email } = req.body;

    const user = await User.buscarPorEmail(email);

    if (!user) {
      throw createError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }

    if (user.emailVerified) {
      throw createError('Email já verificado', 400, 'EMAIL_ALREADY_VERIFIED');
    }

    // Gerar novo token de verificação
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = emailVerificationToken;

    await user.save();

    // Enviar email de verificação
    try {
      await emailService.sendVerificationEmail(user.email, emailVerificationToken);
    } catch (emailError) {
      console.error('Erro ao enviar email de verificação:', emailError);
      throw createError('Erro ao enviar email de verificação', 500, 'EMAIL_SEND_ERROR');
    }

    res.json({
      success: true,
      message: 'Email de verificação reenviado com sucesso'
    });
  })
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar recuperação de senha
 * @access  Public
 */
router.post('/forgot-password',
  passwordResetLimiter,
  sanitizeInput,
  passwordResetValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Email inválido', 400, 'VALIDATION_ERROR');
    }

    const { email } = req.body;

    const user = await User.buscarPorEmail(email);

    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      return res.json({
        success: true,
        message: 'Se o email existir, você receberá instruções de recuperação'
      });
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutos

    await user.save();

    // Enviar email de recuperação
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error('Erro ao enviar email de recuperação:', emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      throw createError('Erro ao enviar email de recuperação', 500, 'EMAIL_SEND_ERROR');
    }

    res.json({
      success: true,
      message: 'Se o email existir, você receberá instruções de recuperação'
    });
  })
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Redefinir senha com token
 * @access  Public
 */
router.post('/reset-password',
  sanitizeInput,
  resetPasswordValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400, 'VALIDATION_ERROR');
    }

    const { token, novaSenha } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw createError('Token inválido ou expirado', 400, 'INVALID_RESET_TOKEN');
    }

    // Atualizar senha
    user.senha = novaSenha;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Invalidar todos os refresh tokens
    user.refreshTokens = [];

    await user.save();

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso'
    });
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Fazer logout do usuário
 * @access  Private
 */
router.post('/logout',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remover refresh token específico
      req.user.refreshTokens = req.user.refreshTokens.filter(
        token => token.token !== refreshToken
      );
      await req.user.save();
    } else {
      // Invalidar todos os refresh tokens
      req.user.refreshTokens = [];
      await req.user.save();
    }

    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  })
);

/**
 * @route   GET /api/auth/me
 * @desc    Obter dados do usuário logado
 * @access  Private
 */
router.get('/me',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const userResponse = {
      id: req.user._id,
      nome: req.user.nome,
      email: req.user.email,
      telefone: req.user.telefone,
      role: req.user.role,
      status: req.user.status,
      emailVerified: req.user.emailVerified,
      configuracoes: req.user.configuracoes,
      estatisticas: req.user.estatisticas,
      nivel: req.user.nivel,
      pontos: req.user.pontos,
      conquistas: req.user.conquistas,
      metas: req.user.metas
    };

    res.json({
      success: true,
      data: {
        user: userResponse
      }
    });
  })
);

module.exports = router;
