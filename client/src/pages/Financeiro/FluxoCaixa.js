import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Paper,
  LinearProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  AttachMoney,
  CalendarToday,
  Search,
  FilterList,
  Download,
  Print,
  Refresh,
  Add,
  Edit,
  Delete,
  Visibility,
  Receipt,
  SwapHoriz,
  FlightTakeoff,
  Person,
  Business,
  Timeline,
  Assessment,
  PieChart,
  BarChart
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const FluxoCaixa = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterPeriod, setFilterPeriod] = useState('30dias');
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [fluxoData, setFluxoData] = useState({
    resumo: {
      saldoInicial: 0,
      totalEntradas: 0,
      totalSaidas: 0,
      saldoFinal: 0,
      saldoProjetado: 0
    },
    movimentacoes: [],
    categorias: {
      entradas: [],
      saidas: []
    }
  });

  useEffect(() => {
    const loadFluxoData = async () => {
      setLoading(true);
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gerar dados mockados
      const movimentacoes = [];
      const tipos = ['entrada', 'saida'];
      const categorias = [
        'Venda de Milhas', 'Compra de Milhas', 'Transferência', 'Taxa Bancária',
        'Comissão', 'Reembolso', 'Depósito', 'Saque', 'Taxa de Programa'
      ];
      
      const pessoas = [
        'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
      ];

      for (let i = 1; i <= 100; i++) {
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        const categoria = categorias[Math.floor(Math.random() * categorias.length)];
        const pessoa = pessoas[Math.floor(Math.random() * pessoas.length)];
        const valor = Math.random() * 5000 + 100;
        const data = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        movimentacoes.push({
          id: i,
          data: data,
          tipo: tipo,
          categoria: categoria,
          descricao: `${tipo === 'entrada' ? 'Recebimento de' : 'Pagamento de'} ${categoria.toLowerCase()}`,
          valor: tipo === 'entrada' ? valor : -valor,
          pessoa: pessoa,
          status: Math.random() > 0.1 ? 'confirmado' : 'pendente',
          observacoes: tipo === 'saida' ? 'Taxa de processamento incluída' : '',
          saldoAcumulado: 0 // Será calculado
        });
      }

      // Ordenar por data e calcular saldo acumulado
      movimentacoes.sort((a, b) => new Date(a.data) - new Date(b.data));
      
      let saldoAcumulado = 50000; // Saldo inicial
      movimentacoes.forEach(mov => {
        saldoAcumulado += mov.valor;
        mov.saldoAcumulado = saldoAcumulado;
      });

      // Calcular totais
      const totalEntradas = movimentacoes
        .filter(m => m.tipo === 'entrada')
        .reduce((sum, m) => sum + Math.abs(m.valor), 0);
      
      const totalSaidas = movimentacoes
        .filter(m => m.tipo === 'saida')
        .reduce((sum, m) => sum + Math.abs(m.valor), 0);

      setFluxoData({
        resumo: {
          saldoInicial: 50000,
          totalEntradas: totalEntradas,
          totalSaidas: totalSaidas,
          saldoFinal: saldoAcumulado,
          saldoProjetado: saldoAcumulado + (totalEntradas - totalSaidas) * 0.1
        },
        movimentacoes: movimentacoes,
        categorias: {
          entradas: ['Venda de Milhas', 'Reembolso', 'Depósito', 'Comissão'],
          saidas: ['Compra de Milhas', 'Taxa Bancária', 'Taxa de Programa', 'Saque']
        }
      });
      
      setLoading(false);
    };

    loadFluxoData();
  }, []);

  // Filtrar movimentações
  const movimentacoesFiltradas = fluxoData.movimentacoes.filter(mov => {
    const matchesSearch = mov.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mov.pessoa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mov.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'todos' || mov.tipo === filterType;
    
    return matchesSearch && matchesType;
  });

  const getTipoColor = (tipo) => {
    return tipo === 'entrada' ? 'success' : 'error';
  };

  const getTipoIcon = (tipo) => {
    return tipo === 'entrada' ? <TrendingUp /> : <TrendingDown />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado': return 'success';
      case 'pendente': return 'warning';
      case 'cancelado': return 'error';
      default: return 'default';
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailDialog(true);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando fluxo de caixa...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          Fluxo de Caixa
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Controle financeiro completo das movimentações
        </Typography>
      </Box>

      {/* Resumo Financeiro */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalance sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Saldo Inicial
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  R$ {fluxoData.resumo.saldoInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Total Entradas
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  R$ {fluxoData.resumo.totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingDown sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Total Saídas
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  R$ {fluxoData.resumo.totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalance sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Saldo Final
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  R$ {fluxoData.resumo.saldoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Timeline sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Saldo Projetado
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  R$ {fluxoData.resumo.saldoProjetado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Movimentações" icon={<Receipt />} />
            <Tab label="Análise por Categoria" icon={<PieChart />} />
            <Tab label="Projeções" icon={<BarChart />} />
          </Tabs>
        </Box>
      </Card>

      {/* Filtros */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Descrição, pessoa ou categoria..."
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
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
                  <MenuItem value="entrada">Entradas</MenuItem>
                  <MenuItem value="saida">Saídas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Período</InputLabel>
                <Select
                  value={filterPeriod}
                  label="Período"
                  onChange={(e) => setFilterPeriod(e.target.value)}
                >
                  <MenuItem value="7dias">7 dias</MenuItem>
                  <MenuItem value="30dias">30 dias</MenuItem>
                  <MenuItem value="90dias">90 dias</MenuItem>
                  <MenuItem value="1ano">1 ano</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" startIcon={<Search />}>
                  Pesquisar
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
                <Button variant="outlined" startIcon={<Add />}>
                  Nova Movimentação
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabela de Movimentações */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Movimentações ({movimentacoesFiltradas.length})
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Pessoa</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="right">Saldo Acumulado</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movimentacoesFiltradas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((mov) => (
                  <TableRow key={mov.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(mov.data).toLocaleDateString('pt-BR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getTipoIcon(mov.tipo)}
                        label={mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                        size="small"
                        color={getTipoColor(mov.tipo)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={mov.categoria}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {mov.descricao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 1, bgcolor: 'primary.main', width: 24, height: 24 }}>
                          {mov.pessoa.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {mov.pessoa}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: mov.valor > 0 ? 'success.main' : 'error.main'
                        }}
                      >
                        {mov.valor > 0 ? '+' : ''}R$ {Math.abs(mov.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        R$ {mov.saldoAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={mov.status}
                        size="small"
                        color={getStatusColor(mov.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Visualizar Detalhes">
                          <IconButton size="small" onClick={() => handleViewDetails(mov)}>
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

          <TablePagination
            component="div"
            count={movimentacoesFiltradas.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
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
            Detalhes da Movimentação
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Informações Gerais</Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Data"
                      secondary={new Date(selectedItem.data).toLocaleDateString('pt-BR')}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Tipo"
                      secondary={
                        <Chip
                          icon={getTipoIcon(selectedItem.tipo)}
                          label={selectedItem.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                          size="small"
                          color={getTipoColor(selectedItem.tipo)}
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Categoria"
                      secondary={selectedItem.categoria}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Descrição"
                      secondary={selectedItem.descricao}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Valores e Status</Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Valor"
                      secondary={
                        <Typography 
                          sx={{ 
                            fontWeight: 600,
                            color: selectedItem.valor > 0 ? 'success.main' : 'error.main'
                          }}
                        >
                          {selectedItem.valor > 0 ? '+' : ''}R$ {Math.abs(selectedItem.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Saldo Acumulado"
                      secondary={`R$ ${selectedItem.saldoAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Status"
                      secondary={
                        <Chip
                          label={selectedItem.status}
                          size="small"
                          color={getStatusColor(selectedItem.status)}
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Pessoa"
                      secondary={selectedItem.pessoa}
                    />
                  </ListItem>
                </List>
              </Grid>
              {selectedItem.observacoes && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Observações</Typography>
                  <Alert severity="info">
                    {selectedItem.observacoes}
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Alertas */}
      <Box sx={{ mt: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Controle Automático:</strong> O sistema calcula automaticamente o saldo acumulado e projeções baseadas no histórico.
        </Alert>
        <Alert severity="warning">
          <strong>Reconciliação:</strong> Movimentações pendentes devem ser confirmadas para manter o fluxo de caixa atualizado.
        </Alert>
      </Box>
    </Box>
  );
};

export default FluxoCaixa;
