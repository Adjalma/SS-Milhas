/**
 * Página de Agendamento
 * 
 * Gerencia agendamentos de transferências, compras e vendas
 * com sistema de calendário e notificações.
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
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Pending,
  Cancel,
  Schedule,
  Notifications,
  Event,
  Today,
  CalendarToday,
  CalendarMonth,
  Timer,
  Save,
  Refresh,
  Alarm
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Agendamento = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('calendario'); // calendario, lista
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    tipoOperacao: 'compra',
    pessoa: '',
    programa: '',
    quantidade: '',
    valor: '',
    dataAgendamento: '',
    horario: '',
    observacoes: '',
    notificarAntes: true,
    minutosAntes: 30,
    status: 'agendado'
  });

  // Dados mockados baseados nas imagens
  const [agendamentos] = useState([
    {
      id: 1,
      tipoOperacao: 'compra',
      pessoa: 'João Silva',
      programa: 'LATAM Pass',
      quantidade: 25000,
      valor: 750.00,
      dataAgendamento: '2024-01-20',
      horario: '14:30',
      observacoes: 'Compra programada para promoção',
      notificarAntes: true,
      minutosAntes: 30,
      status: 'agendado',
      dataCriacao: '2024-01-15'
    },
    {
      id: 2,
      tipoOperacao: 'transferencia',
      pessoa: 'Maria Santos',
      programa: 'Smiles',
      quantidade: 15000,
      valor: 0,
      dataAgendamento: '2024-01-22',
      horario: '10:00',
      observacoes: 'Transferência para cônjuge',
      notificarAntes: true,
      minutosAntes: 60,
      status: 'agendado',
      dataCriacao: '2024-01-16'
    },
    {
      id: 3,
      tipoOperacao: 'venda',
      pessoa: 'Pedro Oliveira',
      programa: 'TudoAzul',
      quantidade: 30000,
      valor: 900.00,
      dataAgendamento: '2024-01-18',
      horario: '16:45',
      observacoes: 'Venda programada',
      notificarAntes: false,
      minutosAntes: 0,
      status: 'executado',
      dataExecucao: '2024-01-18'
    }
  ]);

  const tiposOperacao = [
    { value: 'compra', label: 'Compra de Milhas', icon: '🛒', color: 'primary' },
    { value: 'venda', label: 'Venda de Milhas', icon: '💰', color: 'success' },
    { value: 'transferencia', label: 'Transferência', icon: '🔄', color: 'info' },
    { value: 'transferencia_pessoas', label: 'Transferência entre Pessoas', icon: '👥', color: 'secondary' }
  ];

  const programasFidelidade = [
    'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles',
    'Emirates Skywards', 'Delta SkyMiles', 'Flying Blue'
  ];

  const pessoas = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const horarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

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
      console.log('Agendamento criado:', formData);
      
      // Reset form
      setFormData({
        tipoOperacao: 'compra',
        pessoa: '',
        programa: '',
        quantidade: '',
        valor: '',
        dataAgendamento: '',
        horario: '',
        observacoes: '',
        notificarAntes: true,
        minutosAntes: 30,
        status: 'agendado'
      });
      
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'executado': return 'success';
      case 'agendado': return 'info';
      case 'cancelado': return 'error';
      case 'atrasado': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'executado': return <CheckCircle />;
      case 'agendado': return <Schedule />;
      case 'cancelado': return <Cancel />;
      case 'atrasado': return <Alarm />;
      default: return <Schedule />;
    }
  };

  const getTipoOperacaoInfo = (tipo) => {
    return tiposOperacao.find(t => t.value === tipo) || tiposOperacao[0];
  };

  // Estatísticas
  const stats = {
    totalAgendados: agendamentos.filter(a => a.status === 'agendado').length,
    totalExecutados: agendamentos.filter(a => a.status === 'executado').length,
    proximosAgendamentos: agendamentos.filter(a => a.status === 'agendado').length,
    valorTotalAgendado: agendamentos
      .filter(a => a.status === 'agendado')
      .reduce((sum, a) => sum + a.valor, 0)
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Agendamentos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gerencie operações programadas com notificações automáticas
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={(e, newValue) => newValue && setViewType(newValue)}
            size="small"
          >
            <ToggleButton value="calendario">
              <CalendarToday sx={{ mr: 1 }} />
              Calendário
            </ToggleButton>
            <ToggleButton value="lista">
              <Event sx={{ mr: 1 }} />
              Lista
            </ToggleButton>
          </ToggleButtonGroup>
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
            Novo Agendamento
          </Button>
        </Box>
      </Box>

      {/* Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Agendados</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.totalAgendados}
              </Typography>
              <Typography variant="body2" color="text.secondary">operações</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Executados</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.totalExecutados}
              </Typography>
              <Typography variant="body2" color="text.secondary">operações</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Today sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Próximos</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.proximosAgendamentos}
              </Typography>
              <Typography variant="body2" color="text.secondary">hoje</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timer sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Valor Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                R$ {stats.valorTotalAgendado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Agendamentos */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <CalendarMonth sx={{ mr: 1, verticalAlign: 'middle' }} />
            {viewType === 'calendario' ? 'Calendário de Agendamentos' : 'Lista de Agendamentos'}
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Pessoa</TableCell>
                  <TableCell>Programa</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Data/Hora</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notificação</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agendamentos.map((agendamento) => {
                  const tipoInfo = getTipoOperacaoInfo(agendamento.tipoOperacao);
                  return (
                    <TableRow key={agendamento.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">{tipoInfo.icon}</Typography>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {tipoInfo.label}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{agendamento.pessoa}</TableCell>
                      <TableCell>
                        <Chip label={agendamento.programa} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        {agendamento.quantidade?.toLocaleString() || '-'} {agendamento.quantidade && 'milhas'}
                      </TableCell>
                      <TableCell align="right">
                        {agendamento.valor > 0 ? (
                          <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                            R$ {agendamento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </Typography>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {new Date(agendamento.dataAgendamento).toLocaleDateString('pt-BR')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {agendamento.horario}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(agendamento.status)}
                          label={agendamento.status}
                          color={getStatusColor(agendamento.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Notifications 
                            sx={{ 
                              fontSize: 16, 
                              color: agendamento.notificarAntes ? 'success.main' : 'text.disabled' 
                            }} 
                          />
                          {agendamento.notificarAntes && (
                            <Typography variant="caption">
                              {agendamento.minutosAntes}min antes
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
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
                          <Tooltip title="Executar Agora">
                            <IconButton size="small" color="success">
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancelar">
                            <IconButton size="small" color="error">
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog de Novo Agendamento */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
          Novo Agendamento
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Operação</InputLabel>
                  <Select
                    value={formData.tipoOperacao}
                    label="Tipo de Operação"
                    onChange={(e) => handleInputChange('tipoOperacao', e.target.value)}
                  >
                    {tiposOperacao.map(tipo => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        {tipo.icon} {tipo.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  <InputLabel>Programa</InputLabel>
                  <Select
                    value={formData.programa}
                    label="Programa"
                    onChange={(e) => handleInputChange('programa', e.target.value)}
                  >
                    {programasFidelidade.map(programa => (
                      <MenuItem key={programa} value={programa}>{programa}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantidade de Milhas"
                  type="number"
                  value={formData.quantidade}
                  onChange={(e) => handleInputChange('quantidade', e.target.value)}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>milhas</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data do Agendamento"
                  type="date"
                  value={formData.dataAgendamento}
                  onChange={(e) => handleInputChange('dataAgendamento', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Horário</InputLabel>
                  <Select
                    value={formData.horario}
                    label="Horário"
                    onChange={(e) => handleInputChange('horario', e.target.value)}
                  >
                    {horarios.map(horario => (
                      <MenuItem key={horario} value={horario}>{horario}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valor (se aplicável)"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => handleInputChange('valor', e.target.value)}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Switch
                    checked={formData.notificarAntes}
                    onChange={(e) => handleInputChange('notificarAntes', e.target.checked)}
                  />
                  <Typography>Notificar antes</Typography>
                  {formData.notificarAntes && (
                    <TextField
                      size="small"
                      type="number"
                      value={formData.minutosAntes}
                      onChange={(e) => handleInputChange('minutosAntes', e.target.value)}
                      InputProps={{
                        endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>min</Typography>
                      }}
                      sx={{ width: 100 }}
                    />
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações"
                  multiline
                  rows={3}
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Informações adicionais sobre o agendamento..."
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
            {loading ? 'Salvando...' : 'Agendar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Agendamento;
