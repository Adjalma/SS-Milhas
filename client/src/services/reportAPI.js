/**
 * API Service - Relatórios
 * 
 * Serviço para integração com endpoints de relatórios
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import api from './api';

// ==================== RELATÓRIOS GERAIS ====================

/**
 * Gerar relatório personalizado
 */
export const generateReport = async (type, filters = {}) => {
  try {
    const response = await api.post('/reports/generate', {
      type,
      ...filters
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    throw error;
  }
};

/**
 * Listar relatórios salvos
 */
export const getSavedReports = async () => {
  try {
    const response = await api.get('/reports/saved');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar relatórios salvos:', error);
    throw error;
  }
};

/**
 * Obter relatório por ID
 */
export const getReportById = async (id) => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar relatório:', error);
    throw error;
  }
};

// ==================== RELATÓRIOS FINANCEIROS ====================

/**
 * Relatório de receitas e despesas
 */
export const getIncomeExpenseReport = async (startDate, endDate) => {
  try {
    const response = await api.get('/reports/income-expense', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de receitas e despesas:', error);
    throw error;
  }
};

/**
 * Relatório de fluxo de caixa
 */
export const getCashFlowReport = async (startDate, endDate) => {
  try {
    const response = await api.get('/reports/cash-flow', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de fluxo de caixa:', error);
    throw error;
  }
};

/**
 * Relatório de lucro
 */
export const getProfitReport = async (period = 'month') => {
  try {
    const response = await api.get('/reports/profit', {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de lucro:', error);
    throw error;
  }
};

// ==================== RELATÓRIOS DE MOVIMENTAÇÕES ====================

/**
 * Relatório de vendas
 */
export const getSalesReport = async (filters = {}) => {
  try {
    const response = await api.get('/reports/sales', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de vendas:', error);
    throw error;
  }
};

/**
 * Relatório de compras
 */
export const getPurchasesReport = async (filters = {}) => {
  try {
    const response = await api.get('/reports/purchases', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de compras:', error);
    throw error;
  }
};

/**
 * Relatório de transferências
 */
export const getTransfersReport = async (filters = {}) => {
  try {
    const response = await api.get('/reports/transfers', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de transferências:', error);
    throw error;
  }
};

/**
 * Relatório de passagens
 */
export const getTicketsReport = async (filters = {}) => {
  try {
    const response = await api.get('/reports/tickets', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de passagens:', error);
    throw error;
  }
};

// ==================== RELATÓRIOS DE CPF ====================

/**
 * Relatório de controle de CPF
 */
export const getCPFControlReport = async () => {
  try {
    const response = await api.get('/reports/cpf-control');
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de controle de CPF:', error);
    throw error;
  }
};

/**
 * Relatório de utilização de CPFs
 */
export const getCPFUsageReport = async (startDate, endDate) => {
  try {
    const response = await api.get('/reports/cpf-usage', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de utilização de CPFs:', error);
    throw error;
  }
};

// ==================== RELATÓRIOS DE PROGRAMAS ====================

/**
 * Relatório por programa
 */
export const getProgramReport = async (programId, startDate, endDate) => {
  try {
    const response = await api.get(`/reports/program/${programId}`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de programa:', error);
    throw error;
  }
};

/**
 * Comparativo de programas
 */
export const getProgramsComparison = async (startDate, endDate) => {
  try {
    const response = await api.get('/reports/programs-comparison', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar comparativo de programas:', error);
    throw error;
  }
};

// ==================== RELATÓRIOS DE CLIENTES ====================

/**
 * Relatório de clientes
 */
export const getClientsReport = async () => {
  try {
    const response = await api.get('/reports/clients');
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de clientes:', error);
    throw error;
  }
};

/**
 * Relatório de histórico do cliente
 */
export const getClientHistoryReport = async (clientId) => {
  try {
    const response = await api.get(`/reports/client/${clientId}/history`);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de histórico do cliente:', error);
    throw error;
  }
};

// ==================== EXPORTAÇÃO ====================

/**
 * Exportar relatório em PDF
 */
export const exportReportPDF = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}/export/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao exportar relatório em PDF:', error);
    throw error;
  }
};

/**
 * Exportar relatório em Excel
 */
export const exportReportExcel = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}/export/excel`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao exportar relatório em Excel:', error);
    throw error;
  }
};

/**
 * Exportar relatório em CSV
 */
export const exportReportCSV = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}/export/csv`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao exportar relatório em CSV:', error);
    throw error;
  }
};

// ==================== AGENDAMENTO ====================

/**
 * Agendar relatório recorrente
 */
export const scheduleReport = async (reportConfig) => {
  try {
    const response = await api.post('/reports/schedule', reportConfig);
    return response.data;
  } catch (error) {
    console.error('Erro ao agendar relatório:', error);
    throw error;
  }
};

/**
 * Listar relatórios agendados
 */
export const getScheduledReports = async () => {
  try {
    const response = await api.get('/reports/scheduled');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar relatórios agendados:', error);
    throw error;
  }
};

/**
 * Cancelar relatório agendado
 */
export const cancelScheduledReport = async (scheduleId) => {
  try {
    const response = await api.delete(`/reports/scheduled/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao cancelar relatório agendado:', error);
    throw error;
  }
};

export default {
  // Gerais
  generateReport,
  getSavedReports,
  getReportById,
  
  // Financeiros
  getIncomeExpenseReport,
  getCashFlowReport,
  getProfitReport,
  
  // Movimentações
  getSalesReport,
  getPurchasesReport,
  getTransfersReport,
  getTicketsReport,
  
  // CPF
  getCPFControlReport,
  getCPFUsageReport,
  
  // Programas
  getProgramReport,
  getProgramsComparison,
  
  // Clientes
  getClientsReport,
  getClientHistoryReport,
  
  // Exportação
  exportReportPDF,
  exportReportExcel,
  exportReportCSV,
  
  // Agendamento
  scheduleReport,
  getScheduledReports,
  cancelScheduledReport
};

