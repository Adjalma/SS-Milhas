/**
 * Página de Login Administrativo
 * 
 * Interface para autenticação de administradores do sistema.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Container,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AdminPanelSettings,
  Security,
  Shield,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../../contexts/AuthContext';

// Schema de validação
const schema = yup.object({
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  senha: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const result = await loginAdmin(data);
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'Credenciais inválidas');
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={20}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header Admin */}
          <Box
            sx={{
              background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
              color: 'white',
              p: 4,
              textAlign: 'center',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,107,53,0.8), rgba(247,147,30,0.8))',
                zIndex: 1,
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <AdminPanelSettings sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                SS Milhas
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Painel Administrativo
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Acesso restrito para administradores
              </Typography>
            </Box>
          </Box>

          {/* Formulário */}
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Security sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: 'text.primary',
                }}
              >
                Login Administrativo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Entre com suas credenciais de administrador
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                icon={<Shield />}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <TextField
                fullWidth
                label="Email Administrativo"
                type="email"
                margin="normal"
                autoComplete="email"
                autoFocus
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Senha */}
              <TextField
                fullWidth
                label="Senha Administrativa"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                autoComplete="current-password"
                {...register('senha')}
                error={!!errors.senha}
                helperText={errors.senha?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Botão de login */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                  boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #e55a2b, #e0851a)',
                    boxShadow: '0 12px 40px rgba(255, 107, 53, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <AdminPanelSettings sx={{ mr: 1 }} />
                    Acessar Painel Admin
                  </>
                )}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  ou
                </Typography>
              </Divider>

              {/* Link para login normal */}
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'primary.50',
                    },
                  }}
                >
                  Voltar ao Login Normal
                </Button>
              </Box>
            </Box>
          </CardContent>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              backgroundColor: 'grey.50',
              textAlign: 'center',
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              © 2024 SS Milhas - Sistema Administrativo
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
