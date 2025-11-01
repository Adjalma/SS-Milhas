/**
 * Página de Relatório de Transferências
 * 
 * Relatório detalhado de transferências entre contas e programas
 * com análise de volumes e custos.
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
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Visibility,
  Edit,
  Delete,
  SwapHoriz,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  CalendarToday,
  Person,
  CompareArrows,
  Refresh,
  Assessment,
  BarChart,
  PieChart
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { reportAPI } from '../../services';

const Transferencias = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [relatorio, setRelatorio] = useState({ transferencias: [], totais: {} });

  const fetchRelatorio = async () => {
    try {
      setLoading(true);
      const res = await reportAPI.getTransfersReport();
      setRelatorio(res);
    } catch (err) {
      setError('Erro ao carregar relatório');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRelatorio();
  }, []);
  const [viewType, setViewType] = useState('tabela'); // tabela, grafico
  const [filters, setFilters] = useState({
    periodo: '30dias',
    pessoa: 'todos',
    programaOrigem: 'todos',
    programaDestino: 'todos',
    tipoTransferencia: 'todos',
    status: 'todos',
    dataInicio: '',
    dataFim: '',
    valorMin: '',
    valorMax: ''
  });

  // Dados mockados baseados nas imagens
  const [transferencias] = useState([
    {
      id: 1,
      pessoa: 'João Silva',
      programaOrigem: 'LATAM Pass',
      programaDestino: 'LATAM Pass',
      quantidade: 15000,
      tipoTransferencia: 'interna',
      taxa: 0,
      valorTotal: 0,
      dataTransferencia: '2024-01-15',
      status: 'concluida',
      dataConclusao: '2024-01-15',
      observacoes: 'Transferência familiar'
    },
    {
      id: 2,
      pessoa: 'Maria Santos',
      programaOrigem: 'Smiles',
      programaDestino: 'TudoAzul',
      quantidade: 25000,
      tipoTransferencia: 'externa',
      taxa: 125.00,
      valorTotal: 125.00,
      dataTransferencia: '2024-01-14',
      status: 'processando',
      observacoes: 'Transferência entre programas'
    },
    {
      id: 3,
      pessoa: 'Pedro Oliveira',
      programaOrigem: 'Livelo',
      programaDestino: 'LifeMiles',
      quantidade: 30000,
      tipoTransferencia: 'externa',
      taxa: 150.00,
      valorTotal: 150.00,
      dataTransferencia: '2024-01-13',
      status: 'concluida',
      dataConclusao: '2024-01-13',
      observacoes: 'Transferência promocional'
    }
  ]);

  const programasFidelidade = [
    'Todos', 'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles'
  ];

  const pessoas = [
    'Todos', 'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const tiposTransferencia = [
    'Todos', 'Interna', 'Externa', 'Bonificada', 'Familiar'
  ];

  const statusOptions = [
    'Todos', 'Concluída', 'Processando', 'Pendente', 'Cancelada', 'Falhou'
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
    console.log('Exportando relatório de transferências...');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'concluida': return 'success';
      case 'processando': return 'warning';
      case 'pendente': return 'info';
      case 'cancelada': return 'error';
      case 'falhou': return 'error';
      default: return 'default';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo.toLowerCase()) {
      case 'interna': return 'primary';
      case 'externa': return 'secondary';
      case 'bonificada': return 'success';
      case 'familiar': return 'info';
      default: return 'default';
    }
  };

  // Dados para gráficos
  const chartData = [
    { mes: 'Jan', transferencias: 45, milhas: 450000, taxas: 2250 },
    { mes: 'Fev', transferencias: 52, milhas: 520000, taxas: 2600 },
    { mes: 'Mar', transferencias: 38, milhas: 380000, taxas: 1900 },
    { mes: 'Abr', transferencias: 61, milhas: 610000, taxas: 3050 },
    { mes: 'Mai', transferencias: 47, milhas: 470000, taxas: 2350 },
    { mes: 'Jun', transferencias: 55, milhas: 550000, taxas: 2750 }
  ];

  // Estatísticas
  const stats = {
    totalTransferencias: transferencias.length,
    milhasTransferidas: transferencias.reduce((sum, t) => sum + t.quantidade, 0),
    taxasPagas: transferencias.reduce((sum, t) => sum + t.taxa, 0),
    transferenciasConcluidas: transferencias.filter(t => t.status === 'concluida').length,
    transferenciasProcessando: transferencias.filter(t => t.status === 'processando').length,
    valorMedioTaxa: transferencias.reduce((sum, t) => sum + t.taxa, 0) / transferencias.length || 0
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Relatório de Transferências
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Análise detalhada de transferências entre contas e programas
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
                <InputLabel>Programa Origem</InputLabel>
                <Select
                  value={filters.programaOrigem}
                  label="Programa Origem"
                  onChange={(e) => handleFilterChange('programaOrigem', e.target.value)}
                >
                  {programasFidelidade.map(programa => (
                    <MenuItem key={programa} value={programa}>{programa}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Programa Destino</InputLabel>
                <Select
                  value={filters.programaDestino}
                  label="Programa Destino"
                  onChange={(e) => handleFilterChange('programaDestino', e.target.value)}
                >
                  {programasFidelidade.map(programa => (
                    <MenuItem key={programa} value={programa}>{programa}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filters.tipoTransferencia}
                  label="Tipo"
                  onChange={(e) => handleFilterChange('tipoTransferencia', e.target.value)}
                >
                  {tiposTransferencia.map(tipo => (
                    <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
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
                programaOrigem: 'todos',
                programaDestino: 'todos',
                tipoTransferencia: 'todos',
                status: 'todos',
                dataInicio: '',
                dataFim: '',
                valorMin: '',
                valorMax: ''
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
                <SwapHoriz sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalTransferencias}
              </Typography>
              <Typography variant="body2" color="text.secondary">transferências</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Milhas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.milhasTransferidas.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">transferidas</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Taxas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                R$ {stats.taxasPagas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
              <Typography variant="body2" color="text.secondary">pagas</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Concluídas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.transferenciasConcluidas}
              </Typography>
              <Typography variant="body2" color="text.secondary">operações</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChart sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Taxa Média</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                R$ {stats.valorMedioTaxa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
      </Box>

      {/* Conteúdo Principal */}
      {viewType === 'tabela' ? (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              <SwapHoriz sx={{ mr: 1, verticalAlign: 'middle' }} />
              Detalhes das Transferências
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pessoa</TableCell>
                    <TableCell>Origem → Destino</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Taxa</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Observações</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transferencias.map((transferencia) => (
                    <TableRow key={transferencia.id} hover>
                      <TableCell>{transferencia.pessoa}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={transferencia.programaOrigem} size="small" variant="outlined" />
                          <CompareArrows sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Chip label={transferencia.programaDestino} size="small" variant="outlined" />
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {transferencia.quantidade.toLocaleString()} milhas
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transferencia.tipoTransferencia}
                          color={getTipoColor(transferencia.tipoTransferencia)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {transferencia.taxa > 0 ? (
                          <Typography sx={{ fontWeight: 600, color: 'warning.main' }}>
                            R$ {transferencia.taxa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Grátis
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(transferencia.dataTransferencia).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transferencia.status}
                          color={getStatusColor(transferencia.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {transferencia.observacoes}
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
                  Evolução Mensal de Transferências
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="transferencias" fill="#3B82F6" name="Transferências" />
                      <Bar dataKey="milhas" fill="#10B981" name="Milhas (÷1000)" />
                      <Bar dataKey="taxas" fill="#F59E0B" name="Taxas" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Resumo por Tipo
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Transferências Internas</Typography>
                    <Chip label="35%" color="primary" size="small" />
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Transferências Externas</Typography>
                    <Chip label="45%" color="secondary" size="small" />
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Transferências Familiares</Typography>
                    <Chip label="20%" color="info" size="small" />
                  </Box>
                  <Divider />
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Taxa média:</strong> R$ {stats.valorMedioTaxa.toFixed(2)} por transferência
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Transferencias;
