/**
 * Página de Receitas
 * 
 * Sistema de gestão de receitas financeiras,
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
  TrendingUp,
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
  AccountBalance
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { financialAPI } from '../../services';

const Receitas = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [receitas, setReceitas] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    descricao: '',
    categoria: '',
    valor: '',
    dataRecebimento: new Date().toISOString().split('T')[0],
    cliente: '',
    formaPagamento: 'pix',
    status: 'pendente',
    observacoes: '',
    parcela: 1,
    totalParcelas: 1
  });

  // Buscar receitas do backend
  const fetchReceitas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await financialAPI.getIncomes();
      setReceitas(response.incomes || []);
    } catch (err) {
      console.error('Erro ao buscar receitas:', err);
      setError('Erro ao carregar receitas. Tente novamente.');
      setReceitas([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar receitas ao montar o componente
  React.useEffect(() => {
    fetchReceitas();
  }, []);

  const categorias = [
    'Vendas', 'Comissões', 'Reembolsos', 'Juros', 'Outros'
  ];

  const clientes = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const formasPagamento = [
    'PIX', 'Transferência', 'Cartão', 'Dinheiro', 'Cheque'
  ];

  const statusOptions = [
    'Pendente', 'Recebido', 'Cancelado', 'Vencido'
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
      // Criar receita no backend
      await financialAPI.createIncome({
        tipo: 'receita',
        ...formData,
        data: formData.dataRecebimento
      });
      
      // Recarregar lista
      await fetchReceitas();
      
      // Fechar dialog e reset form
      setOpenDialog(false);
      setFormData({
        descricao: '',
        categoria: '',
        valor: '',
        dataRecebimento: new Date().toISOString().split('T')[0],
        cliente: '',
        formaPagamento: 'pix',
        status: 'pendente',
        observacoes: '',
        parcela: 1,
        totalParcelas: 1
      });
      
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Erro ao registrar receita:', error);
      setError(error.response?.data?.message || 'Erro ao salvar receita. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'recebido': return 'success';
      case 'pendente': return 'warning';
      case 'cancelado': return 'error';
      case 'vencido': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'recebido': return <CheckCircle />;
      case 'pendente': return <Pending />;
      case 'cancelado': return <Cancel />;
      case 'vencido': return <Warning />;
      default: return <Pending />;
    }
  };

  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case 'vendas': return 'success';
      case 'comissoes': return 'info';
      case 'reembolsos': return 'warning';
      case 'juros': return 'secondary';
      default: return 'default';
    }
  };

  // Estatísticas
  const stats = {
    totalReceitas: receitas.length,
    recebidas: receitas.filter(r => r.status === 'recebido').length,
    pendentes: receitas.filter(r => r.status === 'pendente').length,
    valorTotal: receitas.reduce((sum, r) => sum + r.valor, 0),
    valorRecebido: receitas.filter(r => r.status === 'recebido').reduce((sum, r) => sum + r.valor, 0),
    valorPendente: receitas.filter(r => r.status === 'pendente').reduce((sum, r) => sum + r.valor, 0)
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Gestão de Receitas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Controle de entradas financeiras
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
            Nova Receita
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
                <Typography variant="h6">Total Receitas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalReceitas}
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
                <Typography variant="h6">Recebidas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.recebidas}
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
                <AttachMoney sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Valor Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                R$ {stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Valor Recebido</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                R$ {stats.valorRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Receitas */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
            Histórico de Receitas
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Forma Pagamento</TableCell>
                  <TableCell>Data Recebimento</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receitas.map((receita) => (
                  <TableRow key={receita.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {receita.descricao}
                      </Typography>
                      {receita.observacoes && (
                        <Typography variant="caption" color="text.secondary">
                          {receita.observacoes}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={receita.categoria}
                        color={getCategoriaColor(receita.categoria)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{receita.cliente}</TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: 'success.main' }}>
                        R$ {receita.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={receita.formaPagamento} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      {new Date(receita.dataRecebimento).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(receita.status)}
                        label={receita.status}
                        color={getStatusColor(receita.status)}
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
                        <Tooltip title="Marcar como Recebido">
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

      {/* Dialog de Nova Receita */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nova Receita
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
                  placeholder="Descrição da receita..."
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
                  label="Data de Recebimento"
                  type="date"
                  value={formData.dataRecebimento}
                  onChange={(e) => handleInputChange('dataRecebimento', e.target.value)}
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
                  placeholder="Informações adicionais sobre a receita..."
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
            {loading ? 'Salvando...' : 'Registrar Receita'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Receitas;
