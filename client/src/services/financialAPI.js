/**
 * API Service - Financeiro
 * 
 * Serviço para integração com endpoints financeiros do backend
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import api from './api';

// ==================== RECEITAS ====================

/**
 * Listar todas as receitas
 */
export const getIncomes = async (filters = {}) => {
  try {
    const response = await api.get('/financial/income', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    throw error;
  }
};

/**
 * Obter receita por ID
 */
export const getIncomeById = async (id) => {
  try {
    const response = await api.get(`/financial/income/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    throw error;
  }
};

/**
 * Criar nova receita
 */
export const createIncome = async (data) => {
  try {
    const response = await api.post('/financial/income', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar receita:', error);
    throw error;
  }
};

/**
 * Atualizar receita
 */
export const updateIncome = async (id, data) => {
  try {
    const response = await api.put(`/financial/income/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar receita:', error);
    throw error;
  }
};

/**
 * Deletar receita
 */
export const deleteIncome = async (id) => {
  try {
    const response = await api.delete(`/financial/income/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar receita:', error);
    throw error;
  }
};

// ==================== DESPESAS ====================

/**
 * Listar todas as despesas
 */
export const getExpenses = async (filters = {}) => {
  try {
    const response = await api.get('/financial/expense', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    throw error;
  }
};

/**
 * Obter despesa por ID
 */
export const getExpenseById = async (id) => {
  try {
    const response = await api.get(`/financial/expense/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar despesa:', error);
    throw error;
  }
};

/**
 * Criar nova despesa
 */
export const createExpense = async (data) => {
  try {
    const response = await api.post('/financial/expense', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    throw error;
  }
};

/**
 * Atualizar despesa
 */
export const updateExpense = async (id, data) => {
  try {
    const response = await api.put(`/financial/expense/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar despesa:', error);
    throw error;
  }
};

/**
 * Deletar despesa
 */
export const deleteExpense = async (id) => {
  try {
    const response = await api.delete(`/financial/expense/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar despesa:', error);
    throw error;
  }
};

// ==================== CONTAS BANCÁRIAS ====================

/**
 * Listar contas bancárias
 */
export const getBankAccounts = async () => {
  try {
    const response = await api.get('/financial/bank-accounts');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contas bancárias:', error);
    throw error;
  }
};

/**
 * Criar conta bancária
 */
export const createBankAccount = async (data) => {
  try {
    const response = await api.post('/financial/bank-accounts', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar conta bancária:', error);
    throw error;
  }
};

/**
 * Atualizar conta bancária
 */
export const updateBankAccount = async (id, data) => {
  try {
    const response = await api.put(`/financial/bank-accounts/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar conta bancária:', error);
    throw error;
  }
};

/**
 * Deletar conta bancária
 */
export const deleteBankAccount = async (id) => {
  try {
    const response = await api.delete(`/financial/bank-accounts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar conta bancária:', error);
    throw error;
  }
};

// ==================== CARTÕES ====================

/**
 * Listar cartões
 */
export const getCards = async () => {
  try {
    const response = await api.get('/financial/cards');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cartões:', error);
    throw error;
  }
};

/**
 * Criar cartão
 */
export const createCard = async (data) => {
  try {
    const response = await api.post('/financial/cards', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cartão:', error);
    throw error;
  }
};

/**
 * Atualizar cartão
 */
export const updateCard = async (id, data) => {
  try {
    const response = await api.put(`/financial/cards/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar cartão:', error);
    throw error;
  }
};

/**
 * Deletar cartão
 */
export const deleteCard = async (id) => {
  try {
    const response = await api.delete(`/financial/cards/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar cartão:', error);
    throw error;
  }
};

// ==================== FLUXO DE CAIXA ====================

/**
 * Listar fluxo de caixa
 */
export const getCashFlow = async (filters = {}) => {
  try {
    const response = await api.get('/financial/cash-flow', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar fluxo de caixa:', error);
    throw error;
  }
};

/**
 * Criar entrada de fluxo de caixa
 */
export const createCashFlow = async (data) => {
  try {
    const response = await api.post('/financial/cash-flow', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar fluxo de caixa:', error);
    throw error;
  }
};

// ==================== RESUMO FINANCEIRO ====================

/**
 * Obter resumo financeiro
 */
export const getFinancialSummary = async (startDate, endDate) => {
  try {
    const response = await api.get('/financial/summary', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar resumo financeiro:', error);
    throw error;
  }
};

/**
 * Obter estatísticas financeiras
 */
export const getFinancialStats = async () => {
  try {
    const response = await api.get('/financial/stats');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas financeiras:', error);
    throw error;
  }
};

// ==================== TRANSFERÊNCIAS ====================

/**
 * Criar transferência entre contas
 */
export const createTransfer = async (data) => {
  try {
    const response = await api.post('/financial/transfer', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar transferência:', error);
    throw error;
  }
};

export default {
  // Receitas
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
  
  // Despesas
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  
  // Contas Bancárias
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  
  // Cartões
  getCards,
  createCard,
  updateCard,
  deleteCard,
  
  // Fluxo de Caixa
  getCashFlow,
  createCashFlow,
  
  // Resumos
  getFinancialSummary,
  getFinancialStats,
  
  // Transferências
  createTransfer
};

