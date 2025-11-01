/**
 * Hook de Autenticação Segura - React
 * 
 * Hook customizado para gerenciar autenticação de forma segura,
 * incluindo armazenamento de tokens, proteção CSRF e renovação automática.
 * 
 * @author Especialista em Segurança
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { secureStorage, csrf } from '../utils/security';
import api from '../services/api';

export const useSecureAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Verifica se há um token válido e carrega dados do usuário
   */
  const checkAuth = useCallback(async () => {
    try {
      const token = secureStorage.getToken();
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Configurar token no axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Buscar dados do usuário
      const response = await api.get('/api/users/profile');
      
      // Armazenar token CSRF se disponível
      csrf.storeToken(response);
      
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err);
      
      // Se o token está inválido, limpar e redirecionar
      if (err.response?.status === 401) {
        logout();
      } else {
        setError('Erro ao carregar dados do usuário');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Faz login do usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @param {boolean} rememberMe - Se deve lembrar o login
   * @returns {Promise<boolean>} True se login bem-sucedido
   */
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/api/auth/login', {
        email,
        senha: password,
        lembrarMe: rememberMe
      });

      const { token, user: userData } = response.data;

      // Armazenar token de forma segura
      secureStorage.setToken(token);
      
      // Armazenar token CSRF
      csrf.storeToken(response);

      // Configurar token no axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
      setLoading(false);

      return true;
    } catch (err) {
      console.error('Erro no login:', err);
      
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login';
      setError(errorMessage);
      setLoading(false);

      return false;
    }
  };

  /**
   * Registra novo usuário
   * @param {object} userData - Dados do usuário
   * @returns {Promise<boolean>} True se registro bem-sucedido
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/api/auth/register', userData);

      const { token, user: newUser } = response.data;

      // Armazenar token de forma segura
      secureStorage.setToken(token);
      
      // Armazenar token CSRF
      csrf.storeToken(response);

      // Configurar token no axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(newUser);
      setLoading(false);

      return true;
    } catch (err) {
      console.error('Erro no registro:', err);
      
      const errorMessage = err.response?.data?.message || 'Erro ao registrar usuário';
      setError(errorMessage);
      setLoading(false);

      return false;
    }
  };

  /**
   * Faz logout do usuário
   */
  const logout = useCallback(() => {
    // Remover token
    secureStorage.removeToken();
    
    // Remover token CSRF
    csrf.removeToken();

    // Limpar header do axios
    delete api.defaults.headers.common['Authorization'];

    setUser(null);
    setError(null);

    // Redirecionar para login
    navigate('/login');
  }, [navigate]);

  /**
   * Atualiza dados do perfil do usuário
   * @param {object} updatedData - Dados atualizados
   * @returns {Promise<boolean>} True se atualização bem-sucedida
   */
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put('/api/users/profile', updatedData);

      setUser(response.data.user);
      setLoading(false);

      return true;
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
      setLoading(false);

      return false;
    }
  };

  /**
   * Altera a senha do usuário
   * @param {string} currentPassword - Senha atual
   * @param {string} newPassword - Nova senha
   * @returns {Promise<boolean>} True se alteração bem-sucedida
   */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      await api.post('/api/auth/change-password', {
        senhaAtual: currentPassword,
        novaSenha: newPassword,
        confirmNovaSenha: newPassword
      });

      setLoading(false);

      return true;
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      
      const errorMessage = err.response?.data?.message || 'Erro ao alterar senha';
      setError(errorMessage);
      setLoading(false);

      return false;
    }
  };

  /**
   * Solicita recuperação de senha
   * @param {string} email - Email do usuário
   * @returns {Promise<boolean>} True se solicitação bem-sucedida
   */
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);

      await api.post('/api/auth/forgot-password', { email });

      setLoading(false);

      return true;
    } catch (err) {
      console.error('Erro ao solicitar recuperação de senha:', err);
      
      const errorMessage = err.response?.data?.message || 'Erro ao solicitar recuperação de senha';
      setError(errorMessage);
      setLoading(false);

      return false;
    }
  };

  /**
   * Reseta a senha com o token
   * @param {string} token - Token de recuperação
   * @param {string} newPassword - Nova senha
   * @returns {Promise<boolean>} True se reset bem-sucedido
   */
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      await api.post('/api/auth/reset-password', {
        token,
        senha: newPassword,
        confirmSenha: newPassword
      });

      setLoading(false);

      return true;
    } catch (err) {
      console.error('Erro ao resetar senha:', err);
      
      const errorMessage = err.response?.data?.message || 'Erro ao resetar senha';
      setError(errorMessage);
      setLoading(false);

      return false;
    }
  };

  /**
   * Verifica se o usuário tem uma permissão específica
   * @param {string} permission - Nome da permissão
   * @returns {boolean} True se tem a permissão
   */
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    
    // Admin tem todas as permissões
    if (user.role === 'admin') return true;
    
    // Verificar permissão específica
    return user.permissions?.[permission] === true;
  }, [user]);

  /**
   * Verifica se o usuário tem um role específico
   * @param {string|array} roles - Role(s) para verificar
   * @returns {boolean} True se tem o role
   */
  const hasRole = useCallback((roles) => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  }, [user]);

  /**
   * Renova o token JWT
   * @returns {Promise<boolean>} True se renovação bem-sucedida
   */
  const refreshToken = async () => {
    try {
      const response = await api.post('/api/auth/refresh-token');
      
      const { token } = response.data;
      
      // Atualizar token armazenado
      secureStorage.setToken(token);
      
      // Atualizar header do axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return true;
    } catch (err) {
      console.error('Erro ao renovar token:', err);
      
      // Se falhar, fazer logout
      logout();
      
      return false;
    }
  };

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Configurar renovação automática do token (a cada 30 minutos)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshToken();
    }, 30 * 60 * 1000); // 30 minutos

    return () => clearInterval(interval);
  }, [user]);

  // Configurar interceptor do axios para adicionar token CSRF
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // Adicionar token CSRF para requisições que modificam dados
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
          csrf.addTokenToRequest(config);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        // Armazenar token CSRF da resposta
        csrf.storeToken(response);
        return response;
      },
      (error) => {
        // Se receber 401, fazer logout
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    hasPermission,
    hasRole,
    refreshToken
  };
};

export default useSecureAuth;

