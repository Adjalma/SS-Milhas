/**
 * Middleware de Permissões
 * 
 * Controla o acesso baseado no role do usuário
 * e nas permissões da conta.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const User = require('../models/User');
const Account = require('../models/Account');

// Middleware para verificar permissões
const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      // Buscar usuário com conta
      const user = await User.findById(userId).populate('accountId');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      
      if (!user.accountId) {
        return res.status(403).json({
          success: false,
          message: 'Usuário não possui conta associada'
        });
      }
      
      // Verificar se conta está ativa
      if (!user.accountId.isAtiva()) {
        return res.status(403).json({
          success: false,
          message: 'Conta inativa ou expirada'
        });
      }
      
      // Verificar permissão específica
      const hasPermission = user.accountId.verificarPermissoes(userId, permission);
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Acesso negado. Permissão necessária: ${permission}`,
          requiredPermission: permission,
          userRole: user.role
        });
      }
      
      // Adicionar informações do usuário e conta ao request
      req.userAccount = user.accountId;
      req.userRole = user.role;
      req.userPermissions = user.permissions;
      
      next();
      
    } catch (error) {
      console.error('Erro na verificação de permissões:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

// Middleware para verificar se é admin ou owner
const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).populate('accountId');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    if (!['admin', 'owner'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso restrito a administradores'
      });
    }
    
    req.userRole = user.role;
    next();
    
  } catch (error) {
    console.error('Erro na verificação de admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se é owner
const requireOwner = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).populate('accountId');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    if (user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Acesso restrito ao proprietário da conta'
      });
    }
    
    req.userRole = user.role;
    next();
    
  } catch (error) {
    console.error('Erro na verificação de owner:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para filtrar dados baseado no role
const filterDataByRole = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    try {
      if (req.userRole === 'auxiliar') {
        // Auxiliares não podem ver valores financeiros
        if (typeof data === 'object' && data.data) {
          data.data = filterFinancialData(data.data);
        }
      }
      
      originalSend.call(this, data);
    } catch (error) {
      console.error('Erro ao filtrar dados:', error);
      originalSend.call(this, data);
    }
  };
  
  next();
};

// Função para filtrar dados financeiros
const filterFinancialData = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => filterFinancialData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const filtered = { ...data };
    
    // Campos que auxiliares não podem ver
    const financialFields = [
      'valor', 'preco', 'custo', 'lucro', 'receita', 'despesa',
      'saldo', 'total', 'comissao', 'taxa', 'imposto'
    ];
    
    financialFields.forEach(field => {
      if (filtered[field] !== undefined) {
        filtered[field] = '[RESTRITO]';
      }
    });
    
    // Filtrar objetos aninhados
    Object.keys(filtered).forEach(key => {
      if (typeof filtered[key] === 'object') {
        filtered[key] = filterFinancialData(filtered[key]);
      }
    });
    
    return filtered;
  }
  
  return data;
};

// Middleware para log de atividades
const logActivity = (action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const userRole = req.userRole;
      
      // Log da atividade
      console.log(`[${new Date().toISOString()}] ${userRole.toUpperCase()} ${userId}: ${action}`);
      
      next();
    } catch (error) {
      console.error('Erro no log de atividade:', error);
      next();
    }
  };
};

module.exports = {
  checkPermission,
  requireAdmin,
  requireOwner,
  filterDataByRole,
  logActivity
};
