/**
 * Página de Cartão
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
  CreditCard,
  Refresh,
  Add,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Warning,
  Save,
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Cartao = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    banco: '',
    tipo: 'credito',
    numero: '',
    nome: '',
    vencimento: '',
    limite: '',
    ativo: true,
    observacoes: ''
  });

  const [cartoes] = useState([
    {
      id: 1,
      banco: 'Nubank',
      tipo: 'credito',
      numero: '**** **** **** 1234',
      nome: 'João Silva',
      vencimento: '12/25',
      limite: 5000.00,
      ativo: true,
      observacoes: 'Cartão principal'
    },
    {
      id: 2,
      banco: 'Itaú',
      tipo: 'debito',
      numero: '**** **** **** 5678',
      nome: 'João Silva',
      vencimento: '08/26',
      limite: 0,
      ativo: true,
      observacoes: 'Cartão de débito'
    }
  ]);

  const bancos = ['Nubank', 'Itaú', 'Bradesco', 'Santander', 'Banco do Brasil'];

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
      console.log('Cartão registrado:', formData);
      setOpenDialog(false);
    } catch (error) {
      console.error('Erro ao registrar cartão:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalCartoes: cartoes.length,
    ativos: cartoes.filter(c => c.ativo).length,
    limiteTotal: cartoes.reduce((sum, c) => sum + c.limite, 0)
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Cartões
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Cadastro e gestão de cartões
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
            Atualizar
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Novo Cartão
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CreditCard sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalCartoes}
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
                <AttachMoney sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Limite Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                R$ {stats.limiteTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <CreditCard sx={{ mr: 1, verticalAlign: 'middle' }} />
            Cartões Cadastrados
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Banco</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Número</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Vencimento</TableCell>
                  <TableCell align="right">Limite</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartoes.map((cartao) => (
                  <TableRow key={cartao.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {cartao.banco}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cartao.tipo === 'credito' ? 'Crédito' : 'Débito'}
                        color={cartao.tipo === 'credito' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {cartao.numero}
                      </Typography>
                    </TableCell>
                    <TableCell>{cartao.nome}</TableCell>
                    <TableCell>{cartao.vencimento}</TableCell>
                    <TableCell align="right">
                      {cartao.limite > 0 ? (
                        <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                          R$ {cartao.limite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cartao.ativo ? 'Ativo' : 'Inativo'}
                        color={cartao.ativo ? 'success' : 'error'}
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
          <CreditCard sx={{ mr: 1, verticalAlign: 'middle' }} />
          Novo Cartão
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Banco</InputLabel>
                  <Select
                    value={formData.banco}
                    label="Banco"
                    onChange={(e) => handleInputChange('banco', e.target.value)}
                  >
                    {bancos.map(banco => (
                      <MenuItem key={banco} value={banco}>{banco}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={formData.tipo}
                    label="Tipo"
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                  >
                    <MenuItem value="credito">Crédito</MenuItem>
                    <MenuItem value="debito">Débito</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número do Cartão"
                  value={formData.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome no Cartão"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vencimento (MM/AA)"
                  value={formData.vencimento}
                  onChange={(e) => handleInputChange('vencimento', e.target.value)}
                  placeholder="12/25"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Limite"
                  type="number"
                  step="0.01"
                  value={formData.limite}
                  onChange={(e) => handleInputChange('limite', e.target.value)}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.ativo}
                      onChange={(e) => handleInputChange('ativo', e.target.checked)}
                    />
                  }
                  label="Cartão ativo"
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
            {loading ? 'Salvando...' : 'Salvar Cartão'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default Cartao;
