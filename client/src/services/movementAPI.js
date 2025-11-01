/**
 * API de Movimentações
 * 
 * Serviço para comunicação com o backend de movimentações
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

import api from './api';

const movementAPI = {
  // ==================== MOVIMENTAÇÕES ====================

  /**
   * Listar movimentações com filtros
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/movements', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Buscar movimentação por ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/movements/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Criar nova movimentação
   */
  create: async (data) => {
    try {
      const response = await api.post('/movements', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Atualizar movimentação
   */
  update: async (id, data) => {
    try {
      const response = await api.put(`/movements/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Deletar movimentação
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/movements/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Processar movimentação pendente
   */
  process: async (id) => {
    try {
      const response = await api.post(`/movements/${id}/process`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cancelar movimentação
   */
  cancel: async (id, motivo = '') => {
    try {
      const response = await api.post(`/movements/${id}/cancel`, { motivo });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obter estatísticas
   */
  getStats: async (params = {}) => {
    try {
      const response = await api.get('/movements/stats/summary', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Listar movimentações pendentes
   */
  getPending: async () => {
    try {
      const response = await api.get('/movements/pending/list');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ==================== AGENDAMENTOS ====================

  /**
   * Listar agendamentos
   */
  getScheduled: async (params = {}) => {
    try {
      const response = await api.get('/movements/scheduled/list', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Buscar agendamento por ID
   */
  getScheduledById: async (id) => {
    try {
      const response = await api.get(`/movements/schedule/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Criar agendamento
   */
  createScheduled: async (data) => {
    try {
      const response = await api.post('/movements/schedule', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Atualizar agendamento
   */
  updateScheduled: async (id, data) => {
    try {
      const response = await api.put(`/movements/schedule/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Deletar agendamento
   */
  deleteScheduled: async (id) => {
    try {
      const response = await api.delete(`/movements/schedule/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Pausar agendamento
   */
  pauseScheduled: async (id, motivo = '') => {
    try {
      const response = await api.post(`/movements/schedule/${id}/pause`, { motivo });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Retomar agendamento
   */
  resumeScheduled: async (id) => {
    try {
      const response = await api.post(`/movements/schedule/${id}/resume`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Executar agendamento manualmente
   */
  executeScheduled: async (id) => {
    try {
      const response = await api.post(`/movements/schedule/${id}/execute`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Listar agendamentos prontos para executar
   */
  getScheduledReady: async () => {
    try {
      const response = await api.get('/movements/scheduled/ready');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ==================== HELPERS ====================

  /**
   * Criar compra de entrada
   */
  createPurchase: async (data) => {
    return movementAPI.create({
      tipo: 'compra',
      subtipo: 'entrada',
      status: 'pendente',
      ...data
    });
  },

  /**
   * Criar compra bonificada
   */
  createBonusPurchase: async (data) => {
    return movementAPI.create({
      tipo: 'compra',
      subtipo: 'bonificada',
      status: 'pendente',
      ...data
    });
  },

  /**
   * Criar venda
   */
  createSale: async (data) => {
    return movementAPI.create({
      tipo: 'venda',
      status: 'pendente',
      ...data
    });
  },

  /**
   * Criar transferência entre contas
   */
  createTransfer: async (data) => {
    return movementAPI.create({
      tipo: 'transferencia',
      subtipo: 'entre_contas',
      status: 'pendente',
      ...data
    });
  },

  /**
   * Criar transferência entre pessoas
   */
  createPersonTransfer: async (data) => {
    return movementAPI.create({
      tipo: 'transferencia',
      subtipo: 'entre_pessoas',
      status: 'pendente',
      ...data
    });
  },

  /**
   * Criar passagem
   */
  createFlight: async (data) => {
    return movementAPI.create({
      tipo: 'passagem',
      status: 'pendente',
      ...data
    });
  },

  /**
   * Criar saída manual
   */
  createManualExit: async (data) => {
    return movementAPI.create({
      tipo: 'saida_manual',
      status: 'pendente',
      ...data
    });
  }
};

export default movementAPI;

