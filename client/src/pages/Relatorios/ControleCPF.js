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
  Badge,
  Avatar,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Print,
  Refresh,
  Warning,
  CheckCircle,
  Cancel,
  Person,
  FlightTakeoff,
  AttachMoney,
  CalendarToday,
  Visibility,
  Edit,
  Block,
  PlayArrow,
  Stop,
  TrendingUp,
  TrendingDown,
  Info,
  Assessment,
  Timeline,
  BarChart
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getAllCPFs, getCPFStats } from '../../data/cpfData';
import { reportAPI } from '../../services';

const ControleCPF = () => {
  const [cpfs, setCpfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCPFs = async () => {
    try {
      setLoading(true);
      const res = await reportAPI.getCPFControlReport();
      setCpfs(res.cpfs || getAllCPFs());
    } catch (err) {
      setError('Erro ao carregar CPFs');
      setCpfs(getAllCPFs()); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCPFs();
  }, []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedCpf, setSelectedCpf] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [blockDialog, setBlockDialog] = useState(false);

  // Carregar dados da base centralizada
  // Filtrar CPFs
  const cpfsFiltrados = cpfs.filter(cpf => {
    const matchesSearch = cpf.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cpf.cpf.includes(searchTerm);
    const matchesStatus = filterStatus === 'todos' || cpf.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'success';
      case 'bloqueado': return 'error';
      case 'suspenso': return 'warning';
      case 'verificando': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ativo': return <CheckCircle />;
      case 'bloqueado': return <Block />;
      case 'suspenso': return <Warning />;
      case 'verificando': return <Info />;
      default: return <Person />;
    }
  };

  const getRiscoColor = (risco) => {
    switch (risco) {
      case 'alto': return 'error';
      case 'médio': return 'warning';
      case 'baixo': return 'success';
      default: return 'default';
    }
  };

  const handleViewDetails = (cpf) => {
    setSelectedCpf(cpf);
    setDetailDialog(true);
  };

  const handleBlockCPF = (cpf) => {
    setSelectedCpf(cpf);
    setBlockDialog(true);
  };

  const handleBlockConfirm = () => {
    if (selectedCpf) {
      setCpfs(prev => prev.map(cpf => 
        cpf.id === selectedCpf.id 
          ? { ...cpf, status: 'bloqueado', observacoes: 'CPF bloqueado manualmente' }
          : cpf
      ));
      setBlockDialog(false);
      setSelectedCpf(null);
    }
  };

  const handleUnblockCPF = (cpf) => {
    setCpfs(prev => prev.map(item => 
      item.id === cpf.id 
        ? { ...item, status: 'ativo', observacoes: '' }
        : item
    ));
  };

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando controle de CPFs...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          Controle de CPF
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gerencie e monitore todos os CPFs cadastrados no sistema ({cpfs.length} CPFs)
        </Typography>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircle sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Ativos
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {cpfs.filter(c => c.status === 'ativo').length}
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
                  <Block sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Bloqueados
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {cpfs.filter(c => c.status === 'bloqueado').length}
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
            <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Warning sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Suspensos
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {cpfs.filter(c => c.status === 'suspenso').length}
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
            <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Info sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Verificando
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {cpfs.filter(c => c.status === 'verificando').length}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Pesquisar CPF"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome ou CPF..."
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="bloqueado">Bloqueado</MenuItem>
                  <MenuItem value="suspenso">Suspenso</MenuItem>
                  <MenuItem value="verificando">Verificando</MenuItem>
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
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabela de CPFs */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              CPFs Cadastrados ({cpfsFiltrados.length} de {cpfs.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" startIcon={<Assessment />}>
                Relatório Completo
              </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Risco</TableCell>
                  <TableCell>Programas</TableCell>
                  <TableCell align="right">Movimentações</TableCell>
                  <TableCell align="right">Valor Total</TableCell>
                  <TableCell>Último Uso</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cpfsFiltrados
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((cpf) => (
                  <TableRow key={cpf.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32 }}>
                          {cpf.nome.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {cpf.nome}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {cpf.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(cpf.status)}
                        label={cpf.status}
                        size="small"
                        color={getStatusColor(cpf.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cpf.risco}
                        size="small"
                        color={getRiscoColor(cpf.risco)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {cpf.programa ? (
                          <Chip
                            label={cpf.programa}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">-</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {cpf.totalMovimentacoes}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        R$ {(cpf.valorTotal || cpf.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {cpf.ultimoUso.toLocaleDateString('pt-BR')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Visualizar Detalhes">
                          <IconButton size="small" onClick={() => handleViewDetails(cpf)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        {cpf.status === 'ativo' ? (
                          <Tooltip title="Bloquear CPF">
                            <IconButton size="small" color="error" onClick={() => handleBlockCPF(cpf)}>
                              <Block />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Desbloquear CPF">
                            <IconButton size="small" color="success" onClick={() => handleUnblockCPF(cpf)}>
                              <PlayArrow />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={cpfsFiltrados.length}
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
            <Person sx={{ mr: 1 }} />
            Detalhes do CPF
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCpf && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Informações Pessoais</Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Nome"
                      secondary={selectedCpf.nome}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="CPF"
                      secondary={selectedCpf.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Status"
                      secondary={
                        <Chip
                          icon={getStatusIcon(selectedCpf.status)}
                          label={selectedCpf.status}
                          size="small"
                          color={getStatusColor(selectedCpf.status)}
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Data de Cadastro"
                      secondary={selectedCpf.dataCadastro.toLocaleDateString('pt-BR')}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Estatísticas</Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Total de Movimentações"
                      secondary={selectedCpf.totalMovimentacoes}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Valor Total Movimentado"
                      secondary={`R$ ${(selectedCpf.valorTotal || selectedCpf.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Último Uso"
                      secondary={selectedCpf.ultimoUso.toLocaleDateString('pt-BR')}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Nível de Risco"
                      secondary={
                        <Chip
                          label={selectedCpf.risco}
                          size="small"
                          color={getRiscoColor(selectedCpf.risco)}
                        />
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Programa</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedCpf.programa ? (
                    <Chip
                      label={selectedCpf.programa}
                      color="primary"
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">Nenhum programa associado</Typography>
                  )}
                </Box>
              </Grid>
              {selectedCpf.observacoes && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Observações</Typography>
                  <Alert severity="warning">
                    {selectedCpf.observacoes}
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

      {/* Dialog de Bloqueio */}
      <Dialog open={blockDialog} onClose={() => setBlockDialog(false)}>
        <DialogTitle>Bloquear CPF</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja bloquear o CPF de {selectedCpf?.nome}?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta ação impedirá que movimentações sejam realizadas com este CPF.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialog(false)}>Cancelar</Button>
          <Button onClick={handleBlockConfirm} color="error" variant="contained">
            Bloquear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alertas */}
      <Box sx={{ mt: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Controle Inteligente:</strong> O sistema monitora automaticamente padrões suspeitos e pode bloquear CPFs automaticamente.
        </Alert>
        <Alert severity="warning">
          <strong>Atenção:</strong> CPFs bloqueados não poderão realizar movimentações até serem desbloqueados manualmente.
        </Alert>
      </Box>
    </Box>
  );
};

export default ControleCPF;
