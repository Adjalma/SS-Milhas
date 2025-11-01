/**
 * Utilitários de Segurança - Frontend
 * 
 * Funções e classes para implementar segurança no frontend,
 * incluindo sanitização XSS, armazenamento seguro e proteção CSRF.
 * 
 * @author Especialista em Segurança
 * @version 1.0.0
 */

import DOMPurify from 'dompurify';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

// ==================== SANITIZAÇÃO XSS ====================

/**
 * Classe para sanitização de HTML e prevenção de XSS
 */
export class XSSProtection {
  /**
   * Sanitiza HTML usando DOMPurify
   * @param {string} dirty - HTML não sanitizado
   * @param {object} config - Configurações do DOMPurify
   * @returns {string} HTML sanitizado
   */
  static sanitizeHTML(dirty, config = {}) {
    const defaultConfig = {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol'],
      ALLOWED_ATTR: ['href', 'title', 'target'],
      ALLOW_DATA_ATTR: false,
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      ...config
    };
    
    return DOMPurify.sanitize(dirty, defaultConfig);
  }

  /**
   * Remove completamente todas as tags HTML
   * @param {string} str - String com HTML
   * @returns {string} String sem tags HTML
   */
  static stripHTML(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '');
  }

  /**
   * Escapa caracteres HTML
   * @param {string} str - String para escapar
   * @returns {string} String escapada
   */
  static escapeHTML(str) {
    if (!str) return '';
    
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    
    return str.replace(/[&<>"'/]/g, char => escapeMap[char]);
  }

  /**
   * Sanitiza URLs para prevenir javascript: e data: URIs
   * @param {string} url - URL para sanitizar
   * @returns {string} URL sanitizada ou '#' se inválida
   */
  static sanitizeURL(url) {
    if (!url) return '#';
    
    const dangerous = /^(javascript|data|vbscript):/i;
    if (dangerous.test(url)) {
      console.warn('URL perigosa detectada e bloqueada:', url);
      return '#';
    }
    
    return url;
  }

  /**
   * Valida e sanitiza JSON
   * @param {string} jsonString - String JSON
   * @returns {object|null} Objeto parseado ou null se inválido
   */
  static sanitizeJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Remover propriedades perigosas
      const dangerous = ['__proto__', 'constructor', 'prototype'];
      const clean = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;
        
        if (Array.isArray(obj)) {
          return obj.map(item => clean(item));
        }
        
        const cleaned = {};
        for (const key in obj) {
          if (!dangerous.includes(key) && obj.hasOwnProperty(key)) {
            cleaned[key] = clean(obj[key]);
          }
        }
        return cleaned;
      };
      
      return clean(parsed);
    } catch (error) {
      console.error('Erro ao parsear JSON:', error);
      return null;
    }
  }
}

// ==================== ARMAZENAMENTO SEGURO ====================

/**
 * Classe para armazenamento seguro de dados sensíveis
 */
export class SecureStorage {
  constructor() {
    this.secretKey = process.env.REACT_APP_ENCRYPTION_KEY || 'default-secret-key-change-me';
  }

  /**
   * Criptografa dados antes de armazenar
   * @param {string} data - Dados para criptografar
   * @returns {string} Dados criptografados
   */
  encrypt(data) {
    try {
      return CryptoJS.AES.encrypt(data, this.secretKey).toString();
    } catch (error) {
      console.error('Erro ao criptografar:', error);
      return null;
    }
  }

  /**
   * Descriptografa dados armazenados
   * @param {string} encryptedData - Dados criptografados
   * @returns {string} Dados descriptografados
   */
  decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Erro ao descriptografar:', error);
      return null;
    }
  }

  /**
   * Armazena dados de forma segura no localStorage
   * @param {string} key - Chave
   * @param {any} value - Valor (será convertido para JSON)
   */
  setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      const encryptedValue = this.encrypt(jsonValue);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Erro ao armazenar:', error);
    }
  }

  /**
   * Recupera dados do localStorage
   * @param {string} key - Chave
   * @returns {any} Valor parseado ou null
   */
  getItem(key) {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      
      const decryptedValue = this.decrypt(encryptedValue);
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error('Erro ao recuperar:', error);
      return null;
    }
  }

  /**
   * Remove item do localStorage
   * @param {string} key - Chave
   */
  removeItem(key) {
    localStorage.removeItem(key);
  }

  /**
   * Limpa todo o localStorage
   */
  clear() {
    localStorage.clear();
  }

  /**
   * Armazena token JWT de forma segura
   * @param {string} token - Token JWT
   */
  setToken(token) {
    this.setItem('auth_token', token);
  }

  /**
   * Recupera token JWT
   * @returns {string|null} Token ou null
   */
  getToken() {
    return this.getItem('auth_token');
  }

  /**
   * Remove token JWT
   */
  removeToken() {
    this.removeItem('auth_token');
  }
}

// ==================== PROTEÇÃO CSRF ====================

/**
 * Classe para gerenciamento de tokens CSRF
 */
export class CSRFProtection {
  /**
   * Armazena token CSRF do header da resposta
   * @param {object} response - Resposta da API
   */
  static storeToken(response) {
    const csrfToken = response.headers['x-csrf-token'];
    if (csrfToken) {
      Cookies.set('csrf_token', csrfToken, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
  }

  /**
   * Recupera token CSRF
   * @returns {string|null} Token CSRF ou null
   */
  static getToken() {
    return Cookies.get('csrf_token') || null;
  }

  /**
   * Adiciona token CSRF aos headers da requisição
   * @param {object} config - Configuração do axios
   * @returns {object} Configuração com token CSRF
   */
  static addTokenToRequest(config) {
    const token = this.getToken();
    if (token) {
      config.headers['X-CSRF-Token'] = token;
    }
    return config;
  }

  /**
   * Remove token CSRF
   */
  static removeToken() {
    Cookies.remove('csrf_token');
  }
}

// ==================== VALIDAÇÃO DE ENTRADA ====================

/**
 * Classe para validação de entrada do usuário
 */
export class InputValidation {
  /**
   * Valida email
   * @param {string} email - Email para validar
   * @returns {boolean} True se válido
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida CPF
   * @param {string} cpf - CPF para validar (apenas números)
   * @returns {boolean} True se válido
   */
  static isValidCPF(cpf) {
    if (!cpf || cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar dígitos verificadores
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }

  /**
   * Valida CNPJ
   * @param {string} cnpj - CNPJ para validar (apenas números)
   * @returns {boolean} True se válido
   */
  static isValidCNPJ(cnpj) {
    if (!cnpj || cnpj.length !== 14) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    // Validar dígitos verificadores
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += numbers.charAt(size - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;
    
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += numbers.charAt(size - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
  }

  /**
   * Valida força da senha
   * @param {string} password - Senha para validar
   * @returns {object} { valid: boolean, strength: string, errors: array }
   */
  static validatePassword(password) {
    const errors = [];
    let strength = 0;
    
    if (password.length < 8) {
      errors.push('Senha deve ter no mínimo 8 caracteres');
    } else {
      strength++;
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter letras minúsculas');
    } else {
      strength++;
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter letras maiúsculas');
    } else {
      strength++;
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Senha deve conter números');
    } else {
      strength++;
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Senha deve conter caracteres especiais');
    } else {
      strength++;
    }
    
    const strengthLevels = ['muito_fraca', 'fraca', 'media', 'forte', 'muito_forte'];
    
    return {
      valid: errors.length === 0,
      strength: strengthLevels[strength] || 'muito_fraca',
      errors
    };
  }

  /**
   * Sanitiza input removendo caracteres perigosos
   * @param {string} input - Input para sanitizar
   * @returns {string} Input sanitizado
   */
  static sanitizeInput(input) {
    if (!input) return '';
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Valida número de telefone brasileiro
   * @param {string} phone - Telefone para validar
   * @returns {boolean} True se válido
   */
  static isValidPhone(phone) {
    // Aceita formatos: (11) 98888-8888, (11) 8888-8888, 11988888888, 1188888888
    const phoneRegex = /^(?:\(?[1-9]{2}\)?\s?)?[9]?[0-9]{4}-?[0-9]{4}$/;
    return phoneRegex.test(phone);
  }
}

// ==================== RATE LIMITING CLIENTE ====================

/**
 * Classe para rate limiting no cliente
 */
export class ClientRateLimiter {
  constructor() {
    this.requests = new Map();
  }

  /**
   * Verifica se a ação pode ser executada
   * @param {string} action - Nome da ação
   * @param {number} maxRequests - Máximo de requisições permitidas
   * @param {number} windowMs - Janela de tempo em ms
   * @returns {boolean} True se permitido
   */
  canMakeRequest(action, maxRequests = 5, windowMs = 60000) {
    const now = Date.now();
    const actionData = this.requests.get(action) || { timestamps: [] };
    
    // Filtrar timestamps dentro da janela
    actionData.timestamps = actionData.timestamps.filter(
      time => now - time < windowMs
    );
    
    // Verificar se excedeu o limite
    if (actionData.timestamps.length >= maxRequests) {
      const oldestTimestamp = actionData.timestamps[0];
      const timeToWait = windowMs - (now - oldestTimestamp);
      
      console.warn(`Rate limit excedido para ${action}. Aguarde ${Math.ceil(timeToWait / 1000)}s`);
      return false;
    }
    
    // Adicionar timestamp atual
    actionData.timestamps.push(now);
    this.requests.set(action, actionData);
    
    return true;
  }

  /**
   * Reseta o rate limiting para uma ação
   * @param {string} action - Nome da ação
   */
  reset(action) {
    this.requests.delete(action);
  }
}

// ==================== INSTÂNCIAS GLOBAIS ====================

export const xss = XSSProtection;
export const secureStorage = new SecureStorage();
export const csrf = CSRFProtection;
export const validation = InputValidation;
export const rateLimiter = new ClientRateLimiter();

// Exportar como default
export default {
  xss: XSSProtection,
  secureStorage,
  csrf: CSRFProtection,
  validation: InputValidation,
  rateLimiter
};

