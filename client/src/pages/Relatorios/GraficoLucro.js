/**
 * Página de Gráfico de Lucro
 * 
 * Análise detalhada de lucratividade com gráficos interativos
 * e comparações por período, pessoa e programa.
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
  Avatar,
  IconButton,
  Tooltip,
  Slider
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
  PieChart,
  BarChart,
  Timeline
} from '@mui/icons-material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, AreaChart, Area,
  ComposedChart, Legend
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const GraficoLucro = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('linha'); // linha, barra, area, pizza
  const [periodo, setPeriodo] = useState('6meses');
  const [filtros, setFiltros] = useState({
    pessoa: 'todos',
    programa: 'todos',
    tipoOperacao: 'todos'
  });

  // Dados mockados baseados nas imagens
  const [dadosLucro] = useState({
    evolucaoLucro: [
      { mes: 'Jan', lucro: 25500, receita: 85000, custo: 59500, margem: 30.0 },
      { mes: 'Fev', lucro: 27600, receita: 92000, custo: 64400, margem: 30.0 },
      { mes: 'Mar', lucro: 23400, receita: 78000, custo: 54600, margem: 30.0 },
      { mes: 'Abr', lucro: 31500, receita: 105000, custo: 73500, margem: 30.0 },
      { mes: 'Mai', lucro: 29400, receita: 98000, custo: 68600, margem: 30.0 },
      { mes: 'Jun', lucro: 26700, receita: 89000, custo: 62300, margem: 30.0 }
    ],
    lucroPorPessoa: [
      { pessoa: 'João Silva', lucro: 12500, receita: 42000, margem: 29.8 },
      { pessoa: 'Maria Santos', lucro: 9800, receita: 35000, margem: 28.0 },
      { pessoa: 'Pedro Oliveira', lucro: 8500, receita: 30000, margem: 28.3 },
      { pessoa: 'Ana Costa', lucro: 7200, receita: 25000, margem: 28.8 },
      { pessoa: 'Carlos Pereira', lucro: 6800, receita: 24000, margem: 28.3 }
    ],
    lucroPorPrograma: [
      { programa: 'LATAM Pass', lucro: 13500, receita: 45000, margem: 30.0 },
      { programa: 'Smiles', lucro: 9600, receita: 32000, margem: 30.0 },
      { programa: 'TudoAzul', lucro: 8400, receita: 28000, margem: 30.0 },
      { programa: 'Livelo', lucro: 4500, receita: 15000, margem: 30.0 },
      { programa: 'LifeMiles', lucro: 2700, receita: 9000, margem: 30.0 }
    ]
  });

  const pessoas = [
    'Todos', 'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const programas = [
    'Todos', 'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles'
  ];

  const tiposOperacao = [
    'Todos', 'Vendas', 'Transferências', 'Compras', 'Passagens'
  ];

  const periodos = [
    { value: '30dias', label: 'Últimos 30 dias' },
    { value: '3meses', label: 'Últimos 3 meses' },
    { value: '6meses', label: 'Últimos 6 meses' },
    { value: '1ano', label: 'Último ano' },
    { value: '2anos', label: 'Últimos 2 anos' }
  ];

  const coresProgramas = {
    'LATAM Pass': '#3B82F6',
    'Smiles': '#10B981',
    'TudoAzul': '#F59E0B',
    'Livelo': '#EF4444',
    'LifeMiles': '#8B5CF6'
  };

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
    console.log('Exportando gráfico de lucro...');
  };

  // Cálculos de estatísticas
  const stats = {
    lucroTotal: dadosLucro.evolucaoLucro.reduce((sum, item) => sum + item.lucro, 0),
    receitaTotal: dadosLucro.evolucaoLucro.reduce((sum, item) => sum + item.receita, 0),
    margemMedia: dadosLucro.evolucaoLucro.reduce((sum, item) => sum + item.margem, 0) / dadosLucro.evolucaoLucro.length,
    crescimento: ((dadosLucro.evolucaoLucro[dadosLucro.evolucaoLucro.length - 1].lucro - dadosLucro.evolucaoLucro[0].lucro) / dadosLucro.evolucaoLucro[0].lucro * 100)
  };

  const renderChart = () => {
    const data = dadosLucro.evolucaoLucro;
    
    switch (viewType) {
      case 'linha':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <RechartsTooltip 
              formatter={(value, name) => [
                `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                name === 'lucro' ? 'Lucro' : name === 'receita' ? 'Receita' : 'Custo'
              ]}
            />
            <Legend />
            <Line type="monotone" dataKey="lucro" stroke="#10B981" strokeWidth={3} name="Lucro" />
            <Line type="monotone" dataKey="receita" stroke="#3B82F6" strokeWidth={2} name="Receita" />
            <Line type="monotone" dataKey="custo" stroke="#EF4444" strokeWidth={2} name="Custo" />
          </LineChart>
        );
      
      case 'barra':
        return (
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <RechartsTooltip 
              formatter={(value, name) => [
                `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                name === 'lucro' ? 'Lucro' : name === 'receita' ? 'Receita' : 'Custo'
              ]}
            />
            <Legend />
            <Bar dataKey="lucro" fill="#10B981" name="Lucro" />
            <Bar dataKey="receita" fill="#3B82F6" name="Receita" />
            <Bar dataKey="custo" fill="#EF4444" name="Custo" />
          </RechartsBarChart>
        );
      
      case 'area':
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <RechartsTooltip 
              formatter={(value, name) => [
                `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                name === 'lucro' ? 'Lucro' : name === 'receita' ? 'Receita' : 'Custo'
              ]}
            />
            <Legend />
            <Area type="monotone" dataKey="receita" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Receita" />
            <Area type="monotone" dataKey="custo" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Custo" />
            <Line type="monotone" dataKey="lucro" stroke="#10B981" strokeWidth={3} name="Lucro" />
          </ComposedChart>
        );
      
      case 'pizza':
        const pieData = dadosLucro.lucroPorPrograma.map(item => ({
          ...item,
          color: coresProgramas[item.programa] || '#6B7280'
        }));
        return (
          <RechartsPieChart>
            <RechartsTooltip 
              formatter={(value, name) => [
                `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                'Lucro'
              ]}
            />
            <RechartsPieChart
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="lucro"
              label={({ programa, percent }) => `${programa} (${(percent * 100).toFixed(1)}%)`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </RechartsPieChart>
          </RechartsPieChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Gráfico de Lucro
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Análise detalhada de lucratividade e performance
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
              <FormControl fullWidth>
                <InputLabel>Tipo de Operação</InputLabel>
                <Select
                  value={filtros.tipoOperacao}
                  label="Tipo de Operação"
                  onChange={(e) => handleFilterChange('tipoOperacao', e.target.value)}
                >
                  {tiposOperacao.map(tipo => (
                    <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                <AttachMoney sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Lucro Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                R$ {stats.lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Período selecionado
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Receita Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                R$ {stats.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Período selecionado
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Margem Média</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.margemMedia.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lucratividade média
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShowChart sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Crescimento</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: stats.crescimento >= 0 ? 'success.main' : 'error.main' }}>
                {stats.crescimento >= 0 ? '+' : ''}{stats.crescimento.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vs início do período
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
            <BarChart sx={{ mr: 1 }} />
            Barra
          </ToggleButton>
          <ToggleButton value="area">
            <ShowChart sx={{ mr: 1 }} />
            Área
          </ToggleButton>
          <ToggleButton value="pizza">
            <PieChart sx={{ mr: 1 }} />
            Pizza
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Gráfico Principal */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <ShowChart sx={{ mr: 1, verticalAlign: 'middle' }} />
                Evolução do Lucro
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
          {/* Top Pessoas */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Top Vendedores
              </Typography>
              <List>
                {dadosLucro.lucroPorPessoa.slice(0, 5).map((pessoa, index) => (
                  <ListItem key={pessoa.pessoa} divider={index < 4}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {index + 1}
                    </Avatar>
                    <ListItemText
                      primary={pessoa.pessoa}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Lucro: R$ {pessoa.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Margem: {pessoa.margem.toFixed(1)}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Performance por Programa */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                Performance por Programa
              </Typography>
              <Stack spacing={2}>
                {dadosLucro.lucroPorPrograma.map((programa, index) => (
                  <Box key={programa.programa}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: coresProgramas[programa.programa] 
                          }} 
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {programa.programa}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        R$ {programa.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Receita: R$ {programa.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Margem: {programa.margem.toFixed(1)}%
                      </Typography>
                    </Box>
                    {index < dadosLucro.lucroPorPrograma.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
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

export default GraficoLucro;
