/**
 * Página de Relatório de Vendas
 * 
 * Relatório detalhado de vendas de milhas com análise de
 * lucratividade e performance por pessoa e programa.
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
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Visibility,
  Edit,
  Delete,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Person,
  CalendarToday,
  Refresh,
  Assessment,
  BarChart,
  PieChart,
  Star,
  StarBorder,
  Sell
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const Vendas = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('tabela'); // tabela, grafico
  const [filters, setFilters] = useState({
    periodo: '30dias',
    pessoa: 'todos',
    programa: 'todos',
    status: 'todos',
    cliente: 'todos',
    valorMin: '',
    valorMax: '',
    dataInicio: '',
    dataFim: ''
  });

  // Dados mockados baseados nas imagens
  const [vendas] = useState([
    {
      id: 1,
      pessoa: 'João Silva',
      programa: 'LATAM Pass',
      cliente: 'Cliente VIP #1',
      quantidade: 25000,
      valorVenda: 875.00,
      valorCompra: 625.00,
      lucro: 250.00,
      margem: 28.57,
      dataVenda: '2024-01-15',
      status: 'concluida',
      dataConclusao: '2024-01-15',
      observacoes: 'Venda para cliente recorrente'
    },
    {
      id: 2,
      pessoa: 'Maria Santos',
      programa: 'Smiles',
      cliente: 'Cliente Premium #2',
      quantidade: 15000,
      valorVenda: 525.00,
      valorCompra: 450.00,
      lucro: 75.00,
      margem: 14.29,
      dataVenda: '2024-01-14',
      status: 'processando',
      observacoes: 'Aguardando transferência'
    },
    {
      id: 3,
      pessoa: 'Pedro Oliveira',
      programa: 'TudoAzul',
      cliente: 'Cliente Novo #3',
      quantidade: 30000,
      valorVenda: 1200.00,
      valorCompra: 900.00,
      lucro: 300.00,
      margem: 25.00,
      dataVenda: '2024-01-13',
      status: 'concluida',
      dataConclusao: '2024-01-13',
      observacoes: 'Primeira compra do cliente'
    }
  ]);

  const programasFidelidade = [
    'Todos', 'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles'
  ];

  const pessoas = [
    'Todos', 'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const clientes = [
    'Todos', 'Cliente VIP #1', 'Cliente Premium #2', 'Cliente Novo #3', 'Cliente Corporativo #4'
  ];

  const statusOptions = [
    'Todos', 'Concluída', 'Processando', 'Pendente', 'Cancelada'
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
    console.log('Exportando relatório de vendas...');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'concluida': return 'success';
      case 'processando': return 'warning';
      case 'pendente': return 'info';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  // Dados para gráficos
  const chartData = [
    { mes: 'Jan', vendas: 15, receita: 12500, lucro: 3750 },
    { mes: 'Fev', vendas: 22, receita: 18200, lucro: 5460 },
    { mes: 'Mar', vendas: 18, receita: 14850, lucro: 4455 },
    { mes: 'Abr', vendas: 25, receita: 21250, lucro: 6375 },
    { mes: 'Mai', vendas: 20, receita: 17000, lucro: 5100 },
    { mes: 'Jun', vendas: 28, receita: 23800, lucro: 7140 }
  ];

  const pieData = [
    { name: 'LATAM Pass', value: 35, color: '#3B82F6' },
    { name: 'Smiles', value: 25, color: '#10B981' },
    { name: 'TudoAzul', value: 20, color: '#F59E0B' },
    { name: 'Livelo', value: 12, color: '#EF4444' },
    { name: 'Outros', value: 8, color: '#8B5CF6' }
  ];

  // Estatísticas
  const stats = {
    totalVendas: vendas.length,
    receitaTotal: vendas.reduce((sum, v) => sum + v.valorVenda, 0),
    lucroTotal: vendas.reduce((sum, v) => sum + v.lucro, 0),
    vendasConcluidas: vendas.filter(v => v.status === 'concluida').length,
    margemMedia: vendas.reduce((sum, v) => sum + v.margem, 0) / vendas.length || 0,
    milhasVendidas: vendas.reduce((sum, v) => sum + v.quantidade, 0)
  };

  // Top vendedores
  const topVendedores = [
    { nome: 'João Silva', vendas: 15, receita: 12500, lucro: 3750 },
    { nome: 'Maria Santos', vendas: 12, receita: 9800, lucro: 2940 },
    { nome: 'Pedro Oliveira', vendas: 10, receita: 8500, lucro: 2550 }
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Relatório de Vendas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Análise detalhada de vendas e lucratividade
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
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={filters.cliente}
                  label="Cliente"
                  onChange={(e) => handleFilterChange('cliente', e.target.value)}
                >
                  {clientes.map(cliente => (
                    <MenuItem key={cliente} value={cliente}>{cliente}</MenuItem>
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
                label="Valor Mínimo"
                type="number"
                value={filters.valorMin}
                onChange={(e) => handleFilterChange('valorMin', e.target.value)}
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>
                }}
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
                cliente: 'todos',
                valorMin: '',
                valorMax: '',
                dataInicio: '',
                dataFim: ''
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
                <Sell sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Vendas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalVendas}
              </Typography>
              <Typography variant="body2" color="text.secondary">operações</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Receita Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                R$ {stats.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Lucro Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                R$ {stats.lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Margem Média</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.margemMedia.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChart sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Milhas Vendidas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                {stats.milhasVendidas.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Conteúdo Principal */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
                Detalhes das Vendas
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Pessoa</TableCell>
                      <TableCell>Programa</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell align="right">Quantidade</TableCell>
                      <TableCell align="right">Valor Venda</TableCell>
                      <TableCell align="right">Lucro</TableCell>
                      <TableCell align="right">Margem</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vendas.map((venda) => (
                      <TableRow key={venda.id} hover>
                        <TableCell>{venda.pessoa}</TableCell>
                        <TableCell>
                          <Chip label={venda.programa} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {venda.cliente}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {venda.quantidade.toLocaleString()} milhas
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontWeight: 600, color: 'success.main' }}>
                            R$ {venda.valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                            R$ {venda.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${venda.margem.toFixed(1)}%`}
                            color={venda.margem > 20 ? 'success' : venda.margem > 15 ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(venda.dataVenda).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={venda.status}
                            color={getStatusColor(venda.status)}
                            size="small"
                          />
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

          {/* Gráfico de Evolução */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Evolução Mensal de Vendas
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="vendas" stroke="#3B82F6" strokeWidth={2} name="Vendas" />
                    <Line type="monotone" dataKey="receita" stroke="#10B981" strokeWidth={2} name="Receita" />
                    <Line type="monotone" dataKey="lucro" stroke="#F59E0B" strokeWidth={2} name="Lucro" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar com Informações Adicionais */}
        <Grid item xs={12} md={4}>
          {/* Top Vendedores */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
                Top Vendedores
              </Typography>
              <List>
                {topVendedores.map((vendedor, index) => (
                  <ListItem key={vendedor.nome} divider={index < topVendedores.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze' }}>
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={vendedor.nome}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {vendedor.vendas} vendas • R$ {vendedor.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </Typography>
                          <Typography variant="caption" color="primary">
                            Lucro: R$ {vendedor.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Distribuição por Programa */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <PieChart sx={{ mr: 1, verticalAlign: 'middle' }} />
                Vendas por Programa
              </Typography>
              <Box sx={{ height: 250 }}>
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

          {/* Resumo Financeiro */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Resumo Financeiro
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Receita Total:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    R$ {stats.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Custo Total:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    R$ {(stats.receitaTotal - stats.lucroTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Lucro Total:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    R$ {stats.lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Margem Média:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                    {stats.margemMedia.toFixed(1)}%
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Vendas;
