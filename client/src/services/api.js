/**
 * Serviço de API
 * 
 * Configuração do Axios e funções para comunicação
 * com o backend da aplicação.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import axios from 'axios';
import toast from 'react-hot-toast';

// Configuração base do Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://web-production-8843.up.railway.app/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se erro 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });

          const { token } = response.data.data;
          localStorage.setItem('token', token);
          
          // Retry da requisição original
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh falhou, fazer logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Tratar erros específicos
    if (error.response?.status === 403) {
      toast.error('Acesso negado');
    } else if (error.response?.status === 404) {
      toast.error('Recurso não encontrado');
    } else if (error.response?.status === 500) {
      toast.error('Erro interno do servidor');
    } else if (error.code === 'NETWORK_ERROR') {
      toast.error('Erro de conexão. Verifique sua internet.');
    }

    return Promise.reject(error);
  }
);

// ==================== AUTENTICAÇÃO ====================

export const authAPI = {
  // Login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Registro
  register: (userData) => api.post('/auth/register', userData),
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Obter dados do usuário
  getMe: () => api.get('/auth/me'),
  
  // Renovar token
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  
  // Verificar email
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  
  // Reenviar verificação
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  
  // Recuperar senha
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Redefinir senha
  resetPassword: (token, newPassword) => 
    api.post('/auth/reset-password', { token, novaSenha: newPassword }),
  
  // Configurar token de autenticação
  setAuthToken: (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  // Remover token de autenticação
  removeAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  },
};

// ==================== CONTAS ====================

export const accountsAPI = {
  // Listar contas
  getAccounts: (params) => api.get('/accounts', { params }),
  
  // Obter conta específica
  getAccount: (id) => api.get(`/accounts/${id}`),
  
  // Criar conta
  createAccount: (data) => api.post('/accounts', data),
  
  // Atualizar conta
  updateAccount: (id, data) => api.put(`/accounts/${id}`, data),
  
  // Deletar conta
  deleteAccount: (id) => api.delete(`/accounts/${id}`),
  
  // Sincronizar saldo
  syncBalance: (id, data) => api.post(`/accounts/${id}/sync`, data),
  
  // CPFs
  getCPFs: (id) => api.get(`/accounts/${id}/cpfs`),
  addCPF: (id, data) => api.post(`/accounts/${id}/cpfs`, data),
  updateCPF: (id, cpfId, data) => api.put(`/accounts/${id}/cpfs/${cpfId}`, data),
  
  // Alertas
  getAlerts: (id) => api.get(`/accounts/${id}/alerts`),
  addAlert: (id, data) => api.post(`/accounts/${id}/alerts`, data),
  markAlertAsRead: (id, alertId) => api.put(`/accounts/${id}/alerts/${alertId}/read`),
  
  // Upload
  uploadFile: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/accounts/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Estatísticas
  getStats: () => api.get('/accounts/stats/overview'),
};

// ==================== TRANSAÇÕES ====================

export const transactionsAPI = {
  // Listar transações
  getTransactions: (params) => api.get('/transactions', { params }),
  
  // Obter transação específica
  getTransaction: (id) => api.get(`/transactions/${id}`),
  
  // Criar transação
  createTransaction: (data) => api.post('/transactions', data),
  
  // Atualizar transação
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),
  
  // Deletar transação
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
  
  // Upload de comprovante
  uploadReceipt: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/transactions/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Estatísticas
  getStats: (params) => api.get('/transactions/stats/overview', { params }),
  
  // Análise de performance
  getPerformance: (params) => api.get('/transactions/analytics/performance', { params }),
  
  // Importar transações
  importTransactions: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/transactions/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// ==================== DASHBOARD ====================

export const dashboardAPI = {
  // Visão geral
  getOverview: () => api.get('/dashboard/overview'),
  
  // Métricas
  getMetrics: (params) => api.get('/dashboard/metrics', { params }),
  
  // Alertas
  getAlerts: () => api.get('/dashboard/alerts'),
  
  // KPIs
  getKPIs: () => api.get('/dashboard/kpis'),
};

// ==================== RELATÓRIOS ====================

export const reportsAPI = {
  // Relatório financeiro
  getFinancialReport: (params) => api.get('/reports/financial', { params }),
  
  // Relatório de contas
  getAccountsReport: (params) => api.get('/reports/accounts', { params }),
  
  // Relatório de IR
  getTaxReport: (params) => api.get('/reports/tax', { params }),
  
  // Relatório customizado
  getCustomReport: (data) => api.post('/reports/custom', data),
};

// ==================== USUÁRIOS ====================

export const usersAPI = {
  // Métodos básicos do Axios
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
  
  // Perfil
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  
  // Avatar
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Configurações
  updateSettings: (data) => api.put('/users/settings', data),
  
  // Estatísticas
  getStats: () => api.get('/users/stats'),
  
  // Metas
  getGoals: (params) => api.get('/users/goals', { params }),
  createGoal: (data) => api.post('/users/goals', data),
  updateGoal: (id, data) => api.put(`/users/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/users/goals/${id}`),
  
  // Conquistas
  getAchievements: (params) => api.get('/users/achievements', { params }),
  
  // Atividade
  getActivity: (params) => api.get('/users/activity', { params }),
  
  // Deletar conta
  deleteAccount: (data) => api.delete('/users/account', { data }),
};

// ==================== NOTIFICAÇÕES ====================

export const notificationsAPI = {
  // Listar notificações
  getNotifications: (params) => api.get('/notifications', { params }),
  
  // Contar não lidas
  getUnreadCount: () => api.get('/notifications/unread'),
  
  // Marcar como lida
  markAsRead: (notificationId, data) => 
    api.put(`/notifications/${notificationId}/read`, data),
  
  // Marcar todas como lidas
  markAllAsRead: () => api.put('/notifications/read-all'),
  
  // Configurações
  getSettings: () => api.get('/notifications/settings'),
  updateSettings: (data) => api.put('/notifications/settings', data),
  
  // Teste
  sendTest: (data) => api.post('/notifications/test', data),
  
  // Alertas do sistema
  getSystemAlerts: () => api.get('/notifications/alerts/system'),
  
  // Push notifications
  subscribe: (data) => api.post('/notifications/subscribe', data),
  unsubscribe: (data) => api.delete('/notifications/unsubscribe', { data }),
};

// ==================== PROGRAMAS ====================

export const programsAPI = {
  // Listar programas
  getPrograms: (params) => api.get('/programs', { params }),
  
  // Obter programa específico
  getProgram: (id) => api.get(`/programs/${id}`),
  
  // Criar programa
  createProgram: (data) => api.post('/programs', data),
  
  // Atualizar programa
  updateProgram: (id, data) => api.put(`/programs/${id}`, data),
  
  // Deletar programa
  deleteProgram: (id) => api.delete(`/programs/${id}`),
  
  // Estatísticas
  getStats: () => api.get('/programs/stats'),
};

// ==================== UTILITÁRIOS ====================

export const utilsAPI = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Upload genérico
  uploadFile: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Exportar instância do axios para uso direto
export default api;
