/**
 * Sistema de Logs e Auditoria - Sistema de Gestão de Milhas
 * 
 * Implementa sistema robusto de logs usando Winston com
 * diferentes níveis de log, rotação de arquivos e auditoria de segurança.
 * 
 * @author Especialista em Segurança
 * @version 1.0.0
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Criar diretório de logs se não existir
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Formato customizado para logs
 */
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    return log;
  })
);

/**
 * Logger principal da aplicação
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { service: 'ss-milhas-api' },
  transports: [
    // Erros em arquivo separado
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 10,
      tailable: true
    }),
    
    // Todos os logs em arquivo combinado
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 10,
      tailable: true
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});

// Adicionar console em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

/**
 * Logger específico para auditoria de segurança
 */
const securityLogger = winston.createLogger({
  level: 'info',
  format: customFormat,
  defaultMeta: { service: 'security-audit' },
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'security.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 20, // Manter mais arquivos de segurança
      tailable: true
    })
  ]
});

/**
 * Logger específico para auditoria de ações
 */
const auditLogger = winston.createLogger({
  level: 'info',
  format: customFormat,
  defaultMeta: { service: 'audit' },
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'audit.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 30, // Manter mais arquivos de auditoria
      tailable: true
    })
  ]
});

/**
 * Logger específico para performance
 */
const performanceLogger = winston.createLogger({
  level: 'info',
  format: customFormat,
  defaultMeta: { service: 'performance' },
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'performance.log'),
      maxsize: 10485760,
      maxFiles: 7
    })
  ]
});

/**
 * Funções auxiliares de logging
 */

/**
 * Log de autenticação
 */
const logAuth = (action, userId, email, success, details = {}) => {
  const logData = {
    action,
    userId,
    email,
    success,
    timestamp: new Date().toISOString(),
    ...details
  };
  
  securityLogger.info('Authentication Event', logData);
  auditLogger.info('Authentication Event', logData);
};

/**
 * Log de autorização
 */
const logAuthorization = (userId, resource, action, allowed, details = {}) => {
  const logData = {
    userId,
    resource,
    action,
    allowed,
    timestamp: new Date().toISOString(),
    ...details
  };
  
  securityLogger.info('Authorization Event', logData);
};

/**
 * Log de atividade suspeita
 */
const logSuspiciousActivity = (type, severity, req, details = {}) => {
  const logData = {
    type,
    severity,
    ip: req.ip,
    userId: req.user?._id,
    email: req.user?.email,
    path: req.path,
    method: req.method,
    userAgent: req.get('User-Agent'),
    body: req.body,
    query: req.query,
    params: req.params,
    timestamp: new Date().toISOString(),
    ...details
  };
  
  securityLogger.error('Suspicious Activity Detected', logData);
  
  // Alertar para atividades críticas
  if (severity === 'critical') {
    // Aqui você pode adicionar integração com sistema de alertas
    // Ex: enviar email, slack, telegram, etc.
    console.error('🚨 CRITICAL SECURITY ALERT:', logData);
  }
};

/**
 * Log de mudanças em dados sensíveis
 */
const logDataChange = (userId, model, action, recordId, changes = {}, details = {}) => {
  const logData = {
    userId,
    model,
    action,
    recordId,
    changes,
    timestamp: new Date().toISOString(),
    ...details
  };
  
  auditLogger.info('Data Change Event', logData);
};

/**
 * Log de operações financeiras
 */
const logFinancialOperation = (userId, operation, amount, details = {}) => {
  const logData = {
    userId,
    operation,
    amount,
    timestamp: new Date().toISOString(),
    ...details
  };
  
  auditLogger.info('Financial Operation', logData);
  securityLogger.info('Financial Operation', logData);
};

/**
 * Log de acesso a dados sensíveis
 */
const logSensitiveDataAccess = (userId, dataType, recordId, details = {}) => {
  const logData = {
    userId,
    dataType,
    recordId,
    timestamp: new Date().toISOString(),
    ...details
  };
  
  securityLogger.info('Sensitive Data Access', logData);
  auditLogger.info('Sensitive Data Access', logData);
};

/**
 * Log de performance
 */
const logPerformance = (endpoint, method, duration, statusCode, details = {}) => {
  const logData = {
    endpoint,
    method,
    duration,
    statusCode,
    timestamp: new Date().toISOString(),
    ...details
  };
  
  performanceLogger.info('API Performance', logData);
  
  // Alertar para requests lentas (>3 segundos)
  if (duration > 3000) {
    logger.warn('Slow Request Detected', logData);
  }
};

/**
 * Log de erro
 */
const logError = (error, req = null, details = {}) => {
  const logData = {
    message: error.message,
    stack: error.stack,
    code: error.code,
    timestamp: new Date().toISOString(),
    ...details
  };
  
  if (req) {
    logData.path = req.path;
    logData.method = req.method;
    logData.ip = req.ip;
    logData.userId = req.user?._id;
    logData.userAgent = req.get('User-Agent');
  }
  
  logger.error('Application Error', logData);
};

/**
 * Middleware para logging de requisições
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Capturar o método original de send
  const originalSend = res.send;
  
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    // Log da requisição
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userId: req.user?._id,
      userAgent: req.get('User-Agent')
    });
    
    // Log de performance
    logPerformance(req.path, req.method, duration, res.statusCode, {
      userId: req.user?._id
    });
    
    originalSend.call(this, data);
  };
  
  next();
};

/**
 * Middleware para logging de erros
 */
const errorLogger = (err, req, res, next) => {
  logError(err, req, {
    body: req.body,
    query: req.query,
    params: req.params
  });
  
  next(err);
};

/**
 * Analisador de logs de segurança
 */
class SecurityLogAnalyzer {
  constructor() {
    this.alerts = [];
    this.thresholds = {
      failedLogins: { count: 5, window: 15 * 60 * 1000 }, // 5 em 15 min
      suspiciousActivity: { count: 3, window: 60 * 60 * 1000 }, // 3 em 1 hora
      rateLimitHits: { count: 10, window: 60 * 60 * 1000 } // 10 em 1 hora
    };
    this.userActivity = new Map();
  }
  
  trackActivity(userId, activityType) {
    if (!this.userActivity.has(userId)) {
      this.userActivity.set(userId, {});
    }
    
    const userActivities = this.userActivity.get(userId);
    
    if (!userActivities[activityType]) {
      userActivities[activityType] = [];
    }
    
    userActivities[activityType].push(Date.now());
    
    // Limpar atividades antigas
    this.cleanOldActivities(userId, activityType);
    
    // Verificar thresholds
    this.checkThresholds(userId, activityType);
  }
  
  cleanOldActivities(userId, activityType) {
    const userActivities = this.userActivity.get(userId);
    const threshold = this.thresholds[activityType];
    
    if (!threshold || !userActivities[activityType]) return;
    
    const cutoff = Date.now() - threshold.window;
    userActivities[activityType] = userActivities[activityType].filter(
      time => time > cutoff
    );
  }
  
  checkThresholds(userId, activityType) {
    const threshold = this.thresholds[activityType];
    if (!threshold) return;
    
    const userActivities = this.userActivity.get(userId);
    const count = userActivities[activityType].length;
    
    if (count >= threshold.count) {
      this.generateAlert(userId, activityType, count);
    }
  }
  
  generateAlert(userId, activityType, count) {
    const alert = {
      userId,
      activityType,
      count,
      timestamp: Date.now(),
      severity: 'high'
    };
    
    this.alerts.push(alert);
    
    securityLogger.error('Security Threshold Exceeded', alert);
    
    // Aqui você pode adicionar ações automáticas como:
    // - Bloquear usuário temporariamente
    // - Enviar notificação para admins
    // - Aumentar nível de logging para este usuário
    
    console.error('🚨 SECURITY ALERT:', alert);
  }
  
  getAlerts(userId = null) {
    if (userId) {
      return this.alerts.filter(alert => alert.userId === userId);
    }
    return this.alerts;
  }
}

const securityAnalyzer = new SecurityLogAnalyzer();

module.exports = {
  // Loggers principais
  logger,
  securityLogger,
  auditLogger,
  performanceLogger,
  
  // Funções de logging
  logAuth,
  logAuthorization,
  logSuspiciousActivity,
  logDataChange,
  logFinancialOperation,
  logSensitiveDataAccess,
  logPerformance,
  logError,
  
  // Middlewares
  requestLogger,
  errorLogger,
  
  // Analisador de segurança
  securityAnalyzer
};

