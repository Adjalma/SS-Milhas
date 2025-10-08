import { createTheme } from '@mui/material/styles';

// Tema técnico e profissional - inspirado em dashboards modernos
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00D4FF', // Azul ciano tecnológico
      light: '#33DDFF',
      dark: '#00A8CC',
      contrastText: '#000000',
    },
    secondary: {
      main: '#6366F1', // Índigo moderno
      light: '#818CF8',
      dark: '#4338CA',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0A0B1E', // Azul muito escuro
      paper: '#1A1B2E', // Azul escuro para cards
      elevated: '#252741', // Azul médio para elevação
    },
    surface: {
      main: '#1A1B2E',
      light: '#252741',
      dark: '#0F1022',
    },
    text: {
      primary: '#E2E8F0', // Cinza claro
      secondary: '#94A3B8', // Cinza médio
      disabled: '#64748B', // Cinza escuro
    },
    success: {
      main: '#10B981', // Verde tecnológico
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B', // Amarelo âmbar
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444', // Vermelho moderno
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#3B82F6', // Azul informativo
      light: '#60A5FA',
      dark: '#2563EB',
    },
    divider: 'rgba(148, 163, 184, 0.1)',
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    ...Array(19).fill('0 25px 50px -12px rgba(0, 0, 0, 0.25)'),
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1A1B2E 0%, #252741 100%)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(0, 212, 255, 0.1), 0 10px 10px -5px rgba(0, 212, 255, 0.04)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)',
          boxShadow: '0 4px 14px 0 rgba(0, 212, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #33DDFF 0%, #818CF8 100%)',
            boxShadow: '0 6px 20px 0 rgba(0, 212, 255, 0.4)',
          },
        },
        outlined: {
          borderColor: 'rgba(0, 212, 255, 0.5)',
          color: '#00D4FF',
          '&:hover': {
            borderColor: '#00D4FF',
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1A1B2E',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          color: '#818CF8',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
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
        },
      },
    },
  },
});

export default theme;
