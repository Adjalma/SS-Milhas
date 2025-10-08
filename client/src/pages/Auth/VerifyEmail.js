/**
 * Página de Verificação de Email
 * 
 * Interface para verificar email após registro.
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
  Button,
  Typography,
  Link,
  Alert,
  Container,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  FlightTakeoff,
  Email,
  CheckCircle,
  Error,
  Refresh,
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendVerification } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token) {
      handleVerifyEmail();
    }
  }, [token]);

  const handleVerifyEmail = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await verifyEmail(token);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.error || 'Erro na verificação');
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Email não encontrado');
      return;
    }

    setResending(true);
    setError('');

    try {
      const result = await resendVerification(email);
      
      if (result.success) {
        setError('');
        alert('Email de verificação reenviado com sucesso!');
      } else {
        setError(result.error || 'Erro ao reenviar email');
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setResending(false);
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
              background: 'linear-gradient(45deg, #8B5CF6, #06B6D4)',
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <FlightTakeoff sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Verificar Email
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Confirme sua conta para continuar
            </Typography>
          </Box>

          {/* Conteúdo */}
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            {loading && (
              <Box sx={{ mb: 3 }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Verificando email...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Aguarde enquanto confirmamos sua conta
                </Typography>
              </Box>
            )}

            {success && (
              <Box sx={{ mb: 3 }}>
                <CheckCircle
                  sx={{
                    fontSize: 80,
                    color: 'success.main',
                    mb: 2,
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}>
                  Email verificado com sucesso!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Sua conta foi ativada. Redirecionando para login...
                </Typography>
                <CircularProgress size={24} />
              </Box>
            )}

            {error && (
              <Box sx={{ mb: 3 }}>
                <Error
                  sx={{
                    fontSize: 80,
                    color: 'error.main',
                    mb: 2,
                  }}
                />
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
                
                {email && (
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleResendVerification}
                    disabled={resending}
                    sx={{ mb: 2 }}
                  >
                    {resending ? (
                      <CircularProgress size={20} />
                    ) : (
                      'Reenviar email de verificação'
                    )}
                  </Button>
                )}
              </Box>
            )}

            {!loading && !success && !error && (
              <Box sx={{ mb: 3 }}>
                <Email
                  sx={{
                    fontSize: 80,
                    color: 'primary.main',
                    mb: 2,
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Verificação necessária
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Acesse o link enviado para seu email para verificar sua conta.
                </Typography>
                
                {email && (
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleResendVerification}
                    disabled={resending}
                  >
                    {resending ? (
                      <CircularProgress size={20} />
                    ) : (
                      'Reenviar email de verificação'
                    )}
                  </Button>
                )}
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Links */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Voltar para login
              </Link>
              
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Criar nova conta
              </Link>
            </Box>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
};

export default VerifyEmail;
