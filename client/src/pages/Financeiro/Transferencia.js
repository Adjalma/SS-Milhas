/**
 * Página de Transferência Financeira
 * 
 * Sistema de transferências entre contas e pessoas,
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
  Switch,
  RadioGroup,
  Radio
} from '@mui/material';
import {
  SwapHoriz,
  AttachMoney,
  Person,
  Business,
  AccountBalance,
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
  Send,
  Schedule,
  Receipt
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { financialAPI } from '../../services';

const Transferencia = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transferencias, setTransferencias] = useState([]);

  const fetchTransferencias = async () => {
    try {
      setLoading(true);
      const res = await financialAPI.getCashFlow({ tipo: 'transferencia' });
      setTransferencias(res.cashFlow || []);
    } catch (err) {
      setError('Erro ao carregar transferências');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTransferencias();
  }, []);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'entre_contas',
    contaOrigem: '',
    contaDestino: '',
    valor: '',
    descricao: '',
    dataTransferencia: new Date().toISOString().split('T')[0],
    status: 'pendente',
    observacoes: '',
    agendamento: false,
    dataAgendamento: ''
  });

  const tiposTransferencia = [
    { value: 'entre_contas', label: 'Entre Contas' },
    { value: 'para_pessoa', label: 'Para Pessoa' }
  ];

  const contas = [
    'Conta Corrente BB', 'Poupança BB', 'Conta Corrente Itaú', 'Conta Corrente Santander'
  ];

  const pessoas = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const statusOptions = [
    'Pendente', 'Processada', 'Agendada', 'Cancelada', 'Falhou'
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
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Transferência registrada:', formData);
      
      // Reset form
      setFormData({
        tipo: 'entre_contas',
        contaOrigem: '',
        contaDestino: '',
        valor: '',
        descricao: '',
        dataTransferencia: new Date().toISOString().split('T')[0],
        status: 'pendente',
        observacoes: '',
        agendamento: false,
        dataAgendamento: ''
      });
      
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Erro ao registrar transferência:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessar = async (id) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Transferência processada:', id);
    } catch (error) {
      console.error('Erro ao processar transferência:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Transferência cancelada:', id);
    } catch (error) {
      console.error('Erro ao cancelar transferência:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processada': return 'success';
      case 'pendente': return 'warning';
      case 'agendada': return 'info';
      case 'cancelada': return 'error';
      case 'falhou': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processada': return <CheckCircle />;
      case 'pendente': return <Pending />;
      case 'agendada': return <Schedule />;
      case 'cancelada': return <Cancel />;
      case 'falhou': return <Warning />;
      default: return <Pending />;
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'entre_contas': return <AccountBalance />;
      case 'para_pessoa': return <Person />;
      default: return <SwapHoriz />;
    }
  };

  // Estatísticas
  const stats = {
    totalTransferencias: transferencias.length,
    processadas: transferencias.filter(t => t.status === 'processada').length,
    pendentes: transferencias.filter(t => t.status === 'pendente').length,
    agendadas: transferencias.filter(t => t.status === 'agendada').length,
    valorTotal: transferencias.reduce((sum, t) => sum + t.valor, 0),
    valorProcessado: transferencias.filter(t => t.status === 'processada').reduce((sum, t) => sum + t.valor, 0),
    valorPendente: transferencias.filter(t => t.status === 'pendente').reduce((sum, t) => sum + t.valor, 0),
    taxasTotal: transferencias.reduce((sum, t) => sum + t.taxa, 0)
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Transferências Financeiras
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestão de transferências entre contas e pessoas
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
            Nova Transferência
          </Button>
        </Box>
      </Box>

      {/* Resumo */}
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
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Processadas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.processadas}
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
                <Schedule sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Agendadas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.agendadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Valor Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                R$ {stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Transferências */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <SwapHoriz sx={{ mr: 1, verticalAlign: 'middle' }} />
            Histórico de Transferências
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Operação</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Origem</TableCell>
                  <TableCell>Destino</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Taxa</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transferencias.map((transferencia) => (
                  <TableRow key={transferencia.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {transferencia.numeroOperacao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTipoIcon(transferencia.tipo)}
                        <Chip 
                          label={tiposTransferencia.find(t => t.value === transferencia.tipo)?.label} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transferencia.contaOrigem}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transferencia.contaDestino}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                        R$ {transferencia.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {transferencia.taxa > 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          R$ {transferencia.taxa.toFixed(2)}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Grátis
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(transferencia.dataTransferencia).toLocaleDateString('pt-BR')}
                      </Typography>
                      {transferencia.dataProcessamento && (
                        <Typography variant="caption" color="text.secondary">
                          Processada: {new Date(transferencia.dataProcessamento).toLocaleDateString('pt-BR')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(transferencia.status)}
                        label={transferencia.status}
                        color={getStatusColor(transferencia.status)}
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
                        {transferencia.status === 'pendente' && (
                          <Tooltip title="Processar">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleProcessar(transferencia.id)}
                            >
                              <Send />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Cancelar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleCancelar(transferencia.id)}
                            disabled={transferencia.status === 'processada'}
                          >
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

      {/* Dialog de Nova Transferência */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <SwapHoriz sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nova Transferência
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Transferência</InputLabel>
                  <Select
                    value={formData.tipo}
                    label="Tipo de Transferência"
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                  >
                    {tiposTransferencia.map(tipo => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Conta Origem</InputLabel>
                  <Select
                    value={formData.contaOrigem}
                    label="Conta Origem"
                    onChange={(e) => handleInputChange('contaOrigem', e.target.value)}
                  >
                    {contas.map(conta => (
                      <MenuItem key={conta} value={conta}>{conta}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>
                    {formData.tipo === 'entre_contas' ? 'Conta Destino' : 'Destinatário'}
                  </InputLabel>
                  <Select
                    value={formData.contaDestino}
                    label={formData.tipo === 'entre_contas' ? 'Conta Destino' : 'Destinatário'}
                    onChange={(e) => handleInputChange('contaDestino', e.target.value)}
                  >
                    {formData.tipo === 'entre_contas' ? (
                      contas.map(conta => (
                        <MenuItem key={conta} value={conta}>{conta}</MenuItem>
                      ))
                    ) : (
                      pessoas.map(pessoa => (
                        <MenuItem key={pessoa} value={pessoa}>{pessoa}</MenuItem>
                      ))
                    )}
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
                <TextField
                  fullWidth
                  label="Data da Transferência"
                  type="date"
                  value={formData.dataTransferencia}
                  onChange={(e) => handleInputChange('dataTransferencia', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descrição da transferência..."
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.agendamento}
                      onChange={(e) => handleInputChange('agendamento', e.target.checked)}
                    />
                  }
                  label="Agendar transferência"
                />
              </Grid>
              
              {formData.agendamento && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data do Agendamento"
                    type="date"
                    value={formData.dataAgendamento}
                    onChange={(e) => handleInputChange('dataAgendamento', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações"
                  multiline
                  rows={3}
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Informações adicionais sobre a transferência..."
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
            {loading ? 'Salvando...' : 'Registrar Transferência'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Transferencia;
