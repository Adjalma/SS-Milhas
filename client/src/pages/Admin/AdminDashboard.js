/**
 * Dashboard Administrativo
 * 
 * Interface administrativa para gerenciar o sistema SS Milhas.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  AccountBalanceWallet,
  Receipt,
  Assessment,
  MoreVert,
  AdminPanelSettings,
  Security,
  Settings,
  Logout,
  PersonAdd,
  PersonRemove,
  Block,
  CheckCircle,
  Warning,
  Info,
  Star,
  FlightTakeoff,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';

// Dados mockados
const mockAdminData = {
  stats: {
    totalUsuarios: 1247,
    usuariosAtivos: 1156,
    totalContas: 4988,
    totalTransacoes: 15673,
    receitaTotal: 125000.50,
    lucroMes: 8750.25,
    crescimentoUsuarios: 12.5,
    crescimentoReceita: 8.3,
  },
  usuariosRecentes: [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@email.com',
      dataCadastro: '2024-08-15',
      status: 'ativo',
      totalContas: 4,
      totalTransacoes: 23,
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@email.com',
      dataCadastro: '2024-08-14',
      status: 'ativo',
      totalContas: 2,
      totalTransacoes: 15,
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      email: 'pedro@email.com',
      dataCadastro: '2024-08-13',
      status: 'inativo',
      totalContas: 1,
      totalTransacoes: 5,
    },
  ],
  transacoesRecentes: [
    {
      id: 1,
      usuario: 'João Silva',
      tipo: 'compra',
      valor: 1500.00,
      data: '2024-08-15T10:30:00',
      status: 'concluida',
    },
    {
      id: 2,
      usuario: 'Maria Santos',
      tipo: 'venda',
      valor: 900.00,
      data: '2024-08-15T09:15:00',
      status: 'pendente',
    },
    {
      id: 3,
      usuario: 'Ana Oliveira',
      tipo: 'compra',
      valor: 2200.00,
      data: '2024-08-14T16:45:00',
      status: 'concluida',
    },
  ],
  evolucaoUsuarios: [
    { mes: 'Jan', usuarios: 850 },
    { mes: 'Fev', usuarios: 920 },
    { mes: 'Mar', usuarios: 980 },
    { mes: 'Abr', usuarios: 1050 },
    { mes: 'Mai', usuarios: 1100 },
    { mes: 'Jun', usuarios: 1150 },
    { mes: 'Jul', usuarios: 1200 },
    { mes: 'Ago', usuarios: 1247 },
  ],
  receitaPorMes: [
    { mes: 'Jan', receita: 85000 },
    { mes: 'Fev', receita: 92000 },
    { mes: 'Mar', receita: 98000 },
    { mes: 'Abr', receita: 105000 },
    { mes: 'Mai', receita: 110000 },
    { mes: 'Jun', receita: 115000 },
    { mes: 'Jul', receita: 120000 },
    { mes: 'Ago', receita: 125000 },
  ],
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      setData(mockAdminData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados administrativos:', error);
      setLoading(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo':
        return 'success';
      case 'inativo':
        return 'error';
      case 'pendente':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'compra':
        return 'success';
      case 'venda':
        return 'error';
      case 'transferencia':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" height={60} width={300} />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header Admin */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
          color: 'white',
          p: 3,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AdminPanelSettings sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Painel Administrativo
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                SS Milhas - Sistema de Gestão
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<Security />}
              label="Admin"
              color="primary"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <IconButton onClick={handleMenuOpen} sx={{ color: 'white' }}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Estatísticas Principais */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <People />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {data.stats.totalUsuarios.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Usuários
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  +{data.stats.crescimentoUsuarios}% este mês
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {data.stats.usuariosAtivos.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Usuários Ativos
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={92}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {((data.stats.usuariosAtivos / data.stats.totalUsuarios) * 100).toFixed(1)}% ativos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <AccountBalanceWallet />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {data.stats.totalContas.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Contas
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  color="info"
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Média: {(data.stats.totalContas / data.stats.totalUsuarios).toFixed(1)} por usuário
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <TrendingUp />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      R$ {data.stats.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receita Total
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={80}
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  +{data.stats.crescimentoReceita}% este mês
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Evolução de Usuários
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.evolucaoUsuarios}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="usuarios"
                      stroke="#8884d8"
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Receita por Mês
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.receitaPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="receita" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabelas */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Usuários Recentes
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Usuário</TableCell>
                        <TableCell align="right">Contas</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.usuariosRecentes.map((usuario) => (
                        <TableRow key={usuario.id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {usuario.nome}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {usuario.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {usuario.totalContas}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={usuario.status}
                              color={getStatusColor(usuario.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton size="small">
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Transações Recentes
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Usuário</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell align="right">Valor</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.transacoesRecentes.map((transacao) => (
                        <TableRow key={transacao.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {transacao.usuario}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={transacao.tipo}
                              color={getTipoColor(transacao.tipo)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              R$ {transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={transacao.status}
                              color={getStatusColor(transacao.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Menu de Ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate('/admin/users')}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText>Gerenciar Usuários</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigate('/admin/transactions')}>
          <ListItemIcon>
            <Receipt />
          </ListItemIcon>
          <ListItemText>Ver Transações</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigate('/admin/settings')}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText>Configurações</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Logout color="error" />
          </ListItemIcon>
          <ListItemText>Sair</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminDashboard;
