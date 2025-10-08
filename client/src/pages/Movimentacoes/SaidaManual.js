/**
 * Página de Saída Manual
 * 
 * Sistema para registro de saídas manuais de milhas
 * com justificativas e aprovações, baseado no iddas.com.br
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
  RadioGroup,
  Radio
} from '@mui/material';
import {
  Remove,
  Warning,
  CheckCircle,
  Cancel,
  Schedule,
  Person,
  Business,
  FlightTakeoff,
  Refresh,
  Add,
  Visibility,
  Edit,
  Delete,
  Save,
  AttachFile,
  Description,
  Security
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const SaidaManual = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    pessoa: '',
    programa: '',
    quantidade: '',
    motivo: '',
    categoria: 'perda',
    justificativa: '',
    aprovador: '',
    urgente: false,
    dataSaida: new Date().toISOString().split('T')[0],
    observacoes: '',
    status: 'pendente',
    documentos: []
  });

  // Dados mockados baseados nas imagens
  const [saidasManuais] = useState([
    {
      id: 1,
      pessoa: 'João Silva',
      programa: 'LATAM Pass',
      quantidade: 5000,
      motivo: 'Expiração de milhas',
      categoria: 'expiracao',
      justificativa: 'Milhas próximas do vencimento sem possibilidade de uso',
      aprovador: 'Gerente Financeiro',
      urgente: false,
      dataSaida: '2024-01-15',
      dataAprovacao: '2024-01-16',
      status: 'aprovado',
      observacoes: 'Aprovado após análise de vencimento',
      valorPerdido: 175.00
    },
    {
      id: 2,
      pessoa: 'Maria Santos',
      programa: 'Smiles',
      quantidade: 2000,
      motivo: 'Erro operacional',
      categoria: 'erro',
      justificativa: 'Transferência incorreta para conta inexistente',
      aprovador: 'Supervisor',
      urgente: true,
      dataSaida: '2024-01-14',
      status: 'pendente',
      observacoes: 'Aguardando correção do erro',
      valorPerdido: 60.00
    },
    {
      id: 3,
      pessoa: 'Pedro Oliveira',
      programa: 'TudoAzul',
      quantidade: 8000,
      motivo: 'Problema técnico',
      categoria: 'tecnico',
      justificativa: 'Falha no sistema durante transferência',
      aprovador: 'Gerente Técnico',
      urgente: false,
      dataSaida: '2024-01-13',
      dataAprovacao: '2024-01-13',
      status: 'rejeitado',
      observacoes: 'Rejeitado - problema resolvido pelo suporte',
      valorPerdido: 240.00
    }
  ]);

  const programasFidelidade = [
    'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles',
    'Emirates Skywards', 'Delta SkyMiles', 'Flying Blue'
  ];

  const pessoas = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const motivos = [
    'Expiração de milhas',
    'Erro operacional',
    'Problema técnico',
    'Cancelamento de voo',
    'Reembolso',
    'Transferência incorreta',
    'Outro'
  ];

  const categorias = [
    { value: 'expiracao', label: 'Expiração' },
    { value: 'erro', label: 'Erro Operacional' },
    { value: 'tecnico', label: 'Problema Técnico' },
    { value: 'cancelamento', label: 'Cancelamento' },
    { value: 'reembolso', label: 'Reembolso' },
    { value: 'outro', label: 'Outro' }
  ];

  const aprovadores = [
    'Gerente Financeiro',
    'Supervisor',
    'Gerente Técnico',
    'Diretor',
    'Administrador'
  ];

  const statusOptions = [
    'Pendente', 'Aprovado', 'Rejeitado', 'Cancelado'
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
      console.log('Saída manual registrada:', formData);
      
      // Reset form
      setFormData({
        pessoa: '',
        programa: '',
        quantidade: '',
        motivo: '',
        categoria: 'perda',
        justificativa: '',
        aprovador: '',
        urgente: false,
        dataSaida: new Date().toISOString().split('T')[0],
        observacoes: '',
        status: 'pendente',
        documentos: []
      });
      
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Erro ao registrar saída manual:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado': return 'success';
      case 'pendente': return 'warning';
      case 'rejeitado': return 'error';
      case 'cancelado': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'aprovado': return <CheckCircle />;
      case 'pendente': return <Schedule />;
      case 'rejeitado': return <Cancel />;
      case 'cancelado': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case 'expiracao': return 'warning';
      case 'erro': return 'error';
      case 'tecnico': return 'info';
      case 'cancelamento': return 'secondary';
      case 'reembolso': return 'success';
      default: return 'default';
    }
  };

  // Estatísticas
  const stats = {
    totalSaidas: saidasManuais.length,
    pendentes: saidasManuais.filter(s => s.status === 'pendente').length,
    aprovadas: saidasManuais.filter(s => s.status === 'aprovado').length,
    rejeitadas: saidasManuais.filter(s => s.status === 'rejeitado').length,
    milhasPerdidas: saidasManuais.filter(s => s.status === 'aprovado').reduce((sum, s) => sum + s.quantidade, 0),
    valorPerdido: saidasManuais.filter(s => s.status === 'aprovado').reduce((sum, s) => sum + s.valorPerdido, 0)
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Saída Manual de Milhas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Registro de saídas com justificativas e aprovações
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
            Nova Saída
          </Button>
        </Box>
      </Box>

      {/* Alertas */}
      <Alert severity="warning" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>Atenção:</strong> Saídas manuais devem ser justificadas e aprovadas. 
          Esta funcionalidade deve ser usada apenas em casos excepcionais.
        </Typography>
      </Alert>

      {/* Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Remove sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Saídas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalSaidas}
              </Typography>
              <Typography variant="body2" color="text.secondary">registros</Typography>
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
              <Typography variant="body2" color="text.secondary">aguardando aprovação</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Aprovadas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.aprovadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Cancel sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Rejeitadas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                {stats.rejeitadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FlightTakeoff sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Milhas Perdidas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.milhasPerdidas.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                R$ {stats.valorPerdido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Saídas Manuais */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <Remove sx={{ mr: 1, verticalAlign: 'middle' }} />
            Histórico de Saídas Manuais
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pessoa</TableCell>
                  <TableCell>Programa</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell>Aprovador</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Urgente</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {saidasManuais.map((saida) => (
                  <TableRow key={saida.id} hover>
                    <TableCell>{saida.pessoa}</TableCell>
                    <TableCell>
                      <Chip label={saida.programa} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      {saida.quantidade.toLocaleString()} milhas
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={categorias.find(c => c.value === saida.categoria)?.label}
                        color={getCategoriaColor(saida.categoria)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {saida.motivo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {saida.aprovador}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(saida.dataSaida).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(saida.status)}
                        label={saida.status}
                        color={getStatusColor(saida.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {saida.urgente ? (
                        <Chip label="Urgente" color="error" size="small" />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Normal
                        </Typography>
                      )}
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
                        <Tooltip title="Aprovar">
                          <IconButton size="small" color="success">
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rejeitar">
                          <IconButton size="small" color="error">
                            <Cancel />
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

      {/* Dialog de Nova Saída Manual */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Remove sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nova Saída Manual
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Importante:</strong> Esta operação remove milhas permanentemente. 
                Certifique-se de que a justificativa está completa e correta.
              </Typography>
            </Alert>
            
            <Grid container spacing={3}>
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
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={formData.categoria}
                    label="Categoria"
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                  >
                    {categorias.map(categoria => (
                      <MenuItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Motivo</InputLabel>
                  <Select
                    value={formData.motivo}
                    label="Motivo"
                    onChange={(e) => handleInputChange('motivo', e.target.value)}
                  >
                    {motivos.map(motivo => (
                      <MenuItem key={motivo} value={motivo}>{motivo}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Justificativa Detalhada"
                  multiline
                  rows={3}
                  value={formData.justificativa}
                  onChange={(e) => handleInputChange('justificativa', e.target.value)}
                  placeholder="Descreva detalhadamente o motivo da saída manual..."
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Aprovador</InputLabel>
                  <Select
                    value={formData.aprovador}
                    label="Aprovador"
                    onChange={(e) => handleInputChange('aprovador', e.target.value)}
                  >
                    {aprovadores.map(aprovador => (
                      <MenuItem key={aprovador} value={aprovador}>{aprovador}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data da Saída"
                  type="date"
                  value={formData.dataSaida}
                  onChange={(e) => handleInputChange('dataSaida', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.urgente}
                      onChange={(e) => handleInputChange('urgente', e.target.checked)}
                    />
                  }
                  label="Marcar como urgente"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações Adicionais"
                  multiline
                  rows={2}
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Informações complementares..."
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
            disabled={loading || !formData.justificativa}
            color="warning"
          >
            {loading ? 'Salvando...' : 'Registrar Saída'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default SaidaManual;
