/**
 * Página de Registro
 * 
 * Interface para registro de novos usuários no sistema.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Container,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  FlightTakeoff,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../../contexts/AuthContext';

// Schema de validação
const schema = yup.object({
  nome: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  senha: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número')
    .required('Senha é obrigatória'),
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref('senha'), null], 'Senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
  telefone: yup
    .string()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (xx) xxxxx-xxxx'),
});

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const { confirmarSenha, ...userData } = data;
      const result = await registerUser(userData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erro no registro');
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            marginTop: 4,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(45deg, #3B82F6, #10B981)',
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <FlightTakeoff sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              SS Milhas
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Sistema completo de gestão de milhas aéreas
            </Typography>
          </Box>

          {/* Formulário */}
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                textAlign: 'center',
                mb: 3,
                color: 'text.primary',
              }}
            >
              Criar nova conta
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              {/* Nome */}
              <TextField
                fullWidth
                label="Nome completo"
                margin="normal"
                autoComplete="name"
                autoFocus
                {...register('nome')}
                error={!!errors.nome}
                helperText={errors.nome?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Email */}
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                autoComplete="email"
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

              {/* Telefone */}
              <TextField
                fullWidth
                label="Telefone"
                margin="normal"
                placeholder="(11) 99999-9999"
                {...register('telefone')}
                error={!!errors.telefone}
                helperText={errors.telefone?.message || 'Opcional'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Senha */}
              <TextField
                fullWidth
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                autoComplete="new-password"
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

              {/* Confirmar Senha */}
              <TextField
                fullWidth
                label="Confirmar senha"
                type={showConfirmPassword ? 'text' : 'password'}
                margin="normal"
                autoComplete="new-password"
                {...register('confirmarSenha')}
                error={!!errors.confirmarSenha}
                helperText={errors.confirmarSenha?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleToggleConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Botão de registro */}
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
                  'Criar conta'
                )}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  ou
                </Typography>
              </Divider>

              {/* Link para login */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Já tem uma conta?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Fazer login
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
