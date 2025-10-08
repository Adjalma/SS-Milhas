/**
 * Página de Redefinição de Senha
 * 
 * Interface para redefinir senha com token.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
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
  Container,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  FlightTakeoff,
  ArrowBack,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../../contexts/AuthContext';

// Schema de validação
const schema = yup.object({
  senha: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número')
    .required('Senha é obrigatória'),
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref('senha'), null], 'Senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!token) {
      setError('Token de redefinição inválido');
      setTokenValid(false);
    }
  }, [token]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data) => {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const result = await resetPassword(token, data.senha);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.error || 'Erro ao redefinir senha');
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
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
          <Paper elevation={10} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="error" sx={{ mb: 3 }}>
                Token de redefinição inválido ou expirado
              </Alert>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{ textDecoration: 'none' }}
              >
                Solicitar novo link de redefinição
              </Link>
            </CardContent>
          </Paper>
        </Container>
      </Box>
    );
  }

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
              background: 'linear-gradient(45deg, #10B981, #3B82F6)',
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <FlightTakeoff sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Nova Senha
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Defina uma nova senha para sua conta
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
              Redefinir senha
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Senha redefinida com sucesso! Redirecionando para login...
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
                  Digite sua nova senha. Certifique-se de que ela seja segura.
                </Typography>

                {/* Nova Senha */}
                <TextField
                  fullWidth
                  label="Nova senha"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  autoComplete="new-password"
                  autoFocus
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

                {/* Confirmar Nova Senha */}
                <TextField
                  fullWidth
                  label="Confirmar nova senha"
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

                {/* Botão de redefinição */}
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
                    background: 'linear-gradient(45deg, #10B981, #3B82F6)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #059669, #2563EB)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Redefinir Senha'
                  )}
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Redirecionando para login...
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

export default ResetPassword;
