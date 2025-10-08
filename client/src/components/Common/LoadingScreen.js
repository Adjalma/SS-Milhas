/**
 * Componente de tela de carregamento
 * 
 * Exibe uma tela de loading centralizada enquanto
 * a aplicação está carregando dados iniciais.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';

const LoadingScreen = ({ message = 'Carregando...', fullScreen = true }) => {
  const containerStyles = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  } : {
    minHeight: '200px',
  };

  return (
    <Fade in={true}>
      <Box
        sx={{
          ...containerStyles,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: fullScreen ? 'background.default' : 'transparent',
          gap: 2,
        }}
      >
        {/* Logo/Ícone */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <FlightTakeoff
            sx={{
              fontSize: 40,
              color: 'primary.main',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              background: 'linear-gradient(45deg, #3B82F6, #10B981)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Gestão Milhas
          </Typography>
        </Box>

        {/* Spinner */}
        <CircularProgress
          size={40}
          thickness={4}
          sx={{
            color: 'primary.main',
            mb: 1,
          }}
        />

        {/* Mensagem */}
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            maxWidth: 300,
          }}
        >
          {message}
        </Typography>

        {/* Estilos de animação */}
        <style>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
        `}</style>
      </Box>
    </Fade>
  );
};

export default LoadingScreen;
