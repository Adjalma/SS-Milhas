/**
 * Página de Relatório de Evolução
 * 
 * Análise de tendências e evolução do negócio ao longo do tempo
 * com projeções e análises preditivas.
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
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Assessment,
  Refresh,
  Download,
  FilterList,
  CalendarToday,
  Person,
  Business,
  ShowChart,
  Timeline,
  CompareArrows,
  Speed,
  Warning,
  CheckCircle,
  Info
} from '@mui/icons-material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart as RechartsBarChart, Bar, AreaChart, Area, ComposedChart, Legend,
  ScatterChart, Scatter, ReferenceLine
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const Evolucao = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('linha'); // linha, barra, area, scatter
  const [periodo, setPeriodo] = useState('12meses');
  const [mostrarProjecao, setMostrarProjecao] = useState(true);
  const [filtros, setFiltros] = useState({
    pessoa: 'todos',
    programa: 'todos',
    metrica: 'receita'
  });

  // Dados mockados baseados nas imagens
  const [dadosEvolucao] = useState({
    evolucaoHistorica: [
      { mes: 'Jan 2023', receita: 65000, lucro: 19500, operacoes: 120, clientes: 45 },
      { mes: 'Fev 2023', receita: 72000, lucro: 21600, operacoes: 135, clientes: 48 },
      { mes: 'Mar 2023', receita: 68000, lucro: 20400, operacoes: 128, clientes: 52 },
      { mes: 'Abr 2023', receita: 85000, lucro: 25500, operacoes: 142, clientes: 55 },
      { mes: 'Mai 2023', receita: 78000, lucro: 23400, operacoes: 138, clientes: 58 },
      { mes: 'Jun 2023', receita: 92000, lucro: 27600, operacoes: 158, clientes: 62 },
      { mes: 'Jul 2023', receita: 88000, lucro: 26400, operacoes: 152, clientes: 65 },
      { mes: 'Ago 2023', receita: 95000, lucro: 28500, operacoes: 165, clientes: 68 },
      { mes: 'Set 2023', receita: 78000, lucro: 23400, operacoes: 134, clientes: 70 },
      { mes: 'Out 2023', receita: 105000, lucro: 31500, operacoes: 172, clientes: 75 },
      { mes: 'Nov 2023', receita: 98000, lucro: 29400, operacoes: 165, clientes: 78 },
      { mes: 'Dez 2023', receita: 89000, lucro: 26700, operacoes: 156, clientes: 80 },
      { mes: 'Jan 2024', receita: 95000, lucro: 28500, operacoes: 165, clientes: 82 },
      { mes: 'Fev 2024', receita: 102000, lucro: 30600, operacoes: 178, clientes: 85 },
      { mes: 'Mar 2024', receita: 98000, lucro: 29400, operacoes: 172, clientes: 88 },
      { mes: 'Abr 2024', receita: 115000, lucro: 34500, operacoes: 195, clientes: 92 },
      { mes: 'Mai 2024', receita: 108000, lucro: 32400, operacoes: 188, clientes: 95 },
      { mes: 'Jun 2024', receita: 125000, lucro: 37500, operacoes: 210, clientes: 98 }
    ],
    projecao: [
      { mes: 'Jul 2024', receita: 128000, lucro: 38400, operacoes: 215, clientes: 100 },
      { mes: 'Ago 2024', receita: 135000, lucro: 40500, operacoes: 225, clientes: 102 },
      { mes: 'Set 2024', receita: 132000, lucro: 39600, operacoes: 220, clientes: 105 },
      { mes: 'Out 2024', receita: 142000, lucro: 42600, operacoes: 235, clientes: 108 },
      { mes: 'Nov 2024', receita: 138000, lucro: 41400, operacoes: 230, clientes: 110 },
      { mes: 'Dez 2024', receita: 148000, lucro: 44400, operacoes: 245, clientes: 112 }
    ],
    tendencias: {
      crescimentoAnual: 18.5,
      crescimentoMensal: 2.1,
      tendenciaReceita: 'alta',
      tendenciaLucro: 'alta',
      sazonalidade: 'alta'
    },
    alertas: [
      { tipo: 'success', mensagem: 'Crescimento consistente nos últimos 6 meses', icone: 'trending_up' },
      { tipo: 'info', mensagem: 'Sazonalidade detectada - picos em Dez/Mar', icone: 'info' },
      { tipo: 'warning', mensagem: 'Margem de lucro estável - oportunidade de otimização', icone: 'warning' }
    ]
  });

  const pessoas = [
    'Todos', 'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const programas = [
    'Todos', 'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles'
  ];

  const metricas = [
    { value: 'receita', label: 'Receita' },
    { value: 'lucro', label: 'Lucro' },
    { value: 'operacoes', label: 'Operações' },
    { value: 'clientes', label: 'Clientes' }
  ];

  const periodos = [
    { value: '6meses', label: 'Últimos 6 meses' },
    { value: '12meses', label: 'Últimos 12 meses' },
    { value: '18meses', label: 'Últimos 18 meses' },
    { value: '24meses', label: 'Últimos 24 meses' }
  ];

  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
    console.log('Exportando relatório de evolução...');
  };

  const getTendenciaIcon = (tendencia) => {
    switch (tendencia) {
      case 'alta': return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'baixa': return <TrendingDown sx={{ color: 'error.main' }} />;
      default: return <Timeline sx={{ color: 'warning.main' }} />;
    }
  };

  const getAlertaIcon = (tipo) => {
    switch (tipo) {
      case 'success': return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'warning': return <Warning sx={{ color: 'warning.main' }} />;
      case 'info': return <Info sx={{ color: 'info.main' }} />;
      default: return <Info sx={{ color: 'info.main' }} />;
    }
  };

  // Combinar dados históricos com projeção
  const dadosCompletos = mostrarProjecao 
    ? [...dadosEvolucao.evolucaoHistorica, ...dadosEvolucao.projecao]
    : dadosEvolucao.evolucaoHistorica;

  // Filtrar dados baseado no período selecionado
  const dadosFiltrados = dadosCompletos.slice(-parseInt(periodo.replace('meses', '')) * 1);

  const renderChart = () => {
    const data = dadosFiltrados;
    const metrica = filtros.metrica;
    
    switch (viewType) {
      case 'linha':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <RechartsTooltip 
              formatter={(value, name) => {
                const formatValue = metrica === 'receita' || metrica === 'lucro' 
                  ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : value.toLocaleString();
                return [formatValue, name === metrica ? metricas.find(m => m.value === metrica)?.label : name];
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={metrica} 
              stroke="#3B82F6" 
              strokeWidth={3} 
              name={metricas.find(m => m.value === metrica)?.label}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
            {mostrarProjecao && (
              <ReferenceLine x={dadosEvolucao.evolucaoHistorica[dadosEvolucao.evolucaoHistorica.length - 1].mes} stroke="#EF4444" strokeDasharray="5 5" />
            )}
          </LineChart>
        );
      
      case 'barra':
        return (
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <RechartsTooltip 
              formatter={(value, name) => {
                const formatValue = metrica === 'receita' || metrica === 'lucro' 
                  ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : value.toLocaleString();
                return [formatValue, name === metrica ? metricas.find(m => m.value === metrica)?.label : name];
              }}
            />
            <Legend />
            <Bar dataKey={metrica} fill="#3B82F6" name={metricas.find(m => m.value === metrica)?.label} />
            {mostrarProjecao && (
              <ReferenceLine x={dadosEvolucao.evolucaoHistorica[dadosEvolucao.evolucaoHistorica.length - 1].mes} stroke="#EF4444" strokeDasharray="5 5" />
            )}
          </RechartsBarChart>
        );
      
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <RechartsTooltip 
              formatter={(value, name) => {
                const formatValue = metrica === 'receita' || metrica === 'lucro' 
                  ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : value.toLocaleString();
                return [formatValue, name === metrica ? metricas.find(m => m.value === metrica)?.label : name];
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey={metrica} 
              stroke="#3B82F6" 
              fill="#3B82F6" 
              fillOpacity={0.6}
              name={metricas.find(m => m.value === metrica)?.label}
            />
            {mostrarProjecao && (
              <ReferenceLine x={dadosEvolucao.evolucaoHistorica[dadosEvolucao.evolucaoHistorica.length - 1].mes} stroke="#EF4444" strokeDasharray="5 5" />
            )}
          </AreaChart>
        );
      
      case 'scatter':
        return (
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="operacoes" name="Operações" />
            <YAxis dataKey={metrica} name={metricas.find(m => m.value === metrica)?.label} />
            <RechartsTooltip 
              formatter={(value, name) => {
                const formatValue = metrica === 'receita' || metrica === 'lucro' 
                  ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : value.toLocaleString();
                return [formatValue, name === metrica ? metricas.find(m => m.value === metrica)?.label : name];
              }}
            />
            <Legend />
            <Scatter dataKey={metrica} fill="#3B82F6" />
          </ScatterChart>
        );
      
      default:
        return null;
    }
  };

  // Cálculos de estatísticas
  const stats = {
    crescimentoAnual: dadosEvolucao.tendencias.crescimentoAnual,
    crescimentoMensal: dadosEvolucao.tendencias.crescimentoMensal,
    valorAtual: dadosFiltrados[dadosFiltrados.length - 1]?.[filtros.metrica] || 0,
    valorInicial: dadosFiltrados[0]?.[filtros.metrica] || 0,
    crescimentoPeriodo: dadosFiltrados.length > 1 
      ? ((dadosFiltrados[dadosFiltrados.length - 1][filtros.metrica] - dadosFiltrados[0][filtros.metrica]) / dadosFiltrados[0][filtros.metrica] * 100)
      : 0
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Relatório de Evolução
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Análise de tendências e projeções do negócio
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
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

      {/* Filtros */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filtros e Configurações
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
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
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Métrica</InputLabel>
                <Select
                  value={filtros.metrica}
                  label="Métrica"
                  onChange={(e) => handleFilterChange('metricas', e.target.value)}
                >
                  {metricas.map(metrica => (
                    <MenuItem key={metrica.value} value={metrica.value}>{metrica.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Pessoa</InputLabel>
                <Select
                  value={filtros.pessoa}
                  label="Pessoa"
                  onChange={(e) => handleFilterChange('pessoa', e.target.value)}
                >
                  {pessoas.map(pessoa => (
                    <MenuItem key={pessoa} value={pessoa}>{pessoa}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Programa</InputLabel>
                <Select
                  value={filtros.programa}
                  label="Programa"
                  onChange={(e) => handleFilterChange('programa', e.target.value)}
                >
                  {programas.map(programa => (
                    <MenuItem key={programa} value={programa}>{programa}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mostrarProjecao}
                    onChange={(e) => setMostrarProjecao(e.target.checked)}
                  />
                }
                label="Mostrar Projeção"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Crescimento Anual</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                +{stats.crescimentoAnual}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Últimos 12 meses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Crescimento Mensal</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                +{stats.crescimentoMensal}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Média mensal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Valor Atual</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {filtros.metrica === 'receita' || filtros.metrica === 'lucro' 
                  ? `R$ ${stats.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : stats.valorAtual.toLocaleString()
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metricas.find(m => m.value === filtros.metrica)?.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CompareArrows sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Crescimento Período</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: stats.crescimentoPeriodo >= 0 ? 'success.main' : 'error.main' }}>
                {stats.crescimentoPeriodo >= 0 ? '+' : ''}{stats.crescimentoPeriodo.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No período selecionado
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controles de Visualização */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={(e, newValue) => newValue && setViewType(newValue)}
        >
          <ToggleButton value="linha">
            <Timeline sx={{ mr: 1 }} />
            Linha
          </ToggleButton>
          <ToggleButton value="barra">
            <ShowChart sx={{ mr: 1 }} />
            Barra
          </ToggleButton>
          <ToggleButton value="area">
            <Assessment sx={{ mr: 1 }} />
            Área
          </ToggleButton>
          <ToggleButton value="scatter">
            <CompareArrows sx={{ mr: 1 }} />
            Dispersão
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Gráfico Principal */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                Evolução {metricas.find(m => m.value === filtros.metrica)?.label}
                {mostrarProjecao && <Chip label="Com Projeção" color="secondary" size="small" sx={{ ml: 2 }} />}
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Tendências */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                Análise de Tendências
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Receita:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTendenciaIcon(dadosEvolucao.tendencias.tendenciaReceita)}
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      Tendência Alta
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Lucro:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTendenciaIcon(dadosEvolucao.tendencias.tendenciaLucro)}
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      Tendência Alta
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Sazonalidade:</Typography>
                  <Chip 
                    label="Alta" 
                    color="warning" 
                    size="small"
                    icon={<CalendarToday />}
                  />
                </Box>
                
                <Divider />
                
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Crescimento Médio
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600 }}>
                    +{stats.crescimentoAnual}% a.a.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Acima da média do mercado
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Alertas */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                Alertas e Insights
              </Typography>
              <List>
                {dadosEvolucao.alertas.map((alerta, index) => (
                  <ListItem key={index} divider={index < dadosEvolucao.alertas.length - 1}>
                    <ListItemIcon>
                      {getAlertaIcon(alerta.tipo)}
                    </ListItemIcon>
                    <ListItemText
                      primary={alerta.mensagem}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loading */}
      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
};

export default Evolucao;
