/**
 * Layout principal da aplicação
 * 
 * Componente que define a estrutura geral da aplicação,
 * incluindo sidebar, header e área de conteúdo.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  Stack,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings,
  Logout,
  FlightTakeoff,
  TrendingUp,
  Assessment,
  Security,
  NetworkCheck,
  CloudSync,
  Speed
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import NotificationPanel from './NotificationPanel';

const DRAWER_WIDTH = 320;

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
    handleProfileMenuClose();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/dashboard': 'Dashboard',
      '/accounts': 'Contas',
      '/transactions': 'Transações',
      '/movimentacoes/processos': 'Processos',
      '/movimentacoes/compra-entrada': 'Compra Entrada',
      '/movimentacoes/compra-bonificada': 'Compra Bonificada',
      '/movimentacoes/transferencia': 'Transferência',
      '/movimentacoes/transferencia-pessoas': 'Transferência Pessoas',
      '/movimentacoes/agendamento': 'Agendamento',
      '/movimentacoes/venda': 'Venda',
      '/movimentacoes/saida-manual': 'Saída Manual',
      '/movimentacoes/passagem': 'Passagem',
      '/reports': 'Relatórios',
      '/relatorios/controle-cpf': 'Controle CPF',
      '/relatorios/passagens': 'Passagens',
      '/relatorios/transferencias': 'Transferências',
      '/relatorios/vendas': 'Vendas',
      '/relatorios/resumo': 'Resumo',
      '/relatorios/grafico-lucro': 'Gráfico Lucro',
      '/relatorios/evolucao': 'Evolução',
      '/financeiro/fluxo-caixa': 'Fluxo de Caixa',
      '/financeiro/receitas': 'Receitas',
      '/financeiro/despesas': 'Despesas',
      '/financeiro/conciliacao': 'Conciliação',
      '/financeiro/transferencia': 'Transferência Financeira',
      '/cadastros/pessoa': 'Pessoa',
      '/cadastros/conta-bancaria': 'Conta Bancária',
      '/cadastros/cartao': 'Cartão',
      '/cadastros/clubes': 'Clubes',
      '/cadastros/programas': 'Programas',
      '/cadastros/cliente': 'Cliente',
      '/cadastros/etiqueta': 'Etiqueta',
      '/servicos/orcamentos': 'Orçamentos',
      '/servicos/recibos': 'Recibos',
      '/ai/dashboard': 'Dashboard IA',
      '/ajuda/tutoriais': 'Tutoriais',
      '/ajuda/ticket': 'Ticket',
      '/ajuda/whatsapp': 'WhatsApp',
      '/configuracoes/usuarios': 'Gerenciar Usuários',
      '/configuracoes/perfil': 'Perfil',
      '/profile': 'Perfil',
      '/settings': 'Configurações',
      '/notifications': 'Notificações'
    };
    return titles[path] || 'SS Milhas';
  };

  const sidebar = (
    <Sidebar 
      open={true} 
      onMobileClose={() => setMobileOpen(false)} 
    />
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0A0B1E 0%, #1A1B2E 100%)' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          background: 'linear-gradient(135deg, rgba(26, 27, 46, 0.95) 0%, rgba(37, 39, 65, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#E2E8F0' }}>
                {getPageTitle()}
              </Typography>
              <Chip
                label="Técnico"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            </Stack>
          </Box>

          {/* Status Indicators */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 2 }}>
            <Tooltip title="Sistema Online">
              <NetworkCheck sx={{ color: 'success.main', fontSize: 18 }} />
            </Tooltip>
            <Tooltip title="IA Ativa">
              <CloudSync sx={{ color: 'primary.main', fontSize: 18 }} />
            </Tooltip>
            <Tooltip title="Performance">
              <Speed sx={{ color: 'warning.main', fontSize: 18 }} />
            </Tooltip>
          </Stack>

          {/* Notifications */}
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            onClick={handleNotificationMenuOpen}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                fontSize: '0.875rem'
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Navigation drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              background: 'linear-gradient(180deg, #0A0B1E 0%, #1A1B2E 100%)',
              borderRight: '1px solid rgba(99, 102, 241, 0.1)',
            },
          }}
        >
          {sidebar}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              background: 'linear-gradient(180deg, #0A0B1E 0%, #1A1B2E 100%)',
              borderRight: '1px solid rgba(99, 102, 241, 0.1)',
            },
          }}
          open
        >
          {sidebar}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0A0B1E 0%, #1A1B2E 100%)',
        }}
      >
        <Toolbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ 
            padding: 0, 
            margin: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </motion.div>
      </Box>

      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #1A1B2E 0%, #252741 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            backdropFilter: 'blur(10px)',
            mt: 1,
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => { navigate('/configuracoes/perfil'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Perfil</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Configurações</ListItemText>
        </MenuItem>
        <Divider sx={{ bgcolor: 'rgba(148, 163, 184, 0.1)' }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sair</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notification Panel */}
      <NotificationPanel
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationMenuClose}
      />
    </Box>
  );
};

export default Layout;