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

// Modo de desenvolvimento sem autenticação
const DEV_MODE_NO_AUTH = process.env.REACT_APP_NO_AUTH === 'true' || 
                         (process.env.NODE_ENV === 'development' && localStorage.getItem('DEV_NO_AUTH') === 'true');

// Usuário mock para desenvolvimento
const MOCK_USER = {
  _id: 'dev-user-123',
  nome: 'Usuário Desenvolvimento',
  email: 'dev@localhost',
  role: 'admin',
  status: 'ativo',
  permissions: {
    financeiro: true,
    valores: true,
    relatorios: true,
    monitoramento: true,
    cadastros: true
  }
};

// Estado inicial
const initialState = {
  user: DEV_MODE_NO_AUTH ? MOCK_USER : null,
  token: DEV_MODE_NO_AUTH ? 'dev-token-mock' : null,
  isAuthenticated: DEV_MODE_NO_AUTH,
  loading: !DEV_MODE_NO_AUTH, // Se não precisa auth, não precisa carregar
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
    // Se estiver em modo sem autenticação, não precisa inicializar
    if (DEV_MODE_NO_AUTH) {
      console.log('🔓 Modo de desenvolvimento SEM autenticação ativado');
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return;
    }

    let isMounted = true;
    let timeoutId = null;

    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token') || Cookies.get('token');
        
        // Timeout de segurança: sempre define loading como false após 5 segundos
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.warn('Timeout na inicialização da autenticação - definindo loading como false');
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          }
        }, 5000);

        if (token) {
          try {
            // Verificar se o token é válido com timeout
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), 3000)
            );
            
            const apiPromise = authAPI.getMe();
            const response = await Promise.race([apiPromise, timeoutPromise]);
            
            if (isMounted) {
              clearTimeout(timeoutId);
              
              if (response?.data?.success) {
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
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
              }
            }
          } catch (apiError) {
            // Se não conseguir conectar com a API, apenas define loading como false
            // Não remove o token para não perder a sessão se for problema temporário
            if (isMounted) {
              clearTimeout(timeoutId);
              console.warn('Não foi possível verificar token com o servidor:', apiError.message);
              dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
          }
        } else {
          if (isMounted) {
            clearTimeout(timeoutId);
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        // Não remove tokens em caso de erro, apenas define loading como false
        if (isMounted) {
          clearTimeout(timeoutId);
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      }
    };

    initializeAuth();

    // Cleanup
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Função para ativar/desativar modo sem autenticação (apenas dev)
  const toggleDevMode = () => {
    if (process.env.NODE_ENV === 'development') {
      const currentMode = localStorage.getItem('DEV_NO_AUTH') === 'true';
      localStorage.setItem('DEV_NO_AUTH', (!currentMode).toString());
      window.location.reload();
    }
  };

  // Configurar axios com token
  useEffect(() => {
    try {
      if (state.token && authAPI.setAuthToken) {
        authAPI.setAuthToken(state.token);
      } else if (authAPI.removeAuthToken) {
        authAPI.removeAuthToken();
      }
    } catch (error) {
      console.error('Erro ao configurar token:', error);
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
    devMode: DEV_MODE_NO_AUTH,
    
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
    toggleDevMode, // Apenas em desenvolvimento
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
