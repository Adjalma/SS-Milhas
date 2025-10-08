/**
 * Página de Transferência entre Pessoas
 * 
 * Gerencia transferências de milhas entre diferentes pessoas,
 * com controle de relacionamento e histórico familiar.
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
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Pending,
  Cancel,
  TransferWithinAStation,
  People,
  FamilyRestroom,
  AccountBalance,
  TrendingUp,
  Save,
  Refresh,
  PersonAdd
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const TransferenciaPessoas = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pessoaOrigem: '',
    pessoaDestino: '',
    programa: '',
    quantidade: '',
    relacionamento: '',
    motivo: '',
    dataTransferencia: new Date().toISOString().split('T')[0],
    observacoes: '',
    status: 'pendente'
  });

  // Dados mockados baseados nas imagens
  const [transferenciasPessoas] = useState([
    {
      id: 1,
      pessoaOrigem: 'João Silva',
      pessoaDestino: 'Maria Silva (Cônjuge)',
      programa: 'LATAM Pass',
      quantidade: 15000,
      relacionamento: 'Cônjuge',
      motivo: 'Viagem familiar',
      dataTransferencia: '2024-01-15',
      status: 'concluida',
      dataConclusao: '2024-01-15'
    },
    {
      id: 2,
      pessoaOrigem: 'Pedro Oliveira',
      pessoaDestino: 'Ana Oliveira (Filha)',
      programa: 'Smiles',
      quantidade: 8000,
      relacionamento: 'Filho(a)',
      motivo: 'Formatura',
      dataTransferencia: '2024-01-14',
      status: 'processando'
    },
    {
      id: 3,
      pessoaOrigem: 'Carlos Pereira',
      pessoaDestino: 'Lucia Pereira (Mãe)',
      programa: 'TudoAzul',
      quantidade: 12000,
      relacionamento: 'Pai/Mãe',
      motivo: 'Tratamento médico',
      dataTransferencia: '2024-01-13',
      status: 'concluida',
      dataConclusao: '2024-01-13'
    }
  ]);

  // Relacionamentos permitidos (baseado nas imagens)
  const relacionamentos = [
    'Cônjuge',
    'Filho(a)',
    'Pai/Mãe',
    'Irmão(ã)',
    'Avô/Avó',
    'Neto(a)',
    'Sogro(a)',
    'Genro/Nora',
    'Cunhado(a)',
    'Tio(a)',
    'Sobrinho(a)',
    'Primo(a)'
  ];

  const programasFidelidade = [
    'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles',
    'Emirates Skywards', 'Delta SkyMiles', 'Flying Blue'
  ];

  const pessoas = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira',
    'Lucia Ferreira', 'Roberto Almeida', 'Fernanda Lima'
  ];

  const motivos = [
    'Viagem familiar',
    'Emergência médica',
    'Formatura',
    'Aniversário',
    'Natal',
    'Tratamento médico',
    'Viagem de negócios',
    'Outro'
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
      console.log('Transferência entre pessoas realizada:', formData);
      
      // Reset form
      setFormData({
        pessoaOrigem: '',
        pessoaDestino: '',
        programa: '',
        quantidade: '',
        relacionamento: '',
        motivo: '',
        dataTransferencia: new Date().toISOString().split('T')[0],
        observacoes: '',
        status: 'pendente'
      });
      
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
      case 'processando': return <Pending />;
      case 'pendente': return <Pending />;
      case 'cancelada': return <Cancel />;
      default: return <Pending />;
    }
  };

  // Estatísticas das transferências
  const stats = {
    totalTransferidas: transferenciasPessoas.reduce((sum, t) => sum + t.quantidade, 0),
    totalConcluidas: transferenciasPessoas.filter(t => t.status === 'concluida').length,
    totalProcessando: transferenciasPessoas.filter(t => t.status === 'processando').length,
    relacionamentoMaisComum: 'Cônjuge' // Baseado nos dados mockados
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Transferência entre Pessoas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gerencie transferências familiares e entre pessoas relacionadas
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
            startIcon={<PersonAdd />}
            onClick={() => {/* Abrir modal de nova transferência */}}
          >
            Nova Transferência
          </Button>
        </Box>
      </Box>

      {/* Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TransferWithinAStation sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Transferidas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalTransferidas.toLocaleString()}
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
                {stats.totalConcluidas}
              </Typography>
              <Typography variant="body2" color="text.secondary">transferências</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Pending sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Processando</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.totalProcessando}
              </Typography>
              <Typography variant="body2" color="text.secondary">transferências</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FamilyRestroom sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Relacionamento Mais Comum</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.relacionamentoMaisComum}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Formulário de Nova Transferência */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <PersonAdd sx={{ mr: 1, verticalAlign: 'middle' }} />
                Nova Transferência Familiar
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Pessoa de Origem</InputLabel>
                      <Select
                        value={formData.pessoaOrigem}
                        label="Pessoa de Origem"
                        onChange={(e) => handleInputChange('pessoaOrigem', e.target.value)}
                      >
                        {pessoas.map(pessoa => (
                          <MenuItem key={pessoa} value={pessoa}>{pessoa}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Pessoa de Destino</InputLabel>
                      <Select
                        value={formData.pessoaDestino}
                        label="Pessoa de Destino"
                        onChange={(e) => handleInputChange('pessoaDestino', e.target.value)}
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
                      value={formData.quantidade}
                      onChange={(e) => handleInputChange('quantidade', e.target.value)}
                      InputProps={{
                        endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>milhas</Typography>
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Relacionamento</InputLabel>
                      <Select
                        value={formData.relacionamento}
                        label="Relacionamento"
                        onChange={(e) => handleInputChange('relacionamento', e.target.value)}
                      >
                        {relacionamentos.map(rel => (
                          <MenuItem key={rel} value={rel}>{rel}</MenuItem>
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
                      label="Data da Transferência"
                      type="date"
                      value={formData.dataTransferencia}
                      onChange={(e) => handleInputChange('dataTransferencia', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Observações"
                      multiline
                      rows={2}
                      value={formData.observacoes}
                      onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      placeholder="Informações adicionais..."
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? 'Processando...' : 'Transferir Milhas'}
                  </Button>
                </Box>
                
                {loading && <LinearProgress sx={{ mt: 2 }} />}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista de Transferências */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Histórico de Transferências Familiares
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Origem → Destino</TableCell>
                      <TableCell>Programa</TableCell>
                      <TableCell align="right">Quantidade</TableCell>
                      <TableCell>Relacionamento</TableCell>
                      <TableCell>Motivo</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transferenciasPessoas.map((transferencia) => (
                      <TableRow key={transferencia.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {transferencia.pessoaOrigem}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              → {transferencia.pessoaDestino}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={transferencia.programa} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">
                          {transferencia.quantidade.toLocaleString()} milhas
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={transferencia.relacionamento}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {transferencia.motivo}
                          </Typography>
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
        </Grid>
      </Grid>

      {/* Alertas e Informações */}
      <Box sx={{ mt: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Importante:</strong> Transferências familiares podem ter restrições específicas 
            de cada programa de fidelidade. Verifique as regras antes de realizar a transferência.
          </Typography>
        </Alert>
        
        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Atenção:</strong> Alguns programas exigem comprovação de relacionamento 
            para transferências entre pessoas. Mantenha a documentação atualizada.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default TransferenciaPessoas;
