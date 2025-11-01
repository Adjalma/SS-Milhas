/**
 * API Service - Dashboard
 * 
 * Serviço para integração com endpoints do dashboard
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import api from './api';

// ==================== ESTATÍSTICAS GERAIS ====================

/**
 * Obter estatísticas gerais do dashboard
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    throw error;
  }
};

/**
 * Obter métricas financeiras resumidas
 */
export const getFinancialMetrics = async () => {
  try {
    const response = await api.get('/dashboard/financial-metrics');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar métricas financeiras:', error);
    throw error;
  }
};

/**
 * Obter atividades recentes
 */
export const getRecentActivity = async (limit = 10) => {
  try {
    const response = await api.get('/dashboard/recent-activity', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar atividades recentes:', error);
    throw error;
  }
};

/**
 * Obter alertas e notificações
 */
export const getAlerts = async () => {
  try {
    const response = await api.get('/dashboard/alerts');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    throw error;
  }
};

// ==================== GRÁFICOS E ANÁLISES ====================

/**
 * Obter dados para gráfico de evolução
 */
export const getEvolutionChartData = async (period = '30d') => {
  try {
    const response = await api.get('/dashboard/evolution-chart', {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados de evolução:', error);
    throw error;
  }
};

/**
 * Obter dados para gráfico de distribuição
 */
export const getDistributionChartData = async (type = 'programs') => {
  try {
    const response = await api.get('/dashboard/distribution-chart', {
      params: { type }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados de distribuição:', error);
    throw error;
  }
};

/**
 * Obter comparativo mensal
 */
export const getMonthlyComparison = async () => {
  try {
    const response = await api.get('/dashboard/monthly-comparison');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar comparativo mensal:', error);
    throw error;
  }
};

// ==================== RESUMOS ====================

/**
 * Obter resumo de movimentações
 */
export const getMovementsSummary = async () => {
  try {
    const response = await api.get('/dashboard/movements-summary');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar resumo de movimentações:', error);
    throw error;
  }
};

/**
 * Obter resumo de tarefas
 */
export const getTasksSummary = async () => {
  try {
    const response = await api.get('/dashboard/tasks-summary');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar resumo de tarefas:', error);
    throw error;
  }
};

/**
 * Obter top programas
 */
export const getTopPrograms = async (limit = 5) => {
  try {
    const response = await api.get('/dashboard/top-programs', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar top programas:', error);
    throw error;
  }
};

/**
 * Obter top clientes
 */
export const getTopClients = async (limit = 5) => {
  try {
    const response = await api.get('/dashboard/top-clients', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar top clientes:', error);
    throw error;
  }
};

// ==================== METAS E OBJETIVOS ====================

/**
 * Obter progresso de metas
 */
export const getGoalsProgress = async () => {
  try {
    const response = await api.get('/dashboard/goals-progress');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar progresso de metas:', error);
    throw error;
  }
};

/**
 * Atualizar meta
 */
export const updateGoal = async (goalId, data) => {
  try {
    const response = await api.put(`/dashboard/goals/${goalId}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    throw error;
  }
};

// ==================== WIDGETS PERSONALIZADOS ====================

/**
 * Obter configuração de widgets do usuário
 */
export const getWidgetConfig = async () => {
  try {
    const response = await api.get('/dashboard/widget-config');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar configuração de widgets:', error);
    throw error;
  }
};

/**
 * Salvar configuração de widgets
 */
export const saveWidgetConfig = async (config) => {
  try {
    const response = await api.post('/dashboard/widget-config', config);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar configuração de widgets:', error);
    throw error;
  }
};

// ==================== EXPORTAÇÃO ====================

/**
 * Exportar dados do dashboard
 */
export const exportDashboardData = async (format = 'pdf') => {
  try {
    const response = await api.get('/dashboard/export', {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    throw error;
  }
};

export default {
  // Estatísticas
  getDashboardStats,
  getFinancialMetrics,
  getRecentActivity,
  getAlerts,
  
  // Gráficos
  getEvolutionChartData,
  getDistributionChartData,
  getMonthlyComparison,
  
  // Resumos
  getMovementsSummary,
  getTasksSummary,
  getTopPrograms,
  getTopClients,
  
  // Metas
  getGoalsProgress,
  updateGoal,
  
  // Widgets
  getWidgetConfig,
  saveWidgetConfig,
  
  // Exportação
  exportDashboardData
};

