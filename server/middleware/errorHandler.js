/**
 * Middleware de Tratamento de Erros - Sistema de Gestão de Milhas
 * 
 * Middleware centralizado para tratamento de erros da aplicação,
 * incluindo logs, formatação e códigos de erro padronizados.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

/**
 * Middleware principal de tratamento de erros
 * Deve ser o último middleware registrado na aplicação
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro
  console.error('❌ Erro capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    userId: req.user?._id
  });

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400,
      code: 'VALIDATION_ERROR'
    };
  }

  // Erro de cast do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    const message = 'Recurso não encontrado';
    error = {
      message,
      statusCode: 404,
      code: 'RESOURCE_NOT_FOUND'
    };
  }

  // Erro de duplicação do Mongoose
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} já está em uso`;
    error = {
      message,
      statusCode: 400,
      code: 'DUPLICATE_FIELD',
      field
    };
  }

  // Erro JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = {
      message,
      statusCode: 401,
      code: 'INVALID_TOKEN'
    };
  }

  // Token expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = {
      message,
      statusCode: 401,
      code: 'TOKEN_EXPIRED'
    };
  }

  // Erro de limite de arquivo
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'Arquivo muito grande';
    error = {
      message,
      statusCode: 413,
      code: 'FILE_TOO_LARGE'
    };
  }

  // Erro de tipo de arquivo não permitido
  if (err.code === 'INVALID_FILE_TYPE') {
    const message = 'Tipo de arquivo não permitido';
    error = {
      message,
      statusCode: 400,
      code: 'INVALID_FILE_TYPE'
    };
  }

  // Erro de rate limiting
  if (err.statusCode === 429) {
    const message = 'Muitas tentativas. Tente novamente mais tarde.';
    error = {
      message,
      statusCode: 429,
      code: 'RATE_LIMIT_EXCEEDED'
    };
  }

  // Erro de conexão com banco de dados
  if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
    const message = 'Erro de conexão com o banco de dados';
    error = {
      message,
      statusCode: 503,
      code: 'DATABASE_CONNECTION_ERROR'
    };
  }

  // Erro de permissão
  if (err.name === 'ForbiddenError') {
    const message = 'Acesso negado';
    error = {
      message,
      statusCode: 403,
      code: 'FORBIDDEN'
    };
  }

  // Erro de não encontrado
  if (err.name === 'NotFoundError') {
    const message = 'Recurso não encontrado';
    error = {
      message,
      statusCode: 404,
      code: 'NOT_FOUND'
    };
  }

  // Erro de validação de entrada
  if (err.name === 'ValidationError') {
    const message = 'Dados de entrada inválidos';
    error = {
      message,
      statusCode: 422,
      code: 'INPUT_VALIDATION_ERROR',
      details: err.details
    };
  }

  // Definir status code padrão se não definido
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Erro interno do servidor';

  // Preparar resposta de erro
  const errorResponse = {
    success: false,
    message,
    code: error.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Adicionar detalhes em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.error = err;
  }

  // Adicionar ID da requisição se disponível
  if (req.requestId) {
    errorResponse.requestId = req.requestId;
  }

  // Adicionar campo específico para erros de validação
  if (error.field) {
    errorResponse.field = error.field;
  }

  // Adicionar detalhes de validação se disponíveis
  if (error.details) {
    errorResponse.details = error.details;
  }

  // Enviar resposta
  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware para capturar erros assíncronos
 * Envolve funções async para capturar erros automaticamente
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Classe para erros customizados
 */
class AppError extends Error {
  constructor(message, statusCode, code = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Função para criar erros customizados
 */
const createError = (message, statusCode = 500, code = 'APP_ERROR') => {
  return new AppError(message, statusCode, code);
};

/**
 * Middleware para 404 - Rota não encontrada
 */
const notFound = (req, res, next) => {
  const error = createError(
    `Rota não encontrada - ${req.originalUrl}`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

/**
 * Middleware para validar parâmetros obrigatórios
 */
const validateRequired = (fields) => {
  return (req, res, next) => {
    const missing = [];
    
    fields.forEach(field => {
      const value = req.body[field] || req.params[field] || req.query[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      return next(createError(
        `Campos obrigatórios não fornecidos: ${missing.join(', ')}`,
        400,
        'MISSING_REQUIRED_FIELDS'
      ));
    }

    next();
  };
};

/**
 * Middleware para validar tipos de dados
 */
const validateTypes = (schema) => {
  return (req, res, next) => {
    const errors = [];
    
    Object.keys(schema).forEach(field => {
      const expectedType = schema[field];
      const value = req.body[field];
      
      if (value !== undefined) {
        const actualType = typeof value;
        
        if (actualType !== expectedType) {
          errors.push({
            field,
            expected: expectedType,
            actual: actualType
          });
        }
      }
    });

    if (errors.length > 0) {
      return next(createError(
        'Tipos de dados inválidos',
        400,
        'INVALID_DATA_TYPES'
      ));
    }

    next();
  };
};

/**
 * Middleware para sanitização de entrada
 */
const sanitizeInput = (req, res, next) => {
  // Remover tags HTML de strings
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, '').trim();
  };

  // Sanitizar body
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }

  // Sanitizar query params
  if (req.query && typeof req.query === 'object') {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    });
  }

  next();
};

module.exports = {
  errorHandler,
  asyncHandler,
  AppError,
  createError,
  notFound,
  validateRequired,
  validateTypes,
  sanitizeInput
};

// Exportar também como padrão
module.exports.default = errorHandler;
