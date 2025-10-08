import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  Add,
  Save,
  Cancel,
  Edit,
  Delete,
  Visibility,
  AttachMoney,
  FlightTakeoff,
  Person,
  CalendarToday,
  Description,
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const CompraEntrada = () => {
  const [formData, setFormData] = useState({
    pessoa: '',
    programa: '',
    quantidade: '',
    valorUnitario: '',
    valorTotal: '',
    data: new Date().toISOString().split('T')[0],
    observacoes: '',
    automatico: false,
    cpfOrigem: '',
    senhaOrigem: ''
  });

  const [movimentacoes, setMovimentacoes] = useState([
    {
      id: 1,
      pessoa: 'João Silva',
      programa: 'LATAM Pass',
      quantidade: 10000,
      valorUnitario: 0.045,
      valorTotal: 450.00,
      data: '2024-01-15',
      status: 'confirmado',
      observacoes: 'Compra via cartão de crédito'
    },
    {
      id: 2,
      pessoa: 'Maria Santos',
      programa: 'Smiles',
      quantidade: 15000,
      valorUnitario: 0.038,
      valorTotal: 570.00,
      data: '2024-01-14',
      status: 'pendente',
      observacoes: 'Aguardando confirmação do banco'
    }
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const pessoas = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira'
  ];

  const programas = [
    'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles',
    'Emirates Skywards', 'Delta SkyMiles', 'Flying Blue', 'Itaú', 'Banco do Brasil'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Calcular valor total automaticamente
      if (field === 'quantidade' || field === 'valorUnitario') {
        const quantidade = parseFloat(field === 'quantidade' ? value : newData.quantidade) || 0;
        const valorUnitario = parseFloat(field === 'valorUnitario' ? value : newData.valorUnitario) || 0;
        newData.valorTotal = (quantidade * valorUnitario).toFixed(2);
      }
      
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const novaMovimentacao = {
      id: movimentacoes.length + 1,
      ...formData,
      quantidade: parseFloat(formData.quantidade),
      valorUnitario: parseFloat(formData.valorUnitario),
      valorTotal: parseFloat(formData.valorTotal),
      status: 'pendente'
    };

    setMovimentacoes(prev => [novaMovimentacao, ...prev]);
    
    // Limpar formulário
    setFormData({
      pessoa: '',
      programa: '',
      quantidade: '',
      valorUnitario: '',
      valorTotal: '',
      data: new Date().toISOString().split('T')[0],
      observacoes: '',
      automatico: false,
      cpfOrigem: '',
      senhaOrigem: ''
    });

    // Mostrar sucesso
    alert('Movimentação registrada com sucesso!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado': return 'success';
      case 'pendente': return 'warning';
      case 'cancelado': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmado': return <CheckCircle />;
      case 'pendente': return <Warning />;
      case 'cancelado': return <Cancel />;
      default: return <Info />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          Compra (Entrada)
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Registre compras de milhas para suas contas
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Formulário */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Add sx={{ mr: 1 }} />
                  Nova Compra
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Pessoa</InputLabel>
                        <Select
                          value={formData.pessoa}
                          label="Pessoa"
                          onChange={(e) => handleInputChange('pessoa', e.target.value)}
                          required
                        >
                          {pessoas.map(pessoa => (
                            <MenuItem key={pessoa} value={pessoa}>{pessoa}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Programa</InputLabel>
                        <Select
                          value={formData.programa}
                          label="Programa"
                          onChange={(e) => handleInputChange('programa', e.target.value)}
                          required
                        >
                          {programas.map(programa => (
                            <MenuItem key={programa} value={programa}>{programa}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Quantidade de Milhas"
                        type="number"
                        value={formData.quantidade}
                        onChange={(e) => handleInputChange('quantidade', e.target.value)}
                        InputProps={{
                          endAdornment: <FlightTakeoff />
                        }}
                        required
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Valor Unitário (R$)"
                        type="number"
                        step="0.001"
                        value={formData.valorUnitario}
                        onChange={(e) => handleInputChange('valorUnitario', e.target.value)}
                        InputProps={{
                          startAdornment: <AttachMoney />
                        }}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Valor Total (R$)"
                        type="number"
                        value={formData.valorTotal}
                        InputProps={{
                          startAdornment: <AttachMoney />,
                          readOnly: true
                        }}
                        helperText="Calculado automaticamente"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Data"
                        type="date"
                        value={formData.data}
                        onChange={(e) => handleInputChange('data', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: <CalendarToday />
                        }}
                        required
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
                        InputProps={{
                          startAdornment: <Description />
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.automatico}
                            onChange={(e) => handleInputChange('automatico', e.target.checked)}
                          />
                        }
                        label="Captura Automática (via API)"
                      />
                    </Grid>

                    {formData.automatico && (
                      <>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="CPF Origem"
                            value={formData.cpfOrigem}
                            onChange={(e) => handleInputChange('cpfOrigem', e.target.value)}
                            placeholder="000.000.000-00"
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Senha Origem"
                            type="password"
                            value={formData.senhaOrigem}
                            onChange={(e) => handleInputChange('senhaOrigem', e.target.value)}
                          />
                        </Grid>
                      </>
                    )}

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<Save />}
                          fullWidth
                        >
                          Salvar Compra
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={() => setFormData({
                            pessoa: '',
                            programa: '',
                            quantidade: '',
                            valorUnitario: '',
                            valorTotal: '',
                            data: new Date().toISOString().split('T')[0],
                            observacoes: '',
                            automatico: false,
                            cpfOrigem: '',
                            senhaOrigem: ''
                          })}
                        >
                          Limpar
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Histórico */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Histórico de Compras
                </Typography>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Pessoa</TableCell>
                        <TableCell>Programa</TableCell>
                        <TableCell align="right">Milhas</TableCell>
                        <TableCell align="right">Valor</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {movimentacoes
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((mov) => (
                        <TableRow key={mov.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Person sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                              {mov.pessoa}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={mov.programa} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {mov.quantidade.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            R$ {mov.valorTotal.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(mov.status)}
                              label={mov.status}
                              size="small"
                              color={getStatusColor(mov.status)}
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

                <TablePagination
                  component="div"
                  count={movimentacoes.length}
                  page={page}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Alertas */}
      <Box sx={{ mt: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Dica:</strong> Use a captura automática para sincronizar compras diretamente dos programas de fidelidade.
        </Alert>
        <Alert severity="warning">
          <strong>Atenção:</strong> Sempre verifique os dados antes de confirmar a compra. Valores incorretos podem afetar o controle financeiro.
        </Alert>
      </Box>
    </Box>
  );
};

export default CompraEntrada;
