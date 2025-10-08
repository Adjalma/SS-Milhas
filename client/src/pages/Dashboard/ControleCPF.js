import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Avatar,
  Stack,
  CardActionArea,
  CardActions,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  FlightTakeoff,
  Flight,
  AccountBalance,
  Hotel,
  Store,
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Favorite,
  FavoriteBorder,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Info,
  Person,
  Group,
  CalendarToday,
  AttachMoney,
  SwapHoriz,
  MoreVert,
  Visibility,
  Star,
  StarBorder,
  Schedule,
  Notifications,
  Security,
  AccessTime,
  Block,
  CheckCircleOutline,
  ErrorOutline,
  Timer
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { listarCPFs, atualizarEtiqueta } from '../../services/cpfControlAPI';

// Configuração completa dos 67 programas com limites e regras
const programasConfig = {
  // Nacionais (Com Limite de CPF)
  'Smiles (GOL)': {
    categoria: 'Nacional',
    limiteCPF: 25,
    tipoLimite: 'ano_calendario',
    descricao: 'Acumular e resgatar milhas para voos da GOL e mais de 50 parceiras',
    regra: 'O titular pode emitir para si e para até 25 CPFs diferentes por ano-calendário',
    cor: '#2196F3'
  },
  'LATAM Pass': {
    categoria: 'Nacional',
    limiteCPF: 24,
    tipoLimite: 'ano_calendario',
    descricao: 'Acumular e resgatar pontos para voos da LATAM e parceiras',
    regra: 'O titular pode emitir para si e para até 24 CPFs diferentes por ano-calendário',
    cor: '#4CAF50'
  },
  'Azul Fidelidade': {
    categoria: 'Nacional',
    limiteCPF: 5,
    tipoLimite: 'beneficiarios_fixos',
    descricao: 'Acumular e resgatar pontos para voos da Azul, pacotes de viagem e parceiras',
    regra: 'Permite cadastrar uma lista fixa de até 5 beneficiários. Cada beneficiário só pode ser alterado após 60 dias',
    cor: '#FF9800'
  },

  // Internacionais (Sem Limite de CPF)
  'AAdvantage (American Airlines)': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Aerolíneas Argentinas Plus': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Aeroplan (Air Canada)': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Air Europa SUMA': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Alaska Airlines (Mileage Plan)': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'British Executive Club (British Airways)': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Connect Miles (Copa Airlines)': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Delta SkyMiles': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Emirates Skywards': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Etihad Guest': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Finnair Plus': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Flying Blue (Air France/KLM)': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Flying Club (Virgin Atlantic)': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Iberia Plus': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'LifeMiles (Avianca)': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Lufthansa (Miles & More)': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Miles&Smiles (Turkish Airlines)': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Qantas Frequent Flyer': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Qatar Privilege Club': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Southwest Rapid Rewards': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'TAP Miles&Go': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'United MileagePlus': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },
  'Volare (ITA Airways)': { categoria: 'Internacional', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#1976D2' },

  // Bancários e Financeiros
  'Ailos': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Átomos (C6 Bank)': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Banco do Brasil': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Banescard': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Banrisul (Banriclube)': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'BRB StockCar+': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'BTG Pactual': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'BV Merece': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Caixa': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Coopera (Sicoob)': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Credicard': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Cresol': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Curtaí (BRB)': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Esfera (Santander)': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Genial Investimentos': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Itaú': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Livelo (Bradesco e Banco do Brasil)': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Membership Rewards (American Express)': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Nomad Pass': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Nubank Rewards / Ultravioleta': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Porto Plus (Porto Seguro)': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Safra Rewards': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Sicredi': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Sisprime': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'Unicred': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },
  'XP Investimentos': { categoria: 'Bancário', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#9C27B0' },

  // Hotéis
  'All Accor': { categoria: 'Hotel', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#FF5722' },
  'Hilton Honors': { categoria: 'Hotel', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#FF5722' },
  'IHG One Rewards': { categoria: 'Hotel', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#FF5722' },
  'Marriott Bonvoy': { categoria: 'Hotel', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#FF5722' },
  'MeliáRewards': { categoria: 'Hotel', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#FF5722' },
  'World of Hyatt': { categoria: 'Hotel', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#FF5722' },

  // Outros
  '+Mengão': { categoria: 'Outros', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#607D8B' },
  'Ale': { categoria: 'Outros', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#607D8B' },
  'Dotz': { categoria: 'Outros', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#607D8B' },
  'GPA (Cliente Mais)': { categoria: 'Outros', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#607D8B' },
  'Km de Vantagens (Ipiranga)': { categoria: 'Outros', limiteCPF: null, tipoLimite: 'transferencia', cor: '#607D8B' },
  'Loop': { categoria: 'Outros', limiteCPF: null, tipoLimite: 'nao_aplica', cor: '#607D8B' },
  'Premmia (Petrobras)': { categoria: 'Outros', limiteCPF: null, tipoLimite: 'transferencia', cor: '#607D8B' },
  'Shell Box': { categoria: 'Outros', limiteCPF: null, tipoLimite: 'transferencia', cor: '#607D8B' },
  'Virgin Red': { categoria: 'Outros', limiteCPF: null, tipoLimite: 'sem_limite', cor: '#607D8B' }
};

// Dados mockados de CPFs cadastrados
const cpfData = [
  {
    id: 1,
    nome: 'THYAGO',
    programa: 'Smiles (GOL)',
    cpf: '123.456.789-01',
    dataCadastro: '2024-03-15',
    dataUltimoUso: '2024-11-20',
    status: 'ativo',
    alertas: [],
    etiqueta: 'Conta com limite próximo do vencimento - renovar até 31/12/2024'
  },
  {
    id: 2,
    nome: 'ADRIANA DE PAULA',
    programa: 'LATAM Pass',
    cpf: '987.654.321-02',
    dataCadastro: '2024-01-10',
    dataUltimoUso: '2024-12-01',
    status: 'ativo',
    alertas: [],
    etiqueta: ''
  },
  {
    id: 3,
    nome: 'WALLAS',
    programa: 'Azul Fidelidade',
    cpf: '456.789.123-03',
    dataCadastro: '2024-06-22',
    dataUltimoUso: '2024-10-15',
    status: 'ativo',
    alertas: [],
    etiqueta: 'Beneficiário fixo - alteração só após 60 dias'
  },
  {
    id: 4,
    nome: 'VALMIR',
    programa: 'Smiles (GOL)',
    cpf: '789.123.456-04',
    dataCadastro: '2024-02-28',
    dataUltimoUso: '2024-12-10',
    status: 'alerta',
    alertas: ['Próximo do limite anual'],
    etiqueta: 'ATENÇÃO: Apenas 2 CPFs restantes! Usar com cuidado'
  },
  {
    id: 5,
    nome: 'CARLOS',
    programa: 'LATAM Pass',
    cpf: '321.654.987-05',
    dataCadastro: '2024-04-05',
    dataUltimoUso: '2024-09-30',
    status: 'ativo',
    alertas: [],
    etiqueta: ''
  }
];

// Função para calcular dias até vencimento
const calcularDiasVencimento = (programa) => {
  const config = programasConfig[programa];
  if (!config || config.tipoLimite !== 'ano_calendario') return null;
  
  const agora = new Date();
  const proximoAno = new Date(agora.getFullYear() + 1, 0, 1);
  const diffTime = proximoAno - agora;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Função para calcular percentual usado
const calcularPercentualUsado = (programa, cpfUsados) => {
  const config = programasConfig[programa];
  if (!config || !config.limiteCPF) return 0;
  
  return Math.min((cpfUsados / config.limiteCPF) * 100, 100);
};

// Componente de Card de Programa com Monitoramento
const ProgramaCard = ({ programa, cpfUsados, onManageCPF, onUpdateEtiqueta }) => {
  const [etiqueta, setEtiqueta] = React.useState(programa.etiqueta || '');
  const [editandoEtiqueta, setEditandoEtiqueta] = React.useState(false);
  
  const config = programasConfig[programa.programa];
  const diasVencimento = calcularDiasVencimento(programa.programa);
  const percentualUsado = calcularPercentualUsado(programa.programa, cpfUsados);

  const handleSalvarEtiqueta = () => {
    if (onUpdateEtiqueta) {
      onUpdateEtiqueta(programa.id, etiqueta);
    }
    setEditandoEtiqueta(false);
  };
  
  const getStatusColor = () => {
    if (!config || !config.limiteCPF) return 'success';
    if (percentualUsado >= 90) return 'error';
    if (percentualUsado >= 70) return 'warning';
    return 'success';
  };

  const getStatusIcon = () => {
    if (!config || !config.limiteCPF) return <CheckCircle />;
    if (percentualUsado >= 90) return <ErrorOutline />;
    if (percentualUsado >= 70) return <Warning />;
    return <CheckCircleOutline />;
  };

  const getVencimentoInfo = () => {
    if (!config || config.tipoLimite !== 'ano_calendario') return null;
    
    return {
      dias: diasVencimento,
      texto: diasVencimento <= 30 ? `Vence em ${diasVencimento} dias` : `Renova em ${diasVencimento} dias`,
      urgente: diasVencimento <= 30
    };
  };

  const vencimentoInfo = getVencimentoInfo();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(145deg, #1A1B2E 0%, #252741 100%)',
          border: `1px solid ${getStatusColor() === 'success' ? 'rgba(16, 185, 129, 0.2)' : getStatusColor() === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 25px -5px ${getStatusColor() === 'success' ? 'rgba(16, 185, 129, 0.1)' : getStatusColor() === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'}, 0 10px 10px -5px ${getStatusColor() === 'success' ? 'rgba(16, 185, 129, 0.04)' : getStatusColor() === 'warning' ? 'rgba(245, 158, 11, 0.04)' : 'rgba(239, 68, 68, 0.04)'}`
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#E2E8F0', textAlign: 'center' }}>
                  {programa.nome}
                </Typography>
                {etiqueta && (
                  <Tooltip title={etiqueta} arrow placement="top">
                    <Badge
                      badgeContent="!"
                      color="warning"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.5 }
                          }
                        }
                      }}
                    >
                      <Info sx={{ color: '#FFA726', fontSize: 20 }} />
                    </Badge>
                  </Tooltip>
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                {programa.programa}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => onManageCPF(programa)}
              sx={{ color: 'primary.main' }}
            >
              <Group />
            </IconButton>
          </Stack>

          {/* Status e Vencimento */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {getStatusIcon()}
              <Typography variant="caption" color={`${getStatusColor()}.main`}>
                {config?.limiteCPF ? `${cpfUsados}/${config.limiteCPF} CPFs` : 'Sem limite'}
              </Typography>
            </Stack>
            
            {vencimentoInfo && (
              <Chip
                icon={vencimentoInfo.urgente ? <Timer /> : <CalendarToday />}
                label={vencimentoInfo.texto}
                size="small"
                color={vencimentoInfo.urgente ? 'error' : 'primary'}
                variant="outlined"
              />
            )}
          </Stack>

          {/* Progresso do Limite */}
          {config?.limiteCPF && (
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" color="text.secondary">
                  Limite Anual
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {percentualUsado.toFixed(1)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={percentualUsado}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: percentualUsado >= 90 ? 'error.main' : percentualUsado >= 70 ? 'warning.main' : 'primary.main',
                  },
                }}
              />
            </Box>
          )}

          {/* Informações do Programa */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Categoria: {config?.categoria}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Regra: {config?.regra || 'Sem limitação de CPF'}
            </Typography>
          </Box>

          {/* Campo de Etiqueta */}
          <Box sx={{ mb: 3 }}>
            {editandoEtiqueta ? (
              <Stack spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  placeholder="Digite uma informação importante..."
                  value={etiqueta}
                  onChange={(e) => setEtiqueta(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.75rem'
                    }
                  }}
                />
                <Stack direction="row" spacing={1} justifyContent="space-between">
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setEtiqueta('');
                      handleSalvarEtiqueta();
                    }}
                  >
                    Remover
                  </Button>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setEtiqueta(programa.etiqueta || '');
                        setEditandoEtiqueta(false);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleSalvarEtiqueta}
                    >
                      Salvar
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            ) : (
              <Box
                onClick={() => setEditandoEtiqueta(true)}
                sx={{
                  p: 1.5,
                  border: '1px dashed',
                  borderColor: etiqueta ? 'warning.main' : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  cursor: 'pointer',
                  minHeight: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: etiqueta ? 'rgba(255, 167, 38, 0.05)' : 'transparent',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'warning.main',
                    bgcolor: 'rgba(255, 167, 38, 0.1)'
                  }
                }}
              >
                {etiqueta ? (
                  <Stack spacing={0.5} sx={{ width: '100%' }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Info sx={{ fontSize: 14, color: 'warning.main' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'warning.main' }}>
                        Informação Importante
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {etiqueta.length > 50 ? `${etiqueta.substring(0, 50)}...` : etiqueta}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Clique para adicionar informação importante
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {/* Botões de Ação */}
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              startIcon={<Person />}
              sx={{
                flex: 1,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
              onClick={() => onManageCPF(programa)}
            >
              Gerenciar CPF
            </Button>
            <IconButton size="small" color="inherit">
              <MoreVert />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente de Dialog para Gerenciar CPFs
const GerenciarCPFDialog = ({ open, onClose, programa }) => {
  const [cpfs, setCpfs] = useState(cpfData.filter(cpf => cpf.programa === programa?.programa));
  const [novoCPF, setNovoCPF] = useState('');

  const handleAdicionarCPF = () => {
    if (novoCPF.trim()) {
      const novoId = Math.max(...cpfs.map(c => c.id), 0) + 1;
      setCpfs([...cpfs, {
        id: novoId,
        nome: 'NOVO CPF',
        programa: programa.programa,
        cpf: novoCPF,
        dataCadastro: new Date().toISOString().split('T')[0],
        dataUltimoUso: null,
        status: 'ativo',
        alertas: []
      }]);
      setNovoCPF('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Group />
          <Box>
            <Typography variant="h6">Gerenciar CPFs</Typography>
            <Typography variant="body2" color="text.secondary">
              {programa?.nome} - {programa?.programa}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        {/* Adicionar Novo CPF */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Novo CPF"
              value={novoCPF}
              onChange={(e) => setNovoCPF(e.target.value)}
              placeholder="000.000.000-00"
              size="small"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdicionarCPF}
              disabled={!novoCPF.trim()}
            >
              Adicionar
            </Button>
          </Stack>
        </Paper>

        {/* Lista de CPFs */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CPF</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Data Cadastro</TableCell>
                <TableCell>Último Uso</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Etiqueta</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cpfs.map((cpf) => (
                <TableRow key={cpf.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {cpf.cpf}
                    </Typography>
                  </TableCell>
                  <TableCell>{cpf.nome}</TableCell>
                  <TableCell>{cpf.dataCadastro}</TableCell>
                  <TableCell>{cpf.dataUltimoUso || 'Nunca usado'}</TableCell>
                  <TableCell>
                    <Chip
                      label={cpf.status}
                      size="small"
                      color={cpf.status === 'ativo' ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    {cpf.etiqueta ? (
                      <Tooltip title={cpf.etiqueta} arrow>
                        <Chip
                          label={cpf.etiqueta.length > 30 ? `${cpf.etiqueta.substring(0, 30)}...` : cpf.etiqueta}
                          size="small"
                          color="warning"
                          icon={<Info />}
                          sx={{ maxWidth: 200 }}
                        />
                      </Tooltip>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Sem etiqueta
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

const ControleCPF = () => {
  const { user } = useAuth();
  const [programas, setProgramas] = useState([
    { id: 1, nome: 'THYAGO', programa: 'Smiles (GOL)', cpfUsados: 8, etiqueta: 'Conta com limite próximo do vencimento - renovar até 31/12/2024' },
    { id: 2, nome: 'ADRIANA DE PAULA', programa: 'LATAM Pass', cpfUsados: 12, etiqueta: '' },
    { id: 3, nome: 'WALLAS', programa: 'Azul Fidelidade', cpfUsados: 3, etiqueta: 'Beneficiário fixo - alteração só após 60 dias' },
    { id: 4, nome: 'VALMIR', programa: 'Smiles (GOL)', cpfUsados: 23, etiqueta: 'ATENÇÃO: Apenas 2 CPFs restantes! Usar com cuidado' },
    { id: 5, nome: 'CARLOS', programa: 'LATAM Pass', cpfUsados: 5, etiqueta: '' }
  ]);
  
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [busca, setBusca] = useState('');
  const [programaSelecionado, setProgramaSelecionado] = useState(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  // Carregar etiquetas do banco de dados ao iniciar
  useEffect(() => {
    const carregarEtiquetas = async () => {
      try {
        console.log('🔄 Carregando etiquetas do banco de dados...');
        const response = await listarCPFs();
        
        if (response.success && response.data) {
          console.log('✅ Etiquetas carregadas do banco:', response.data.length);
          
          // Criar mapa de etiquetas por nome+programa
          const etiquetasMap = {};
          response.data.forEach(cpf => {
            if (cpf.etiqueta) {
              // Criar chave única baseada em nome+programa
              const chave = `${cpf.nome}_${cpf.programaNome}`;
              etiquetasMap[chave] = cpf.etiqueta;
            }
          });
          
          // Atualizar programas com as etiquetas do banco
          setProgramas(prev => prev.map(p => {
            const chave = `${p.nome}_${p.programa}`;
            return {
              ...p,
              etiqueta: etiquetasMap[chave] || p.etiqueta || ''
            };
          }));
        }
      } catch (error) {
        console.error('⚠️ Erro ao carregar etiquetas do banco:', error);
        
        // Fallback: carregar do localStorage
        const etiquetasSalvas = localStorage.getItem('etiquetas_cpf');
        if (etiquetasSalvas) {
          try {
            const etiquetas = JSON.parse(etiquetasSalvas);
            setProgramas(prev => prev.map(p => ({
              ...p,
              etiqueta: etiquetas[p.id] || p.etiqueta || ''
            })));
            console.log('✅ Etiquetas carregadas do localStorage (backup)');
          } catch (error) {
            console.error('Erro ao carregar etiquetas do localStorage:', error);
          }
        }
      }
    };
    
    // Aguardar programas serem carregados antes de carregar etiquetas
    if (programas.length > 0) {
      carregarEtiquetas();
    }
  }, [programas.length]);

  const handleUpdateEtiqueta = async (id, etiqueta) => {
    try {
      // Encontrar o programa completo
      const programa = programas.find(p => p.id === id);
      
      if (!programa) {
        throw new Error('Programa não encontrado');
      }
      
      // Preparar dados do CPF para enviar ao backend
      const cpfData = {
        nome: programa.nome,
        cpf: `${id}.000.000-00`, // CPF temporário baseado no ID
        programaNome: programa.programa,
        categoria: programasConfig[programa.programa]?.categoria || 'Outros',
        cpfUsados: programa.cpfUsados,
        limiteCPF: programasConfig[programa.programa]?.limiteCPF || null,
        milhas: 0,
        cm: 0,
        valor: 0,
        status: 'ativo',
        favorito: false
      };
      
      // Atualizar no banco de dados (cria automaticamente se não existir)
      await atualizarEtiqueta(id, etiqueta, cpfData);
      
      // Atualizar estado local
      setProgramas(prev => prev.map(p => 
        p.id === id ? { ...p, etiqueta } : p
      ));
      
      // Também salvar no localStorage como backup
      const etiquetas = {};
      programas.forEach(p => {
        if (p.id === id) {
          etiquetas[p.id] = etiqueta;
        } else if (p.etiqueta) {
          etiquetas[p.id] = p.etiqueta;
        }
      });
      localStorage.setItem('etiquetas_cpf', JSON.stringify(etiquetas));
      
      console.log('✅ Etiqueta salva no banco de dados com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar etiqueta no banco:', error);
      
      // Em caso de erro, salvar apenas no localStorage
      setProgramas(prev => {
        const novoProgramas = prev.map(p => 
          p.id === id ? { ...p, etiqueta } : p
        );
        
        const etiquetas = {};
        novoProgramas.forEach(p => {
          if (p.etiqueta) {
            etiquetas[p.id] = p.etiqueta;
          }
        });
        localStorage.setItem('etiquetas_cpf', JSON.stringify(etiquetas));
        
        return novoProgramas;
      });
      
      alert('⚠️ Erro ao salvar no banco de dados. Verifique se o servidor está rodando.\n\nSalvo localmente como backup.');
    }
  };

  const categorias = [
    { value: 'todos', label: 'Todos', count: programas.length },
    { value: 'Nacional', label: 'Nacionais', count: programas.filter(p => programasConfig[p.programa]?.categoria === 'Nacional').length },
    { value: 'Internacional', label: 'Internacionais', count: programas.filter(p => programasConfig[p.programa]?.categoria === 'Internacional').length },
    { value: 'Bancário', label: 'Bancários', count: programas.filter(p => programasConfig[p.programa]?.categoria === 'Bancário').length },
    { value: 'Hotel', label: 'Hotéis', count: programas.filter(p => programasConfig[p.programa]?.categoria === 'Hotel').length },
    { value: 'Outros', label: 'Outros', count: programas.filter(p => programasConfig[p.programa]?.categoria === 'Outros').length }
  ];

  const programasFiltrados = programas
    .filter(programa => {
      const matchCategoria = filtroCategoria === 'todos' || programasConfig[programa.programa]?.categoria === filtroCategoria;
      const matchBusca = busca === '' || 
        programa.nome.toLowerCase().includes(busca.toLowerCase()) ||
        programa.programa.toLowerCase().includes(busca.toLowerCase());
      return matchCategoria && matchBusca;
    });

  const handleGerenciarCPF = (programa) => {
    setProgramaSelecionado(programa);
    setDialogAberto(true);
  };

  const handleFecharDialog = () => {
    setDialogAberto(false);
    setProgramaSelecionado(null);
  };

  // Calcular alertas de vencimento
  const alertasVencimento = programas
    .filter(p => {
      const config = programasConfig[p.programa];
      return config && config.tipoLimite === 'ano_calendario';
    })
    .map(p => {
      const dias = calcularDiasVencimento(p.programa);
      return { programa: p, dias };
    })
    .filter(a => a.dias <= 30);

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #0A0B1E 0%, #1A1B2E 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, background: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              Controle de CPF
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitoramento completo de limites de CPF por programa de fidelidade
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #33DDFF 0%, #818CF8 100%)',
              }
            }}
          >
            Novo Programa
          </Button>
        </Stack>
      </motion.div>

      {/* Alertas de Vencimento */}
      {alertasVencimento.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>⚠️ Alertas de Vencimento</AlertTitle>
            {alertasVencimento.map((alerta, index) => (
              <Typography key={index} variant="body2">
                • {alerta.programa.nome} ({alerta.programa.programa}) - Vence em {alerta.dias} dias
              </Typography>
            ))}
          </Alert>
        </motion.div>
      )}

      {/* Filtros e Busca */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper
          sx={{
            p: 3,
            mb: 3,
            background: 'linear-gradient(145deg, #1A1B2E 0%, #252741 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Buscar por nome ou programa..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            <ToggleButtonGroup
              value={filtroCategoria}
              exclusive
              onChange={(e, value) => value && setFiltroCategoria(value)}
              size="small"
            >
              {categorias.map(cat => (
                <ToggleButton key={cat.value} value={cat.value}>
                  {cat.label} ({cat.count})
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
        </Paper>
      </motion.div>

      {/* Grid de Programas */}
      <Grid container spacing={3}>
        {programasFiltrados.map((programa, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={programa.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProgramaCard
                programa={programa}
                cpfUsados={programa.cpfUsados}
                onManageCPF={handleGerenciarCPF}
                onUpdateEtiqueta={handleUpdateEtiqueta}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Resumo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Paper
          sx={{
            p: 3,
            mt: 4,
            background: 'linear-gradient(145deg, #1A1B2E 0%, #252741 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Resumo do Monitoramento
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {programas.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Programas Monitorados
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                  {alertasVencimento.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Alertas de Vencimento
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.main' }}>
                  {programas.filter(p => {
                    const config = programasConfig[p.programa];
                    return config?.limiteCPF && (p.cpfUsados / config.limiteCPF) >= 0.9;
                  }).length}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Próximo do Limite
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {programas.filter(p => {
                    const config = programasConfig[p.programa];
                    return !config?.limiteCPF || (p.cpfUsados / config.limiteCPF) < 0.5;
                  }).length}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Dentro do Limite
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Dialog de Gerenciamento */}
      <GerenciarCPFDialog
        open={dialogAberto}
        onClose={handleFecharDialog}
        programa={programaSelecionado}
      />
    </Box>
  );
};

export default ControleCPF;
