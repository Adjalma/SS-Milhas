/**
 * Página de Notificações
 * 
 * Interface para gerenciar notificações do sistema.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  Alert,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  MoreVert,
  MarkEmailRead,
  Delete,
  FilterList,
  Search,
  Notifications as NotificationsIcon,
  Warning,
  Info,
  CheckCircle,
  Error,
  Star,
  Schedule,
  Email,
  Phone,
  Push,
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Layout from '../../components/Layout/Layout';

// Dados mockados
const mockNotifications = [
  {
    id: 1,
    tipo: 'warning',
    titulo: 'Pontos Expirando',
    mensagem: '50.000 pontos na conta Latam Pass expiram em 15 dias',
    data: '2024-08-15T10:30:00',
    lida: false,
    prioridade: 'alta',
    conta: 'Latam Pass',
    acao: 'verificar_conta',
  },
  {
    id: 2,
    tipo: 'info',
    titulo: 'Nova Transação',
    mensagem: 'Compra de 25.000 milhas registrada com sucesso',
    data: '2024-08-15T09:15:00',
    lida: false,
    prioridade: 'media',
    conta: 'Smiles',
    acao: 'ver_transacao',
  },
  {
    id: 3,
    tipo: 'success',
    titulo: 'Meta Concluída',
    mensagem: 'Parabéns! Você atingiu a meta de 100.000 milhas',
    data: '2024-08-14T16:45:00',
    lida: true,
    prioridade: 'baixa',
    conta: 'Geral',
    acao: 'ver_dashboard',
  },
  {
    id: 4,
    tipo: 'error',
    titulo: 'Saldo Baixo',
    mensagem: 'Conta TudoAzul com saldo abaixo de 1.000 pontos',
    data: '2024-08-14T14:20:00',
    lida: false,
    prioridade: 'alta',
    conta: 'TudoAzul',
    acao: 'verificar_conta',
  },
  {
    id: 5,
    tipo: 'info',
    titulo: 'Promoção Especial',
    mensagem: 'Oferta especial: compre milhas com 20% de desconto',
    data: '2024-08-13T11:00:00',
    lida: true,
    prioridade: 'media',
    conta: 'Geral',
    acao: 'ver_promocoes',
  },
  {
    id: 6,
    tipo: 'warning',
    titulo: 'Backup Realizado',
    mensagem: 'Backup automático dos seus dados foi realizado com sucesso',
    data: '2024-08-13T02:00:00',
    lida: true,
    prioridade: 'baixa',
    conta: 'Sistema',
    acao: 'ver_backup',
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filtro, setFiltro] = useState('todas');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, lida: true }
          : notification
      )
    );
    handleMenuClose();
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, lida: true }))
    );
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    handleMenuClose();
  };

  const handleDeleteAll = () => {
    if (window.confirm('Tem certeza que deseja excluir todas as notificações?')) {
      setNotifications([]);
    }
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      case 'success':
        return <CheckCircle color="success" />;
      default:
        return <Info color="info" />;
    }
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'alta':
        return 'error';
      case 'media':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    // Filtrar por status
    if (filtro === 'nao_lidas') {
      filtered = filtered.filter(n => !n.lida);
    } else if (filtro === 'lidas') {
      filtered = filtered.filter(n => n.lida);
    }

    // Filtrar por busca
    if (busca) {
      filtered = filtered.filter(n =>
        n.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        n.mensagem.toLowerCase().includes(busca.toLowerCase()) ||
        n.conta.toLowerCase().includes(busca.toLowerCase())
      );
    }

    return filtered;
  };

  const unreadCount = notifications.filter(n => !n.lida).length;
  const highPriorityCount = notifications.filter(n => n.prioridade === 'alta' && !n.lida).length;

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" height={40} width={200} />
          <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
        </Box>
      </Layout>
    );
  }

  const filteredNotifications = getFilteredNotifications();

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Notificações
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie suas notificações do sistema
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<MarkEmailRead />}
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Marcar todas como lidas
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDeleteAll}
              disabled={notifications.length === 0}
            >
              Excluir todas
            </Button>
          </Box>
        </Box>

        {/* Estatísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NotificationsIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {notifications.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {unreadCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Não lidas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Warning color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {highPriorityCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Alta prioridade
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircle color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {notifications.filter(n => n.lida).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lidas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filtros */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  placeholder="Buscar notificações..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Filtrar por</InputLabel>
                  <Select
                    value={filtro}
                    label="Filtrar por"
                    onChange={(e) => setFiltro(e.target.value)}
                  >
                    <MenuItem value="todas">Todas</MenuItem>
                    <MenuItem value="nao_lidas">Não lidas</MenuItem>
                    <MenuItem value="lidas">Lidas</MenuItem>
                    <MenuItem value="alta">Alta prioridade</MenuItem>
                    <MenuItem value="media">Média prioridade</MenuItem>
                    <MenuItem value="baixa">Baixa prioridade</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Lista de Notificações */}
        <Card>
          <CardContent>
            {filteredNotifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Nenhuma notificação encontrada
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {busca || filtro !== 'todas' 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Você está em dia com todas as notificações'
                  }
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      sx={{
                        backgroundColor: notification.lida ? 'transparent' : 'action.hover',
                        '&:hover': {
                          backgroundColor: 'action.selected',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: notification.lida ? 'grey.400' : 'primary.main',
                          }}
                        >
                          {getIcon(notification.tipo)}
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: notification.lida ? 400 : 600,
                                flex: 1,
                              }}
                            >
                              {notification.titulo}
                            </Typography>
                            <Chip
                              label={notification.prioridade}
                              size="small"
                              color={getPriorityColor(notification.prioridade)}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {notification.mensagem}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" color="text.disabled">
                                {notification.conta}
                              </Typography>
                              <Typography variant="caption" color="text.disabled">
                                •
                              </Typography>
                              <Typography variant="caption" color="text.disabled">
                                {formatDistanceToNow(new Date(notification.data), {
                                  addSuffix: true,
                                  locale: ptBR,
                                })}
                              </Typography>
                              <Typography variant="caption" color="text.disabled">
                                •
                              </Typography>
                              <Typography variant="caption" color="text.disabled">
                                {format(new Date(notification.data), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, notification)}
                      >
                        <MoreVert />
                      </IconButton>
                    </ListItem>
                    
                    {index < filteredNotifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Menu de Ações */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {!selectedNotification?.lida && (
            <MenuItem onClick={() => handleMarkAsRead(selectedNotification?.id)}>
              <ListItemIcon>
                <MarkEmailRead />
              </ListItemIcon>
              <ListItemText>Marcar como lida</ListItemText>
            </MenuItem>
          )}
          <MenuItem onClick={() => handleDelete(selectedNotification?.id)} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete color="error" />
            </ListItemIcon>
            <ListItemText>Excluir</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Layout>
  );
};

export default Notifications;
