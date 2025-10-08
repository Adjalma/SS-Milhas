/**
 * Página de Detalhes da Conta
 * 
 * Interface para visualizar detalhes completos de uma conta.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  Warning,
  CheckCircle,
  FlightTakeoff,
  Receipt,
  Assessment,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Layout from '../../components/Layout/Layout';

// Dados mockados
const mockAccountDetail = {
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
  historico: [
    {
      id: 1,
      data: '2024-08-15',
      tipo: 'compra',
      descricao: 'Compra de 5.000 milhas',
      valor: 5000,
      saldoAnterior: 40000,
      saldoNovo: 45000,
    },
    {
      id: 2,
      data: '2024-08-10',
      tipo: 'transferencia',
      descricao: 'Transferência recebida',
      valor: 2000,
      saldoAnterior: 38000,
      saldoNovo: 40000,
    },
    {
      id: 3,
      data: '2024-08-05',
      tipo: 'venda',
      descricao: 'Venda de 3.000 milhas',
      valor: -3000,
      saldoAnterior: 41000,
      saldoNovo: 38000,
    },
  ],
  estatisticas: {
    totalCompras: 15000,
    totalVendas: 8000,
    totalTransferencias: 5000,
    valorTotalCompras: 4500.00,
    valorTotalVendas: 2400.00,
    lucro: -2100.00,
  },
};

const AccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccountDetail();
  }, [id]);

  const loadAccountDetail = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccount(mockAccountDetail);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar detalhes da conta:', error);
      setLoading(false);
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

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'compra':
        return <TrendingUp color="success" />;
      case 'venda':
        return <TrendingDown color="error" />;
      case 'transferencia':
        return <Receipt color="info" />;
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
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" height={40} width={200} />
          <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Skeleton variant="rectangular" height={150} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Layout>
    );
  }

  if (!account) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Conta não encontrada
          </Alert>
        </Box>
      </Layout>
    );
  }

  const variation = getVariation(account.saldo, account.saldoAnterior);
  const progress = calculateProgress(account.saldo, account.meta);

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate('/accounts')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {account.nome}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Detalhes da conta {account.numero}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/accounts/${account.id}/edit`)}
          >
            Editar
          </Button>
        </Box>

        {/* Informações Principais */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: account.cor, mr: 2, width: 60, height: 60 }}>
                    {account.icone}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {account.nome}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {account.programa} • {account.numero}
                    </Typography>
                    <Chip
                      label={account.status}
                      color={getStatusColor(account.status)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: account.cor }}>
                        {account.saldo.toLocaleString()}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {account.tipo === 'miles' ? 'milhas' : 'pontos'} atuais
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Meta: {account.meta.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {account.meta - account.saldo > 0 
                          ? `${(account.meta - account.saldo).toLocaleString()} para atingir`
                          : 'Meta atingida!'
                        }
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Progresso da Meta */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progresso da meta
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {progress.toFixed(0)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>

                {/* Variação */}
                {variation.value > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp
                      sx={{
                        fontSize: 20,
                        color: variation.isPositive ? 'success.main' : 'error.main',
                        mr: 1,
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        color: variation.isPositive ? 'success.main' : 'error.main',
                        fontWeight: 600,
                      }}
                    >
                      {variation.isPositive ? '+' : '-'}{variation.value.toLocaleString()} 
                      ({variation.percentage.toFixed(1)}%)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      desde a última atualização
                    </Typography>
                  </Box>
                )}

                {/* Informações Adicionais */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Expira em:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {format(new Date(account.expiracao), 'dd/MM/yyyy', { locale: ptBR })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Última atualização:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {format(new Date(account.ultimaAtualizacao), 'dd/MM/yyyy', { locale: ptBR })}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Estatísticas
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Total Compras"
                      secondary={`${account.estatisticas.totalCompras.toLocaleString()} milhas`}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <TrendingDown color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Total Vendas"
                      secondary={`${account.estatisticas.totalVendas.toLocaleString()} milhas`}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Receipt color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Transferências"
                      secondary={`${account.estatisticas.totalTransferencias.toLocaleString()} milhas`}
                    />
                  </ListItem>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <ListItem>
                    <ListItemText
                      primary="Valor Total Compras"
                      secondary={`R$ ${account.estatisticas.valorTotalCompras.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Valor Total Vendas"
                      secondary={`R$ ${account.estatisticas.valorTotalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Lucro/Prejuízo"
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: account.estatisticas.lucro >= 0 ? 'success.main' : 'error.main',
                            fontWeight: 600,
                          }}
                        >
                          R$ {account.estatisticas.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Histórico de Transações */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Histórico de Transações
            </Typography>
            
            <List>
              {account.historico.map((transacao, index) => (
                <React.Fragment key={transacao.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getTipoIcon(transacao.tipo)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {transacao.descricao}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: transacao.valor > 0 ? 'success.main' : 'error.main',
                              fontWeight: 600,
                            }}
                          >
                            {transacao.valor > 0 ? '+' : ''}{transacao.valor.toLocaleString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(transacao.data), 'dd/MM/yyyy', { locale: ptBR })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Saldo anterior: {transacao.saldoAnterior.toLocaleString()} → 
                            Saldo novo: {transacao.saldoNovo.toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < account.historico.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default AccountDetail;
