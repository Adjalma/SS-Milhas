/**
 * Página de Login
 * 
 * Interface para autenticação de usuários no sistema,
 * incluindo validação de formulário e integração com API.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Paper,
  CircularProgress,
  Stack,
  Avatar,
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  FlightTakeoff,
  Security,
  Storage,
  NetworkCheck
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';

import { useAuth } from '../../contexts/AuthContext';
import NeuralParticles from '../../components/NeuralParticles';
import { useNavigate } from 'react-router-dom';

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

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      const result = await login(data);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erro no login');
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
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0A0B1E 0%, #1A1B2E 100%)',
        padding: 0,
        margin: 0,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <NeuralParticles />
      
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        width: '100%',
        maxWidth: 400,
        px: 2
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <Paper
            elevation={24}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(145deg, rgba(26, 27, 46, 0.95) 0%, rgba(37, 39, 65, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 212, 255, 0.25)',
            }}
          >
            {/* Header */}
            <Box sx={{ 
              p: 3, 
              textAlign: 'center',
              borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)'
            }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={2}>
                <Avatar
                  sx={{
                    bgcolor: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)',
                    width: 48,
                    height: 48,
                  }}
                >
                  <Storage />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}>
                    SS Milhas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sistema Técnico
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" justifyContent="center" spacing={1}>
                <Chip
                  icon={<NetworkCheck />}
                  label="Online"
                  size="small"
                  color="success"
                  variant="outlined"
                />
                <Chip
                  icon={<Security />}
                  label="Seguro"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                textAlign: 'center',
                color: '#E2E8F0',
                fontWeight: 600
              }}>
                Acesso ao Sistema
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  variant="outlined"
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register('email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 212, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00D4FF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00D4FF',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  variant="outlined"
                  autoComplete="current-password"
                  error={!!errors.senha}
                  helperText={errors.senha?.message}
                  {...register('senha')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'text.secondary' }} />
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 212, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00D4FF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00D4FF',
                    },
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{
                      color: '#00D4FF',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Esqueceu a senha?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mb: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)',
                    boxShadow: '0 4px 14px 0 rgba(0, 212, 255, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #33DDFF 0%, #818CF8 100%)',
                      boxShadow: '0 6px 20px 0 rgba(0, 212, 255, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(148, 163, 184, 0.3)',
                      color: 'rgba(148, 163, 184, 0.6)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Entrar'
                  )}
                </Button>

                {(process.env.NODE_ENV === 'development') && (
                  <>
                    <Divider sx={{ my: 2, borderColor: 'rgba(148, 163, 184, 0.1)' }}>
                      <Typography variant="body2" color="text.secondary">
                        ou
                      </Typography>
                    </Divider>

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        localStorage.setItem('DEV_NO_AUTH', 'true');
                        window.location.reload();
                      }}
                      sx={{
                        py: 1.5,
                        mb: 2,
                        borderRadius: 2,
                        borderColor: '#10B981',
                        color: '#10B981',
                        '&:hover': {
                          borderColor: '#059669',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        },
                      }}
                    >
                      🔓 Acessar sem Login (Desenvolvimento)
                    </Button>
                  </>
                )}

                <Divider sx={{ my: 2, borderColor: 'rgba(148, 163, 184, 0.1)' }}>
                  <Typography variant="body2" color="text.secondary">
                    ou
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Não tem uma conta?{' '}
                    <Link
                      component={RouterLink}
                      to="/register"
                      sx={{
                        color: '#00D4FF',
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Cadastre-se
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Login;