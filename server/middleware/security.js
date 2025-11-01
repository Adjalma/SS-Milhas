/**
 * Middleware de Segurança Avançada - Sistema de Gestão de Milhas
 * 
 * Implementa camadas adicionais de segurança incluindo CSRF protection,
 * XSS protection, rate limiting granular e outras medidas de segurança.
 * 
 * @author Especialista em Segurança
 * @version 1.0.0
 */

const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

/**
 * Proteção CSRF (Cross-Site Request Forgery)
 * Implementação manual de CSRF tokens
 */
class CSRFProtection {
  constructor() {
    this.tokens = new Map();
    this.tokenExpiry = 1 * 60 * 60 * 1000; // 1 hora
    
    // Limpar tokens expirados a cada 10 minutos
    setInterval(() => this.cleanExpiredTokens(), 10 * 60 * 1000);
  }
  
  /**
   * Gera um token CSRF
   */
  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }
  
  /**
   * Armazena token com timestamp
   */
  storeToken(token, userId) {
    this.tokens.set(token, {
      userId,
      timestamp: Date.now()
    });
  }
  
  /**
   * Verifica se token é válido
   */
  verifyToken(token, userId) {
    const tokenData = this.tokens.get(token);
    
    if (!tokenData) return false;
    if (tokenData.userId !== userId) return false;
    if (Date.now() - tokenData.timestamp > this.tokenExpiry) {
      this.tokens.delete(token);
      return false;
    }
    
    return true;
  }
  
  /**
   * Remove token após uso
   */
  consumeToken(token) {
    this.tokens.delete(token);
  }
  
  /**
   * Limpa tokens expirados
   */
  cleanExpiredTokens() {
    const now = Date.now();
    for (const [token, data] of this.tokens.entries()) {
      if (now - data.timestamp > this.tokenExpiry) {
        this.tokens.delete(token);
      }
    }
  }
}

const csrfProtection = new CSRFProtection();

/**
 * Middleware para gerar e enviar token CSRF
 */
const csrfTokenGenerator = (req, res, next) => {
  if (req.user) {
    const token = csrfProtection.generateToken();
    csrfProtection.storeToken(token, req.user._id.toString());
    res.set('X-CSRF-Token', token);
  }
  next();
};

/**
 * Middleware para verificar token CSRF
 */
const csrfValidator = (req, res, next) => {
  // Apenas para métodos que modificam dados
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return next();
  }
  
  // Pular para rotas públicas
  if (!req.user) {
    return next();
  }
  
  const token = req.get('X-CSRF-Token') || req.body._csrf || req.query._csrf;
  
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Token CSRF não fornecido',
      code: 'CSRF_TOKEN_MISSING'
    });
  }
  
  if (!csrfProtection.verifyToken(token, req.user._id.toString())) {
    return res.status(403).json({
      success: false,
      message: 'Token CSRF inválido ou expirado',
      code: 'CSRF_TOKEN_INVALID'
    });
  }
  
  // Consumir token (single-use)
  csrfProtection.consumeToken(token);
  
  next();
};

/**
 * Rate Limiting Granular
 */

// Rate limiter para login - 5 tentativas por 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    code: 'TOO_MANY_LOGIN_ATTEMPTS',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Não contar logins bem-sucedidos
});

// Rate limiter para registro - 3 tentativas por hora
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Muitas tentativas de registro. Tente novamente em 1 hora.',
    code: 'TOO_MANY_REGISTER_ATTEMPTS',
    retryAfter: 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter para recuperação de senha - 3 tentativas por hora
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Muitas tentativas de recuperação de senha. Tente novamente em 1 hora.',
    code: 'TOO_MANY_PASSWORD_RESET_ATTEMPTS',
    retryAfter: 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter para rotas de API sensíveis - 30 requests por minuto
const apiSensitiveLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em 1 minuto.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter para operações financeiras - 20 requests por minuto
const financialLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Muitas operações financeiras. Tente novamente em 1 minuto.',
    code: 'FINANCIAL_RATE_LIMIT_EXCEEDED',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter para uploads - 10 requests por hora
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Muitos uploads. Tente novamente em 1 hora.',
    code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
    retryAfter: 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Proteção XSS Avançada
 */
const xssProtection = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      // Remove scripts e tags HTML perigosas
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
        .replace(/<embed\b[^<]*>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '') // Remove event handlers (onclick, onload, etc)
        .trim();
    }
    if (typeof value === 'object' && value !== null) {
      return sanitizeObject(value);
    }
    return value;
  };
  
  const sanitizeObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeValue(item));
    }
    
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeValue(obj[key]);
      }
    }
    return sanitized;
  };
  
  // Sanitizar body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitizar query params
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  // Sanitizar params
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

/**
 * Proteção contra Timing Attacks
 */
const timingSafeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  
  if (a.length !== b.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(a),
    Buffer.from(b)
  );
};

/**
 * Middleware para adicionar delay consistente em autenticação
 */
const authDelayMiddleware = async (req, res, next) => {
  const delay = Math.floor(Math.random() * 100) + 50; // 50-150ms de delay aleatório
  await new Promise(resolve => setTimeout(resolve, delay));
  next();
};

/**
 * Proteção contra Path Traversal
 */
const pathTraversalProtection = (req, res, next) => {
  const checkPathTraversal = (value) => {
    if (typeof value === 'string') {
      // Detectar tentativas de path traversal
      if (value.includes('..') || value.includes('./') || value.includes('\\')) {
        return true;
      }
    }
    return false;
  };
  
  const checkObject = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (checkPathTraversal(value)) return true;
        if (typeof value === 'object' && value !== null) {
          if (checkObject(value)) return true;
        }
      }
    }
    return false;
  };
  
  // Verificar todas as fontes de input
  if (
    checkObject(req.body) ||
    checkObject(req.query) ||
    checkObject(req.params)
  ) {
    return res.status(400).json({
      success: false,
      message: 'Entrada inválida detectada',
      code: 'PATH_TRAVERSAL_DETECTED'
    });
  }
  
  next();
};

/**
 * Proteção contra HTTP Parameter Pollution
 */
const hppProtection = (req, res, next) => {
  // Converter arrays de parâmetros em valores únicos (primeiro valor)
  if (req.query) {
    for (const key in req.query) {
      if (Array.isArray(req.query[key])) {
        req.query[key] = req.query[key][0];
      }
    }
  }
  
  next();
};

/**
 * Headers de segurança adicionais
 */
const additionalSecurityHeaders = (req, res, next) => {
  // Permissions Policy
  res.setHeader('Permissions-Policy', 
    'geolocation=(), microphone=(), camera=(), payment=()');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // X-DNS-Prefetch-Control
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  
  // Expect-CT
  res.setHeader('Expect-CT', 'max-age=86400, enforce');
  
  // X-Permitted-Cross-Domain-Policies
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  
  next();
};

/**
 * Detecção de atividades suspeitas
 */
class SuspiciousActivityDetector {
  constructor() {
    this.activities = new Map();
    this.suspiciousPatterns = [
      { pattern: /union.*select/i, type: 'SQL_INJECTION' },
      { pattern: /<script/i, type: 'XSS_ATTEMPT' },
      { pattern: /\.\.\/|\.\.\\/, type: 'PATH_TRAVERSAL' },
      { pattern: /exec\(|eval\(/, type: 'CODE_INJECTION' }
    ];
  }
  
  detect(req) {
    const suspicious = [];
    const input = JSON.stringify({
      body: req.body,
      query: req.query,
      params: req.params
    });
    
    for (const { pattern, type } of this.suspiciousPatterns) {
      if (pattern.test(input)) {
        suspicious.push(type);
      }
    }
    
    return suspicious;
  }
  
  log(req, activities) {
    const key = req.ip + ':' + (req.user?._id || 'anonymous');
    
    if (!this.activities.has(key)) {
      this.activities.set(key, []);
    }
    
    const userActivities = this.activities.get(key);
    userActivities.push({
      timestamp: Date.now(),
      activities,
      path: req.path,
      method: req.method
    });
    
    // Log crítico se detectar atividade suspeita
    console.error('🚨 ATIVIDADE SUSPEITA DETECTADA:', {
      ip: req.ip,
      userId: req.user?._id,
      activities,
      path: req.path,
      method: req.method,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  }
}

const activityDetector = new SuspiciousActivityDetector();

/**
 * Middleware para detectar atividades suspeitas
 */
const suspiciousActivityMiddleware = (req, res, next) => {
  const suspicious = activityDetector.detect(req);
  
  if (suspicious.length > 0) {
    activityDetector.log(req, suspicious);
    
    // Bloquear requisição suspeita
    return res.status(400).json({
      success: false,
      message: 'Requisição bloqueada por motivos de segurança',
      code: 'SUSPICIOUS_ACTIVITY_DETECTED'
    });
  }
  
  next();
};

/**
 * Middleware para validar Content-Type
 */
const validateContentType = (allowedTypes = ['application/json']) => {
  return (req, res, next) => {
    // Apenas para métodos com body
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.get('Content-Type');
      
      if (!contentType) {
        return res.status(400).json({
          success: false,
          message: 'Content-Type não especificado',
          code: 'MISSING_CONTENT_TYPE'
        });
      }
      
      const isAllowed = allowedTypes.some(type => 
        contentType.toLowerCase().includes(type.toLowerCase())
      );
      
      if (!isAllowed) {
        return res.status(415).json({
          success: false,
          message: 'Content-Type não suportado',
          code: 'UNSUPPORTED_CONTENT_TYPE',
          allowed: allowedTypes
        });
      }
    }
    
    next();
  };
};

/**
 * Middleware para limitar tamanho de payload
 */
const payloadSizeLimit = (maxSize = 10 * 1024 * 1024) => { // 10MB padrão
  return (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length') || 0);
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        success: false,
        message: 'Payload muito grande',
        code: 'PAYLOAD_TOO_LARGE',
        maxSize: maxSize
      });
    }
    
    next();
  };
};

module.exports = {
  // CSRF Protection
  csrfTokenGenerator,
  csrfValidator,
  
  // Rate Limiters
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  apiSensitiveLimiter,
  financialLimiter,
  uploadLimiter,
  
  // XSS Protection
  xssProtection,
  
  // Timing Attack Protection
  timingSafeCompare,
  authDelayMiddleware,
  
  // Path Traversal Protection
  pathTraversalProtection,
  
  // HPP Protection
  hppProtection,
  
  // Additional Security Headers
  additionalSecurityHeaders,
  
  // Suspicious Activity Detection
  suspiciousActivityMiddleware,
  
  // Content Type Validation
  validateContentType,
  
  // Payload Size Limit
  payloadSizeLimit
};

