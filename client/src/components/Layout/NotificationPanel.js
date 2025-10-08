/**
 * Componente NotificationPanel - Sistema de Gestão de Milhas
 * 
 * Painel lateral de notificações com lista de alertas
 * e configurações de notificação.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Chip,
  Button,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  MarkEmailRead as MarkReadIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NOTIFICATION_WIDTH = 360;

const mockNotifications = [
  {
    id: 1,
    type: 'warning',
    title: 'Pontos Expirando',
    message: '50.000 pontos na conta Latam Pass expiram em 15 dias',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    read: false,
    priority: 'alta',
    account: 'Latam Pass',
  },
  {
    id: 2,
    type: 'info',
    title: 'Nova Transação',
    message: 'Compra de 25.000 milhas registrada com sucesso',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
    read: false,
    priority: 'media',
    account: 'Smiles',
  },
  {
    id: 3,
    type: 'success',
    title: 'Meta Concluída',
    message: 'Parabéns! Você atingiu a meta de 100.000 milhas',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
    read: true,
    priority: 'baixa',
    account: 'Geral',
  },
  {
    id: 4,
    type: 'error',
    title: 'Saldo Baixo',
    message: 'Conta TudoAzul com saldo abaixo de 1.000 pontos',
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    read: false,
    priority: 'alta',
    account: 'TudoAzul',
  },
];

const NotificationPanel = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'success':
        return <SuccessIcon color="success" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta':
        return 'error';
      case 'media':
        return 'warning';
      default:
        return 'default';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'alta' && !n.read).length;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: NOTIFICATION_WIDTH,
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notificações
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Configurações">
              <IconButton size="small">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Actions */}
        {unreadCount > 0 && (
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Button
              size="small"
              startIcon={<MarkReadIcon />}
              onClick={markAllAsRead}
              sx={{ width: '100%' }}
            >
              Marcar todas como lidas
            </Button>
          </Box>
        )}

        {/* Alerts Summary */}
        {highPriorityCount > 0 && (
          <Box sx={{ p: 2, backgroundColor: 'error.50', borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <WarningIcon color="error" sx={{ fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: 'error.main', fontWeight: 600 }}>
                {highPriorityCount} alerta{highPriorityCount > 1 ? 's' : ''} crítico{highPriorityCount > 1 ? 's' : ''}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Requer atenção imediata
            </Typography>
          </Box>
        )}

        {/* Notifications List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Nenhuma notificação
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                      cursor: 'pointer',
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getIcon(notification.type)}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: notification.read ? 400 : 600,
                              flex: 1,
                            }}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.priority}
                            size="small"
                            color={getPriorityColor(notification.priority)}
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
                            {notification.message}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              sx={{
                                width: 20,
                                height: 20,
                                fontSize: '0.7rem',
                                backgroundColor: 'primary.main',
                              }}
                            >
                              {notification.account.charAt(0)}
                            </Avatar>
                            <Typography variant="caption" color="text.disabled">
                              {notification.account}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              •
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {formatDistanceToNow(notification.time, {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
            {notifications.length} notificação{notifications.length !== 1 ? 'ões' : ''} total
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationPanel;
