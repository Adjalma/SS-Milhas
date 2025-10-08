/**
 * Página de Tarefas
 * 
 * Sistema de gestão de tarefas com Kanban board,
 * baseado no sistema de tarefas do iddas.com.br
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
  Badge,
  IconButton,
  Tooltip,
  Paper,
  DragDropContext,
  Droppable,
  Draggable
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Schedule,
  Warning,
  Error,
  Person,
  CalendarToday,
  Flag,
  Assignment,
  Refresh,
  FilterList,
  MoreVert,
  PlayArrow,
  Pause,
  Stop
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Tarefas = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [filtros, setFiltros] = useState({
    status: 'todos',
    prioridade: 'todos',
    responsavel: 'todos',
    categoria: 'todos'
  });

  // Dados mockados baseados nas imagens
  const [tarefas] = useState({
    pendentes: [
      {
        id: 1,
        titulo: 'Validar compra LATAM Pass',
        descricao: 'Verificar documentos e aprovar compra de 25.000 milhas',
        prioridade: 'alta',
        responsavel: 'João Silva',
        categoria: 'compras',
        dataVencimento: '2024-01-20',
        dataCriacao: '2024-01-15',
        estimativa: '2h',
        tags: ['urgente', 'latam']
      },
      {
        id: 2,
        titulo: 'Processar transferência familiar',
        descricao: 'Transferir 15.000 milhas Smiles entre cônjuges',
        prioridade: 'media',
        responsavel: 'Maria Santos',
        categoria: 'transferencias',
        dataVencimento: '2024-01-22',
        dataCriacao: '2024-01-16',
        estimativa: '1h',
        tags: ['familiar', 'smiles']
      }
    ],
    emAndamento: [
      {
        id: 3,
        titulo: 'Revisar relatório mensal',
        descricao: 'Analisar dados de vendas do mês de janeiro',
        prioridade: 'alta',
        responsavel: 'Pedro Oliveira',
        categoria: 'relatorios',
        dataVencimento: '2024-01-25',
        dataCriacao: '2024-01-14',
        estimativa: '4h',
        tags: ['mensal', 'vendas']
      }
    ],
    concluidas: [
      {
        id: 4,
        titulo: 'Atualizar cadastro de cliente',
        descricao: 'Incluir novos dados do cliente VIP #1',
        prioridade: 'baixa',
        responsavel: 'Ana Costa',
        categoria: 'cadastros',
        dataVencimento: '2024-01-18',
        dataCriacao: '2024-01-17',
        dataConclusao: '2024-01-18',
        estimativa: '30min',
        tags: ['cadastro', 'cliente']
      }
    ]
  });

  const statusOptions = [
    'Todos', 'Pendente', 'Em Andamento', 'Concluída', 'Cancelada'
  ];

  const prioridades = [
    'Todos', 'Alta', 'Média', 'Baixa'
  ];

  const responsaveis = [
    'Todos', 'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const categorias = [
    'Todos', 'Compras', 'Vendas', 'Transferências', 'Relatórios', 'Cadastros', 'Financeiro'
  ];

  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Dados atualizados');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'error';
      case 'media': return 'warning';
      case 'baixa': return 'success';
      default: return 'default';
    }
  };

  const getPrioridadeIcon = (prioridade) => {
    switch (prioridade) {
      case 'alta': return <Flag sx={{ color: 'error.main' }} />;
      case 'media': return <Flag sx={{ color: 'warning.main' }} />;
      case 'baixa': return <Flag sx={{ color: 'success.main' }} />;
      default: return <Flag />;
    }
  };

  const getCategoriaIcon = (categoria) => {
    switch (categoria) {
      case 'compras': return <Assignment />;
      case 'vendas': return <Assignment />;
      case 'transferencias': return <Assignment />;
      case 'relatorios': return <Assignment />;
      case 'cadastros': return <Assignment />;
      case 'financeiro': return <Assignment />;
      default: return <Assignment />;
    }
  };

  const isAtrasada = (dataVencimento) => {
    return new Date(dataVencimento) < new Date();
  };

  // Estatísticas
  const stats = {
    total: tarefas.pendentes.length + tarefas.emAndamento.length + tarefas.concluidas.length,
    pendentes: tarefas.pendentes.length,
    emAndamento: tarefas.emAndamento.length,
    concluidas: tarefas.concluidas.length,
    atrasadas: tarefas.pendentes.filter(t => isAtrasada(t.dataVencimento)).length
  };

  const renderColunaTarefas = (titulo, tarefas, cor) => (
    <Grid item xs={12} md={4}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: `${cor}.main` }}>
              {titulo}
            </Typography>
            <Badge badgeContent={tarefas.length} color={cor}>
              <Assignment />
            </Badge>
          </Box>
          
          <List>
            {tarefas.map((tarefa) => (
              <ListItem 
                key={tarefa.id} 
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  border: 1, 
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: isAtrasada(tarefa.dataVencimento) ? 'error.light' : 'background.paper',
                  opacity: isAtrasada(tarefa.dataVencimento) ? 0.8 : 1
                }}
              >
                <ListItemIcon>
                  {getPrioridadeIcon(tarefa.prioridade)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {tarefa.titulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {tarefa.descricao}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={tarefa.prioridade}
                          color={getPrioridadeColor(tarefa.prioridade)}
                          size="small"
                        />
                        <Chip
                          label={tarefa.categoria}
                          size="small"
                          variant="outlined"
                          icon={getCategoriaIcon(tarefa.categoria)}
                        />
                        {tarefa.tags.map(tag => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            color="default"
                          />
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                            {tarefa.responsavel.charAt(0)}
                          </Avatar>
                          <Typography variant="caption">
                            {tarefa.responsavel}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(tarefa.dataVencimento).toLocaleDateString('pt-BR')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Estimativa: {tarefa.estimativa}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Visualizar">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mais opções">
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
          
          {tarefas.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Assignment sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Nenhuma tarefa nesta coluna
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Gestão de Tarefas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sistema Kanban para controle de atividades
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Atualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Nova Tarefa
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filtros
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filtros.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Select
                  value={filtros.prioridade}
                  label="Prioridade"
                  onChange={(e) => handleFilterChange('prioridade', e.target.value)}
                >
                  {prioridades.map(prioridade => (
                    <MenuItem key={prioridade} value={prioridade}>{prioridade}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Responsável</InputLabel>
                <Select
                  value={filtros.responsavel}
                  label="Responsável"
                  onChange={(e) => handleFilterChange('responsavel', e.target.value)}
                >
                  {responsaveis.map(responsavel => (
                    <MenuItem key={responsavel} value={responsavel}>{responsavel}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={filtros.categoria}
                  label="Categoria"
                  onChange={(e) => handleFilterChange('categoria', e.target.value)}
                >
                  {categorias.map(categoria => (
                    <MenuItem key={categoria} value={categoria}>{categoria}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">tarefas</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Pendentes</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.pendentes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PlayArrow sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Em Andamento</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.emAndamento}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Concluídas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.concluidas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Atrasadas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                {stats.atrasadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alertas */}
      {stats.atrasadas > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Você tem <strong>{stats.atrasadas} tarefas atrasadas</strong> que precisam de atenção imediata.
          </Typography>
        </Alert>
      )}

      {/* Kanban Board */}
      <Grid container spacing={3}>
        {renderColunaTarefas('Pendentes', tarefas.pendentes, 'warning')}
        {renderColunaTarefas('Em Andamento', tarefas.emAndamento, 'info')}
        {renderColunaTarefas('Concluídas', tarefas.concluidas, 'success')}
      </Grid>

      {/* Dialog de Nova Tarefa */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Add sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nova Tarefa
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título da Tarefa"
                placeholder="Digite o título da tarefa..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={3}
                placeholder="Descreva os detalhes da tarefa..."
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Select label="Prioridade">
                  <MenuItem value="alta">Alta</MenuItem>
                  <MenuItem value="media">Média</MenuItem>
                  <MenuItem value="baixa">Baixa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Responsável</InputLabel>
                <Select label="Responsável">
                  {responsaveis.slice(1).map(responsavel => (
                    <MenuItem key={responsavel} value={responsavel}>{responsavel}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select label="Categoria">
                  {categorias.slice(1).map(categoria => (
                    <MenuItem key={categoria} value={categoria}>{categoria}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de Vencimento"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Estimativa de Tempo"
                placeholder="Ex: 2h, 1d, 30min"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tags"
                placeholder="Ex: urgente, latam, familiar"
                helperText="Separe as tags por vírgula"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            Criar Tarefa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading */}
      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
};

export default Tarefas;
