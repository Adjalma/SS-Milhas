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
  Tab,
  FormControlLabel,
  Switch,
  InputAdornment
} from '@mui/material';
import {
  Person,
  PersonAdd,
  Search,
  FilterList,
  Download,
  Print,
  Refresh,
  Add,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Badge,
  AccountBalance,
  CreditCard,
  FlightTakeoff,
  AttachMoney,
  Warning,
  CheckCircle,
  Info,
  Business,
  Home
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const CadastroPessoa = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [formDialog, setFormDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [pessoas, setPessoas] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    rg: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    dataNascimento: '',
    profissao: '',
    observacoes: '',
    status: 'ativo'
  });

  useEffect(() => {
    const loadPessoasData = async () => {
      setLoading(true);
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gerar dados mockados
      const pessoasMockadas = [];
      const nomes = [
        'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira',
        'Lucia Ferreira', 'Roberto Almeida', 'Fernanda Lima', 'Marcos Souza', 'Juliana Rocha',
        'Antonio Gomes', 'Patricia Dias', 'Ricardo Nunes', 'Camila Martins', 'Felipe Ribeiro',
        'Larissa Carvalho', 'Diego Barbosa', 'Gabriela Moreira', 'Rafael Cunha', 'Beatriz Cardoso'
      ];
      
      const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília'];
      const estados = ['SP', 'RJ', 'MG', 'BA', 'DF'];
      const profissoes = ['Engenheiro', 'Advogado', 'Médico', 'Professor', 'Empresário'];
      const statusOptions = ['ativo', 'inativo', 'suspenso'];

      for (let i = 1; i <= 500; i++) {
        const nomeIndex = Math.floor(Math.random() * nomes.length);
        const cidadeIndex = Math.floor(Math.random() * cidades.length);
        const profissaoIndex = Math.floor(Math.random() * profissoes.length);
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        
        pessoasMockadas.push({
          id: i,
          nome: `${nomes[nomeIndex]} ${i}`,
          cpf: `${Math.floor(Math.random() * 900000000) + 100000000}`,
          rg: `${Math.floor(Math.random() * 90000000) + 10000000}`,
          email: `pessoa${i}@email.com`,
          telefone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
          endereco: `Rua ${Math.floor(Math.random() * 1000) + 1}, ${Math.floor(Math.random() * 100) + 1}`,
          cidade: cidades[cidadeIndex],
          estado: estados[cidadeIndex],
          cep: `${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 900) + 100}`,
          dataNascimento: new Date(1950 + Math.random() * 50, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          profissao: profissoes[profissaoIndex],
          observacoes: status === 'suspenso' ? 'Cliente com restrições' : '',
          status: status,
          dataCadastro: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          totalContas: Math.floor(Math.random() * 10) + 1,
          valorTotal: Math.random() * 100000 + 10000
        });
      }
      
      setPessoas(pessoasMockadas);
      setLoading(false);
    };

    loadPessoasData();
  }, []);

  // Filtrar pessoas
  const pessoasFiltradas = pessoas.filter(pessoa => {
    const matchesSearch = pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pessoa.cpf.includes(searchTerm) ||
                         pessoa.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || pessoa.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'success';
      case 'inativo': return 'default';
      case 'suspenso': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ativo': return <CheckCircle />;
      case 'inativo': return <Warning />;
      case 'suspenso': return <Info />;
      default: return <Person />;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const novaPessoa = {
      id: pessoas.length + 1,
      ...formData,
      dataCadastro: new Date(),
      totalContas: 0,
      valorTotal: 0
    };

    setPessoas(prev => [novaPessoa, ...prev]);
    setFormDialog(false);
    
    // Limpar formulário
    setFormData({
      nome: '',
      cpf: '',
      rg: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      dataNascimento: '',
      profissao: '',
      observacoes: '',
      status: 'ativo'
    });

    alert('Pessoa cadastrada com sucesso!');
  };

  const handleViewDetails = (pessoa) => {
    setSelectedPerson(pessoa);
    setDetailDialog(true);
  };

  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCEP = (cep) => {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando cadastro de pessoas...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          Cadastro de Pessoas
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gerencie o cadastro de todas as pessoas do sistema ({pessoas.length} pessoas)
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
                    Ativas
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {pessoas.filter(p => p.status === 'ativo').length}
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
            <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Warning sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Inativas
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {pessoas.filter(p => p.status === 'inativo').length}
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
            <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Info sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Suspensas
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {pessoas.filter(p => p.status === 'suspenso').length}
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
            <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Total
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {pessoas.length}
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
                label="Pesquisar Pessoa"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome, CPF ou email..."
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
                  <MenuItem value="inativo">Inativo</MenuItem>
                  <MenuItem value="suspenso">Suspenso</MenuItem>
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
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setFormDialog(true)}
                >
                  Nova Pessoa
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabela de Pessoas */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Pessoas Cadastradas ({pessoasFiltradas.length} de {pessoas.length})
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Cidade/UF</TableCell>
                  <TableCell>Profissão</TableCell>
                  <TableCell>Contas</TableCell>
                  <TableCell>Valor Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pessoasFiltradas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((pessoa) => (
                  <TableRow key={pessoa.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32 }}>
                          {pessoa.nome.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {pessoa.nome}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {formatCPF(pessoa.cpf)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {pessoa.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {pessoa.telefone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {pessoa.cidade}/{pessoa.estado}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {pessoa.profissao}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={pessoa.totalContas} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        R$ {pessoa.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(pessoa.status)}
                        label={pessoa.status}
                        size="small"
                        color={getStatusColor(pessoa.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Visualizar Detalhes">
                          <IconButton size="small" onClick={() => handleViewDetails(pessoa)}>
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
            count={pessoasFiltradas.length}
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
            Detalhes da Pessoa
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPerson && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Informações Pessoais</Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Nome Completo"
                      secondary={selectedPerson.nome}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="CPF"
                      secondary={formatCPF(selectedPerson.cpf)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="RG"
                      secondary={selectedPerson.rg}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Email"
                      secondary={selectedPerson.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Telefone"
                      secondary={selectedPerson.telefone}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Endereço e Dados</Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Endereço"
                      secondary={selectedPerson.endereco}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Cidade/UF"
                      secondary={`${selectedPerson.cidade}/${selectedPerson.estado}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="CEP"
                      secondary={formatCEP(selectedPerson.cep)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Data de Nascimento"
                      secondary={new Date(selectedPerson.dataNascimento).toLocaleDateString('pt-BR')}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Profissão"
                      secondary={selectedPerson.profissao}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Informações do Sistema</Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Status"
                      secondary={
                        <Chip
                          icon={getStatusIcon(selectedPerson.status)}
                          label={selectedPerson.status}
                          size="small"
                          color={getStatusColor(selectedPerson.status)}
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Data de Cadastro"
                      secondary={new Date(selectedPerson.dataCadastro).toLocaleDateString('pt-BR')}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Total de Contas"
                      secondary={selectedPerson.totalContas}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Valor Total Movimentado"
                      secondary={`R$ ${selectedPerson.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    />
                  </ListItem>
                </List>
              </Grid>
              {selectedPerson.observacoes && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Observações</Typography>
                  <Alert severity="warning">
                    {selectedPerson.observacoes}
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

      {/* Dialog de Formulário */}
      <Dialog open={formDialog} onClose={() => setFormDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonAdd sx={{ mr: 1 }} />
            Nova Pessoa
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="CPF"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="RG"
                  value={formData.rg}
                  onChange={(e) => handleInputChange('rg', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Endereço"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="CEP"
                  value={formData.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  placeholder="00000-000"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Estado"
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  placeholder="SP"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Profissão"
                  value={formData.profissao}
                  onChange={(e) => handleInputChange('profissao', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Nascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <MenuItem value="ativo">Ativo</MenuItem>
                    <MenuItem value="inativo">Inativo</MenuItem>
                    <MenuItem value="suspenso">Suspenso</MenuItem>
                  </Select>
                </FormControl>
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
          <Button onClick={() => setFormDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alertas */}
      <Box sx={{ mt: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Cadastro Completo:</strong> Mantenha sempre os dados pessoais atualizados para melhor controle.
        </Alert>
        <Alert severity="warning">
          <strong>LGPD:</strong> Os dados pessoais são protegidos conforme a Lei Geral de Proteção de Dados.
        </Alert>
      </Box>
    </Box>
  );
};

export default CadastroPessoa;
