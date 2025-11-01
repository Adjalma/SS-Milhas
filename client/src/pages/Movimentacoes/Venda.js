/**
 * Página de Venda
 * 
 * Sistema de vendas de milhas com cálculo automático de lucro,
 * baseado no sistema de vendas do iddas.com.br
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Person,
  Business,
  FlightTakeoff,
  Refresh,
  Add,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Pending,
  Cancel,
  Warning,
  Info,
  Save,
  Calculate,
  Receipt
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { movementAPI } from '../../services';

const Venda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendas, setVendas] = useState([]);

  const fetchVendas = async () => {
    try {
      setLoading(true);
      const res = await movementAPI.getMovements({ tipo: 'venda' });
      setVendas(res.movements || []);
    } catch (err) {
      setError('Erro ao carregar vendas');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVendas();
  }, []);
  
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    pessoa: '',
    programa: '',
    quantidade: '',
    valorPorMilha: '',
    valorTotal: '',
    cliente: '',
    tipoCliente: 'pessoa_fisica',
    observacoes: '',
    dataVenda: new Date().toISOString().split('T')[0],
    status: 'pendente',
    comissao: '',
    lucroEstimado: ''
  });

  // Dados mockados baseados nas imagens
  const [vendas] = useState([
    {
      id: 1,
      pessoa: 'João Silva',
      programa: 'LATAM Pass',
      quantidade: 25000,
      valorPorMilha: 0.035,
      valorTotal: 875.00,
      cliente: 'Cliente VIP #1',
      tipoCliente: 'pessoa_fisica',
      comissao: 87.50,
      lucroReal: 262.50,
      margem: 30.0,
      dataVenda: '2024-01-15',
      status: 'concluida',
      dataConclusao: '2024-01-15',
      observacoes: 'Venda para cliente recorrente'
    },
    {
      id: 2,
      pessoa: 'Maria Santos',
      programa: 'Smiles',
      quantidade: 15000,
      valorPorMilha: 0.030,
      valorTotal: 450.00,
      cliente: 'Cliente Premium #2',
      tipoCliente: 'pessoa_fisica',
      comissao: 45.00,
      lucroReal: 135.00,
      margem: 30.0,
      dataVenda: '2024-01-14',
      status: 'processando',
      observacoes: 'Aguardando transferência'
    },
    {
      id: 3,
      pessoa: 'Pedro Oliveira',
      programa: 'TudoAzul',
      quantidade: 30000,
      valorPorMilha: 0.040,
      valorTotal: 1200.00,
      cliente: 'Empresa ABC Ltda',
      tipoCliente: 'pessoa_juridica',
      comissao: 120.00,
      lucroReal: 360.00,
      margem: 30.0,
      dataVenda: '2024-01-13',
      status: 'pendente',
      observacoes: 'Venda corporativa'
    }
  ]);

  const programasFidelidade = [
    'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles',
    'Emirates Skywards', 'Delta SkyMiles', 'Flying Blue'
  ];

  const pessoas = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const clientes = [
    'Cliente VIP #1', 'Cliente Premium #2', 'Empresa ABC Ltda', 'Cliente Novo #3', 'Cliente Corporativo #4'
  ];

  const tiposCliente = [
    { value: 'pessoa_fisica', label: 'Pessoa Física' },
    { value: 'pessoa_juridica', label: 'Pessoa Jurídica' }
  ];

  const statusOptions = [
    'Pendente', 'Processando', 'Concluída', 'Cancelada'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Calcular valor total automaticamente
      if (field === 'quantidade' || field === 'valorPorMilha') {
        const quantidade = parseFloat(newData.quantidade) || 0;
        const valorPorMilha = parseFloat(newData.valorPorMilha) || 0;
        newData.valorTotal = (quantidade * valorPorMilha).toFixed(2);
        
        // Calcular lucro estimado (assumindo margem de 30%)
        newData.lucroEstimado = (newData.valorTotal * 0.3).toFixed(2);
        newData.comissao = (newData.valorTotal * 0.1).toFixed(2);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Venda registrada:', formData);
      
      // Reset form
      setFormData({
        pessoa: '',
        programa: '',
        quantidade: '',
        valorPorMilha: '',
        valorTotal: '',
        cliente: '',
        tipoCliente: 'pessoa_fisica',
        observacoes: '',
        dataVenda: new Date().toISOString().split('T')[0],
        status: 'pendente',
        comissao: '',
        lucroEstimado: ''
      });
      
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluida': return 'success';
      case 'processando': return 'warning';
      case 'pendente': return 'info';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluida': return <CheckCircle />;
      case 'processando': return <Pending />;
      case 'pendente': return <Pending />;
      case 'cancelada': return <Cancel />;
      default: return <Pending />;
    }
  };

  // Estatísticas
  const stats = {
    totalVendas: vendas.length,
    receitaTotal: vendas.reduce((sum, v) => sum + v.valorTotal, 0),
    lucroTotal: vendas.reduce((sum, v) => sum + v.lucroReal, 0),
    vendasConcluidas: vendas.filter(v => v.status === 'concluida').length,
    margemMedia: vendas.reduce((sum, v) => sum + v.margem, 0) / vendas.length || 0,
    milhasVendidas: vendas.reduce((sum, v) => sum + v.quantidade, 0)
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Venda de Milhas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sistema de vendas com cálculo automático de lucro
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Atualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Nova Venda
          </Button>
        </Box>
      </Box>

      {/* Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Receipt sx={{ mr: 1, color: 'primary.main' }} />
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
                <CheckCircle sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Concluídas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.vendasConcluidas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FlightTakeoff sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Milhas Vendidas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                {stats.milhasVendidas.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Vendas */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
            Histórico de Vendas
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pessoa</TableCell>
                  <TableCell>Programa</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Valor/Milha</TableCell>
                  <TableCell align="right">Valor Total</TableCell>
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
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {venda.cliente}
                        </Typography>
                        <Chip 
                          label={venda.tipoCliente === 'pessoa_fisica' ? 'PF' : 'PJ'} 
                          size="small" 
                          color={venda.tipoCliente === 'pessoa_fisica' ? 'primary' : 'secondary'}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {venda.quantidade.toLocaleString()} milhas
                    </TableCell>
                    <TableCell align="right">
                      R$ {venda.valorPorMilha.toFixed(3)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: 'success.main' }}>
                        R$ {venda.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                        R$ {venda.lucroReal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${venda.margem.toFixed(1)}%`}
                        color={venda.margem > 25 ? 'success' : venda.margem > 20 ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(venda.dataVenda).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(venda.status)}
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
                            <Cancel />
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

      {/* Dialog de Nova Venda */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nova Venda
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Pessoa</InputLabel>
                  <Select
                    value={formData.pessoa}
                    label="Pessoa"
                    onChange={(e) => handleInputChange('pessoa', e.target.value)}
                  >
                    {pessoas.map(pessoa => (
                      <MenuItem key={pessoa} value={pessoa}>{pessoa}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Programa</InputLabel>
                  <Select
                    value={formData.programa}
                    label="Programa"
                    onChange={(e) => handleInputChange('programa', e.target.value)}
                  >
                    {programasFidelidade.map(programa => (
                      <MenuItem key={programa} value={programa}>{programa}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Quantidade de Milhas"
                  type="number"
                  value={formData.quantidade}
                  onChange={(e) => handleInputChange('quantidade', e.target.value)}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>milhas</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Valor por Milha"
                  type="number"
                  step="0.001"
                  value={formData.valorPorMilha}
                  onChange={(e) => handleInputChange('valorPorMilha', e.target.value)}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Valor Total"
                  type="number"
                  step="0.01"
                  value={formData.valorTotal}
                  onChange={(e) => handleInputChange('valorTotal', e.target.value)}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Cliente</InputLabel>
                  <Select
                    value={formData.cliente}
                    label="Cliente"
                    onChange={(e) => handleInputChange('cliente', e.target.value)}
                  >
                    {clientes.map(cliente => (
                      <MenuItem key={cliente} value={cliente}>{cliente}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Cliente</InputLabel>
                  <Select
                    value={formData.tipoCliente}
                    label="Tipo de Cliente"
                    onChange={(e) => handleInputChange('tipoCliente', e.target.value)}
                  >
                    {tiposCliente.map(tipo => (
                      <MenuItem key={tipo.value} value={tipo.value}>{tipo.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data da Venda"
                  type="date"
                  value={formData.dataVenda}
                  onChange={(e) => handleInputChange('dataVenda', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    {statusOptions.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações"
                  multiline
                  rows={3}
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Informações adicionais sobre a venda..."
                />
              </Grid>
              
              {/* Cálculos automáticos */}
              {formData.valorTotal && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Cálculos Automáticos:</strong><br />
                      • Lucro Estimado: R$ {formData.lucroEstimado}<br />
                      • Comissão: R$ {formData.comissao}<br />
                      • Margem: 30%
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<Save />}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Registrar Venda'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Venda;
