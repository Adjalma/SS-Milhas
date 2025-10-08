/**
 * Página de Orçamentos
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
  Avatar,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  RequestQuote,
  Refresh,
  Add,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Save,
  AttachMoney,
  Person,
  Business,
  Send
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Orcamentos = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    cliente: '',
    servico: '',
    valor: '',
    validade: '',
    status: 'pendente',
    observacoes: ''
  });

  const [orcamentos] = useState([
    {
      id: 1,
      numero: 'ORC-2024-001',
      cliente: 'João Silva',
      servico: 'Compra de milhas LATAM Pass',
      valor: 875.00,
      validade: '2024-01-25',
      status: 'pendente',
      dataCriacao: '2024-01-15',
      observacoes: 'Orçamento para 25.000 milhas'
    },
    {
      id: 2,
      numero: 'ORC-2024-002',
      cliente: 'Empresa ABC Ltda',
      servico: 'Transferência de milhas',
      valor: 450.00,
      validade: '2024-01-22',
      status: 'aprovado',
      dataCriacao: '2024-01-14',
      observacoes: 'Transferência familiar'
    }
  ]);

  const clientes = ['João Silva', 'Maria Santos', 'Empresa ABC Ltda'];
  const servicos = ['Compra de milhas', 'Transferência de milhas', 'Venda de milhas', 'Consultoria'];
  const statusOptions = ['Pendente', 'Aprovado', 'Rejeitado', 'Vencido'];

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
      console.log('Orçamento registrado:', formData);
      setOpenDialog(false);
    } catch (error) {
      console.error('Erro ao registrar orçamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado': return 'success';
      case 'pendente': return 'warning';
      case 'rejeitado': return 'error';
      case 'vencido': return 'error';
      default: return 'default';
    }
  };

  const stats = {
    totalOrcamentos: orcamentos.length,
    pendentes: orcamentos.filter(o => o.status === 'pendente').length,
    aprovados: orcamentos.filter(o => o.status === 'aprovado').length,
    valorTotal: orcamentos.reduce((sum, o) => sum + o.valor, 0)
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Orçamentos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestão de orçamentos para clientes
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
            Atualizar
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Novo Orçamento
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RequestQuote sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalOrcamentos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Pendentes</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.pendentes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Aprovados</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.aprovados}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
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
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <RequestQuote sx={{ mr: 1, verticalAlign: 'middle' }} />
            Orçamentos Cadastrados
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Serviço</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Validade</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orcamentos.map((orcamento) => (
                  <TableRow key={orcamento.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {orcamento.numero}
                      </Typography>
                    </TableCell>
                    <TableCell>{orcamento.cliente}</TableCell>
                    <TableCell>{orcamento.servico}</TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                        R$ {orcamento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(orcamento.validade).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={orcamento.status}
                        color={getStatusColor(orcamento.status)}
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
                        <Tooltip title="Enviar">
                          <IconButton size="small" color="success">
                            <Send />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <RequestQuote sx={{ mr: 1, verticalAlign: 'middle' }} />
          Novo Orçamento
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
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
                  <InputLabel>Serviço</InputLabel>
                  <Select
                    value={formData.servico}
                    label="Serviço"
                    onChange={(e) => handleInputChange('servico', e.target.value)}
                  >
                    {servicos.map(servico => (
                      <MenuItem key={servico} value={servico}>{servico}</MenuItem>
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
                <TextField
                  fullWidth
                  label="Validade"
                  type="date"
                  value={formData.validade}
                  onChange={(e) => handleInputChange('validade', e.target.value)}
                  InputLabelProps={{ shrink: true }}
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
            {loading ? 'Salvando...' : 'Salvar Orçamento'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Orcamentos;
