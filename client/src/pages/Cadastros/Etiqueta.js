/**
 * Página de Etiqueta
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
  LocalOffer,
  Refresh,
  Add,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Save,
  Label,
  ColorLens
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Etiqueta = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cor: '#3B82F6',
    descricao: '',
    ativa: true,
    observacoes: ''
  });

  const [etiquetas] = useState([
    {
      id: 1,
      nome: 'VIP',
      cor: '#FFD700',
      descricao: 'Cliente VIP',
      ativa: true,
      observacoes: 'Clientes premium'
    },
    {
      id: 2,
      nome: 'Urgente',
      cor: '#FF0000',
      descricao: 'Prioridade alta',
      ativa: true,
      observacoes: 'Demandas urgentes'
    },
    {
      id: 3,
      nome: 'Novo',
      cor: '#00FF00',
      descricao: 'Cliente novo',
      ativa: true,
      observacoes: 'Clientes recém-cadastrados'
    },
    {
      id: 4,
      nome: 'Inativo',
      cor: '#808080',
      descricao: 'Cliente inativo',
      ativa: false,
      observacoes: 'Clientes sem movimentação'
    }
  ]);

  const cores = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
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
      console.log('Etiqueta registrada:', formData);
      setOpenDialog(false);
    } catch (error) {
      console.error('Erro ao registrar etiqueta:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalEtiquetas: etiquetas.length,
    ativas: etiquetas.filter(e => e.ativa).length,
    inativas: etiquetas.filter(e => !e.ativa).length
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Etiquetas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Cadastro e gestão de etiquetas
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
            Atualizar
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Nova Etiqueta
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalOffer sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalEtiquetas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Ativas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.ativas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Delete sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Inativas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.inativas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <LocalOffer sx={{ mr: 1, verticalAlign: 'middle' }} />
            Etiquetas Cadastradas
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Cor</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {etiquetas.map((etiqueta) => (
                  <TableRow key={etiqueta.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: etiqueta.cor }}>
                          <Label />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {etiqueta.nome}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: etiqueta.cor,
                            borderRadius: '50%',
                            border: '1px solid #ccc'
                          }}
                        />
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {etiqueta.cor}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{etiqueta.descricao}</TableCell>
                    <TableCell>
                      <Chip
                        label={etiqueta.ativa ? 'Ativa' : 'Inativa'}
                        color={etiqueta.ativa ? 'success' : 'error'}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <LocalOffer sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nova Etiqueta
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome da Etiqueta"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Cor</InputLabel>
                  <Select
                    value={formData.cor}
                    label="Cor"
                    onChange={(e) => handleInputChange('cor', e.target.value)}
                  >
                    {cores.map(cor => (
                      <MenuItem key={cor} value={cor}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              backgroundColor: cor,
                              borderRadius: '50%',
                              border: '1px solid #ccc'
                            }}
                          />
                          <Typography variant="body2">{cor}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.ativa}
                      onChange={(e) => handleInputChange('ativa', e.target.checked)}
                    />
                  }
                  label="Etiqueta ativa"
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
            startIcon={<Save />}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Etiqueta'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Etiqueta;
