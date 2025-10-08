/**
 * Página de Ticket
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
  HelpOutline,
  Refresh,
  Add,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Save,
  Support,
  BugReport,
  QuestionAnswer,
  PriorityHigh,
  LowPriority,
  Send
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Ticket = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: 'suporte',
    prioridade: 'media',
    descricao: '',
    anexos: ''
  });

  const [tickets] = useState([
    {
      id: 1,
      numero: 'TKT-2024-001',
      titulo: 'Problema ao fazer login',
      categoria: 'suporte',
      prioridade: 'alta',
      status: 'aberto',
      dataCriacao: '2024-01-15',
      usuario: 'João Silva',
      descricao: 'Não consigo fazer login no sistema'
    },
    {
      id: 2,
      numero: 'TKT-2024-002',
      titulo: 'Erro na transferência de milhas',
      categoria: 'bug',
      prioridade: 'media',
      status: 'em_andamento',
      dataCriacao: '2024-01-14',
      usuario: 'Maria Santos',
      descricao: 'Sistema apresenta erro ao transferir milhas'
    },
    {
      id: 3,
      numero: 'TKT-2024-003',
      titulo: 'Dúvida sobre relatórios',
      categoria: 'duvida',
      prioridade: 'baixa',
      status: 'resolvido',
      dataCriacao: '2024-01-13',
      usuario: 'Pedro Costa',
      descricao: 'Como gerar relatório de vendas?'
    }
  ]);

  const categorias = ['Suporte', 'Bug', 'Dúvida', 'Sugestão'];
  const prioridades = [
    { value: 'baixa', label: 'Baixa', color: 'success' },
    { value: 'media', label: 'Média', color: 'warning' },
    { value: 'alta', label: 'Alta', color: 'error' }
  ];
  const statusOptions = ['Aberto', 'Em Andamento', 'Resolvido', 'Fechado'];

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
      console.log('Ticket criado:', formData);
      setOpenDialog(false);
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrioridadeColor = (prioridade) => {
    const prioridadeData = prioridades.find(p => p.value === prioridade);
    return prioridadeData ? prioridadeData.color : 'default';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aberto': return 'warning';
      case 'em_andamento': return 'info';
      case 'resolvido': return 'success';
      case 'fechado': return 'default';
      default: return 'default';
    }
  };

  const stats = {
    totalTickets: tickets.length,
    abertos: tickets.filter(t => t.status === 'aberto').length,
    emAndamento: tickets.filter(t => t.status === 'em_andamento').length,
    resolvidos: tickets.filter(t => t.status === 'resolvido').length
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Tickets de Suporte
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sistema de atendimento e suporte
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
            Atualizar
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Novo Ticket
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HelpOutline sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalTickets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Abertos</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.abertos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Em Andamento</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.emAndamento}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Resolvidos</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.resolvidos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <HelpOutline sx={{ mr: 1, verticalAlign: 'middle' }} />
            Tickets de Suporte
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Prioridade</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Usuário</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {ticket.numero}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {ticket.titulo}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ticket.descricao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.categoria}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={prioridades.find(p => p.value === ticket.prioridade)?.label}
                        color={getPrioridadeColor(ticket.prioridade)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.status}
                        color={getStatusColor(ticket.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{ticket.usuario}</TableCell>
                    <TableCell>
                      {new Date(ticket.dataCriacao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Visualizar">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Responder">
                          <IconButton size="small" color="primary">
                            <Send />
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <HelpOutline sx={{ mr: 1, verticalAlign: 'middle' }} />
          Novo Ticket
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título do Ticket"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={formData.categoria}
                    label="Categoria"
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                  >
                    {categorias.map(categoria => (
                      <MenuItem key={categoria} value={categoria.toLowerCase()}>{categoria}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Prioridade</InputLabel>
                  <Select
                    value={formData.prioridade}
                    label="Prioridade"
                    onChange={(e) => handleInputChange('prioridade', e.target.value)}
                  >
                    {prioridades.map(prioridade => (
                      <MenuItem key={prioridade.value} value={prioridade.value}>
                        {prioridade.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição do Problema"
                  multiline
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  required
                  placeholder="Descreva detalhadamente o problema ou dúvida..."
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Anexos (URLs ou descrição)"
                  multiline
                  rows={2}
                  value={formData.anexos}
                  onChange={(e) => handleInputChange('anexos', e.target.value)}
                  placeholder="Links para screenshots, arquivos ou outras informações relevantes..."
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
            {loading ? 'Criando...' : 'Criar Ticket'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Ticket;
