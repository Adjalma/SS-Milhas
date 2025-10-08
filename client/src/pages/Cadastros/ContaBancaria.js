/**
 * Página de Conta Bancária
 * 
 * Sistema de cadastro de contas bancárias,
 * baseado no sistema de cadastros do iddas.com.br
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
  Avatar,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  AccountBalance,
  AccountBalanceWallet,
  Refresh,
  Add,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Warning,
  Info,
  Save,
  Search,
  Business,
  Person,
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const ContaBancaria = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    banco: '',
    tipo: 'corrente',
    agencia: '',
    conta: '',
    digito: '',
    titular: '',
    cpfCnpj: '',
    ativa: true,
    saldo: 0,
    observacoes: ''
  });

  // Dados mockados
  const [contas] = useState([
    {
      id: 1,
      banco: 'Banco do Brasil',
      tipo: 'corrente',
      agencia: '1234',
      conta: '12345-6',
      digito: '6',
      titular: 'João Silva',
      cpfCnpj: '123.456.789-00',
      ativa: true,
      saldo: 15420.50,
      observacoes: 'Conta principal'
    },
    {
      id: 2,
      banco: 'Banco do Brasil',
      tipo: 'poupanca',
      agencia: '1234',
      conta: '98765-4',
      digito: '4',
      titular: 'João Silva',
      cpfCnpj: '123.456.789-00',
      ativa: true,
      saldo: 8500.00,
      observacoes: 'Poupança para reserva'
    },
    {
      id: 3,
      banco: 'Itaú',
      tipo: 'corrente',
      agencia: '5678',
      conta: '54321-0',
      digito: '0',
      titular: 'João Silva',
      cpfCnpj: '123.456.789-00',
      ativa: false,
      saldo: 0,
      observacoes: 'Conta inativa'
    }
  ]);

  const bancos = [
    'Banco do Brasil', 'Itaú', 'Bradesco', 'Santander', 'Caixa Econômica Federal',
    'Banco Inter', 'Nubank', 'BTG Pactual', 'Safra', 'Banco do Nordeste'
  ];

  const tiposConta = [
    { value: 'corrente', label: 'Conta Corrente' },
    { value: 'poupanca', label: 'Poupança' },
    { value: 'investimento', label: 'Conta Investimento' }
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
      console.log('Conta bancária registrada:', formData);
      
      setFormData({
        banco: '',
        tipo: 'corrente',
        agencia: '',
        conta: '',
        digito: '',
        titular: '',
        cpfCnpj: '',
        ativa: true,
        saldo: 0,
        observacoes: ''
      });
      
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Erro ao registrar conta:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'corrente': return 'primary';
      case 'poupanca': return 'success';
      case 'investimento': return 'warning';
      default: return 'default';
    }
  };

  const stats = {
    totalContas: contas.length,
    ativas: contas.filter(c => c.ativa).length,
    inativas: contas.filter(c => !c.ativa).length,
    saldoTotal: contas.reduce((sum, c) => sum + c.saldo, 0)
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Contas Bancárias
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Cadastro e gestão de contas bancárias
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
            Nova Conta
          </Button>
        </Box>
      </Box>

      {/* Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalContas}
              </Typography>
              <Typography variant="body2" color="text.secondary">contas</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Ativas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.ativas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Inativas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.inativas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Saldo Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                R$ {stats.saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Contas */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <AccountBalanceWallet sx={{ mr: 1, verticalAlign: 'middle' }} />
            Contas Cadastradas
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Banco</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Agência</TableCell>
                  <TableCell>Conta</TableCell>
                  <TableCell>Titular</TableCell>
                  <TableCell align="right">Saldo</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contas.map((conta) => (
                  <TableRow key={conta.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <Business />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {conta.banco}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tiposConta.find(t => t.value === conta.tipo)?.label}
                        color={getTipoColor(conta.tipo)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{conta.agencia}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {conta.conta}-{conta.digito}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {conta.titular}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {conta.cpfCnpj}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                        R$ {conta.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={conta.ativa ? 'Ativa' : 'Inativa'}
                        color={conta.ativa ? 'success' : 'error'}
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

      {/* Dialog de Nova Conta */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nova Conta Bancária
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Banco</InputLabel>
                  <Select
                    value={formData.banco}
                    label="Banco"
                    onChange={(e) => handleInputChange('banco', e.target.value)}
                  >
                    {bancos.map(banco => (
                      <MenuItem key={banco} value={banco}>{banco}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Conta</InputLabel>
                  <Select
                    value={formData.tipo}
                    label="Tipo de Conta"
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                  >
                    {tiposConta.map(tipo => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Agência"
                  value={formData.agencia}
                  onChange={(e) => handleInputChange('agencia', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Número da Conta"
                  value={formData.conta}
                  onChange={(e) => handleInputChange('conta', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Dígito"
                  value={formData.digito}
                  onChange={(e) => handleInputChange('digito', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Titular"
                  value={formData.titular}
                  onChange={(e) => handleInputChange('titular', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CPF/CNPJ"
                  value={formData.cpfCnpj}
                  onChange={(e) => handleInputChange('cpfCnpj', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Saldo Inicial"
                  type="number"
                  step="0.01"
                  value={formData.saldo}
                  onChange={(e) => handleInputChange('saldo', e.target.value)}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.ativa}
                      onChange={(e) => handleInputChange('ativa', e.target.checked)}
                    />
                  }
                  label="Conta ativa"
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
                  placeholder="Informações adicionais sobre a conta..."
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
            {loading ? 'Salvando...' : 'Salvar Conta'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default ContaBancaria;
