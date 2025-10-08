import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Tooltip,
  Alert,
  Paper,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Download,
  Print,
  Refresh,
  MoreVert,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Schedule,
  CheckCircle,
  Warning,
  FlightTakeoff,
  Person,
  AttachMoney,
  Visibility,
  Edit,
  Delete,
  Receipt
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    compras: 0,
    vendas: 0,
    transferencias: 0,
    pendentes: 0
  });

  useEffect(() => {
    const loadTransactionsData = async () => {
      setLoading(true);
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados
      const mockTransactions = [
        {
          id: 1,
          tipo: 'compra',
          descricao: 'Compra de 5.000 milhas Latam Pass',
          detalhes: 'Compra realizada via site oficial',
          conta: 'Latam Pass',
          valor: 5000,
          valorMonetario: 1500.00,
          data: '2024-08-14',
          status: 'concluida'
        },
        {
          id: 2,
          tipo: 'transferencia',
          descricao: 'Transferência para conta Smiles',
          detalhes: 'Transferência entre contas próprias',
          conta: 'Smiles',
          valor: 2000,
          valorMonetario: null,
          data: '2024-08-13',
          status: 'concluida'
        },
        {
          id: 3,
          tipo: 'venda',
          descricao: 'Venda de 3.000 milhas',
          detalhes: 'Aguardando confirmação do comprador',
          conta: 'TudoAzul',
          valor: -3000,
          valorMonetario: 900.00,
          data: '2024-08-12',
          status: 'pendente'
        },
        {
          id: 4,
          tipo: 'compra',
          descricao: 'Compra de 2.500 milhas Smiles',
          detalhes: 'Promoção especial',
          conta: 'Smiles',
          valor: 2500,
          valorMonetario: 750.00,
          data: '2024-08-11',
          status: 'concluida'
        },
        {
          id: 5,
          tipo: 'venda',
          descricao: 'Venda de 1.500 milhas',
          detalhes: 'Venda realizada com sucesso',
          conta: 'Latam Pass',
          valor: -1500,
          valorMonetario: 450.00,
          data: '2024-08-10',
          status: 'concluida'
        }
      ];

      setTransactions(mockTransactions);
      
      // Calcular estatísticas
      setStats({
        compras: mockTransactions.filter(t => t.tipo === 'compra').length,
        vendas: mockTransactions.filter(t => t.tipo === 'venda').length,
        transferencias: mockTransactions.filter(t => t.tipo === 'transferencia').length,
        pendentes: mockTransactions.filter(t => t.status === 'pendente').length
      });
      
      setLoading(false);
    };

    loadTransactionsData();
  }, []);

  // Filtrar transações
  const transactionsFiltradas = transactions.filter(transaction => {
    const matchesSearch = transaction.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.conta.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'todos' || transaction.tipo === filterType;
    const matchesStatus = filterStatus === 'todos' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'compra': return 'success';
      case 'venda': return 'error';
      case 'transferencia': return 'info';
      default: return 'default';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'compra': return <TrendingUp />;
      case 'venda': return <TrendingDown />;
      case 'transferencia': return <SwapHoriz />;
      default: return <Receipt />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluida': return 'success';
      case 'pendente': return 'warning';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluida': return <CheckCircle />;
      case 'pendente': return <Schedule />;
      case 'cancelada': return <Warning />;
      default: return <Receipt />;
    }
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailDialog(true);
  };

  const handleMenuOpen = (event, transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTransaction(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando transações...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          Transações
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gerencie suas transações de milhas
        </Typography>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Compras
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.compras}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingDown sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Vendas
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.vendas}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SwapHoriz sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Transferências
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.transferencias}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Schedule sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Pendentes
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.pendentes}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Filtros e Ações */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                placeholder="Descrição ou conta..."
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filterType}
                  label="Tipo"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="compra">Compra</MenuItem>
                  <MenuItem value="venda">Venda</MenuItem>
                  <MenuItem value="transferencia">Transferência</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="concluida">Concluída</MenuItem>
                  <MenuItem value="pendente">Pendente</MenuItem>
                  <MenuItem value="cancelada">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" startIcon={<Add />}>
                  Nova Transação
                </Button>
                <Button variant="outlined" startIcon={<Download />}>
                  Exportar
                </Button>
                <Button variant="outlined" startIcon={<Print />}>
                  Imprimir
                </Button>
                <Button variant="outlined" startIcon={<Refresh />}>
                  Atualizar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Lista de Transações ({transactionsFiltradas.length})
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Conta</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="right">Valor Monetário</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionsFiltradas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Chip
                        icon={getTipoIcon(transaction.tipo)}
                        label={transaction.tipo}
                        size="small"
                        color={getTipoColor(transaction.tipo)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {transaction.descricao}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.detalhes}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlightTakeoff sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {transaction.conta}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: transaction.valor > 0 ? 'success.main' : 'error.main'
                        }}
                      >
                        {transaction.valor > 0 ? '+' : ''}{transaction.valor.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {transaction.valorMonetario ? (
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          R$ {transaction.valorMonetario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(transaction.data).toLocaleDateString('pt-BR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(transaction.status)}
                        label={transaction.status}
                        size="small"
                        color={getStatusColor(transaction.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Visualizar">
                          <IconButton size="small" onClick={() => handleViewDetails(transaction)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mais opções">
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleMenuOpen(e, transaction)}
                          >
                            <MoreVert />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={transactionsFiltradas.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
          />
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={detailDialog} onClose={() => setDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Receipt sx={{ mr: 1 }} />
            Detalhes da Transação
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Informações Gerais</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Tipo:</Typography>
                  <Chip
                    icon={getTipoIcon(selectedTransaction.tipo)}
                    label={selectedTransaction.tipo}
                    size="small"
                    color={getTipoColor(selectedTransaction.tipo)}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Descrição:</Typography>
                  <Typography variant="body2">{selectedTransaction.descricao}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Detalhes:</Typography>
                  <Typography variant="body2">{selectedTransaction.detalhes}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Conta:</Typography>
                  <Typography variant="body2">{selectedTransaction.conta}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Valores e Status</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Valor em Milhas:</Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: selectedTransaction.valor > 0 ? 'success.main' : 'error.main'
                    }}
                  >
                    {selectedTransaction.valor > 0 ? '+' : ''}{selectedTransaction.valor.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Valor Monetário:</Typography>
                  <Typography variant="h6">
                    {selectedTransaction.valorMonetario 
                      ? `R$ ${selectedTransaction.valorMonetario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : '-'
                    }
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Data:</Typography>
                  <Typography variant="body2">
                    {new Date(selectedTransaction.data).toLocaleDateString('pt-BR')}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip
                    icon={getStatusIcon(selectedTransaction.status)}
                    label={selectedTransaction.status}
                    size="small"
                    color={getStatusColor(selectedTransaction.status)}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Menu de Ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Receipt />
          </ListItemIcon>
          <ListItemText>Gerar Comprovante</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Transactions;