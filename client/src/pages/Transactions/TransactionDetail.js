/**
 * Página de Detalhes da Transação
 * 
 * Interface para visualizar detalhes completos de uma transação.
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
  Receipt,
  AccountBalanceWallet,
  CalendarToday,
  AttachMoney,
  Description,
  CheckCircle,
  Warning,
  Cancel,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Layout from '../../components/Layout/Layout';

// Dados mockados
const mockTransactionDetail = {
  id: 1,
  tipo: 'compra',
  descricao: 'Compra de 5.000 milhas Latam Pass',
  conta: 'Latam Pass',
  valor: 5000,
  valorMonetario: 1500.00,
  data: '2024-08-15',
  status: 'concluida',
  observacoes: 'Compra realizada via site oficial da Latam durante promoção especial',
  detalhes: {
    taxa: 0,
    desconto: 150.00,
    valorOriginal: 1650.00,
    meioPagamento: 'Cartão de Crédito',
    numeroTransacao: 'TXN-2024-0815-001',
    comprovante: 'comprovante_compra_001.pdf',
  },
  historico: [
    {
      data: '2024-08-15 10:30:00',
      status: 'iniciada',
      observacao: 'Transação iniciada pelo usuário',
    },
    {
      data: '2024-08-15 10:32:00',
      status: 'processando',
      observacao: 'Pagamento processado com sucesso',
    },
    {
      data: '2024-08-15 10:35:00',
      status: 'concluida',
      observacao: 'Milhas creditadas na conta',
    },
  ],
};

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactionDetail();
  }, [id]);

  const loadTransactionDetail = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransaction(mockTransactionDetail);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar detalhes da transação:', error);
      setLoading(false);
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
        return <Receipt />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluida':
        return <CheckCircle color="success" />;
      case 'pendente':
        return <Warning color="warning" />;
      case 'cancelada':
        return <Cancel color="error" />;
      default:
        return <Receipt />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluida':
        return 'success';
      case 'pendente':
        return 'warning';
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'compra':
        return 'success';
      case 'venda':
        return 'error';
      case 'transferencia':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" height={40} width={200} />
          <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
        </Box>
      </Layout>
    );
  }

  if (!transaction) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Transação não encontrada
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate('/transactions')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Detalhes da Transação
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {transaction.descricao}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/transactions/${transaction.id}/edit`)}
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
                  <Avatar sx={{ bgcolor: getTipoColor(transaction.tipo) + '.main', mr: 2 }}>
                    {getTipoIcon(transaction.tipo)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {transaction.descricao}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {transaction.conta} • {transaction.detalhes.numeroTransacao}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        label={transaction.tipo}
                        color={getTipoColor(transaction.tipo)}
                        size="small"
                      />
                      <Chip
                        label={transaction.status}
                        color={getStatusColor(transaction.status)}
                        size="small"
                        icon={getStatusIcon(transaction.status)}
                      />
                    </Box>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: getTipoColor(transaction.tipo) + '.main' }}>
                        {transaction.valor > 0 ? '+' : ''}{transaction.valor.toLocaleString()}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        milhas {transaction.tipo === 'compra' ? 'adquiridas' : transaction.tipo === 'venda' ? 'vendidas' : 'transferidas'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        R$ {transaction.valorMonetario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        valor monetário
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Detalhes Financeiros */}
                {transaction.detalhes && (
                  <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Detalhes Financeiros
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Valor Original:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          R$ {transaction.detalhes.valorOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Desconto:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                          - R$ {transaction.detalhes.desconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Taxa:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          R$ {transaction.detalhes.taxa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Meio de Pagamento:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {transaction.detalhes.meioPagamento}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Observações */}
                {transaction.observacoes && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Observações
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {transaction.observacoes}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Informações da Transação
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Data"
                      secondary={format(new Date(transaction.data), 'dd/MM/yyyy', { locale: ptBR })}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalanceWallet />
                    </ListItemIcon>
                    <ListItemText
                      primary="Conta"
                      secondary={transaction.conta}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <AttachMoney />
                    </ListItemIcon>
                    <ListItemText
                      primary="Valor Monetário"
                      secondary={`R$ ${transaction.valorMonetario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Description />
                    </ListItemIcon>
                    <ListItemText
                      primary="Número da Transação"
                      secondary={transaction.detalhes.numeroTransacao}
                    />
                  </ListItem>
                </List>

                {/* Comprovante */}
                {transaction.detalhes.comprovante && (
                  <Box sx={{ mt: 2, p: 2, backgroundColor: 'primary.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Comprovante
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        // Simular download do comprovante
                        alert('Download do comprovante iniciado');
                      }}
                    >
                      Baixar {transaction.detalhes.comprovante}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Histórico da Transação */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Histórico da Transação
            </Typography>
            
            <List>
              {transaction.historico.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(item.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(item.data), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </Typography>
                        </Box>
                      }
                      secondary={item.observacao}
                    />
                  </ListItem>
                  {index < transaction.historico.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default TransactionDetail;
