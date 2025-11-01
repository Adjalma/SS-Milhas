/**
 * Middleware de Validação de Entrada - Sistema de Gestão de Milhas
 * 
 * Implementa validação robusta de entrada usando Joi para proteger
 * contra injeção de dados maliciosos e garantir integridade dos dados.
 * 
 * @author Especialista em Segurança
 * @version 1.0.0
 */

const Joi = require('joi');

/**
 * Schemas de validação comuns
 */
const commonSchemas = {
  // ObjectId do MongoDB
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('ID inválido'),
  
  // Email
  email: Joi.string().email().lowercase().trim().max(255),
  
  // Senha forte
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .message('Senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos'),
  
  // Senha simples (para primeiro acesso)
  simplePassword: Joi.string().min(6).max(128),
  
  // Nome
  name: Joi.string().trim().min(2).max(100).pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
  
  // CPF
  cpf: Joi.string().length(11).pattern(/^[0-9]{11}$/),
  
  // CNPJ
  cnpj: Joi.string().length(14).pattern(/^[0-9]{14}$/),
  
  // Telefone
  phone: Joi.string().pattern(/^[0-9]{10,11}$/),
  
  // Valor monetário
  money: Joi.number().min(0).max(999999999.99).precision(2),
  
  // Data
  date: Joi.date().iso(),
  
  // Paginação
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  
  // Sorting
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'nome', 'email', 'valor', 'data'),
  sortOrder: Joi.string().valid('asc', 'desc', '1', '-1'),
  
  // URL
  url: Joi.string().uri(),
  
  // Status genérico
  status: Joi.string().valid('ativo', 'inativo', 'pendente', 'cancelado'),
};

/**
 * Schemas de validação para autenticação
 */
const authSchemas = {
  // Registro
  register: Joi.object({
    nome: commonSchemas.name.required(),
    email: commonSchemas.email.required(),
    senha: commonSchemas.password.required(),
    confirmSenha: Joi.string().valid(Joi.ref('senha')).required()
      .messages({ 'any.only': 'As senhas não coincidem' }),
    telefone: commonSchemas.phone,
    cpf: commonSchemas.cpf,
    aceitouTermos: Joi.boolean().valid(true).required()
  }),
  
  // Login
  login: Joi.object({
    email: commonSchemas.email.required(),
    senha: Joi.string().required(),
    lembrarMe: Joi.boolean()
  }),
  
  // Recuperação de senha
  forgotPassword: Joi.object({
    email: commonSchemas.email.required()
  }),
  
  // Reset de senha
  resetPassword: Joi.object({
    token: Joi.string().required(),
    senha: commonSchemas.password.required(),
    confirmSenha: Joi.string().valid(Joi.ref('senha')).required()
      .messages({ 'any.only': 'As senhas não coincidem' })
  }),
  
  // Mudança de senha
  changePassword: Joi.object({
    senhaAtual: Joi.string().required(),
    novaSenha: commonSchemas.password.required(),
    confirmNovaSenha: Joi.string().valid(Joi.ref('novaSenha')).required()
      .messages({ 'any.only': 'As senhas não coincidem' })
  })
};

/**
 * Schemas de validação para usuários
 */
const userSchemas = {
  // Criar usuário
  create: Joi.object({
    nome: commonSchemas.name.required(),
    email: commonSchemas.email.required(),
    senha: commonSchemas.simplePassword.required(),
    role: Joi.string().valid('admin', 'manager', 'user').default('user'),
    telefone: commonSchemas.phone,
    cpf: commonSchemas.cpf,
    permissions: Joi.object({
      financeiro: Joi.boolean().default(false),
      valores: Joi.boolean().default(false),
      relatorios: Joi.boolean().default(false),
      monitoramento: Joi.boolean().default(false),
      cadastros: Joi.boolean().default(false)
    })
  }),
  
  // Atualizar usuário
  update: Joi.object({
    nome: commonSchemas.name,
    telefone: commonSchemas.phone,
    role: Joi.string().valid('admin', 'manager', 'user'),
    status: Joi.string().valid('ativo', 'inativo', 'suspenso'),
    permissions: Joi.object({
      financeiro: Joi.boolean(),
      valores: Joi.boolean(),
      relatorios: Joi.boolean(),
      monitoramento: Joi.boolean(),
      cadastros: Joi.boolean()
    })
  }).min(1),
  
  // ID do usuário
  userId: Joi.object({
    id: commonSchemas.objectId.required()
  })
};

/**
 * Schemas de validação para movimentações
 */
const movementSchemas = {
  // Criar movimentação
  create: Joi.object({
    tipo: Joi.string().valid('compra', 'venda', 'transferencia', 'bonificacao', 'expiracao', 'estorno').required(),
    programa: Joi.string().required(),
    quantidade: Joi.number().integer().min(1).required(),
    valorUnitario: commonSchemas.money,
    valorTotal: commonSchemas.money,
    cpf: commonSchemas.cpf.required(),
    data: commonSchemas.date.default(() => new Date()),
    descricao: Joi.string().max(500),
    comprovante: Joi.string().uri(),
    status: Joi.string().valid('pendente', 'confirmado', 'cancelado').default('pendente'),
    metadata: Joi.object()
  }),
  
  // Atualizar movimentação
  update: Joi.object({
    status: Joi.string().valid('pendente', 'confirmado', 'cancelado'),
    descricao: Joi.string().max(500),
    comprovante: Joi.string().uri(),
    metadata: Joi.object()
  }).min(1),
  
  // Query parameters para listagem
  query: Joi.object({
    tipo: Joi.string().valid('compra', 'venda', 'transferencia', 'bonificacao', 'expiracao', 'estorno'),
    programa: Joi.string(),
    cpf: commonSchemas.cpf,
    status: Joi.string().valid('pendente', 'confirmado', 'cancelado'),
    dataInicio: commonSchemas.date,
    dataFim: commonSchemas.date,
    page: commonSchemas.page,
    limit: commonSchemas.limit,
    sortBy: commonSchemas.sortBy,
    sortOrder: commonSchemas.sortOrder
  })
};

/**
 * Schemas de validação para financeiro
 */
const financialSchemas = {
  // Criar receita/despesa
  createTransaction: Joi.object({
    tipo: Joi.string().valid('receita', 'despesa').required(),
    categoria: Joi.string().required(),
    valor: commonSchemas.money.required(),
    data: commonSchemas.date.default(() => new Date()),
    descricao: Joi.string().max(500),
    metodoPagamento: Joi.string().valid('dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'transferencia', 'boleto'),
    status: Joi.string().valid('pendente', 'pago', 'recebido', 'cancelado').default('pendente'),
    recorrente: Joi.boolean().default(false),
    frequencia: Joi.when('recorrente', {
      is: true,
      then: Joi.string().valid('diaria', 'semanal', 'quinzenal', 'mensal', 'trimestral', 'semestral', 'anual').required()
    }),
    tags: Joi.array().items(Joi.string()),
    anexos: Joi.array().items(Joi.string().uri())
  }),
  
  // Criar conta bancária
  createAccount: Joi.object({
    banco: Joi.string().required(),
    agencia: Joi.string().required(),
    conta: Joi.string().required(),
    tipo: Joi.string().valid('corrente', 'poupanca', 'investimento').required(),
    saldoInicial: commonSchemas.money.default(0),
    ativo: Joi.boolean().default(true)
  }),
  
  // Criar cartão
  createCard: Joi.object({
    nome: Joi.string().required(),
    bandeira: Joi.string().valid('visa', 'mastercard', 'elo', 'amex', 'hipercard', 'outros').required(),
    tipo: Joi.string().valid('credito', 'debito', 'multiplo').required(),
    numero: Joi.string().pattern(/^[0-9]{4}$/).required(),
    limite: commonSchemas.money,
    diaFechamento: Joi.number().integer().min(1).max(31),
    diaVencimento: Joi.number().integer().min(1).max(31),
    ativo: Joi.boolean().default(true)
  })
};

/**
 * Schemas de validação para tarefas
 */
const taskSchemas = {
  // Criar tarefa
  create: Joi.object({
    titulo: Joi.string().required().max(200),
    descricao: Joi.string().max(2000),
    status: Joi.string().valid('todo', 'in_progress', 'review', 'done').default('todo'),
    prioridade: Joi.string().valid('baixa', 'media', 'alta', 'urgente').default('media'),
    dataInicio: commonSchemas.date,
    dataVencimento: commonSchemas.date,
    atribuidoPara: commonSchemas.objectId,
    tags: Joi.array().items(Joi.string()),
    checklist: Joi.array().items(Joi.object({
      item: Joi.string().required(),
      concluido: Joi.boolean().default(false)
    }))
  }),
  
  // Atualizar tarefa
  update: Joi.object({
    titulo: Joi.string().max(200),
    descricao: Joi.string().max(2000),
    status: Joi.string().valid('todo', 'in_progress', 'review', 'done'),
    prioridade: Joi.string().valid('baixa', 'media', 'alta', 'urgente'),
    dataVencimento: commonSchemas.date,
    atribuidoPara: commonSchemas.objectId,
    tags: Joi.array().items(Joi.string()),
    checklist: Joi.array().items(Joi.object({
      item: Joi.string().required(),
      concluido: Joi.boolean()
    }))
  }).min(1)
};

/**
 * Middleware de validação genérico
 * @param {Object} schema - Schema Joi para validação
 * @param {String} source - Fonte dos dados (body, params, query)
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];
    
    const options = {
      abortEarly: false, // Retornar todos os erros
      stripUnknown: true, // Remover campos desconhecidos
      errors: {
        wrap: {
          label: '' // Remover labels dos erros
        }
      }
    };
    
    const { error, value } = schema.validate(dataToValidate, options);
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        code: 'VALIDATION_ERROR',
        errors
      });
    }
    
    // Substituir dados validados
    req[source] = value;
    next();
  };
};

/**
 * Middleware para validar múltiplas fontes
 */
const validateAll = (schemas) => {
  return (req, res, next) => {
    const errors = [];
    
    Object.keys(schemas).forEach(source => {
      const schema = schemas[source];
      const { error, value } = schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true
      });
      
      if (error) {
        error.details.forEach(detail => {
          errors.push({
            source,
            field: detail.path.join('.'),
            message: detail.message,
            type: detail.type
          });
        });
      } else {
        req[source] = value;
      }
    });
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        code: 'VALIDATION_ERROR',
        errors
      });
    }
    
    next();
  };
};

/**
 * Validação customizada para CPF
 */
const validateCPF = (cpf) => {
  if (!cpf || cpf.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validar dígitos verificadores
  let soma = 0;
  let resto;
  
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};

/**
 * Validação customizada para CNPJ
 */
const validateCNPJ = (cnpj) => {
  if (!cnpj || cnpj.length !== 14) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  // Validar dígitos verificadores
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
};

/**
 * Middleware para validar CPF
 */
const validateCPFMiddleware = (req, res, next) => {
  const cpf = req.body.cpf || req.params.cpf || req.query.cpf;
  
  if (cpf && !validateCPF(cpf)) {
    return res.status(400).json({
      success: false,
      message: 'CPF inválido',
      code: 'INVALID_CPF'
    });
  }
  
  next();
};

/**
 * Middleware para validar CNPJ
 */
const validateCNPJMiddleware = (req, res, next) => {
  const cnpj = req.body.cnpj || req.params.cnpj || req.query.cnpj;
  
  if (cnpj && !validateCNPJ(cnpj)) {
    return res.status(400).json({
      success: false,
      message: 'CNPJ inválido',
      code: 'INVALID_CNPJ'
    });
  }
  
  next();
};

module.exports = {
  // Função principal de validação
  validate,
  validateAll,
  
  // Schemas
  commonSchemas,
  authSchemas,
  userSchemas,
  movementSchemas,
  financialSchemas,
  taskSchemas,
  
  // Validações customizadas
  validateCPF,
  validateCNPJ,
  validateCPFMiddleware,
  validateCNPJMiddleware
};

