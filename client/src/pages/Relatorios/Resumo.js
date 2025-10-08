/**
 * Página de Relatório de Resumo
 * 
 * Dashboard executivo com resumo geral das operações,
 * KPIs principais e indicadores de performance.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  FlightTakeoff,
  People,
  Assessment,
  Refresh,
  Download,
  FilterList,
  CalendarToday,
  CalendarMonth,
  TrendingFlat,
  CheckCircle,
  Warning,
  Error,
  Info
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, AreaChart, Area } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const Resumo = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [periodo, setPeriodo] = useState('30dias');

  // Dados mockados baseados nas imagens
  const [dadosResumo] = useState({
    resumoGeral: {
      totalContas: 542,
      totalMilhas: 12500000,
      valorTotal: 375000.00,
      operacoesMes: 156,
      receitaMes: 89000.00,
      lucroMes: 26700.00,
      margemMedia: 30.0
    },
    evolucao: {
      crescimento: 15.2,
      tendencia: 'alta',
      mesAnterior: {
        operacoes: 142,
        receita: 78000.00,
        lucro: 23400.00
      }
    },
    alertas: [
      { tipo: 'warning', mensagem: '5 contas com saldo baixo', acao: 'Verificar' },
      { tipo: 'info', mensagem: '12 transferências pendentes', acao: 'Processar' },
      { tipo: 'success', mensagem: 'Meta mensal atingida', acao: 'Parabéns!' }
    ]
  });

  const periodos = [
    { value: '7dias', label: 'Últimos 7 dias' },
    { value: '30dias', label: 'Últimos 30 dias' },
    { value: '90dias', label: 'Últimos 90 dias' },
    { value: '6meses', label: 'Últimos 6 meses' },
    { value: '1ano', label: 'Último ano' }
  ];

  // Dados para gráficos
  const chartData = [
    { mes: 'Jan', receita: 85000, lucro: 25500, operacoes: 142 },
    { mes: 'Fev', receita: 92000, lucro: 27600, operacoes: 158 },
    { mes: 'Mar', receita: 78000, lucro: 23400, operacoes: 134 },
    { mes: 'Abr', receita: 105000, lucro: 31500, operacoes: 172 },
    { mes: 'Mai', receita: 98000, lucro: 29400, operacoes: 165 },
    { mes: 'Jun', receita: 89000, lucro: 26700, operacoes: 156 }
  ];

  const programaData = [
    { programa: 'LATAM Pass', milhas: 4500000, valor: 135000, percentual: 36 },
    { programa: 'Smiles', milhas: 3200000, valor: 96000, percentual: 25.6 },
    { programa: 'TudoAzul', milhas: 2800000, valor: 84000, percentual: 22.4 },
    { programa: 'Livelo', milhas: 1500000, valor: 45000, percentual: 12 },
    { programa: 'Outros', milhas: 500000, valor: 15000, percentual: 4 }
  ];

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Dados atualizados');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    console.log('Exportando resumo executivo...');
  };

  const getTendenciaIcon = (tendencia) => {
    switch (tendencia) {
      case 'alta': return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'baixa': return <TrendingDown sx={{ color: 'error.main' }} />;
      default: return <TrendingFlat sx={{ color: 'warning.main' }} />;
    }
  };

  const getAlertaIcon = (tipo) => {
    switch (tipo) {
      case 'success': return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'warning': return <Warning sx={{ color: 'warning.main' }} />;
      case 'error': return <Error sx={{ color: 'error.main' }} />;
      default: return <Info sx={{ color: 'info.main' }} />;
    }
  };

  const getAlertaColor = (tipo) => {
    switch (tipo) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Resumo Executivo
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Visão geral das operações e performance do negócio
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={periodo}
              label="Período"
              onChange={(e) => setPeriodo(e.target.value)}
            >
              {periodos.map(p => (
                <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Exportar
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Atualizar
          </Button>
        </Box>
      </Box>

      {/* KPIs Principais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Contas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {dadosResumo.resumoGeral.totalContas.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {getTendenciaIcon('alta')}
                <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                  +12 este mês
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FlightTakeoff sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Total Milhas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {(dadosResumo.resumoGeral.totalMilhas / 1000000).toFixed(1)}M
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {getTendenciaIcon('alta')}
                <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                  +8.5% vs mês anterior
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Receita Mês</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                R$ {dadosResumo.resumoGeral.receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {getTendenciaIcon('alta')}
                <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                  +14.1% vs mês anterior
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Lucro Mês</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                R$ {dadosResumo.resumoGeral.lucroMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {getTendenciaIcon('alta')}
                <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                  +14.1% vs mês anterior
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Margem Média</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                {dadosResumo.resumoGeral.margemMedia}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {getTendenciaIcon('alta')}
                <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                  +2.3% vs mês anterior
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos Principais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Evolução Mensal
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="receita" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="lucro" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Distribuição por Programa
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={programaData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="programa" type="category" width={100} />
                    <RechartsTooltip />
                    <Bar dataKey="valor" fill="#3B82F6" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alertas e Ações */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                Alertas e Notificações
              </Typography>
              <List>
                {dadosResumo.alertas.map((alerta, index) => (
                  <ListItem key={index} divider={index < dadosResumo.alertas.length - 1}>
                    <ListItemIcon>
                      {getAlertaIcon(alerta.tipo)}
                    </ListItemIcon>
                    <ListItemText
                      primary={alerta.mensagem}
                      secondary={alerta.acao}
                    />
                    <Button size="small" variant="outlined">
                      Ação
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Comparativo Mensal
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Operações:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {dadosResumo.resumoGeral.operacoesMes}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      (+{dadosResumo.resumoGeral.operacoesMes - dadosResumo.evolucao.mesAnterior.operacoes})
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Receita:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      R$ {dadosResumo.resumoGeral.receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      (+{((dadosResumo.resumoGeral.receitaMes - dadosResumo.evolucao.mesAnterior.receita) / dadosResumo.evolucao.mesAnterior.receita * 100).toFixed(1)}%)
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Lucro:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      R$ {dadosResumo.resumoGeral.lucroMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      (+{((dadosResumo.resumoGeral.lucroMes - dadosResumo.evolucao.mesAnterior.lucro) / dadosResumo.evolucao.mesAnterior.lucro * 100).toFixed(1)}%)
                    </Typography>
                  </Box>
                </Box>
                
                <Divider />
                
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Crescimento Geral
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600 }}>
                    +{dadosResumo.evolucao.crescimento}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    vs mês anterior
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loading */}
      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
};

export default Resumo;
