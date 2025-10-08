import api from './api';

// Serviços
const programService = {
  // Buscar todos os programas
  getAllPrograms: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.categoria) params.append('categoria', filters.categoria);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.search) params.append('search', filters.search);
      if (filters.ativo !== undefined) params.append('ativo', filters.ativo);
      
      const response = await api.get(`/programs/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar programas:', error);
      throw error;
    }
  },

  // Buscar programa por ID
  getProgramById: async (id) => {
    try {
      const response = await api.get(`/programs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar programa:', error);
      throw error;
    }
  },

  // Buscar estatísticas
  getStats: async () => {
    try {
      const response = await api.get('/programs/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  },

  // Criar novo programa
  createProgram: async (programData) => {
    try {
      const response = await api.post('/programs', programData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar programa:', error);
      throw error;
    }
  },

  // Atualizar programa
  updateProgram: async (id, programData) => {
    try {
      const response = await api.put(`/programs/${id}`, programData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar programa:', error);
      throw error;
    }
  },

  // Deletar programa
  deleteProgram: async (id) => {
    try {
      const response = await api.delete(`/programs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar programa:', error);
      throw error;
    }
  }
};

export default programService;

