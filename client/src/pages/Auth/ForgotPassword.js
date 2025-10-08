/**
 * Página de Recuperação de Senha
 * 
 * Interface para solicitar recuperação de senha.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  Alert,
  Container,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  FlightTakeoff,
  ArrowBack,
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
});

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await forgotPassword(data.email);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Erro ao enviar email');
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(45deg, #EF4444, #F59E0B)',
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <FlightTakeoff sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Recuperar Senha
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Digite seu email para receber instruções
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
              Esqueceu sua senha?
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Instruções de recuperação enviadas para seu email. Verifique sua caixa de entrada.
              </Alert>
            )}

            {!success ? (
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 3,
                    textAlign: 'center',
                  }}
                >
                  Digite o email associado à sua conta e enviaremos instruções para redefinir sua senha.
                </Typography>

                {/* Email */}
                <TextField
                  fullWidth
                  label="Email"
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

                {/* Botão de envio */}
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
                    background: 'linear-gradient(45deg, #EF4444, #F59E0B)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #DC2626, #D97706)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Enviar Instruções'
                  )}
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 3,
                  }}
                >
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </Typography>
              </Box>
            )}

            {/* Links */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                <ArrowBack sx={{ fontSize: 16 }} />
                Voltar para login
              </Link>
            </Box>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
