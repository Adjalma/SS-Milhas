/**
 * Página de Compra Bonificada
 * 
 * Permite registrar compras de milhas bonificadas com cálculos automáticos
 * e gestão de status das transações.
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
  LinearProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Pending,
  Cancel,
  AttachMoney,
  FlightTakeoff,
  TrendingUp,
  Calculate,
  Save,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const CompraBonificada = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pessoa: '',
    programa: '',
    quantidadeMilhas: '',
    valorPorMilha: '',
    valorTotal: '',
    dataCompra: new Date().toISOString().split('T')[0],
    observacoes: '',
    status: 'pendente'
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Dados mockados para demonstração
  const [comprasBonificadas] = useState([
    {
      id: 1,
      pessoa: 'João Silva',
      programa: 'LATAM Pass',
      quantidadeMilhas: 50000,
      valorPorMilha: 0.025,
      valorTotal: 1250.00,
      dataCompra: '2024-01-15',
      observacoes: 'Compra promocional',
      status: 'aprovado',
      dataAprovacao: '2024-01-16'
    },
    {
      id: 2,
      pessoa: 'Maria Santos',
      programa: 'Smiles',
      quantidadeMilhas: 30000,
      valorPorMilha: 0.030,
      valorTotal: 900.00,
      dataCompra: '2024-01-14',
      observacoes: 'Bônus de fidelidade',
      status: 'pendente'
    }
  ]);

  const programasFidelidade = [
    'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles',
    'Emirates Skywards', 'Delta SkyMiles', 'Flying Blue'
  ];

  const pessoas = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Calcular valor total automaticamente
      if (field === 'quantidadeMilhas' || field === 'valorPorMilha') {
        const quantidade = parseFloat(newData.quantidadeMilhas) || 0;
        const valorPorMilha = parseFloat(newData.valorPorMilha) || 0;
        newData.valorTotal = (quantidade * valorPorMilha).toFixed(2);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Compra bonificada registrada:', formData);
      
      // Reset form
      setFormData({
        pessoa: '',
        programa: '',
        quantidadeMilhas: '',
        valorPorMilha: '',
        valorTotal: '',
        dataCompra: new Date().toISOString().split('T')[0],
        observacoes: '',
        status: 'pendente'
      });
      
    } catch (error) {
      console.error('Erro ao registrar compra:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado': return 'success';
      case 'pendente': return 'warning';
      case 'cancelado': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'aprovado': return <CheckCircle />;
      case 'pendente': return <Pending />;
      case 'cancelado': return <Cancel />;
      default: return <Pending />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Compra Bonificada
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Registre compras de milhas com bônus e promoções
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
            Nova Compra
          </Button>
        </Box>
      </Box>

      {/* Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Investido</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                R$ {comprasBonificadas.reduce((sum, compra) => sum + compra.valorTotal, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FlightTakeoff sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Milhas Adquiridas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {comprasBonificadas.reduce((sum, compra) => sum + compra.quantidadeMilhas, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Custo Médio</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                R$ {(comprasBonificadas.reduce((sum, compra) => sum + compra.valorPorMilha, 0) / comprasBonificadas.length || 0).toFixed(3)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Aprovadas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {comprasBonificadas.filter(c => c.status === 'aprovado').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Formulário de Nova Compra */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <Add sx={{ mr: 1, verticalAlign: 'middle' }} />
            Nova Compra Bonificada
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
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
              
              <Grid item xs={12} md={4}>
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
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Valor por Milha"
                  type="number"
                  step="0.001"
                  value={formData.valorPorMilha}
                  onChange={(e) => handleInputChange('valorPorMilha', e.target.value)}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Valor Total"
                  type="number"
                  step="0.01"
                  value={formData.valorTotal}
                  onChange={(e) => handleInputChange('valorTotal', e.target.value)}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data da Compra"
                  type="date"
                  value={formData.dataCompra}
                  onChange={(e) => handleInputChange('dataCompra', e.target.value)}
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
                    <MenuItem value="pendente">Pendente</MenuItem>
                    <MenuItem value="aprovado">Aprovado</MenuItem>
                    <MenuItem value="cancelado">Cancelado</MenuItem>
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
                  placeholder="Informações adicionais sobre a compra bonificada..."
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
                sx={{ minWidth: 150 }}
              >
                {loading ? 'Salvando...' : 'Salvar Compra'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setFormData({
                  pessoa: '',
                  programa: '',
                  quantidadeMilhas: '',
                  valorPorMilha: '',
                  valorTotal: '',
                  dataCompra: new Date().toISOString().split('T')[0],
                  observacoes: '',
                  status: 'pendente'
                })}
              >
                Limpar
              </Button>
            </Box>
            
            {loading && <LinearProgress sx={{ mt: 2 }} />}
          </Box>
        </CardContent>
      </Card>

      {/* Lista de Compras */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Histórico de Compras Bonificadas
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pessoa</TableCell>
                  <TableCell>Programa</TableCell>
                  <TableCell align="right">Milhas</TableCell>
                  <TableCell align="right">Valor/Milha</TableCell>
                  <TableCell align="right">Valor Total</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comprasBonificadas.map((compra) => (
                  <TableRow key={compra.id} hover>
                    <TableCell>{compra.pessoa}</TableCell>
                    <TableCell>
                      <Chip label={compra.programa} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      {compra.quantidadeMilhas.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      R$ {compra.valorPorMilha.toFixed(3)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                        R$ {compra.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(compra.dataCompra).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(compra.status)}
                        label={compra.status}
                        color={getStatusColor(compra.status)}
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
    </Box>
  );
};

export default CompraBonificada;
