/**
 * Página de Transferência
 * 
 * Gerencia transferências de milhas entre contas e programas,
 * com controle de status e histórico completo.
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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Pending,
  Cancel,
  SwapHoriz,
  FlightTakeoff,
  TrendingUp,
  Schedule,
  Save,
  Refresh,
  TransferWithinAStation
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { movementAPI } from '../../services';

const Transferencia = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transferencias, setTransferencias] = useState([]);

  const fetchTransferencias = async () => {
    try {
      setLoading(true);
      const res = await movementAPI.getMovements({ tipo: 'transferencia' });
      setTransferencias(res.movements || []);
    } catch (err) {
      setError('Erro ao carregar transferências');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTransferencias();
  }, []);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    origem: {
      pessoa: '',
      programa: '',
      quantidade: ''
    },
    destino: {
      pessoa: '',
      programa: '',
      quantidade: ''
    },
    tipoTransferencia: 'interna',
    taxa: '',
    observacoes: '',
    dataTransferencia: new Date().toISOString().split('T')[0],
    status: 'pendente'
  });
  const [openDialog, setOpenDialog] = useState(false);

  // Dados mockados
  const [transferencias] = useState([
    {
      id: 1,
      origem: { pessoa: 'João Silva', programa: 'LATAM Pass', quantidade: 10000 },
      destino: { pessoa: 'Maria Santos', programa: 'LATAM Pass', quantidade: 10000 },
      tipoTransferencia: 'interna',
      taxa: 0,
      valorTotal: 0,
      dataTransferencia: '2024-01-15',
      observacoes: 'Transferência familiar',
      status: 'concluida',
      dataConclusao: '2024-01-15'
    },
    {
      id: 2,
      origem: { pessoa: 'Pedro Oliveira', programa: 'Smiles', quantidade: 25000 },
      destino: { pessoa: 'Ana Costa', programa: 'TudoAzul', quantidade: 25000 },
      tipoTransferencia: 'externa',
      taxa: 50.00,
      valorTotal: 50.00,
      dataTransferencia: '2024-01-14',
      observacoes: 'Transferência entre programas',
      status: 'processando'
    }
  ]);

  const programasFidelidade = [
    'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles',
    'Emirates Skywards', 'Delta SkyMiles', 'Flying Blue'
  ];

  const pessoas = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const tiposTransferencia = [
    { value: 'interna', label: 'Interna (mesmo programa)' },
    { value: 'externa', label: 'Externa (programas diferentes)' },
    { value: 'bonificada', label: 'Bonificada (com bônus)' }
  ];

  const steps = [
    'Origem da Transferência',
    'Destino da Transferência',
    'Configurações',
    'Confirmação'
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      origem: { pessoa: '', programa: '', quantidade: '' },
      destino: { pessoa: '', programa: '', quantidade: '' },
      tipoTransferencia: 'interna',
      taxa: '',
      observacoes: '',
      dataTransferencia: new Date().toISOString().split('T')[0],
      status: 'pendente'
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Transferência realizada:', formData);
      handleReset();
    } catch (error) {
      console.error('Erro ao realizar transferência:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluida': return 'success';
      case 'processando': return 'warning';
      case 'pendente': return 'info';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluida': return <CheckCircle />;
      case 'processando': return <Schedule />;
      case 'pendente': return <Pending />;
      case 'cancelada': return <Cancel />;
      default: return <Pending />;
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Pessoa de Origem</InputLabel>
                <Select
                  value={formData.origem.pessoa}
                  label="Pessoa de Origem"
                  onChange={(e) => handleInputChange('origem', 'pessoa', e.target.value)}
                >
                  {pessoas.map(pessoa => (
                    <MenuItem key={pessoa} value={pessoa}>{pessoa}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Programa de Origem</InputLabel>
                <Select
                  value={formData.origem.programa}
                  label="Programa de Origem"
                  onChange={(e) => handleInputChange('origem', 'programa', e.target.value)}
                >
                  {programasFidelidade.map(programa => (
                    <MenuItem key={programa} value={programa}>{programa}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantidade de Milhas"
                type="number"
                value={formData.origem.quantidade}
                onChange={(e) => handleInputChange('origem', 'quantidade', e.target.value)}
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>milhas</Typography>
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Pessoa de Destino</InputLabel>
                <Select
                  value={formData.destino.pessoa}
                  label="Pessoa de Destino"
                  onChange={(e) => handleInputChange('destino', 'pessoa', e.target.value)}
                >
                  {pessoas.map(pessoa => (
                    <MenuItem key={pessoa} value={pessoa}>{pessoa}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Programa de Destino</InputLabel>
                <Select
                  value={formData.destino.programa}
                  label="Programa de Destino"
                  onChange={(e) => handleInputChange('destino', 'programa', e.target.value)}
                >
                  {programasFidelidade.map(programa => (
                    <MenuItem key={programa} value={programa}>{programa}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantidade a Receber"
                type="number"
                value={formData.destino.quantidade}
                onChange={(e) => handleInputChange('destino', 'quantidade', e.target.value)}
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>milhas</Typography>
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Transferência</InputLabel>
                <Select
                  value={formData.tipoTransferencia}
                  label="Tipo de Transferência"
                  onChange={(e) => setFormData(prev => ({ ...prev, tipoTransferencia: e.target.value }))}
                >
                  {tiposTransferencia.map(tipo => (
                    <MenuItem key={tipo.value} value={tipo.value}>{tipo.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Taxa de Transferência"
                type="number"
                step="0.01"
                value={formData.taxa}
                onChange={(e) => setFormData(prev => ({ ...prev, taxa: e.target.value }))}
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Data da Transferência"
                type="date"
                value={formData.dataTransferencia}
                onChange={(e) => setFormData(prev => ({ ...prev, dataTransferencia: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Informações adicionais sobre a transferência..."
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Confira os dados da transferência antes de confirmar
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                      Origem
                    </Typography>
                    <Typography><strong>Pessoa:</strong> {formData.origem.pessoa}</Typography>
                    <Typography><strong>Programa:</strong> {formData.origem.programa}</Typography>
                    <Typography><strong>Quantidade:</strong> {formData.origem.quantidade} milhas</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="success" sx={{ mb: 2 }}>
                      Destino
                    </Typography>
                    <Typography><strong>Pessoa:</strong> {formData.destino.pessoa}</Typography>
                    <Typography><strong>Programa:</strong> {formData.destino.programa}</Typography>
                    <Typography><strong>Quantidade:</strong> {formData.destino.quantidade} milhas</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Detalhes da Transferência
                    </Typography>
                    <Typography><strong>Tipo:</strong> {tiposTransferencia.find(t => t.value === formData.tipoTransferencia)?.label}</Typography>
                    <Typography><strong>Taxa:</strong> R$ {formData.taxa || '0,00'}</Typography>
                    <Typography><strong>Data:</strong> {new Date(formData.dataTransferencia).toLocaleDateString('pt-BR')}</Typography>
                    {formData.observacoes && (
                      <Typography><strong>Observações:</strong> {formData.observacoes}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Transferência de Milhas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gerencie transferências entre contas e programas
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
            Nova Transferência
          </Button>
        </Box>
      </Box>

      {/* Resumo */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SwapHoriz sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Transferidas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {transferencias.reduce((sum, t) => sum + t.origem.quantidade, 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">milhas</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Concluídas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {transferencias.filter(t => t.status === 'concluida').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Processando</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {transferencias.filter(t => t.status === 'processando').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Taxas Pagas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                R$ {transferencias.reduce((sum, t) => sum + (t.taxa || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Wizard de Nova Transferência */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <TransferWithinAStation sx={{ mr: 1, verticalAlign: 'middle' }} />
            Nova Transferência
          </Typography>
          
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={loading}
                      >
                        {index === steps.length - 1 ? 'Confirmar Transferência' : 'Continuar'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Voltar
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>Transferência realizada com sucesso!</Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Nova Transferência
              </Button>
            </Paper>
          )}
          
          {loading && <LinearProgress sx={{ mt: 2 }} />}
        </CardContent>
      </Card>

      {/* Lista de Transferências */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Histórico de Transferências
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Origem</TableCell>
                  <TableCell>Destino</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Taxa</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transferencias.map((transferencia) => (
                  <TableRow key={transferencia.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {transferencia.origem.pessoa}
                        </Typography>
                        <Chip label={transferencia.origem.programa} size="small" variant="outlined" />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {transferencia.destino.pessoa}
                        </Typography>
                        <Chip label={transferencia.destino.programa} size="small" variant="outlined" />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {transferencia.origem.quantidade.toLocaleString()} milhas
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={tiposTransferencia.find(t => t.value === transferencia.tipoTransferencia)?.label}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      R$ {transferencia.taxa?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </TableCell>
                    <TableCell>
                      {new Date(transferencia.dataTransferencia).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(transferencia.status)}
                        label={transferencia.status}
                        color={getStatusColor(transferencia.status)}
                        size="small"
                      />
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
                        <Tooltip title="Cancelar">
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
    </Box>
  );
};

export default Transferencia;
