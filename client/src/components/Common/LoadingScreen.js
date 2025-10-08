import React from 'react';
import { Box, Typography, LinearProgress, Stack } from '@mui/material';
import { Storage, NetworkCheck, Security, Speed } from '@mui/icons-material';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const systemChecks = [
    { icon: <Storage />, text: 'Inicializando banco de dados...', color: '#00D4FF' },
    { icon: <NetworkCheck />, text: 'Verificando conexões...', color: '#10B981' },
    { icon: <Security />, text: 'Validando segurança...', color: '#6366F1' },
    { icon: <Speed />, text: 'Otimizando performance...', color: '#F59E0B' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0B1E 0%, #1A1B2E 100%)',
        color: '#E2E8F0',
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            boxShadow: '0 20px 25px -5px rgba(0, 212, 255, 0.3), 0 10px 10px -5px rgba(0, 212, 255, 0.04)',
          }}
        >
          <Storage sx={{ fontSize: 40, color: '#000' }} />
        </Box>
      </motion.div>

      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          SS Milhas
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Sistema Técnico de Gestão
        </Typography>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            mb: 2,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)',
              borderRadius: 3,
            },
          }}
        />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {Math.round(progress)}% carregado
        </Typography>
      </motion.div>

      {/* System Checks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Stack spacing={2} sx={{ mt: 6, minWidth: 300 }}>
          {systemChecks.map((check, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    color: check.color,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {check.icon}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {check.text}
                </Typography>
              </Stack>
            </motion.div>
          ))}
        </Stack>
      </motion.div>

      {/* Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        style={{ marginTop: '2rem' }}
      >
        <Typography variant="caption" color="text.secondary">
          Inicializando sistema técnico...
        </Typography>
      </motion.div>
    </Box>
  );
};

export default LoadingScreen;