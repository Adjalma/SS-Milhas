/**
 * Error Boundary Component
 * 
 * Captura erros JavaScript em qualquer lugar da árvore de componentes
 * filhos, registra esses erros e exibe uma UI de fallback.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React from 'react';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';
import { ErrorOutline, Refresh, Home } from '@mui/icons-material';
import toast from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para exibir a UI de erro
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Registra o erro
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log do erro para monitoramento
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    
    // Aqui você pode enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
    
    // Mostrar toast de erro
    toast.error('Ocorreu um erro inesperado. Tente recarregar a página.');
  }

  handleReload = () => {
    // Recarregar a página
    window.location.reload();
  };

  handleGoHome = () => {
    // Redirecionar para home
    window.location.href = '/dashboard';
  };

  handleReset = () => {
    // Resetar o estado do error boundary
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback personalizada
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default',
            padding: 2,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              maxWidth: 600,
              width: '100%',
              padding: 4,
              textAlign: 'center',
            }}
          >
            {/* Ícone de erro */}
            <ErrorOutline
              sx={{
                fontSize: 80,
                color: 'error.main',
                mb: 2,
              }}
            />

            {/* Título */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
              }}
            >
              Oops! Algo deu errado
            </Typography>

            {/* Descrição */}
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada 
              e está trabalhando para resolver o problema.
            </Typography>

            {/* Alert com detalhes em desenvolvimento */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, textAlign: 'left' }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Detalhes do erro (desenvolvimento):
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {this.state.error.toString()}
                </Typography>
                {this.state.errorInfo && (
                  <details style={{ marginTop: 8 }}>
                    <summary>Stack trace</summary>
                    <pre style={{ fontSize: 12, overflow: 'auto', maxHeight: 200 }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </Alert>
            )}

            {/* Botões de ação */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReload}
                sx={{ minWidth: 140 }}
              >
                Recarregar Página
              </Button>

              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={this.handleGoHome}
                sx={{ minWidth: 140 }}
              >
                Ir para Home
              </Button>

              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="text"
                  onClick={this.handleReset}
                  sx={{ minWidth: 140 }}
                >
                  Tentar Novamente
                </Button>
              )}
            </Box>

            {/* Informações de contato */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                }}
              >
                Se o problema persistir, entre em contato com nosso suporte.
              </Typography>
            </Box>
          </Paper>
        </Box>
      );
    }

    // Se não há erro, renderiza os filhos normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;
