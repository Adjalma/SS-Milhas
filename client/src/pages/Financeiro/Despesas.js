/**
 * Página de Despesas
 * 
 * Sistema de gestão de despesas financeiras,
 * baseado no sistema financeiro do iddas.com.br
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
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  TrendingDown,
  AttachMoney,
  Person,
  Business,
  Receipt,
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
  Search,
  CalendarToday,
  Category,
  AccountBalance,
  LocalShipping,
  Build,
  School,
  ShoppingCart,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { financialAPI } from '../../services';

const Despesas = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [despesas, setDespesas] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    descricao: '',
    categoria: '',
    valor: '',
    dataVencimento: new Date().toISOString().split('T')[0],
    dataPagamento: '',
    fornecedor: '',
    formaPagamento: 'pix',
    status: 'pendente',
    observacoes: '',
    parcela: 1,
    totalParcelas: 1,
    recorrente: false
  });

  // Buscar despesas do backend
  const fetchDespesas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await financialAPI.getExpenses();
      setDespesas(response.expenses || []);
    } catch (err) {
      console.error('Erro ao buscar despesas:', err);
      setError('Erro ao carregar despesas. Tente novamente.');
      setDespesas([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDespesas();
  }, []);

  // Dados mockados removidos - agora usa backend
  const [despesasOLD] = useState([
    {
      id: 1,
      descricao: 'Compra de milhas LATAM Pass',
      categoria: 'compras',
      valor: 875.00,
      dataVencimento: '2024-01-15',
      dataPagamento: '2024-01-15',
      fornecedor: 'LATAM Airlines',
      formaPagamento: 'pix',
      status: 'pago',
      observacoes: 'Compra para cliente João Silva',
      parcela: 1,
      totalParcelas: 1,
      recorrente: false
    },
    {
      id: 2,
      descricao: 'Taxa de transferência bancária',
      categoria: 'taxas',
      valor: 15.50,
      dataVencimento: '2024-01-14',
      dataPagamento: '2024-01-14',
      fornecedor: 'Banco do Brasil',
      formaPagamento: 'debito',
      status: 'pago',
      observacoes: 'Taxa mensal de transferências',
      parcela: 1,
      totalParcelas: 1,
      recorrente: true
    },
    {
      id: 3,
      descricao: 'Software de gestão',
      categoria: 'tecnologia',
      valor: 299.00,
      dataVencimento: '2024-01-20',
      dataPagamento: '',
      fornecedor: 'Tech Solutions',
      formaPagamento: 'cartao',
      status: 'pendente',
      observacoes: 'Licença mensal do sistema',
      parcela: 1,
      totalParcelas: 1,
      recorrente: true
    },
    {
      id: 4,
      descricao: 'Marketing digital',
      categoria: 'marketing',
      valor: 450.00,
      dataVencimento: '2024-01-18',
      dataPagamento: '',
      fornecedor: 'Agência Digital',
      formaPagamento: 'transferencia',
      status: 'vencido',
      observacoes: 'Campanha de anúncios',
      parcela: 1,
      totalParcelas: 1,
      recorrente: false
    }
  ]);

  const categorias = [
    'Compras', 'Taxas', 'Tecnologia', 'Marketing', 'Operacional', 'Impostos', 'Outros'
  ];

  const fornecedores = [
    'LATAM Airlines', 'Smiles', 'Banco do Brasil', 'Tech Solutions', 'Agência Digital', 'Outros'
  ];

  const formasPagamento = [
    'PIX', 'Transferência', 'Cartão', 'Débito Automático', 'Dinheiro', 'Cheque'
  ];

  const statusOptions = [
    'Pendente', 'Pago', 'Vencido', 'Cancelado'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await financialAPI.createExpense({
        tipo: 'despesa',
        ...formData,
        data: formData.dataVencimento
      });
      await fetchDespesas();
      setOpenDialog(false);
      
      // Reset form
      setFormData({
        descricao: '',
        categoria: '',
        valor: '',
        dataVencimento: new Date().toISOString().split('T')[0],
        dataPagamento: '',
        fornecedor: '',
        formaPagamento: 'pix',
        status: 'pendente',
        observacoes: '',
        parcela: 1,
        totalParcelas: 1,
        recorrente: false
      });
      
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Erro ao registrar despesa:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pago': return 'success';
      case 'pendente': return 'warning';
      case 'vencido': return 'error';
      case 'cancelado': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pago': return <CheckCircle />;
      case 'pendente': return <Pending />;
      case 'vencido': return <Warning />;
      case 'cancelado': return <Cancel />;
      default: return <Pending />;
    }
  };

  const getCategoriaIcon = (categoria) => {
    switch (categoria) {
      case 'compras': return <ShoppingCart />;
      case 'taxas': return <Receipt />;
      case 'tecnologia': return <Build />;
      case 'marketing': return <TrendingUp />;
      case 'operacional': return <Business />;
      case 'impostos': return <AccountBalance />;
      default: return <Category />;
    }
  };

  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case 'compras': return 'primary';
      case 'taxas': return 'warning';
      case 'tecnologia': return 'info';
      case 'marketing': return 'success';
      case 'operacional': return 'secondary';
      case 'impostos': return 'error';
      default: return 'default';
    }
  };

  const isVencida = (dataVencimento, status) => {
    return new Date(dataVencimento) < new Date() && status !== 'pago';
  };

  // Estatísticas
  const stats = {
    totalDespesas: despesas.length,
    pagas: despesas.filter(d => d.status === 'pago').length,
    pendentes: despesas.filter(d => d.status === 'pendente').length,
    vencidas: despesas.filter(d => d.status === 'vencido').length,
    valorTotal: despesas.reduce((sum, d) => sum + d.valor, 0),
    valorPago: despesas.filter(d => d.status === 'pago').reduce((sum, d) => sum + d.valor, 0),
    valorPendente: despesas.filter(d => d.status === 'pendente').reduce((sum, d) => sum + d.valor, 0),
    valorVencido: despesas.filter(d => d.status === 'vencido').reduce((sum, d) => sum + d.valor, 0)
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Gestão de Despesas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Controle de saídas financeiras
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
            Nova Despesa
          </Button>
        </Box>
      </Box>

      {/* Alertas */}
      {stats.vencidas > 0 && (
        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Atenção:</strong> Você tem <strong>{stats.vencidas} despesas vencidas</strong> 
            no valor total de <strong>R$ {stats.valorVencido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>.
          </Typography>
        </Alert>
      )}

      {/* Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Despesas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalDespesas}
              </Typography>
              <Typography variant="body2" color="text.secondary">registros</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Pagas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.pagas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Pending sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Pendentes</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.pendentes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Vencidas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                {stats.vencidas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Valor Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                R$ {stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Despesas */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <TrendingDown sx={{ mr: 1, verticalAlign: 'middle' }} />
            Histórico de Despesas
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Fornecedor</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Forma Pagamento</TableCell>
                  <TableCell>Vencimento</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {despesas.map((despesa) => (
                  <TableRow 
                    key={despesa.id} 
                    hover
                    sx={{
                      bgcolor: isVencida(despesa.dataVencimento, despesa.status) ? 'error.light' : 'inherit',
                      opacity: isVencida(despesa.dataVencimento, despesa.status) ? 0.8 : 1
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {despesa.descricao}
                        </Typography>
                        {despesa.observacoes && (
                          <Typography variant="caption" color="text.secondary">
                            {despesa.observacoes}
                          </Typography>
                        )}
                        {despesa.recorrente && (
                          <Chip label="Recorrente" size="small" color="info" sx={{ mt: 0.5 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getCategoriaIcon(despesa.categoria)}
                        <Chip
                          label={despesa.categoria}
                          color={getCategoriaColor(despesa.categoria)}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{despesa.fornecedor}</TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: 'error.main' }}>
                        R$ {despesa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={despesa.formaPagamento} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2"
                        color={isVencida(despesa.dataVencimento, despesa.status) ? 'error.main' : 'inherit'}
                      >
                        {new Date(despesa.dataVencimento).toLocaleDateString('pt-BR')}
                      </Typography>
                      {despesa.dataPagamento && (
                        <Typography variant="caption" color="text.secondary">
                          Pago: {new Date(despesa.dataPagamento).toLocaleDateString('pt-BR')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(despesa.status)}
                        label={despesa.status}
                        color={getStatusColor(despesa.status)}
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
                        <Tooltip title="Marcar como Pago">
                          <IconButton size="small" color="success">
                            <CheckCircle />
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

      {/* Dialog de Nova Despesa */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <TrendingDown sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nova Despesa
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descrição da despesa..."
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={formData.categoria}
                    label="Categoria"
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                  >
                    {categorias.map(categoria => (
                      <MenuItem key={categoria} value={categoria}>{categoria}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => handleInputChange('valor', e.target.value)}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>
                  }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Fornecedor</InputLabel>
                  <Select
                    value={formData.fornecedor}
                    label="Fornecedor"
                    onChange={(e) => handleInputChange('fornecedor', e.target.value)}
                  >
                    {fornecedores.map(fornecedor => (
                      <MenuItem key={fornecedor} value={fornecedor}>{fornecedor}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Forma de Pagamento</InputLabel>
                  <Select
                    value={formData.formaPagamento}
                    label="Forma de Pagamento"
                    onChange={(e) => handleInputChange('formaPagamento', e.target.value)}
                  >
                    {formasPagamento.map(forma => (
                      <MenuItem key={forma} value={forma}>{forma}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Vencimento"
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) => handleInputChange('dataVencimento', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Pagamento"
                  type="date"
                  value={formData.dataPagamento}
                  onChange={(e) => handleInputChange('dataPagamento', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.recorrente}
                      onChange={(e) => handleInputChange('recorrente', e.target.checked)}
                    />
                  }
                  label="Despesa recorrente"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações"
                  multiline
                  rows={3}
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Informações adicionais sobre a despesa..."
                />
              </Grid>
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
            {loading ? 'Salvando...' : 'Registrar Despesa'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Despesas;
