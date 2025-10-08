/**
 * Página de Passagem
 * 
 * Sistema de gestão de passagens aéreas com milhas,
 * baseado no sistema de passagens do iddas.com.br
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
  Autocomplete
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  Schedule,
  Person,
  Business,
  AttachMoney,
  Refresh,
  Add,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Pending,
  Cancel,
  Warning,
  Info,
  Save,
  Search,
  LocationOn,
  CalendarToday,
  People
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Passagem = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    pessoa: '',
    programa: '',
    origem: '',
    destino: '',
    dataIda: '',
    dataVolta: '',
    classe: 'economica',
    quantidadeMilhas: '',
    taxaEmbarque: '',
    valorTotal: '',
    passageiros: 1,
    tipoVoo: 'ida_volta',
    observacoes: '',
    status: 'pendente'
  });

  // Dados mockados baseados nas imagens
  const [passagens] = useState([
    {
      id: 1,
      pessoa: 'João Silva',
      programa: 'LATAM Pass',
      origem: 'São Paulo (GRU)',
      destino: 'Rio de Janeiro (GIG)',
      dataIda: '2024-01-20',
      dataVolta: '2024-01-25',
      classe: 'economica',
      quantidadeMilhas: 15000,
      taxaEmbarque: 89.50,
      valorTotal: 539.50,
      passageiros: 1,
      tipoVoo: 'ida_volta',
      numeroReserva: 'LAT123456',
      status: 'confirmada',
      dataCompra: '2024-01-15',
      observacoes: 'Viagem de negócios'
    },
    {
      id: 2,
      pessoa: 'Maria Santos',
      programa: 'Smiles',
      origem: 'Brasília (BSB)',
      destino: 'São Paulo (GRU)',
      dataIda: '2024-01-22',
      dataVolta: null,
      classe: 'executiva',
      quantidadeMilhas: 25000,
      taxaEmbarque: 125.00,
      valorTotal: 875.00,
      passageiros: 2,
      tipoVoo: 'ida',
      numeroReserva: 'SMI789012',
      status: 'pendente',
      dataCompra: '2024-01-16',
      observacoes: 'Viagem familiar'
    },
    {
      id: 3,
      pessoa: 'Pedro Oliveira',
      programa: 'TudoAzul',
      origem: 'Rio de Janeiro (GIG)',
      destino: 'Fortaleza (FOR)',
      dataIda: '2024-01-25',
      dataVolta: '2024-01-30',
      classe: 'economica',
      quantidadeMilhas: 20000,
      taxaEmbarque: 95.00,
      valorTotal: 695.00,
      passageiros: 1,
      tipoVoo: 'ida_volta',
      numeroReserva: 'AZU345678',
      status: 'cancelada',
      dataCompra: '2024-01-18',
      observacoes: 'Cancelamento por motivos pessoais'
    }
  ]);

  const programasFidelidade = [
    'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles',
    'Emirates Skywards', 'Delta SkyMiles', 'Flying Blue'
  ];

  const pessoas = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const aeroportos = [
    'São Paulo (GRU)', 'Rio de Janeiro (GIG)', 'Brasília (BSB)', 'Fortaleza (FOR)',
    'Salvador (SSA)', 'Recife (REC)', 'Belo Horizonte (CNF)', 'Porto Alegre (POA)',
    'Curitiba (CWB)', 'Goiânia (GYN)', 'Manaus (MAO)', 'Belém (BEL)'
  ];

  const classes = [
    { value: 'economica', label: 'Econômica' },
    { value: 'executiva', label: 'Executiva' },
    { value: 'primeira', label: 'Primeira Classe' }
  ];

  const tiposVoo = [
    { value: 'ida', label: 'Ida' },
    { value: 'volta', label: 'Volta' },
    { value: 'ida_volta', label: 'Ida e Volta' }
  ];

  const statusOptions = [
    'Pendente', 'Confirmada', 'Cancelada', 'Reembolsada'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Calcular valor total automaticamente
      if (field === 'quantidadeMilhas' || field === 'taxaEmbarque') {
        const milhas = parseFloat(newData.quantidadeMilhas) || 0;
        const taxa = parseFloat(newData.taxaEmbarque) || 0;
        // Assumindo valor médio de R$ 0,03 por milha
        newData.valorTotal = ((milhas * 0.03) + taxa).toFixed(2);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Passagem registrada:', formData);
      
      // Reset form
      setFormData({
        pessoa: '',
        programa: '',
        origem: '',
        destino: '',
        dataIda: '',
        dataVolta: '',
        classe: 'economica',
        quantidadeMilhas: '',
        taxaEmbarque: '',
        valorTotal: '',
        passageiros: 1,
        tipoVoo: 'ida_volta',
        observacoes: '',
        status: 'pendente'
      });
      
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Erro ao registrar passagem:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada': return 'success';
      case 'pendente': return 'warning';
      case 'cancelada': return 'error';
      case 'reembolsada': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmada': return <CheckCircle />;
      case 'pendente': return <Pending />;
      case 'cancelada': return <Cancel />;
      case 'reembolsada': return <Info />;
      default: return <Pending />;
    }
  };

  const getClasseColor = (classe) => {
    switch (classe) {
      case 'primeira': return 'error';
      case 'executiva': return 'warning';
      case 'economica': return 'success';
      default: return 'default';
    }
  };

  // Estatísticas
  const stats = {
    totalPassagens: passagens.length,
    confirmadas: passagens.filter(p => p.status === 'confirmada').length,
    pendentes: passagens.filter(p => p.status === 'pendente').length,
    canceladas: passagens.filter(p => p.status === 'cancelada').length,
    milhasUtilizadas: passagens.reduce((sum, p) => sum + p.quantidadeMilhas, 0),
    valorTotal: passagens.reduce((sum, p) => sum + p.valorTotal, 0)
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Gestão de Passagens
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sistema de reservas e gestão de passagens com milhas
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
            Nova Passagem
          </Button>
        </Box>
      </Box>

      {/* Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FlightTakeoff sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Passagens</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalPassagens}
              </Typography>
              <Typography variant="body2" color="text.secondary">reservas</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Confirmadas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.confirmadas}
              </Typography>
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
                <AttachMoney sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Valor Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                R$ {stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Milhas Utilizadas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                {stats.milhasUtilizadas.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Passagens */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <FlightTakeoff sx={{ mr: 1, verticalAlign: 'middle' }} />
            Histórico de Passagens
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pessoa</TableCell>
                  <TableCell>Programa</TableCell>
                  <TableCell>Rota</TableCell>
                  <TableCell>Datas</TableCell>
                  <TableCell>Classe</TableCell>
                  <TableCell align="right">Milhas</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Reserva</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {passagens.map((passagem) => (
                  <TableRow key={passagem.id} hover>
                    <TableCell>{passagem.pessoa}</TableCell>
                    <TableCell>
                      <Chip label={passagem.programa} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {passagem.origem}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            → {passagem.destino}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Ida: {new Date(passagem.dataIda).toLocaleDateString('pt-BR')}
                        </Typography>
                        {passagem.dataVolta && (
                          <Typography variant="caption" color="text.secondary">
                            Volta: {new Date(passagem.dataVolta).toLocaleDateString('pt-BR')}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={classes.find(c => c.value === passagem.classe)?.label}
                        color={getClasseColor(passagem.classe)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {passagem.quantidadeMilhas.toLocaleString()} milhas
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                        R$ {passagem.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        + R$ {passagem.taxaEmbarque} taxa
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {passagem.numeroReserva}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(passagem.status)}
                        label={passagem.status}
                        color={getStatusColor(passagem.status)}
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

      {/* Dialog de Nova Passagem */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <FlightTakeoff sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nova Passagem
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                <Autocomplete
                  options={aeroportos}
                  value={formData.origem}
                  onChange={(e, newValue) => handleInputChange('origem', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Origem"
                      placeholder="Selecione o aeroporto de origem"
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={aeroportos}
                  value={formData.destino}
                  onChange={(e, newValue) => handleInputChange('destino', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Destino"
                      placeholder="Selecione o aeroporto de destino"
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Ida"
                  type="date"
                  value={formData.dataIda}
                  onChange={(e) => handleInputChange('dataIda', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Volta"
                  type="date"
                  value={formData.dataVolta}
                  onChange={(e) => handleInputChange('dataVolta', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={formData.tipoVoo === 'ida'}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Voo</InputLabel>
                  <Select
                    value={formData.tipoVoo}
                    label="Tipo de Voo"
                    onChange={(e) => handleInputChange('tipoVoo', e.target.value)}
                  >
                    {tiposVoo.map(tipo => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Classe</InputLabel>
                  <Select
                    value={formData.classe}
                    label="Classe"
                    onChange={(e) => handleInputChange('classe', e.target.value)}
                  >
                    {classes.map(classe => (
                      <MenuItem key={classe.value} value={classe.value}>
                        {classe.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Passageiros"
                  type="number"
                  min="1"
                  max="9"
                  value={formData.passageiros}
                  onChange={(e) => handleInputChange('passageiros', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantidade de Milhas"
                  type="number"
                  value={formData.quantidadeMilhas}
                  onChange={(e) => handleInputChange('quantidadeMilhas', e.target.value)}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>milhas</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Taxa de Embarque"
                  type="number"
                  step="0.01"
                  value={formData.taxaEmbarque}
                  onChange={(e) => handleInputChange('taxaEmbarque', e.target.value)}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>
                  }}
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
                  placeholder="Informações adicionais sobre a passagem..."
                />
              </Grid>
              
              {/* Cálculo automático */}
              {formData.valorTotal && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Valor Estimado:</strong> R$ {formData.valorTotal}
                      <br />
                      <strong>Milhas por passageiro:</strong> {Math.floor(formData.quantidadeMilhas / formData.passageiros).toLocaleString()}
                    </Typography>
                  </Alert>
                </Grid>
              )}
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
            {loading ? 'Salvando...' : 'Reservar Passagem'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Passagem;
