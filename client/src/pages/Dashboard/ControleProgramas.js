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
  CircularProgress,
  Alert
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
  StarBorder
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getAllCPFs, getAllProgramas } from '../../data/cpfData';
import { programsAPI } from '../../services/api';
import { listarCPFs, atualizarEtiqueta } from '../../services/cpfControlAPI';

// Dados dos programas baseados na sua descrição
const programasData = [
  // Programas da imagem original
  {
    id: 1,
    nome: 'THYAGO',
    cpf: '12345678901',
    programa: 'Smiles (GOL)',
    tipo: 'nacional',
    logo: 'smiles',
    milhas: 8049,
    cm: 16.00,
    valor: 128.78,
    limiteCPF: 25,
    cpfUsados: 0,
    corLimite: '#2196F3',
    corLimiteUsado: '#f44336',
    status: 'ativo',
    favorito: false,
    categoria: 'Nacional',
    descricao: 'Acumular e resgatar milhas para voos da GOL e mais de 50 companhias aéreas parceiras',
    etiqueta: 'Conta com limite próximo do vencimento - renovar até 31/12/2024'
  },
  {
    id: 2,
    nome: 'ADRIANA DE PAULA',
    cpf: '98765432102',
    programa: 'LATAM Pass',
    tipo: 'nacional',
    logo: 'latam',
    milhas: 5320,
    cm: 14.68,
    valor: 78.12,
    limiteCPF: 24,
    cpfUsados: 8,
    corLimite: '#2196F3',
    corLimiteUsado: '#f44336',
    status: 'ativo',
    favorito: true,
    categoria: 'Nacional',
    descricao: 'Acumular e resgatar pontos para voos da LATAM e companhias parceiras',
    etiqueta: ''
  },
  {
    id: 3,
    nome: 'WALLAS',
    cpf: '11122233344',
    programa: 'Azul Fidelidade',
    tipo: 'nacional',
    logo: 'azul',
    milhas: 4410,
    cm: 26.88,
    valor: 118.55,
    limiteCPF: 5,
    cpfUsados: 3,
    corLimite: '#2196F3',
    corLimiteUsado: '#f44336',
    status: 'ativo',
    favorito: false,
    categoria: 'Nacional',
    descricao: 'Acumular e resgatar pontos para voos da Azul e companhias parceiras',
    etiqueta: 'Beneficiário fixo - alteração só após 60 dias'
  },
  {
    id: 4,
    nome: 'VALMIR',
    programa: 'Smiles (GOL)',
    tipo: 'nacional',
    logo: 'smiles',
    milhas: 4410,
    cm: 26.88,
    valor: 118.55,
    limiteCPF: 25,
    cpfUsados: 23,
    corLimite: '#2196F3',
    corLimiteUsado: '#f44336',
    status: 'alerta',
    favorito: false,
    categoria: 'Nacional',
    descricao: 'Acumular e resgatar milhas para voos da GOL e mais de 50 companhias aéreas parceiras',
    etiqueta: 'ATENÇÃO: Apenas 2 CPFs restantes! Usar com cuidado'
  },
  {
    id: 5,
    nome: 'CARLOS',
    programa: 'LATAM Pass',
    tipo: 'nacional',
    logo: 'latam',
    milhas: 73,
    cm: 16.63,
    valor: 1.21,
    limiteCPF: 24,
    cpfUsados: 5,
    corLimite: '#2196F3',
    corLimiteUsado: '#f44336',
    status: 'ativo',
    favorito: true,
    categoria: 'Nacional',
    descricao: 'Acumular e resgatar pontos para voos da LATAM e companhias parceiras',
    etiqueta: ''
  }
];

// Usar apenas os dados dos CPFs cadastrados
const todosProgramasData = programasData;

// Componente de Card de Programa
const ProgramaCard = ({ programa, onEdit, onDelete, onToggleFavorite, onUpdateEtiqueta }) => {
  const [etiqueta, setEtiqueta] = React.useState(programa.etiqueta || '');
  const [editandoEtiqueta, setEditandoEtiqueta] = React.useState(false);
  
  const isNacional = programa.tipo === 'nacional';
  const limiteRestante = isNacional ? programa.limiteCPF - programa.cpfUsados : null;
  const percentualLimite = isNacional ? (programa.cpfUsados / programa.limiteCPF) * 100 : 0;

  const handleSalvarEtiqueta = () => {
    if (onUpdateEtiqueta) {
      onUpdateEtiqueta(programa.id, etiqueta);
    }
    setEditandoEtiqueta(false);
  };

  const getStatusColor = () => {
    if (!isNacional) return 'success';
    if (percentualLimite >= 90) return 'error';
    if (percentualLimite >= 70) return 'warning';
    return 'success';
  };

  const getStatusIcon = () => {
    if (!isNacional) return <CheckCircle />;
    if (percentualLimite >= 90) return <Warning />;
    if (percentualLimite >= 70) return <Info />;
    return <CheckCircle />;
  };

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
                {programa.etiqueta && (
                  <Tooltip title={programa.etiqueta} arrow placement="top">
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
              onClick={() => onToggleFavorite(programa.id)}
              sx={{ color: programa.favorito ? '#f44336' : 'text.secondary' }}
            >
              {programa.favorito ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Stack>

          {/* Logo e Status */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              {/* Logo placeholder - você pode adicionar logos reais aqui */}
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: programa.categoria === 'Nacional' ? 'primary.main' : 
                           programa.categoria === 'Internacional' ? 'secondary.main' :
                           programa.categoria === 'Bancário' ? 'success.main' : 'warning.main',
                  mx: 'auto',
                  mb: 1
                }}
              >
                {programa.categoria === 'Nacional' ? <FlightTakeoff /> :
                 programa.categoria === 'Internacional' ? <Flight /> :
                 programa.categoria === 'Bancário' ? <AccountBalance /> : <Hotel />}
              </Avatar>
            </Box>

            {/* Limite de CPF para programas nacionais */}
            {isNacional && (
              <Box sx={{ minWidth: 80 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={percentualLimite}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: percentualLimite >= 90 ? 'error.main' : percentualLimite >= 70 ? 'warning.main' : 'primary.main',
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {programa.cpfUsados}/{programa.limiteCPF}
                  </Typography>
                </Stack>
              </Box>
            )}
          </Stack>

          {/* Métricas */}
          <Stack spacing={2} mb={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">Milhas</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {programa.milhas.toLocaleString('pt-BR')}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">CM</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {programa.cm.toFixed(2).replace('.', ',')}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">R$</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {programa.valor.toFixed(2).replace('.', ',')}
              </Typography>
            </Stack>
          </Stack>

          {/* Status */}
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={2}>
            {getStatusIcon()}
            <Typography variant="caption" color={`${getStatusColor()}.main`}>
              {isNacional ? `${limiteRestante} CPFs restantes` : 'Sem limite'}
            </Typography>
          </Stack>

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
              startIcon={<Add />}
              sx={{
                flex: 1,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              Comprar
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<SwapHoriz />}
              sx={{ flex: 1 }}
            >
              Vender
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

const ControleProgramas = () => {
  const { user } = useAuth();
  const [programas, setProgramas] = useState([]);
  const [programasDisponiveis, setProgramasDisponiveis] = useState([]);
  const [loadingProgramas, setLoadingProgramas] = useState(true);
  const [errorProgramas, setErrorProgramas] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroPrograma, setFiltroPrograma] = useState('todos');
  const [filtroPessoa, setFiltroPessoa] = useState('');
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('nome');

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
        const etiquetasSalvas = localStorage.getItem('etiquetas_programas');
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

  // Carregar programas disponíveis do banco de dados
  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        setLoadingProgramas(true);
        const response = await programsAPI.getPrograms();
        setProgramasDisponiveis(response.data.data);
        setErrorProgramas(null);
      } catch (error) {
        console.error('Erro ao carregar programas:', error);
        setErrorProgramas(`Erro ao carregar programas: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoadingProgramas(false);
      }
    };

    fetchProgramas();
  }, []);

  // Carregar CPFs cadastrados
  useEffect(() => {
    const cpfsData = getAllCPFs();
    setProgramas(cpfsData);
  }, []);

  const categorias = [
    { value: 'todos', label: 'Todos', count: programas.length },
    { value: 'Nacional', label: 'Nacionais', count: programas.filter(p => p.categoria === 'Nacional').length },
    { value: 'Internacional', label: 'Internacionais', count: programas.filter(p => p.categoria === 'Internacional').length },
    { value: 'Bancário', label: 'Bancários', count: programas.filter(p => p.categoria === 'Bancário').length },
    { value: 'Hotel', label: 'Hotéis', count: programas.filter(p => p.categoria === 'Hotel').length },
    { value: 'Varejo', label: 'Varejo', count: programas.filter(p => p.categoria === 'Varejo').length },
    { value: 'Outros', label: 'Outros', count: programas.filter(p => p.categoria === 'Outros').length }
  ];

  // Lista única de programas para o filtro - agora vem do banco
  const listaProgramas = programasDisponiveis.map(p => p.nome).sort();

  const programasFiltrados = programas
    .filter(programa => {
      const matchCategoria = filtroCategoria === 'todos' || programa.categoria === filtroCategoria;
      const matchPrograma = filtroPrograma === 'todos' || programa.programa === filtroPrograma;
      const matchPessoa = filtroPessoa === '' || 
        programa.nome.toLowerCase().includes(filtroPessoa.toLowerCase()) ||
        (programa.cpf && programa.cpf.includes(filtroPessoa.replace(/\D/g, '')));
      const matchBusca = busca === '' || 
        programa.nome.toLowerCase().includes(busca.toLowerCase()) ||
        programa.programa.toLowerCase().includes(busca.toLowerCase()) ||
        (programa.cpf && programa.cpf.includes(busca.replace(/\D/g, '')));
      return matchCategoria && matchPrograma && matchPessoa && matchBusca;
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'milhas':
          return b.milhas - a.milhas;
        case 'valor':
          return b.valor - a.valor;
        default:
          return 0;
      }
    });

  const handleToggleFavorite = (id) => {
    setProgramas(prev => prev.map(p => 
      p.id === id ? { ...p, favorito: !p.favorito } : p
    ));
  };

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
        cpf: programa.cpf,
        programaNome: programa.programa,
        categoria: programa.categoria,
        cpfUsados: programa.cpfUsados,
        limiteCPF: programa.limiteCPF,
        milhas: programa.milhas,
        cm: programa.cm,
        valor: programa.valor,
        status: programa.status,
        favorito: programa.favorito
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
      localStorage.setItem('etiquetas_programas', JSON.stringify(etiquetas));
      
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
        localStorage.setItem('etiquetas_programas', JSON.stringify(etiquetas));
        
        return novoProgramas;
      });
      
      alert('⚠️ Erro ao salvar no banco de dados. Verifique se o servidor está rodando.\n\nSalvo localmente como backup.');
    }
  };

  const handleEdit = (id) => {
    console.log('Editar programa:', id);
  };

  const handleDelete = (id) => {
    console.log('Deletar programa:', id);
  };

  return (
    <Box sx={{ p: 2, background: 'linear-gradient(135deg, #0A0B1E 0%, #1A1B2E 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, background: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              Controle de Programas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerenciamento completo de programas de milhas, pontos e fidelidade
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
          <Stack spacing={2}>
            {/* Linha 1: Busca geral */}
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
            </Stack>

            {/* Linha 2: Filtros específicos */}
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                select
                size="small"
                label="Filtrar por Programa"
                value={filtroPrograma}
                onChange={(e) => setFiltroPrograma(e.target.value)}
                sx={{ minWidth: 250 }}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="todos">Todos os Programas</option>
                {listaProgramas.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </TextField>

              <TextField
                size="small"
                label="Filtrar por CPF ou Nome"
                placeholder="Digite o CPF ou nome da pessoa..."
                value={filtroPessoa}
                onChange={(e) => setFiltroPessoa(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1 }}
              />

              {(filtroPrograma !== 'todos' || filtroPessoa !== '') && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setFiltroPrograma('todos');
                    setFiltroPessoa('');
                  }}
                  startIcon={<FilterList />}
                >
                  Limpar Filtros
                </Button>
              )}
            </Stack>

            {/* Linha 3: Categorias */}
            <Stack direction="row" spacing={2} alignItems="center">
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
          </Stack>
        </Paper>
      </motion.div>


      {/* Contador de Resultados */}
      {(filtroPrograma !== 'todos' || filtroPessoa !== '' || busca !== '') && (
        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<Info />}
            label={`${programasFiltrados.length} programa(s) encontrado(s)`}
            color="primary"
            variant="outlined"
          />
        </Box>
      )}

      {/* Grid de Programas */}
      <Grid container spacing={2}>
        {programasFiltrados.length === 0 ? (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 8,
                textAlign: 'center',
                background: 'linear-gradient(145deg, #1A1B2E 0%, #252741 100%)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
            >
              <Warning sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhum programa encontrado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tente ajustar os filtros para encontrar o que procura
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setBusca('');
                  setFiltroPrograma('todos');
                  setFiltroPessoa('');
                  setFiltroCategoria('todos');
                }}
              >
                Limpar Todos os Filtros
              </Button>
            </Paper>
          </Grid>
        ) : (
          programasFiltrados.map((programa, index) => (
          <Grid item xs={12} sm={6} md={6} lg={4} key={programa.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProgramaCard
                programa={programa}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onUpdateEtiqueta={handleUpdateEtiqueta}
              />
            </motion.div>
          </Grid>
          ))
        )}
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
            Resumo dos Programas
          </Typography>
          <Grid container spacing={2}>
            {categorias.slice(1).map(cat => {
              const programasCategoria = programas.filter(p => p.categoria === cat.value);
              const totalMilhas = programasCategoria.reduce((sum, p) => sum + p.milhas, 0);
              const totalValor = programasCategoria.reduce((sum, p) => sum + p.valor, 0);
              
              return (
                <Grid item xs={12} sm={6} md={3} key={cat.value}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {programasCategoria.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {cat.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {totalMilhas.toLocaleString('pt-BR')} milhas
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      R$ {totalValor.toFixed(2).replace('.', ',')}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default ControleProgramas;
