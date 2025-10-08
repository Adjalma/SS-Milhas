/**
 * Página de Relatório de Passagens
 * 
 * Relatório detalhado de passagens aéreas com filtros avançados,
 * estatísticas e análise de custos.
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  DatePicker,
  Stack,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Visibility,
  Edit,
  Delete,
  Flight,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  CalendarToday,
  Person,
  LocationOn,
  Refresh,
  Assessment,
  BarChart,
  PieChart
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const Passagens = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('tabela'); // tabela, grafico
  const [chartType, setChartType] = useState('linha'); // linha, barra, pizza
  const [filters, setFilters] = useState({
    periodo: '30dias',
    pessoa: 'todos',
    programa: 'todos',
    status: 'todos',
    dataInicio: '',
    dataFim: '',
    valorMin: '',
    valorMax: '',
    origem: '',
    destino: ''
  });

  // Dados mockados baseados nas imagens
  const [passagens] = useState([
    {
      id: 1,
      pessoa: 'João Silva',
      programa: 'LATAM Pass',
      origem: 'São Paulo (GRU)',
      destino: 'Rio de Janeiro (GIG)',
      dataVoo: '2024-01-20',
      horario: '08:30',
      classe: 'Econômica',
      quantidadeMilhas: 15000,
      valorMilhas: 450.00,
      taxaEmbarque: 89.50,
      valorTotal: 539.50,
      status: 'confirmada',
      dataCompra: '2024-01-15',
      numeroReserva: 'LAT123456'
    },
    {
      id: 2,
      pessoa: 'Maria Santos',
      programa: 'Smiles',
      origem: 'Brasília (BSB)',
      destino: 'São Paulo (GRU)',
      dataVoo: '2024-01-22',
      horario: '14:15',
      classe: 'Executiva',
      quantidadeMilhas: 25000,
      valorMilhas: 750.00,
      taxaEmbarque: 125.00,
      valorTotal: 875.00,
      status: 'confirmada',
      dataCompra: '2024-01-16',
      numeroReserva: 'SMI789012'
    },
    {
      id: 3,
      pessoa: 'Pedro Oliveira',
      programa: 'TudoAzul',
      origem: 'Rio de Janeiro (GIG)',
      destino: 'Fortaleza (FOR)',
      dataVoo: '2024-01-25',
      horario: '19:45',
      classe: 'Econômica',
      quantidadeMilhas: 20000,
      valorMilhas: 600.00,
      taxaEmbarque: 95.00,
      valorTotal: 695.00,
      status: 'pendente',
      dataCompra: '2024-01-18',
      numeroReserva: 'AZU345678'
    }
  ]);

  const programasFidelidade = [
    'Todos', 'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles'
  ];

  const pessoas = [
    'Todos', 'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const statusOptions = [
    'Todos', 'Confirmada', 'Pendente', 'Cancelada', 'Reembolsada'
  ];

  const periodos = [
    { value: '7dias', label: 'Últimos 7 dias' },
    { value: '30dias', label: 'Últimos 30 dias' },
    { value: '90dias', label: 'Últimos 90 dias' },
    { value: '6meses', label: 'Últimos 6 meses' },
    { value: '1ano', label: 'Último ano' },
    { value: 'personalizado', label: 'Período personalizado' }
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Filtros aplicados:', filters);
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    console.log('Exportando relatório de passagens...');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmada': return 'success';
      case 'pendente': return 'warning';
      case 'cancelada': return 'error';
      case 'reembolsada': return 'info';
      default: return 'default';
    }
  };

  // Dados para gráficos
  const chartData = [
    { mes: 'Jan', passagens: 15, valor: 8500 },
    { mes: 'Fev', passagens: 22, valor: 12500 },
    { mes: 'Mar', passagens: 18, valor: 9800 },
    { mes: 'Abr', passagens: 25, valor: 14200 },
    { mes: 'Mai', passagens: 20, valor: 11200 },
    { mes: 'Jun', passagens: 28, valor: 16800 }
  ];

  const pieData = [
    { name: 'LATAM Pass', value: 35, color: '#3B82F6' },
    { name: 'Smiles', value: 28, color: '#10B981' },
    { name: 'TudoAzul', value: 22, color: '#F59E0B' },
    { name: 'Outros', value: 15, color: '#EF4444' }
  ];

  // Estatísticas
  const stats = {
    totalPassagens: passagens.length,
    valorTotal: passagens.reduce((sum, p) => sum + p.valorTotal, 0),
    milhasUtilizadas: passagens.reduce((sum, p) => sum + p.quantidadeMilhas, 0),
    passagensConfirmadas: passagens.filter(p => p.status === 'confirmada').length,
    valorMedio: passagens.reduce((sum, p) => sum + p.valorTotal, 0) / passagens.length || 0
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Relatório de Passagens
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Análise detalhada de passagens aéreas e custos
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
            onClick={() => window.location.reload()}
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
            Filtros de Pesquisa
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Período</InputLabel>
                <Select
                  value={filters.periodo}
                  label="Período"
                  onChange={(e) => handleFilterChange('periodo', e.target.value)}
                >
                  {periodos.map(periodo => (
                    <MenuItem key={periodo.value} value={periodo.value}>
                      {periodo.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Pessoa</InputLabel>
                <Select
                  value={filters.pessoa}
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
                  value={filters.programa}
                  label="Programa"
                  onChange={(e) => handleFilterChange('programa', e.target.value)}
                >
                  {programasFidelidade.map(programa => (
                    <MenuItem key={programa} value={programa}>{programa}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Origem"
                value={filters.origem}
                onChange={(e) => handleFilterChange('origem', e.target.value)}
                placeholder="Ex: São Paulo"
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Destino"
                value={filters.destino}
                onChange={(e) => handleFilterChange('destino', e.target.value)}
                placeholder="Ex: Rio de Janeiro"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              disabled={loading}
            >
              Pesquisar
            </Button>
            <Button
              variant="outlined"
              onClick={() => setFilters({
                periodo: '30dias',
                pessoa: 'todos',
                programa: 'todos',
                status: 'todos',
                dataInicio: '',
                dataFim: '',
                valorMin: '',
                valorMax: '',
                origem: '',
                destino: ''
              })}
            >
              Limpar Filtros
            </Button>
          </Box>
          
          {loading && <LinearProgress sx={{ mt: 2 }} />}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Flight sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Passagens</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalPassagens}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Valor Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                R$ {stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Milhas Utilizadas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.milhasUtilizadas.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Confirmadas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.passagensConfirmadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChart sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Valor Médio</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                R$ {stats.valorMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
          <ToggleButton value="tabela">
            <Assessment sx={{ mr: 1 }} />
            Tabela
          </ToggleButton>
          <ToggleButton value="grafico">
            <BarChart sx={{ mr: 1 }} />
            Gráficos
          </ToggleButton>
        </ToggleButtonGroup>
        
        {viewType === 'grafico' && (
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(e, newValue) => newValue && setChartType(newValue)}
            size="small"
          >
            <ToggleButton value="linha">Linha</ToggleButton>
            <ToggleButton value="barra">Barra</ToggleButton>
            <ToggleButton value="pizza">Pizza</ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      {/* Conteúdo Principal */}
      {viewType === 'tabela' ? (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              <Flight sx={{ mr: 1, verticalAlign: 'middle' }} />
              Detalhes das Passagens
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pessoa</TableCell>
                    <TableCell>Programa</TableCell>
                    <TableCell>Rota</TableCell>
                    <TableCell>Data/Hora</TableCell>
                    <TableCell>Classe</TableCell>
                    <TableCell align="right">Milhas</TableCell>
                    <TableCell align="right">Valor</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Reserva</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {passagens.map((passagem) => (
                    <TableRow key={passagem.id} hover>
                      <TableCell>{passagem.pessoa}</TableCell>
                      <TableCell>
                        <Chip label={passagem.programa} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {passagem.origem}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            → {passagem.destino}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {new Date(passagem.dataVoo).toLocaleDateString('pt-BR')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {passagem.horario}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={passagem.classe}
                          size="small"
                          color={passagem.classe === 'Executiva' ? 'primary' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {passagem.quantidadeMilhas.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                          R$ {passagem.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={passagem.status}
                          color={getStatusColor(passagem.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {passagem.numeroReserva}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Visualizar">
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancelar">
                            <IconButton size="small" color="error">
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Evolução Mensal
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'linha' ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="passagens" stroke="#3B82F6" strokeWidth={2} />
                        <Line type="monotone" dataKey="valor" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    ) : (
                      <RechartsBarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="passagens" fill="#3B82F6" />
                        <Bar dataKey="valor" fill="#10B981" />
                      </RechartsBarChart>
                    )}
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
                    <RechartsPieChart>
                      <RechartsTooltip />
                      <RechartsPieChart
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Passagens;
