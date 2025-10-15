/**
 * Middleware de Autenticação - Sistema de Gestão de Milhas
 * 
 * Middleware para autenticação JWT e controle de acesso
 * baseado em roles de usuário.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware principal de autenticação
 * Verifica se o usuário está autenticado através do token JWT
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Verificar se o token existe no header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido',
        code: 'NO_TOKEN'
      });
    }

    // Extrair token do header "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    // Verificar e decodificar o token
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
    const decoded = jwt.verify(token, secret);
    
    // Buscar usuário no banco de dados
    const user = await User.findById(decoded.id).select('-senha -refreshTokens');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Verificar se o usuário está ativo
    if (user.status !== 'ativo') {
      return res.status(403).json({
        success: false,
        message: 'Usuário inativo ou suspenso',
        code: 'USER_INACTIVE'
      });
    }

    // Verificar se o email foi verificado (liberar admins mesmo sem verificação)
    if (!user.emailVerified && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Email não verificado. Verifique sua caixa de entrada.',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Adicionar usuário ao objeto request
    req.user = user;
    req.userId = user._id;
    
    // Atualizar último login (sem bloquear a requisição)
    user.estatisticas.ultimoLogin = new Date();
    user.save().catch(err => console.error('Erro ao atualizar último login:', err));

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Middleware para verificar roles específicos
 * @param {Array} roles - Array de roles permitidos
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Permissões insuficientes.',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware para verificar se o usuário pode acessar recurso específico
 * @param {String} resource - Nome do recurso
 * @param {String} action - Ação a ser realizada
 */
const requirePermission = (resource, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Verificar se o usuário pode realizar a ação
    const canPerform = req.user.podeRealizarAcao(action);
    
    if (!canPerform) {
      return res.status(403).json({
        success: false,
        message: `Acesso negado para ${action} em ${resource}`,
        code: 'PERMISSION_DENIED',
        resource,
        action
      });
    }

    next();
  };
};

/**
 * Middleware para verificar se o usuário é o dono do recurso
 * @param {String} resourceId - ID do recurso
 * @param {String} userIdField - Campo que contém o ID do usuário no recurso
 */
const requireOwnership = (resourceId = 'id', userIdField = 'usuario') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
          code: 'NOT_AUTHENTICATED'
        });
      }

      // Para usuários admin, permitir acesso a qualquer recurso
      if (req.user.role === 'admin') {
        return next();
      }

      const resourceIdValue = req.params[resourceId];
      
      // Determinar o modelo baseado na rota
      let Model;
      const route = req.route.path;
      
      if (route.includes('/accounts')) {
        Model = require('../models/Account');
      } else if (route.includes('/transactions')) {
        Model = require('../models/Transaction');
      } else {
        return next(); // Para outros recursos, continuar
      }

      // Buscar o recurso
      const resource = await Model.findById(resourceIdValue);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Recurso não encontrado',
          code: 'RESOURCE_NOT_FOUND'
        });
      }

      // Verificar se o usuário é o dono
      const resourceUserId = resource[userIdField].toString();
      const currentUserId = req.user._id.toString();

      if (resourceUserId !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado. Você não é o proprietário deste recurso.',
          code: 'OWNERSHIP_REQUIRED'
        });
      }

      // Adicionar o recurso ao request para uso posterior
      req.resource = resource;
      
      next();
    } catch (error) {
      console.error('Erro na verificação de propriedade:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  };
};

/**
 * Middleware para verificar rate limiting por usuário
 * @param {Number} maxRequests - Número máximo de requests
 * @param {Number} windowMs - Janela de tempo em ms
 */
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Limpar requests antigos
    if (userRequests.has(userId)) {
      const requests = userRequests.get(userId);
      const validRequests = requests.filter(time => time > windowStart);
      userRequests.set(userId, validRequests);
    }

    // Verificar limite
    const userRequestCount = userRequests.get(userId)?.length || 0;
    
    if (userRequestCount >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Muitas tentativas. Tente novamente em alguns minutos.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Registrar request atual
    if (!userRequests.has(userId)) {
      userRequests.set(userId, []);
    }
    userRequests.get(userId).push(now);

    next();
  };
};

/**
 * Middleware para log de auditoria
 */
const auditLog = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log da ação (em produção, usar um sistema de logs adequado)
      if (req.user) {
        console.log(`[AUDIT] Usuário ${req.user._id} (${req.user.email}) executou ${action} em ${new Date().toISOString()}`);
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware opcional de autenticação
 * Não falha se não houver token, mas adiciona usuário se presente
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return next();
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-senha -refreshTokens');
    
    if (user && user.status === 'ativo') {
      req.user = user;
      req.userId = user._id;
    }

    next();
  } catch (error) {
    // Em caso de erro, apenas continua sem usuário
    next();
  }
};

module.exports = {
  authMiddleware,
  requireRole,
  requirePermission,
  requireOwnership,
  userRateLimit,
  auditLog,
  optionalAuth
};

// Exportar também como padrão
module.exports.default = authMiddleware;
