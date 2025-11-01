/**
 * API Service - Tarefas
 * 
 * Serviço para integração com endpoints de tarefas/Kanban do backend
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import api from './api';

// ==================== TAREFAS ====================

/**
 * Listar todas as tarefas
 */
export const getTasks = async (filters = {}) => {
  try {
    const response = await api.get('/tasks', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    throw error;
  }
};

/**
 * Obter tarefa por ID
 */
export const getTaskById = async (id) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    throw error;
  }
};

/**
 * Criar nova tarefa
 */
export const createTask = async (data) => {
  try {
    const response = await api.post('/tasks', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }
};

/**
 * Atualizar tarefa
 */
export const updateTask = async (id, data) => {
  try {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    throw error;
  }
};

/**
 * Atualizar status da tarefa
 */
export const updateTaskStatus = async (id, status) => {
  try {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar status da tarefa:', error);
    throw error;
  }
};

/**
 * Atualizar prioridade da tarefa
 */
export const updateTaskPriority = async (id, prioridade) => {
  try {
    const response = await api.patch(`/tasks/${id}/priority`, { prioridade });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar prioridade da tarefa:', error);
    throw error;
  }
};

/**
 * Atribuir tarefa a usuário
 */
export const assignTask = async (id, userId) => {
  try {
    const response = await api.patch(`/tasks/${id}/assign`, { atribuidoPara: userId });
    return response.data;
  } catch (error) {
    console.error('Erro ao atribuir tarefa:', error);
    throw error;
  }
};

/**
 * Deletar tarefa
 */
export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    throw error;
  }
};

// ==================== KANBAN ====================

/**
 * Obter tarefas no formato Kanban
 */
export const getKanbanTasks = async () => {
  try {
    const response = await api.get('/tasks/kanban');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar Kanban:', error);
    throw error;
  }
};

/**
 * Mover tarefa no Kanban
 */
export const moveTaskInKanban = async (taskId, newStatus, newPosition) => {
  try {
    const response = await api.patch(`/tasks/${taskId}/move`, {
      status: newStatus,
      position: newPosition
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao mover tarefa no Kanban:', error);
    throw error;
  }
};

// ==================== CHECKLIST ====================

/**
 * Adicionar item ao checklist
 */
export const addChecklistItem = async (taskId, item) => {
  try {
    const response = await api.post(`/tasks/${taskId}/checklist`, { item });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar item ao checklist:', error);
    throw error;
  }
};

/**
 * Marcar item do checklist como concluído/não concluído
 */
export const toggleChecklistItem = async (taskId, itemId) => {
  try {
    const response = await api.patch(`/tasks/${taskId}/checklist/${itemId}/toggle`);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar item do checklist:', error);
    throw error;
  }
};

/**
 * Remover item do checklist
 */
export const removeChecklistItem = async (taskId, itemId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}/checklist/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao remover item do checklist:', error);
    throw error;
  }
};

// ==================== COMENTÁRIOS ====================

/**
 * Adicionar comentário à tarefa
 */
export const addComment = async (taskId, comment) => {
  try {
    const response = await api.post(`/tasks/${taskId}/comments`, { texto: comment });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    throw error;
  }
};

/**
 * Listar comentários da tarefa
 */
export const getTaskComments = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    throw error;
  }
};

// ==================== TAGS ====================

/**
 * Adicionar tag à tarefa
 */
export const addTag = async (taskId, tag) => {
  try {
    const response = await api.post(`/tasks/${taskId}/tags`, { tag });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar tag:', error);
    throw error;
  }
};

/**
 * Remover tag da tarefa
 */
export const removeTag = async (taskId, tag) => {
  try {
    const response = await api.delete(`/tasks/${taskId}/tags/${tag}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao remover tag:', error);
    throw error;
  }
};

// ==================== ESTATÍSTICAS ====================

/**
 * Obter estatísticas das tarefas
 */
export const getTaskStats = async () => {
  try {
    const response = await api.get('/tasks/stats');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas de tarefas:', error);
    throw error;
  }
};

/**
 * Obter tarefas por usuário
 */
export const getTasksByUser = async (userId) => {
  try {
    const response = await api.get(`/tasks/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas do usuário:', error);
    throw error;
  }
};

/**
 * Obter minhas tarefas
 */
export const getMyTasks = async () => {
  try {
    const response = await api.get('/tasks/my-tasks');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar minhas tarefas:', error);
    throw error;
  }
};

export default {
  // CRUD Básico
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  
  // Status e Atribuição
  updateTaskStatus,
  updateTaskPriority,
  assignTask,
  
  // Kanban
  getKanbanTasks,
  moveTaskInKanban,
  
  // Checklist
  addChecklistItem,
  toggleChecklistItem,
  removeChecklistItem,
  
  // Comentários
  addComment,
  getTaskComments,
  
  // Tags
  addTag,
  removeTag,
  
  // Estatísticas
  getTaskStats,
  getTasksByUser,
  getMyTasks
};

