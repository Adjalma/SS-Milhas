/**
 * Página de Contas
 * 
 * Interface para gerenciar contas de programas de fidelidade.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  AccountBalanceWallet,
  TrendingUp,
  Warning,
  CheckCircle,
  FlightTakeoff,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';

// Dados mockados
const mockAccounts = [
  {
    id: 1,
    nome: 'Latam Pass',
    numero: '123456789',
    saldo: 45000,
    saldoAnterior: 42000,
    expiracao: '2024-12-15',
    status: 'ativa',
    programa: 'Latam',
    tipo: 'miles',
    icone: 'LT',
    cor: '#1976d2',
    ultimaAtualizacao: '2024-08-15',
    meta: 50000,
  },
  {
    id: 2,
    nome: 'Smiles',
    numero: '987654321',
    saldo: 32000,
    saldoAnterior: 30000,
    expiracao: '2025-03-20',
    status: 'ativa',
    programa: 'Gol',
    tipo: 'smiles',
    icone: 'SM',
    cor: '#2e7d32',
    ultimaAtualizacao: '2024-08-14',
    meta: 40000,
  },
  {
    id: 3,
    nome: 'TudoAzul',
    numero: '456789123',
    saldo: 28000,
    saldoAnterior: 25000,
    expiracao: '2024-11-30',
    status: 'expirando',
    programa: 'Azul',
    tipo: 'miles',
    icone: 'TA',
    cor: '#ed6c02',
    ultimaAtualizacao: '2024-08-13',
    meta: 35000,
  },
  {
    id: 4,
    nome: 'Azul Fidelidade',
    numero: '789123456',
    saldo: 20000,
    saldoAnterior: 18000,
    expiracao: '2025-06-10',
    status: 'ativa',
    programa: 'Azul',
    tipo: 'miles',
    icone: 'AF',
    cor: '#9c27b0',
    ultimaAtualizacao: '2024-08-12',
    meta: 30000,
  },
];

const Accounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('add'); // add, edit, view
  const [formData, setFormData] = useState({
    nome: '',
    numero: '',
    programa: '',
    tipo: 'miles',
    meta: '',
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccounts(mockAccounts);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, account) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccount(account);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAccount(null);
  };

  const handleDialogOpen = (type, account = null) => {
    setDialogType(type);
    setSelectedAccount(account);
    
    if (account) {
      setFormData({
        nome: account.nome,
        numero: account.numero,
        programa: account.programa,
        tipo: account.tipo,
        meta: account.meta,
      });
    } else {
      setFormData({
        nome: '',
        numero: '',
        programa: '',
        tipo: 'miles',
        meta: '',
      });
    }
    
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedAccount(null);
    setFormData({
      nome: '',
      numero: '',
      programa: '',
      tipo: 'miles',
      meta: '',
    });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (dialogType === 'add') {
        // Adicionar nova conta
        const newAccount = {
          id: Date.now(),
          ...formData,
          saldo: 0,
          saldoAnterior: 0,
          status: 'ativa',
          expiracao: '2025-12-31',
          ultimaAtualizacao: new Date().toISOString().split('T')[0],
          icone: formData.nome.substring(0, 2).toUpperCase(),
          cor: '#1976d2',
        };
        
        setAccounts(prev => [...prev, newAccount]);
      } else if (dialogType === 'edit') {
        // Editar conta existente
        setAccounts(prev =>
          prev.map(account =>
            account.id === selectedAccount.id
              ? { ...account, ...formData }
              : account
          )
        );
      }
      
      handleDialogClose();
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setAccounts(prev => prev.filter(account => account.id !== selectedAccount.id));
      handleMenuClose();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativa':
        return 'success';
      case 'expirando':
        return 'warning';
      case 'expirada':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ativa':
        return <CheckCircle />;
      case 'expirando':
        return <Warning />;
      case 'expirada':
        return <Warning />;
      default:
        return <AccountBalanceWallet />;
    }
  };

  const calculateProgress = (saldo, meta) => {
    return Math.min((saldo / meta) * 100, 100);
  };

  const getVariation = (saldo, saldoAnterior) => {
    const variation = saldo - saldoAnterior;
    return {
      value: Math.abs(variation),
      isPositive: variation >= 0,
      percentage: saldoAnterior > 0 ? (variation / saldoAnterior) * 100 : 0,
    };
  };

  if (loading) {
    return (
      <Layout>
        <Box>
          <Grid container spacing={2}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Contas de Fidelidade
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie suas contas de programas de fidelidade
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleDialogOpen('add')}
            sx={{
              background: 'linear-gradient(45deg, #3B82F6, #10B981)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2563EB, #059669)',
              },
            }}
          >
            Nova Conta
          </Button>
        </Box>

        {/* Estatísticas */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <AccountBalanceWallet />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {accounts.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Contas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <FlightTakeoff />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {accounts.reduce((sum, account) => sum + account.saldo, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Milhas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <Warning />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {accounts.filter(account => account.status === 'expirando').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expirando
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <TrendingUp />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {accounts.filter(account => account.status === 'ativa').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ativas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Lista de Contas */}
        <Grid container spacing={2}>
          {accounts.map((account) => {
            const variation = getVariation(account.saldo, account.saldoAnterior);
            const progress = calculateProgress(account.saldo, account.meta);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={account.id}>
                <Card sx={{ height: '100%', position: 'relative' }}>
                  <CardContent>
                    {/* Header da Conta */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: account.cor, mr: 2 }}>
                          {account.icone}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {account.nome}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {account.numero}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, account)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    {/* Saldo */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: account.cor }}>
                        {account.saldo.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {account.tipo === 'miles' ? 'milhas' : 'pontos'}
                      </Typography>
                    </Box>

                    {/* Variação */}
                    {variation.value > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TrendingUp
                          sx={{
                            fontSize: 16,
                            color: variation.isPositive ? 'success.main' : 'error.main',
                            mr: 0.5,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: variation.isPositive ? 'success.main' : 'error.main',
                            fontWeight: 600,
                          }}
                        >
                          {variation.isPositive ? '+' : '-'}{variation.value.toLocaleString()} 
                          ({variation.percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                    )}

                    {/* Progresso da Meta */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Meta: {account.meta.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {progress.toFixed(0)}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          height: 8,
                          backgroundColor: 'grey.200',
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: account.cor,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Status e Expiração */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        icon={getStatusIcon(account.status)}
                        label={account.status}
                        color={getStatusColor(account.status)}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        Expira em {format(new Date(account.expiracao), 'dd/MM/yyyy', { locale: ptBR })}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Menu de Ações */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleDialogOpen('view', selectedAccount)}>
            <ListItemIcon>
              <Visibility />
            </ListItemIcon>
            <ListItemText>Visualizar</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleDialogOpen('edit', selectedAccount)}>
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete color="error" />
            </ListItemIcon>
            <ListItemText>Excluir</ListItemText>
          </MenuItem>
        </Menu>

        {/* Dialog de Formulário */}
        <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialogType === 'add' ? 'Nova Conta' : 
             dialogType === 'edit' ? 'Editar Conta' : 'Detalhes da Conta'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Nome da Conta"
                value={formData.nome}
                onChange={(e) => handleFormChange('nome', e.target.value)}
                margin="normal"
                disabled={dialogType === 'view'}
              />
              <TextField
                fullWidth
                label="Número da Conta"
                value={formData.numero}
                onChange={(e) => handleFormChange('numero', e.target.value)}
                margin="normal"
                disabled={dialogType === 'view'}
              />
              <TextField
                fullWidth
                label="Programa"
                value={formData.programa}
                onChange={(e) => handleFormChange('programa', e.target.value)}
                margin="normal"
                disabled={dialogType === 'view'}
              />
              <FormControl fullWidth margin="normal" disabled={dialogType === 'view'}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={formData.tipo}
                  label="Tipo"
                  onChange={(e) => handleFormChange('tipo', e.target.value)}
                >
                  <MenuItem value="miles">Milhas</MenuItem>
                  <MenuItem value="smiles">Smiles</MenuItem>
                  <MenuItem value="pontos">Pontos</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Meta"
                type="number"
                value={formData.meta}
                onChange={(e) => handleFormChange('meta', e.target.value)}
                margin="normal"
                disabled={dialogType === 'view'}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>
              {dialogType === 'view' ? 'Fechar' : 'Cancelar'}
            </Button>
            {dialogType !== 'view' && (
              <Button onClick={handleSave} variant="contained">
                {dialogType === 'add' ? 'Criar' : 'Salvar'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Accounts;
