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
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import NotificationPanel from './NotificationPanel';

const DRAWER_WIDTH = 280;

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, logout } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
    navigate('/login');
  };

  const handleGoToProfile = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  const handleGoToSettings = () => {
    handleProfileMenuClose();
    navigate('/settings');
  };

  const handleNotificationsToggle = () => {
    setNotificationOpen(!notificationOpen);
  };

  // Obter título da página baseado na rota
  const getPageTitle = () => {
    const path = location.pathname;
    
    const titles = {
      '/dashboard': 'Dashboard',
      '/accounts': 'Contas',
      '/transactions': 'Transações',
      '/reports': 'Relatórios',
      '/profile': 'Perfil',
      '/settings': 'Configurações',
      '/notifications': 'Notificações',
      '/movimentacoes/compra-entrada': 'Compra (Entrada)',
      '/movimentacoes/compra-bonificada': 'Compra Bonificada',
      '/movimentacoes/transferencia': 'Transferência',
      '/movimentacoes/transferencia-pessoas': 'Transf. entre Pessoas',
      '/movimentacoes/agendamento': 'Agendamento',
      '/movimentacoes/processos': 'Processos',
      '/movimentacoes/venda': 'Venda',
      '/movimentacoes/saida-manual': 'Saída Manual',
      '/movimentacoes/passagem': 'Passagem',
      '/tarefas': 'Tarefas',
      '/relatorios/controle-cpf': 'Controle de CPF',
      '/financeiro/fluxo-caixa': 'Fluxo de Caixa',
      '/financeiro/receitas': 'Receitas',
      '/financeiro/despesas': 'Despesas',
        '/financeiro/conciliacao': 'Conciliação',
        '/financeiro/transferencia': 'Transferência Financeira',
        '/cadastros/pessoa': 'Cadastro de Pessoas',
        '/cadastros/conta-bancaria': 'Conta Bancária',
        '/cadastros/cartao': 'Cartões',
        '/cadastros/clubes': 'Clubes de Fidelidade',
        '/cadastros/programas': 'Programas de Fidelidade',
        '/cadastros/cliente': 'Clientes',
        '/cadastros/etiqueta': 'Etiquetas',
        '/servicos/orcamentos': 'Orçamentos',
        '/servicos/recibos': 'Recibos',
        '/ajuda/tutoriais': 'Tutoriais',
        '/ajuda/ticket': 'Tickets de Suporte',
        '/ajuda/whatsapp': 'WhatsApp Business',
        '/ai/dashboard': 'Dashboard da IA',
        '/configuracoes/usuarios': 'Gerenciar Usuários',
    };

    // Para rotas com parâmetros (ex: /accounts/123)
    if (path.startsWith('/accounts/') && path !== '/accounts') {
      return 'Detalhes da Conta';
    }
    if (path.startsWith('/transactions/') && path !== '/transactions') {
      return 'Detalhes da Transação';
    }

    return titles[path] || 'Gestão de Milhas';
  };

  const drawer = (
    <Sidebar 
      mobileOpen={mobileOpen}
      onMobileClose={() => setMobileOpen(false)}
    />
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          {/* Botão menu (mobile) */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="abrir menu"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo e título */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            {isMobile && (
              <FlightTakeoff sx={{ color: 'primary.main', fontSize: 28 }} />
            )}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                display: { xs: isMobile ? 'block' : 'none', md: 'block' },
              }}
            >
              {getPageTitle()}
            </Typography>
          </Box>

          {/* Ações do header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notificações */}
            <Tooltip title="Notificações">
              <IconButton
                color="inherit"
                onClick={handleNotificationsToggle}
                sx={{ position: 'relative' }}
              >
                <Badge 
                  badgeContent={3} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.75rem',
                      height: 18,
                      minWidth: 18,
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Indicador de performance */}
            <Tooltip title="Performance">
              <IconButton color="inherit" sx={{ color: 'success.main' }}>
                <TrendingUp />
              </IconButton>
            </Tooltip>

            {/* Relatórios */}
            <Tooltip title="Relatórios">
              <IconButton 
                color="inherit"
                onClick={() => navigate('/reports')}
              >
                <Assessment />
              </IconButton>
            </Tooltip>

            {/* Menu do usuário */}
            <Tooltip title="Menu do usuário">
              <IconButton
                size="large"
                edge="end"
                aria-label="menu do usuário"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {user?.avatar ? (
                  <Avatar
                    src={user.avatar}
                    alt={user.nome}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user?.iniciais || user?.nome?.charAt(0)?.toUpperCase()}
                  </Avatar>
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu do usuário */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          },
        }}
      >
        {/* Informações do usuário */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.nome}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        
        <Divider />

        {/* Opções do menu */}
        <MenuItem onClick={handleGoToProfile}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Meu Perfil</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleGoToSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Configurações</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sair</ListItemText>
        </MenuItem>
      </Menu>

      {/* Drawer (Sidebar) */}
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
            keepMounted: true, // Melhora performance no mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        {/* Espaço para o AppBar */}
        <Toolbar />

        {/* Conteúdo da página */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>

      {/* Panel de notificações */}
      <NotificationPanel
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </Box>
  );
};

export default Layout;
