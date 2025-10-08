/**
 * Página de Clubes
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
  EmojiEvents,
  Refresh,
  Add,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Warning,
  Save,
  People,
  Star
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Clubes = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    programa: '',
    nivel: '',
    beneficios: '',
    ativo: true,
    observacoes: ''
  });

  const [clubes] = useState([
    {
      id: 1,
      nome: 'Latam Pass Gold',
      programa: 'LATAM Pass',
      nivel: 'Gold',
      beneficios: 'Upgrade automático, bagagem extra, lounge',
      ativo: true,
      observacoes: 'Clube premium LATAM'
    },
    {
      id: 2,
      nome: 'Smiles Diamante',
      programa: 'Smiles',
      nivel: 'Diamante',
      beneficios: 'Milhas bônus, upgrade, lounge',
      ativo: true,
      observacoes: 'Nível mais alto Smiles'
    }
  ]);

  const programas = ['LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo'];

  const niveis = ['Bronze', 'Prata', 'Gold', 'Platina', 'Diamante'];

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
      console.log('Clube registrado:', formData);
      setOpenDialog(false);
    } catch (error) {
      console.error('Erro ao registrar clube:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNivelColor = (nivel) => {
    switch (nivel.toLowerCase()) {
      case 'diamante': return 'error';
      case 'platina': return 'warning';
      case 'gold': return 'secondary';
      case 'prata': return 'info';
      case 'bronze': return 'default';
      default: return 'default';
    }
  };

  const stats = {
    totalClubes: clubes.length,
    ativos: clubes.filter(c => c.ativo).length,
    inativos: clubes.filter(c => !c.ativo).length
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Clubes de Fidelidade
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Cadastro e gestão de clubes de fidelidade
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
            Atualizar
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Novo Clube
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEvents sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalClubes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Ativos</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.ativos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Inativos</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.inativos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <EmojiEvents sx={{ mr: 1, verticalAlign: 'middle' }} />
            Clubes Cadastrados
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Programa</TableCell>
                  <TableCell>Nível</TableCell>
                  <TableCell>Benefícios</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clubes.map((clube) => (
                  <TableRow key={clube.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <Star />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {clube.nome}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={clube.programa} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={clube.nivel}
                        color={getNivelColor(clube.nivel)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {clube.beneficios}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={clube.ativo ? 'Ativo' : 'Inativo'}
                        color={clube.ativo ? 'success' : 'error'}
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
          <EmojiEvents sx={{ mr: 1, verticalAlign: 'middle' }} />
          Novo Clube
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome do Clube"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Programa</InputLabel>
                  <Select
                    value={formData.programa}
                    label="Programa"
                    onChange={(e) => handleInputChange('programa', e.target.value)}
                  >
                    {programas.map(programa => (
                      <MenuItem key={programa} value={programa}>{programa}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Nível</InputLabel>
                  <Select
                    value={formData.nivel}
                    label="Nível"
                    onChange={(e) => handleInputChange('nivel', e.target.value)}
                  >
                    {niveis.map(nivel => (
                      <MenuItem key={nivel} value={nivel}>{nivel}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.ativo}
                      onChange={(e) => handleInputChange('ativo', e.target.checked)}
                    />
                  }
                  label="Clube ativo"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Benefícios"
                  value={formData.beneficios}
                  onChange={(e) => handleInputChange('beneficios', e.target.value)}
                  placeholder="Liste os benefícios do clube..."
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
            {loading ? 'Salvando...' : 'Salvar Clube'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Clubes;
