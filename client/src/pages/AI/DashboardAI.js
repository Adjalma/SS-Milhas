/**
 * Dashboard da IA - Sistema de Monitoramento de Oportunidades
 * 
 * Interface para monitorar oportunidades de milhas em tempo real
 * usando IA e dados do Telegram
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
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
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Psychology,
  Telegram,
  TrendingUp,
  TrendingDown,
  Notifications,
  PlayArrow,
  Stop,
  Refresh,
  Visibility,
  CheckCircle,
  Warning,
  Error,
  SmartToy,
  Analytics,
  Timeline,
  Assessment,
  Speed,
  Security,
  Insights
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const DashboardAI = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [opportunities, setOpportunities] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [marketTrends, setMarketTrends] = useState({});
  const [monitorStatus, setMonitorStatus] = useState('offline');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);

  // Configurações
  const [settings, setSettings] = useState({
    autoRefresh: true,
    minConfidence: 0.7,
    notifications: true,
    selectedPrograms: ['smiles', 'latam', 'tudoazul']
  });

  // Dados mockados para demonstração
  const mockOpportunities = [
    {
      id: 'opp_001',
      timestamp: new Date().toISOString(),
      source: {
        channel: 'BANCO_DE_MILHAS_ON_FIRE',
        author: 'Marcio',
        original_text: 'Meta Mundi compro smiles 83k 1 cpf 17'
      },
      analysis: {
        program: 'smiles',
        quantity: 83000,
        price_per_mile: 17.0,
        cpf_count: 1,
        opportunity_type: 'compra'
      },
      confidence: 0.92,
      summary: 'Excelente oportunidade de compra de Smiles com preço 10% abaixo do mercado',
      recommendation: 'comprar',
      risk_level: 'baixo'
    },
    {
      id: 'opp_002',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      source: {
        channel: 'BALCAO_DE_MILHAS_COMPRAS',
        author: 'Michel Daddy',
        original_text: 'Meta Mundi compro smiles 83k 1 cpf 16,50'
      },
      analysis: {
        program: 'smiles',
        quantity: 83000,
        price_per_mile: 16.5,
        cpf_count: 1,
        opportunity_type: 'compra'
      },
      confidence: 0.88,
      summary: 'Boa oportunidade de compra de Smiles com preço competitivo',
      recommendation: 'comprar',
      risk_level: 'baixo'
    },
    {
      id: 'opp_003',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      source: {
        channel: 'BALCAO_DE_MILHAS_COMP',
        author: 'Sistema Bot',
        original_text: 'Compro 90.644 milhas LATAM para emissão com 4 CPF. Compro por R$ 24,00 cada mil milhas'
      },
      analysis: {
        program: 'latam',
        quantity: 90644,
        price_per_mile: 24.0,
        cpf_count: 4,
        opportunity_type: 'venda'
      },
      confidence: 0.95,
      summary: 'Oportunidade excepcional de venda de LATAM Pass - preço acima do mercado',
      recommendation: 'vender',
      risk_level: 'baixo'
    }
  ];

  const mockStatistics = {
    total_opportunities: 156,
    active_opportunities: 12,
    total_messages: 2847,
    programs_stats: {
      smiles: 45,
      latam: 38,
      tudoazul: 25,
      livelo: 12,
      iberia: 8,
      avios: 5
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto refresh se habilitado
    if (settings.autoRefresh) {
      const interval = setInterval(loadData, 30000); // 30 segundos
      return () => clearInterval(interval);
    }
  }, [settings.autoRefresh]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simula carregamento de dados da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOpportunities(mockOpportunities);
      setStatistics(mockStatistics);
      
      // Simula status do monitor
      setMonitorStatus('online');
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const startMonitor = async () => {
    try {
      // Simula chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMonitorStatus('online');
    } catch (error) {
      console.error('Erro ao iniciar monitor:', error);
    }
  };

  const stopMonitor = async () => {
    try {
      // Simula chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMonitorStatus('offline');
    } catch (error) {
      console.error('Erro ao parar monitor:', error);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.7) return 'warning';
    return 'error';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'baixo': return 'success';
      case 'médio': return 'warning';
      case 'alto': return 'error';
      default: return 'default';
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'comprar': return 'success';
      case 'vender': return 'error';
      case 'aguardar': return 'warning';
      default: return 'default';
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
            Dashboard da IA
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Monitoramento inteligente de oportunidades em tempo real
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadData}
            disabled={loading}
          >
            Atualizar
          </Button>
          {monitorStatus === 'online' ? (
            <Button
              variant="contained"
              color="error"
              startIcon={<Stop />}
              onClick={stopMonitor}
            >
              Parar Monitor
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              startIcon={<PlayArrow />}
              onClick={startMonitor}
            >
              Iniciar Monitor
            </Button>
          )}
        </Box>
      </Box>

      {/* Status do Sistema */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SmartToy sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Status da IA</Typography>
              </Box>
              <Chip
                label={monitorStatus === 'online' ? 'Online' : 'Offline'}
                color={monitorStatus === 'online' ? 'success' : 'error'}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Monitoramento {monitorStatus === 'online' ? 'ativo' : 'inativo'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Oportunidades</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {statistics.active_opportunities || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ativas agora
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Telegram sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Canais</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                7
              </Typography>
              <Typography variant="body2" color="text.secondary">
                monitorados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Analytics sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Mensagens</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {statistics.total_messages || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                analisadas hoje
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Oportunidades" icon={<Insights />} />
            <Tab label="Análise de Mercado" icon={<Assessment />} />
            <Tab label="Configurações" icon={<Security />} />
          </Tabs>
        </Box>

        {/* Tab 1: Oportunidades */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Oportunidades Identificadas pela IA
            </Typography>
            
            {loading && <LinearProgress sx={{ mb: 2 }} />}
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Programa</TableCell>
                    <TableCell>Oportunidade</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Preço/Milha</TableCell>
                    <TableCell>Confiança</TableCell>
                    <TableCell>Recomendação</TableCell>
                    <TableCell>Fonte</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {opportunities.map((opp) => (
                    <TableRow key={opp.id} hover>
                      <TableCell>
                        <Chip
                          label={opp.analysis.program.toUpperCase()}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {opp.analysis.opportunity_type === 'compra' ? 'Compra' : 'Venda'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {opp.summary}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {opp.analysis.quantity.toLocaleString()} milhas
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>
                          R$ {opp.analysis.price_per_mile.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={opp.confidence * 100}
                            sx={{ width: 60, height: 6 }}
                            color={getConfidenceColor(opp.confidence)}
                          />
                          <Typography variant="caption">
                            {(opp.confidence * 100).toFixed(0)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={opp.recommendation}
                          color={getRecommendationColor(opp.recommendation)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {opp.source.channel}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {opp.source.author}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver Detalhes">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedOpportunity(opp);
                              setOpenDetails(true);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Tab 2: Análise de Mercado */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Análise de Tendências do Mercado
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Estatísticas por Programa
                  </Typography>
                  
                  <List>
                    {Object.entries(statistics.programs_stats || {}).map(([program, count]) => (
                      <ListItem key={program}>
                        <ListItemIcon>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {program.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={program.toUpperCase()}
                          secondary={`${count} oportunidades`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Insights da IA
                  </Typography>
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Tendência de Mercado:</strong> Preços de Smiles em alta, 
                      oportunidades de compra em LATAM Pass.
                    </Typography>
                  </Alert>
                  
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Recomendação:</strong> Considerar compra de Smiles 
                      abaixo de R$ 16,50 por milha.
                    </Typography>
                  </Alert>
                  
                  <Alert severity="warning">
                    <Typography variant="body2">
                      <strong>Atenção:</strong> Verificar autenticidade de ofertas 
                      com preços muito abaixo do mercado.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 3: Configurações */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Configurações da IA
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Monitoramento
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoRefresh}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          autoRefresh: e.target.checked
                        }))}
                      />
                    }
                    label="Atualização Automática"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: e.target.checked
                        }))}
                      />
                    }
                    label="Notificações"
                  />
                  
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Confiança Mínima"
                      type="number"
                      value={settings.minConfidence}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        minConfidence: parseFloat(e.target.value)
                      }))}
                      inputProps={{ min: 0, max: 1, step: 0.1 }}
                      helperText="0.0 = Baixa confiança, 1.0 = Alta confiança"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Programas Monitorados
                  </Typography>
                  
                  <FormControl fullWidth>
                    <InputLabel>Programas</InputLabel>
                    <Select
                      multiple
                      value={settings.selectedPrograms}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        selectedPrograms: e.target.value
                      }))}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      <MenuItem value="smiles">Smiles</MenuItem>
                      <MenuItem value="latam">LATAM Pass</MenuItem>
                      <MenuItem value="tudoazul">TudoAzul</MenuItem>
                      <MenuItem value="livelo">Livelo</MenuItem>
                      <MenuItem value="iberia">Iberia Plus</MenuItem>
                      <MenuItem value="avios">Avios</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Insights sx={{ mr: 1, verticalAlign: 'middle' }} />
          Detalhes da Oportunidade
        </DialogTitle>
        <DialogContent>
          {selectedOpportunity && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Informações Básicas</Typography>
                  <Typography><strong>Programa:</strong> {selectedOpportunity.analysis.program.toUpperCase()}</Typography>
                  <Typography><strong>Tipo:</strong> {selectedOpportunity.analysis.opportunity_type}</Typography>
                  <Typography><strong>Quantidade:</strong> {selectedOpportunity.analysis.quantity.toLocaleString()} milhas</Typography>
                  <Typography><strong>Preço por Milha:</strong> R$ {selectedOpportunity.analysis.price_per_mile.toFixed(2)}</Typography>
                  <Typography><strong>CPFs:</strong> {selectedOpportunity.analysis.cpf_count}</Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Análise da IA</Typography>
                  <Typography><strong>Confiança:</strong> {(selectedOpportunity.confidence * 100).toFixed(1)}%</Typography>
                  <Typography><strong>Recomendação:</strong> {selectedOpportunity.recommendation}</Typography>
                  <Typography><strong>Risco:</strong> {selectedOpportunity.risk_level}</Typography>
                  <Typography><strong>Resumo:</strong> {selectedOpportunity.summary}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Fonte</Typography>
                  <Typography><strong>Canal:</strong> {selectedOpportunity.source.channel}</Typography>
                  <Typography><strong>Autor:</strong> {selectedOpportunity.source.author}</Typography>
                  <Typography><strong>Mensagem Original:</strong></Typography>
                  <Typography variant="body2" sx={{ 
                    p: 2, 
                    bgcolor: 'grey.100', 
                    borderRadius: 1,
                    fontFamily: 'monospace'
                  }}>
                    {selectedOpportunity.source.original_text}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetails(false)}>
            Fechar
          </Button>
          <Button variant="contained" startIcon={<CheckCircle />}>
            Marcar como Interessado
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardAI;
