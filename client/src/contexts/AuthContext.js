/**
 * Contexto de Autenticação
 * 
 * Gerencia o estado de autenticação global da aplicação,
 * incluindo login, logout e dados do usuário.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

import { authAPI } from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Estado inicial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

// Tipos de ações
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
};

// Reducer para gerenciar estado
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

// Criar contexto
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const queryClient = useQueryClient();

  // Verificar token no localStorage/cookies ao inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token') || Cookies.get('token');
        
        if (token) {
          // Verificar se o token é válido
          const response = await authAPI.getMe();
          
          if (response.data.success) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user: response.data.data.user,
                token,
              },
            });
          } else {
            // Token inválido, remover
            localStorage.removeItem('token');
            Cookies.remove('token');
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        localStorage.removeItem('token');
        Cookies.remove('token');
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    initializeAuth();
  }, []);

  // Configurar axios com token
  useEffect(() => {
    if (state.token) {
      authAPI.setAuthToken(state.token);
    } else {
      authAPI.removeAuthToken();
    }
  }, [state.token]);

  // Função de login
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data;
        
        // Salvar tokens
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });

        toast.success(`Bem-vindo, ${user.nome}!`);
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Erro no login');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erro no login';
      toast.error(message);
      
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      return { success: false, error: message };
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data;
        
        // Salvar tokens
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });

        toast.success(`Conta criada com sucesso! Bem-vindo, ${user.nome}!`);
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Erro no registro');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erro no registro';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      // Chamar API de logout se tiver token
      if (state.token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar dados locais
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      Cookies.remove('token');
      
      // Limpar cache do React Query
      queryClient.clear();
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.success('Logout realizado com sucesso');
    }
  };

  // Função para atualizar dados do usuário
  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    });
  };

  // Função para renovar token
  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (!storedRefreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const response = await authAPI.refreshToken(storedRefreshToken);
      
      if (response.data.success) {
        const { token } = response.data.data;
        
        // Atualizar token
        localStorage.setItem('token', token);
        Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: state.user,
            token,
          },
        });

        return token;
      } else {
        throw new Error('Falha ao renovar token');
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      logout();
      throw error;
    }
  };

  // Função para verificar email
  const verifyEmail = async (token) => {
    try {
      const response = await authAPI.verifyEmail(token);
      
      if (response.data.success) {
        toast.success('Email verificado com sucesso!');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Erro na verificação');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erro na verificação';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Função para recuperar senha
  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.data.success) {
        toast.success('Instruções enviadas para seu email');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Erro ao enviar email');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erro ao enviar email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Função para redefinir senha
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await authAPI.resetPassword(token, newPassword);
      
      if (response.data.success) {
        toast.success('Senha redefinida com sucesso!');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Erro ao redefinir senha');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erro ao redefinir senha';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Função para reenviar verificação de email
  const resendVerification = async (email) => {
    try {
      const response = await authAPI.resendVerification(email);
      
      if (response.data.success) {
        toast.success('Email de verificação reenviado!');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Erro ao reenviar email');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erro ao reenviar email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Valores do contexto
  const value = {
    // Estado
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    
    // Funções
    login,
    register,
    logout,
    updateUser,
    refreshToken,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
