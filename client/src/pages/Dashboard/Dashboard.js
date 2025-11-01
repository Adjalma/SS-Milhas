import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Alert,
  Tooltip,
  Avatar,
  Stack,
  CardActionArea,
  CardActions,
  Divider,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  FlightTakeoff,
  Refresh,
  Add,
  Download,
  FilterList,
  Notifications,
  Warning,
  CheckCircle,
  Schedule,
  AttachMoney,
  SwapHoriz,
  PersonAdd,
  Assessment,
  Timeline,
  Clear,
  Visibility,
  Edit,
  Delete,
  Star,
  StarBorder,
  Assignment,
  Speed,
  Security,
  Analytics,
  Storage,
  NetworkCheck,
  CloudSync
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, financialAPI } from '../../services';

// Componente de Card de Métrica
const MetricCard = ({ title, value, change, icon, color = 'primary', onClick }) => {
  const isPositive = change && change > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(145deg, #1A1B2E 0%, #252741 100%)',
          border: `1px solid ${color === 'primary' ? 'rgba(0, 212, 255, 0.2)' : color === 'success' ? 'rgba(16, 185, 129, 0.2)' : color === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: onClick ? 'pointer' : 'default',
          '&:hover': onClick ? {
            transform: 'translateY(-4px)',
            borderColor: color === 'primary' ? 'rgba(0, 212, 255, 0.4)' : color === 'success' ? 'rgba(16, 185, 129, 0.4)' : color === 'warning' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)',
            boxShadow: `0 20px 25px -5px ${color === 'primary' ? 'rgba(0, 212, 255, 0.1)' : color === 'success' ? 'rgba(16, 185, 129, 0.1)' : color === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'}, 0 10px 10px -5px ${color === 'primary' ? 'rgba(0, 212, 255, 0.04)' : color === 'success' ? 'rgba(16, 185, 129, 0.04)' : color === 'warning' ? 'rgba(245, 158, 11, 0.04)' : 'rgba(239, 68, 68, 0.04)'}`
          } : {},
        }}
        onClick={onClick}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {value}
              </Typography>
              {change !== undefined && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {isPositive ? (
                    <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                  )}
                  <Typography
                    variant="body2"
                    color={isPositive ? 'success.main' : 'error.main'}
                    sx={{ fontWeight: 500 }}
                  >
                    {Math.abs(change)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    vs mês anterior
                  </Typography>
                </Stack>
              )}
            </Box>
            <Avatar
              sx={{
                bgcolor: color === 'primary' ? 'primary.main' : color === 'success' ? 'success.main' : color === 'warning' ? 'warning.main' : 'error.main',
                width: 48,
                height: 48,
              }}
            >
              {icon}
            </Avatar>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente de Card de Ação Rápida
const QuickActionCard = ({ title, description, icon, color, onClick }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card
      sx={{
        background: 'linear-gradient(145deg, #1A1B2E 0%, #252741 100%)',
        border: `1px solid ${color}`,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: color.replace('0.2', '0.4'),
          boxShadow: `0 20px 25px -5px ${color.replace('0.2', '0.1')}, 0 10px 10px -5px ${color.replace('0.2', '0.04')}`
        },
      }}
      onClick={onClick}
    >
      <CardActionArea sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Avatar
              sx={{
                bgcolor: color.replace('rgba(', '').replace(', 0.2)', ''),
                width: 40,
                height: 40,
                mb: 2,
              }}
            >
              {icon}
            </Avatar>
            <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
          <Button
            size="small"
            endIcon={<Add />}
            sx={{ mt: 2, alignSelf: 'flex-start' }}
          >
            Acessar
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  </motion.div>
);

// Componente de Atividade Recente
const RecentActivity = ({ activities = [] }) => (
  <Card
    sx={{
      background: 'linear-gradient(145deg, #1A1B2E 0%, #252741 100%)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      backdropFilter: 'blur(10px)',
    }}
  >
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Atividade Recente
        </Typography>
        <IconButton size="small">
          <Refresh />
        </IconButton>
      </Stack>
      
      <Stack spacing={2}>
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: activity.type === 'success' ? 'success.main' : activity.type === 'warning' ? 'warning.main' : 'primary.main',
                  width: 32,
                  height: 32,
                }}
              >
                {activity.icon}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {activity.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activity.time}
                </Typography>
              </Box>
              <Chip
                label={activity.status}
                size="small"
                color={activity.type === 'success' ? 'success' : activity.type === 'warning' ? 'warning' : 'primary'}
                variant="outlined"
              />
            </Stack>
            {index < activities.length - 1 && <Divider sx={{ mt: 2 }} />}
          </motion.div>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

// Componente de Status do Sistema
const SystemStatus = () => {
  const [systems] = useState([
    { name: 'Banco de Dados', status: 'online', progress: 95 },
    { name: 'API Backend', status: 'online', progress: 98 },
    { name: 'Sistema de IA', status: 'online', progress: 87 },
    { name: 'Monitoramento', status: 'online', progress: 92 },
  ]);

  return (
    <Card
      sx={{
        background: 'linear-gradient(145deg, #1A1B2E 0%, #252741 100%)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <NetworkCheck sx={{ color: 'success.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Status do Sistema
          </Typography>
        </Stack>
        
        <Stack spacing={2}>
          {systems.map((system, index) => (
            <Box key={index}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {system.name}
                </Typography>
                <Chip
                  label={system.status}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={system.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'success.main',
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalMilhas: '2.5M',
    valorTotal: 'R$ 485.2K',
    transacoes: '1,247',
    clientes: '342'
  });

  // Simulação de atividades recentes
  const recentActivities = [
    {
      title: 'Nova transação processada',
      time: '2 min atrás',
      status: 'Concluído',
      type: 'success',
      icon: <CheckCircle />
    },
    {
      title: 'Sistema de IA analisou oportunidades',
      time: '5 min atrás',
      status: 'Processado',
      type: 'success',
      icon: <Analytics />
    },
    {
      title: 'Backup automático realizado',
      time: '1 hora atrás',
      status: 'Concluído',
      type: 'success',
      icon: <CloudSync />
    },
    {
      title: 'Monitoramento de canal ativo',
      time: '2 horas atrás',
      status: 'Online',
      type: 'warning',
      icon: <Security />
    }
  ];

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, background: 'linear-gradient(135deg, #0A0B1E 0%, #1A1B2E 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, background: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              Dashboard SS Milhas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bem-vindo de volta, {user?.name || 'Usuário'}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ color: 'text.secondary' }}>
              <Notifications />
            </IconButton>
            <IconButton sx={{ color: 'text.secondary' }}>
              <FilterList />
            </IconButton>
            <IconButton sx={{ color: 'text.secondary' }}>
              <Download />
            </IconButton>
          </Stack>
        </Stack>
      </motion.div>

      {/* Métricas Principais */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total de Milhas"
            value={metrics.totalMilhas}
            change={12.5}
            icon={<FlightTakeoff />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Valor Total"
            value={metrics.valorTotal}
            change={8.3}
            icon={<AccountBalance />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Transações"
            value={metrics.transacoes}
            change={-2.1}
            icon={<SwapHoriz />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Clientes Ativos"
            value={metrics.clientes}
            change={15.7}
            icon={<PersonAdd />}
            color="primary"
          />
        </Grid>
      </Grid>

      {/* Ações Rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Ações Rápidas
        </Typography>
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Nova Transação"
              description="Registrar nova movimentação de milhas"
              icon={<Add />}
              color="rgba(0, 212, 255, 0.2)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Relatórios"
              description="Visualizar análises e relatórios"
              icon={<Assessment />}
              color="rgba(16, 185, 129, 0.2)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Controle de Programas"
              description="Gerenciar programas de milhas"
              icon={<FlightTakeoff />}
              color="rgba(99, 102, 241, 0.2)"
              onClick={() => navigate('/dashboard/controle-programas')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="IA Dashboard"
              description="Monitoramento inteligente"
              icon={<Analytics />}
              color="rgba(99, 102, 241, 0.2)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Configurações"
              description="Gerenciar sistema e usuários"
              icon={<Security />}
              color="rgba(245, 158, 11, 0.2)"
            />
          </Grid>
        </Grid>
      </motion.div>

      {/* Conteúdo Inferior */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <RecentActivity activities={recentActivities} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SystemStatus />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;