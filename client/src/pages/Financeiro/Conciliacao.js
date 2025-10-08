/**
 * Página de Conciliação
 * 
 * Sistema de conciliação bancária e financeira,
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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Sync,
  AccountBalance,
  AttachMoney,
  Refresh,
  Search,
  Visibility,
  Edit,
  Check,
  Close,
  ExpandMore,
  Compare,
  Timeline,
  Assessment
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Conciliacao = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('mes_atual');
  const [selectedAccount, setSelectedAccount] = useState('todas');

  // Dados mockados baseados nas imagens
  const [conciliacao] = useState({
    resumo: {
      totalMovimentacoes: 45,
      conciliadas: 38,
      pendentes: 7,
      divergencias: 2,
      saldoContabil: 15420.50,
      saldoBancario: 15380.75,
      diferenca: -39.75
    },
    movimentacoes: [
      {
        id: 1,
        data: '2024-01-15',
        descricao: 'Venda de milhas LATAM Pass',
        valor: 875.00,
        tipo: 'entrada',
        categoria: 'vendas',
        status: 'conciliada',
        referencia: 'VND-001',
        observacoes: 'Cliente João Silva'
      },
      {
        id: 2,
        data: '2024-01-15',
        descricao: 'Taxa bancária',
        valor: 15.50,
        tipo: 'saida',
        categoria: 'taxas',
        status: 'pendente',
        referencia: 'TXN-002',
        observacoes: 'Taxa de transferência'
      },
      {
        id: 3,
        data: '2024-01-14',
        descricao: 'Compra de milhas Smiles',
        valor: 450.00,
        tipo: 'saida',
        categoria: 'compras',
        status: 'conciliada',
        referencia: 'CMP-003',
        observacoes: 'Para cliente Maria Santos'
      },
      {
        id: 4,
        data: '2024-01-14',
        descricao: 'Recebimento PIX',
        valor: 1200.00,
        tipo: 'entrada',
        categoria: 'vendas',
        status: 'divergencia',
        referencia: 'PIX-004',
        observacoes: 'Valor não identificado'
      }
    ]
  });

  const periodos = [
    'Mês Atual', 'Mês Anterior', 'Últimos 3 meses', 'Últimos 6 meses', 'Ano Atual'
  ];

  const contas = [
    'Todas', 'Conta Corrente BB', 'Poupança BB', 'Conta Corrente Itaú'
  ];

  const categorias = [
    'Vendas', 'Compras', 'Taxas', 'Transferências', 'Outros'
  ];

  const statusOptions = [
    'Todas', 'Conciliadas', 'Pendentes', 'Divergências'
  ];

  const handleConciliar = async (id) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Movimentação conciliada:', id);
    } catch (error) {
      console.error('Erro ao conciliar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejeitar = async (id) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Movimentação rejeitada:', id);
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'conciliada': return 'success';
      case 'pendente': return 'warning';
      case 'divergencia': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'conciliada': return <CheckCircle />;
      case 'pendente': return <Warning />;
      case 'divergencia': return <Error />;
      default: return <Warning />;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'entrada': return 'success';
      case 'saida': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Conciliação Bancária
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Conciliação entre movimentações contábeis e bancárias
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
            startIcon={<Sync />}
            onClick={() => {/* Sincronizar com banco */}}
          >
            Sincronizar
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <Search sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filtros
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Período</InputLabel>
                <Select
                  value={selectedPeriod}
                  label="Período"
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  {periodos.map(periodo => (
                    <MenuItem key={periodo} value={periodo}>{periodo}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Conta</InputLabel>
                <Select
                  value={selectedAccount}
                  label="Conta"
                  onChange={(e) => setSelectedAccount(e.target.value)}
                >
                  {contas.map(conta => (
                    <MenuItem key={conta} value={conta}>{conta}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Button 
                variant="contained" 
                fullWidth
                startIcon={<Search />}
                size="large"
              >
                Aplicar Filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {conciliacao.resumo.totalMovimentacoes}
              </Typography>
              <Typography variant="body2" color="text.secondary">movimentações</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Conciliadas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {conciliacao.resumo.conciliadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Pendentes</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {conciliacao.resumo.pendentes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Error sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Divergências</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                {conciliacao.resumo.divergencias}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Compare sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Diferença</Typography>
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: conciliacao.resumo.diferenca < 0 ? 'error.main' : 'success.main' 
                }}
              >
                R$ {Math.abs(conciliacao.resumo.diferenca).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alertas */}
      {conciliacao.resumo.divergencias > 0 && (
        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Atenção:</strong> Existem <strong>{conciliacao.resumo.divergencias} divergências</strong> 
            que precisam ser analisadas. Diferença total: <strong>R$ {conciliacao.resumo.diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
          </Typography>
        </Alert>
      )}

      {/* Comparação de Saldos */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
            Comparação de Saldos
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    Saldo Contábil
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    R$ {conciliacao.resumo.saldoContabil.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    Saldo Bancário
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                    R$ {conciliacao.resumo.saldoBancario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    Diferença
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      color: conciliacao.resumo.diferenca < 0 ? 'error.main' : 'success.main' 
                    }}
                  >
                    R$ {conciliacao.resumo.diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de Movimentações */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
            Movimentações para Conciliação
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Referência</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Observações</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conciliacao.movimentacoes.map((mov) => (
                  <TableRow key={mov.id} hover>
                    <TableCell>
                      {new Date(mov.data).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {mov.descricao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={mov.categoria} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        sx={{ 
                          fontWeight: 600, 
                          color: mov.tipo === 'entrada' ? 'success.main' : 'error.main' 
                        }}
                      >
                        {mov.tipo === 'entrada' ? '+' : '-'} R$ {mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {mov.referencia}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(mov.status)}
                        label={mov.status}
                        color={getStatusColor(mov.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {mov.observacoes}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Visualizar">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Conciliar">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleConciliar(mov.id)}
                            disabled={mov.status === 'conciliada'}
                          >
                            <Check />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rejeitar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleRejeitar(mov.id)}
                          >
                            <Close />
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
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Conciliacao;
