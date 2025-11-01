/**
 * Página de Processos
 * 
 * Sistema Kanban para gestão de processos,
 * baseado no sistema de processos do iddas.com.br
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
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  FormControlLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Badge
} from '@mui/material';
import {
  Assignment,
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Pending,
  PlayArrow,
  Stop,
  Refresh,
  FilterList,
  Search,
  Person,
  CalendarToday,
  LocalOffer,
  Schedule,
  PriorityHigh,
  LowPriority,
  DragIndicator,
  MoreVert
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { movementAPI } from '../../services';

const Processos = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processos, setProcessos] = useState([]);

  const fetchProcessos = async () => {
    try {
      setLoading(true);
      const res = await movementAPI.getMovements({ tipo: 'processo' });
      setProcessos(res.movements || []);
    } catch (err) {
      setError('Erro ao carregar processos');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProcessos();
  }, []);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    pessoa: '',
    etiqueta: '',
    prioridade: 'media',
    prazo: '',
    observacoes: ''
  });

  const [filtros, setFiltros] = useState({
    pessoa: 'todos',
    periodo: {
      inicio: '',
      fim: ''
    },
    etiqueta: 'todos'
  });

  // Dados mockados dos processos
  const [processos, setProcessos] = useState([
    {
      id: 1,
      titulo: 'Compra de milhas LATAM Pass',
      descricao: 'Processo de compra de 50.000 milhas para cliente VIP',
      pessoa: 'João Silva',
      etiqueta: 'VIP',
      prioridade: 'alta',
      prazo: '2024-01-25',
      status: 'aguardando',
      dataCriacao: '2024-01-15',
      responsavel: 'Maria Santos',
      progresso: 0,
      observacoes: 'Cliente solicitou urgência'
    },
    {
      id: 2,
      titulo: 'Transferência entre contas',
      descricao: 'Transferir 25.000 milhas da conta A para conta B',
      pessoa: 'Empresa ABC',
      etiqueta: 'Normal',
      prioridade: 'media',
      prazo: '2024-01-30',
      status: 'em_andamento',
      dataCriacao: '2024-01-14',
      responsavel: 'Pedro Costa',
      progresso: 60,
      observacoes: 'Aguardando confirmação do cliente'
    },
    {
      id: 3,
      titulo: 'Venda de milhas Smiles',
      descricao: 'Venda de 30.000 milhas Smiles para terceiros',
      pessoa: 'Ana Oliveira',
      etiqueta: 'Urgente',
      prioridade: 'alta',
      prazo: '2024-01-20',
      status: 'concluido',
      dataCriacao: '2024-01-10',
      responsavel: 'Carlos Lima',
      progresso: 100,
      observacoes: 'Processo finalizado com sucesso'
    }
  ]);

  const pessoas = ['João Silva', 'Maria Santos', 'Empresa ABC', 'Ana Oliveira', 'Pedro Costa'];
  const etiquetas = ['VIP', 'Urgente', 'Normal', 'Baixa Prioridade'];
  const prioridades = [
    { value: 'baixa', label: 'Baixa', color: 'success' },
    { value: 'media', label: 'Média', color: 'warning' },
    { value: 'alta', label: 'Alta', color: 'error' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFiltroChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novoProcesso = {
        id: processos.length + 1,
        ...formData,
        status: 'aguardando',
        dataCriacao: new Date().toISOString().split('T')[0],
        responsavel: user?.nome || 'Usuário',
        progresso: 0
      };
      
      setProcessos(prev => [...prev, novoProcesso]);
      setFormData({
        titulo: '',
        descricao: '',
        pessoa: '',
        etiqueta: '',
        prioridade: 'media',
        prazo: '',
        observacoes: ''
      });
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Erro ao criar processo:', error);
    } finally {
      setLoading(false);
    }
  };

  const moverProcesso = (processoId, novoStatus) => {
    setProcessos(prev => prev.map(processo => 
      processo.id === processoId 
        ? { 
            ...processo, 
            status: novoStatus,
            progresso: novoStatus === 'aguardando' ? 0 : 
                      novoStatus === 'em_andamento' ? 50 : 100
          }
        : processo
    ));
  };

  const getPrioridadeColor = (prioridade) => {
    const prioridadeData = prioridades.find(p => p.value === prioridade);
    return prioridadeData ? prioridadeData.color : 'default';
  };

  const getPrioridadeLabel = (prioridade) => {
    const prioridadeData = prioridades.find(p => p.value === prioridade);
    return prioridadeData ? prioridadeData.label : prioridade;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aguardando': return '#6B7280';
      case 'em_andamento': return '#3B82F6';
      case 'concluido': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'aguardando': return 'AGUARDANDO';
      case 'em_andamento': return 'EM ANDAMENTO';
      case 'concluido': return 'CONCLUÍDO';
      default: return status;
    }
  };

  const processosAguardando = processos.filter(p => p.status === 'aguardando');
  const processosEmAndamento = processos.filter(p => p.status === 'em_andamento');
  const processosConcluidos = processos.filter(p => p.status === 'concluido');

  const ProcessoCard = ({ processo }) => (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header do Card */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
            {processo.titulo}
          </Typography>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>

        {/* Descrição */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {processo.descricao}
        </Typography>

        {/* Informações */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption">{processo.pessoa}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption">
              Prazo: {new Date(processo.prazo).toLocaleDateString('pt-BR')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption">
              Responsável: {processo.responsavel}
            </Typography>
          </Box>
        </Box>

        {/* Chips */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={getPrioridadeLabel(processo.prioridade)}
            color={getPrioridadeColor(processo.prioridade)}
            size="small"
          />
          <Chip
            label={processo.etiqueta}
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Progresso */}
        {processo.status !== 'aguardando' && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption">Progresso</Typography>
              <Typography variant="caption">{processo.progresso}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={processo.progresso}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        {/* Ações */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Tooltip title="Visualizar">
            <IconButton size="small">
              <Visibility />
            </IconButton>
          </Tooltip>
          
          {processo.status === 'aguardando' && (
            <Tooltip title="Iniciar">
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => moverProcesso(processo.id, 'em_andamento')}
              >
                <PlayArrow />
              </IconButton>
            </Tooltip>
          )}
          
          {processo.status === 'em_andamento' && (
            <Tooltip title="Concluir">
              <IconButton 
                size="small" 
                color="success"
                onClick={() => moverProcesso(processo.id, 'concluido')}
              >
                <CheckCircle />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Editar">
            <IconButton size="small">
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Processos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestão de processos com sistema Kanban
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
            Novo Processo
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Pessoa</InputLabel>
                <Select
                  value={filtros.pessoa}
                  label="Pessoa"
                  onChange={(e) => handleFiltroChange('pessoa', e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  {pessoas.map(pessoa => (
                    <MenuItem key={pessoa} value={pessoa}>{pessoa}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Período Início"
                type="date"
                value={filtros.periodo.inicio}
                onChange={(e) => handleFiltroChange('periodo', { ...filtros.periodo, inicio: e.target.value })}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Período Fim"
                type="date"
                value={filtros.periodo.fim}
                onChange={(e) => handleFiltroChange('periodo', { ...filtros.periodo, fim: e.target.value })}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Etiqueta</InputLabel>
                <Select
                  value={filtros.etiqueta}
                  label="Etiqueta"
                  onChange={(e) => handleFiltroChange('etiqueta', e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  {etiquetas.map(etiqueta => (
                    <MenuItem key={etiqueta} value={etiqueta}>{etiqueta}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button 
                variant="contained" 
                fullWidth
                startIcon={<Search />}
                size="small"
              >
                Pesquisar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <Grid container spacing={3}>
        {/* AGUARDANDO */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: '#6B7280', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AGUARDANDO
                </Typography>
                <Badge badgeContent={processosAguardando.length} color="error">
                  <Pending />
                </Badge>
              </Box>
              
              <Box sx={{ p: 2, minHeight: 400, maxHeight: 600, overflow: 'auto' }}>
                {processosAguardando.length === 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: 200,
                    color: 'text.secondary'
                  }}>
                    <Assignment sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="body2">
                      Nenhum processo aguardando
                    </Typography>
                  </Box>
                ) : (
                  processosAguardando.map(processo => (
                    <ProcessoCard key={processo.id} processo={processo} />
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* EM ANDAMENTO */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: '#3B82F6', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  EM ANDAMENTO
                </Typography>
                <Badge badgeContent={processosEmAndamento.length} color="error">
                  <PlayArrow />
                </Badge>
              </Box>
              
              <Box sx={{ p: 2, minHeight: 400, maxHeight: 600, overflow: 'auto' }}>
                {processosEmAndamento.length === 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: 200,
                    color: 'text.secondary'
                  }}>
                    <PlayArrow sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="body2">
                      Nenhum processo em andamento
                    </Typography>
                  </Box>
                ) : (
                  processosEmAndamento.map(processo => (
                    <ProcessoCard key={processo.id} processo={processo} />
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* CONCLUÍDO */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: '#10B981', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  CONCLUÍDO
                </Typography>
                <Badge badgeContent={processosConcluidos.length} color="error">
                  <CheckCircle />
                </Badge>
              </Box>
              
              <Box sx={{ p: 2, minHeight: 400, maxHeight: 600, overflow: 'auto' }}>
                {processosConcluidos.length === 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: 200,
                    color: 'text.secondary'
                  }}>
                    <CheckCircle sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="body2">
                      Nenhum processo concluído
                    </Typography>
                  </Box>
                ) : (
                  processosConcluidos.map(processo => (
                    <ProcessoCard key={processo.id} processo={processo} />
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Novo Processo */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Novo Processo
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título do Processo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  multiline
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Pessoa</InputLabel>
                  <Select
                    value={formData.pessoa}
                    label="Pessoa"
                    onChange={(e) => handleInputChange('pessoa', e.target.value)}
                  >
                    {pessoas.map(pessoa => (
                      <MenuItem key={pessoa} value={pessoa}>{pessoa}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Etiqueta</InputLabel>
                  <Select
                    value={formData.etiqueta}
                    label="Etiqueta"
                    onChange={(e) => handleInputChange('etiqueta', e.target.value)}
                  >
                    {etiquetas.map(etiqueta => (
                      <MenuItem key={etiqueta} value={etiqueta}>{etiqueta}</MenuItem>
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
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prazo"
                  type="date"
                  value={formData.prazo}
                  onChange={(e) => handleInputChange('prazo', e.target.value)}
                  InputLabelProps={{ shrink: true }}
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
            startIcon={<Assignment />}
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Processo'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Processos;