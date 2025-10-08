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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  FlightTakeoff,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';

import { useAuth } from '../../contexts/AuthContext';
import NeuralParticles from '../../components/NeuralParticles';

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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        width: '100%',
        maxWidth: 400,
        padding: 2
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={10}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              width: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(45deg, #3B82F6, #10B981)',
                color: 'white',
                p: 2,
                textAlign: 'center',
              }}
            >
              <FlightTakeoff sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              SS Milhas
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Sistema completo de gestão de milhas aéreas
            </Typography>
            </Box>

            {/* Formulário */}
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  mb: 2,
                  color: 'text.primary',
                }}
              >
                Faça login na sua conta
              </Typography>


            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="dense"
                autoComplete="email"
                autoFocus
                defaultValue="admin@ssmilhas.com"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message || 'Use: admin@ssmilhas.com'}
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
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  margin="dense"
                  autoComplete="current-password"
                  defaultValue="123456"
                  {...register('senha')}
                  error={!!errors.senha}
                  helperText={errors.senha?.message || 'Use: 123456'}
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

                {/* Link para esqueci a senha */}
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{ textDecoration: 'none' }}
                  >
                    Esqueceu sua senha?
                  </Link>
                </Box>

                {/* Botão de login */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    mb: 1,
                    py: 1,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #3B82F6, #10B981)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2563EB, #059669)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Entrar'
                  )}
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    ou
                  </Typography>
                </Divider>

                {/* Link para registro */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Não tem uma conta?{' '}
                    <Link
                      component={RouterLink}
                      to="/register"
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      Criar conta
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
