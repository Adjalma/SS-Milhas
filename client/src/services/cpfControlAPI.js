import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configurar interceptor para adicionar token
axios.interceptors.request.use(
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

// ==================== CPF CONTROL API ====================

/**
 * Listar todos os CPFs do usuário
 */
export const listarCPFs = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    if (filtros.categoria) params.append('categoria', filtros.categoria);
    if (filtros.status) params.append('status', filtros.status);
    if (filtros.programa) params.append('programa', filtros.programa);
    
    const response = await axios.get(`${API_URL}/cpf-control?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar CPFs:', error);
    throw error;
  }
};

/**
 * Listar CPFs com etiquetas
 */
export const listarCPFsComEtiquetas = async () => {
  try {
    const response = await axios.get(`${API_URL}/cpf-control/com-etiquetas`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar CPFs com etiquetas:', error);
    throw error;
  }
};

/**
 * Buscar CPF específico
 */
export const buscarCPF = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/cpf-control/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar CPF:', error);
    throw error;
  }
};

/**
 * Criar novo CPF
 */
export const criarCPF = async (dados) => {
  try {
    const response = await axios.post(`${API_URL}/cpf-control`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar CPF:', error);
    throw error;
  }
};

/**
 * Atualizar CPF
 */
export const atualizarCPF = async (id, dados) => {
  try {
    const response = await axios.put(`${API_URL}/cpf-control/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar CPF:', error);
    throw error;
  }
};

/**
 * Atualizar apenas a etiqueta do CPF
 */
export const atualizarEtiqueta = async (id, etiqueta, cpfData = null) => {
  try {
    const response = await axios.put(`${API_URL}/cpf-control/${id}/etiqueta`, { 
      etiqueta,
      cpfData 
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar etiqueta:', error);
    throw error;
  }
};

/**
 * Adicionar alerta ao CPF
 */
export const adicionarAlerta = async (id, tipo, mensagem) => {
  try {
    const response = await axios.post(`${API_URL}/cpf-control/${id}/alerta`, {
      tipo,
      mensagem
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar alerta:', error);
    throw error;
  }
};

/**
 * Deletar CPF
 */
export const deletarCPF = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/cpf-control/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar CPF:', error);
    throw error;
  }
};

/**
 * Obter estatísticas dos CPFs
 */
export const obterEstatisticas = async () => {
  try {
    const response = await axios.get(`${API_URL}/cpf-control/stats/resumo`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw error;
  }
};

/**
 * Sincronizar etiquetas do localStorage com o banco de dados
 */
export const sincronizarEtiquetas = async () => {
  try {
    // Buscar etiquetas do localStorage
    const etiquetasProgramas = JSON.parse(localStorage.getItem('etiquetas_programas') || '{}');
    const etiquetasCPF = JSON.parse(localStorage.getItem('etiquetas_cpf') || '{}');
    
    // Combinar todas as etiquetas
    const todasEtiquetas = { ...etiquetasProgramas, ...etiquetasCPF };
    
    // Atualizar cada uma no banco
    const promises = Object.entries(todasEtiquetas).map(([id, etiqueta]) => {
      return atualizarEtiqueta(id, etiqueta).catch(err => {
        console.error(`Erro ao sincronizar etiqueta ${id}:`, err);
        return null;
      });
    });
    
    await Promise.all(promises);
    
    console.log('Etiquetas sincronizadas com sucesso!');
    return { success: true, count: promises.length };
  } catch (error) {
    console.error('Erro ao sincronizar etiquetas:', error);
    throw error;
  }
};

/**
 * Migrar dados do localStorage para o banco de dados
 */
export const migrarDadosLocalStorage = async () => {
  try {
    // Buscar todos os CPFs do localStorage
    const cpfsLocalStorage = JSON.parse(localStorage.getItem('cpfs_cadastrados') || '[]');
    
    if (cpfsLocalStorage.length === 0) {
      console.log('Nenhum dado para migrar');
      return { success: true, count: 0 };
    }
    
    // Criar cada CPF no banco
    const promises = cpfsLocalStorage.map(cpf => {
      return criarCPF(cpf).catch(err => {
        console.error(`Erro ao migrar CPF ${cpf.nome}:`, err);
        return null;
      });
    });
    
    const resultados = await Promise.all(promises);
    const sucesso = resultados.filter(r => r !== null).length;
    
    console.log(`Migração concluída: ${sucesso}/${cpfsLocalStorage.length} CPFs migrados`);
    
    return { success: true, count: sucesso, total: cpfsLocalStorage.length };
  } catch (error) {
    console.error('Erro ao migrar dados:', error);
    throw error;
  }
};

export default {
  listarCPFs,
  listarCPFsComEtiquetas,
  buscarCPF,
  criarCPF,
  atualizarCPF,
  atualizarEtiqueta,
  adicionarAlerta,
  deletarCPF,
  obterEstatisticas,
  sincronizarEtiquetas,
  migrarDadosLocalStorage
};
