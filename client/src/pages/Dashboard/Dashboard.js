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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  LinearProgress,
  Alert,
  Tooltip,
  Badge,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  CardActionArea,
  CardActions
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  FlightTakeoff,
  MoreVert,
  Refresh,
  Add,
  Download,
  FilterList,
  Notifications,
  Warning,
  CheckCircle,
  Schedule,
  AttachMoney,
  SwapHoriz,
  PersonAdd,
  Assessment,
  Timeline,
  Search,
  Clear,
  Visibility,
  Edit,
  Delete,
  Star,
  StarBorder,
  ShoppingCart,
  TransferWithinAStation,
  List,
  CalendarMonth,
  CalendarToday,
  CalendarToday as CalendarViewYear,
  TaskAlt,
  Assignment
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterMenu, setFilterMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('todos');
  const [selectedPerson, setSelectedPerson] = useState('todos');
  const [selectedTag, setSelectedTag] = useState('todos');
  const [sortBy, setSortBy] = useState('programa');
  const [resumoType, setResumoType] = useState('mensal'); // mensal, anual, total

  // Dados mockados baseados na imagem do iddas.com.br
  const [dashboardData, setDashboardData] = useState({
    resumo: {
      compras: 35401.46,
      vendas: 15612.87,
      recebimentos: 18943.00
    },
    tarefas: {
      total: 2,
      atrasadas: 0,
      proximosDias: 0,
      longoPrazo: 2
    },
    contas: [],
    etiquetas: ['VIP', 'Premium', 'Básico', 'Novo', 'Inativo']
  });

  // Lista completa de programas de fidelidade (como no iddas)
  const programasFidelidade = [
    'Todos', 'LATAM Pass', 'Smiles', 'TudoAzul', 'Livelo', 'LifeMiles',
    'Emirates Skywards', 'Delta SkyMiles', 'Flying Blue', 'British Executive Club',
    'Qatar Privilege Club', 'United Airlines', 'American Airlines', 'Air France',
    'KLM', 'Lufthansa', 'Swiss', 'Turkish Airlines', 'Aerolíneas Argentinas',
    'Aeroplan', 'Air Europa', 'Alaska Airlines', 'Iberia', 'TAP Miles&Go',
    'Virgin Red', 'World of Hyatt', 'Hilton Honors', 'Marriott Bonvoy',
    'IHG', 'Accor', 'Meliá', 'Itaú', 'Banco do Brasil', 'Bradesco', 'Caixa',
    'Santander', 'BTG Pactual', 'XP Investimentos', 'Nubank', 'Inter',
    'Safra', 'Sicredi', 'Unicred', 'Cresol', 'Coopera', 'Ailos',
    'Banrisul', 'BRB', 'Credicard', 'Banescard', 'BV Merece', 'Genial',
    'Nomad Pass', 'Porto Plus', 'Premmia', 'Qantas', 'Southwest',
    'Shell Box', 'Sisprime', 'Connect Miles', 'Curtaí', 'Dotz', 'Esfera',
    'Etihad Guest', 'Finnair Plus', 'GPA', 'IB', 'Membership Rewards',
    'Miles&Smiles Turkish', 'Volare - ITA Airways'
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Simular carregamento de dados
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados baseados na imagem do iddas.com.br
        const contasMockadas = [
          { id: 1, nome: 'ADRIANA', programa: 'Livelo', milhas: 29008, cm: 23.33, valor: 676.66, favorito: false },
          { id: 2, nome: 'ADRIANA DE PAULA', programa: 'Livelo', milhas: 974, cm: 29.09, valor: 28.33, favorito: false },
          { id: 3, nome: 'AIRAM', programa: 'Livelo', milhas: 590, cm: 23.53, valor: 13.88, favorito: false },
          { id: 4, nome: 'ALEX', programa: 'Livelo', milhas: 15000, cm: 25.50, valor: 382.50, favorito: true },
          { id: 5, nome: 'ANDRE', programa: 'Livelo', milhas: 8500, cm: 24.20, valor: 205.70, favorito: false },
          { id: 6, nome: 'BRUNA', programa: 'Livelo', milhas: 12000, cm: 26.80, valor: 321.60, favorito: false },
          { id: 7, nome: 'CAIO', programa: 'Livelo', milhas: 22000, cm: 22.45, valor: 493.90, favorito: true },
          { id: 8, nome: 'CARLOS', programa: 'Livelo', milhas: 18000, cm: 24.90, valor: 448.20, favorito: false },
          { id: 9, nome: 'CELIA', programa: 'Livelo', milhas: 7500, cm: 27.30, valor: 204.75, favorito: false },
          { id: 10, nome: 'FELIPE', programa: 'Livelo', milhas: 13500, cm: 25.80, valor: 348.30, favorito: false },
          { id: 11, nome: 'JENNIFER', programa: 'Livelo', milhas: 9500, cm: 26.50, valor: 251.75, favorito: false },
          { id: 12, nome: 'JULIANA', programa: 'Livelo', milhas: 16000, cm: 23.90, valor: 382.40, favorito: false },
          { id: 13, nome: 'LAUREN', programa: 'Livelo', milhas: 11000, cm: 25.20, valor: 277.20, favorito: false },
          { id: 14, nome: 'MARCELO', programa: 'Livelo', milhas: 20000, cm: 24.60, valor: 492.00, favorito: false },
          { id: 15, nome: 'MARCIO ALACE', programa: 'Livelo', milhas: 14000, cm: 26.10, valor: 365.40, favorito: false },
          { id: 16, nome: 'PABLO', programa: 'Livelo', milhas: 17000, cm: 25.40, valor: 431.80, favorito: false },
          { id: 17, nome: 'PEDRO DIAS', programa: 'Livelo', milhas: 12500, cm: 24.80, valor: 310.00, favorito: false },
          { id: 18, nome: 'PEDRO PAULO', programa: 'Livelo', milhas: 19000, cm: 23.70, valor: 450.30, favorito: true },
          { id: 19, nome: 'PEDRO SOARES', programa: 'Livelo', milhas: 13000, cm: 26.20, valor: 340.60, favorito: false },
          { id: 20, nome: 'PRISCILA', programa: 'Livelo', milhas: 10500, cm: 25.60, valor: 268.80, favorito: false }
        ];

        // Gerar contas adicionais para atingir 500+
        const nomesAdicionais = [
          'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Pereira',
          'Lucia Ferreira', 'Roberto Almeida', 'Fernanda Lima', 'Marcos Souza', 'Juliana Rocha',
          'Antonio Gomes', 'Patricia Dias', 'Ricardo Nunes', 'Camila Martins', 'Felipe Ribeiro'
        ];
        
        const programas = ['Livelo', 'LATAM Pass', 'Smiles', 'TudoAzul', 'LifeMiles'];

        for (let i = 21; i <= 500; i++) {
          const nomeIndex = Math.floor(Math.random() * nomesAdicionais.length);
          const programaIndex = Math.floor(Math.random() * programas.length);
          const milhas = Math.floor(Math.random() * 50000) + 1000;
          const cm = Math.random() * 10 + 20; // R$ 20-30 por milha
          const valor = (milhas * cm) / 1000;
          
          contasMockadas.push({
            id: i,
            nome: `${nomesAdicionais[nomeIndex]} ${i}`,
            programa: programas[programaIndex],
            milhas: milhas,
            cm: cm,
            valor: valor,
            favorito: Math.random() > 0.8
          });
        }

        setDashboardData({
          resumo: {
            compras: 35401.46,
            vendas: 15612.87,
            recebimentos: 18943.00
          },
          tarefas: {
            total: 2,
            atrasadas: 0,
            proximosDias: 0,
            longoPrazo: 2
          },
          contas: contasMockadas,
          etiquetas: ['VIP', 'Premium', 'Básico', 'Novo', 'Inativo']
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Filtrar contas baseado nos filtros
  const contasFiltradas = dashboardData.contas.filter(conta => {
    const matchesSearch = conta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conta.programa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = selectedProgram === 'todos' || conta.programa === selectedProgram;
    const matchesPerson = selectedPerson === 'todos' || conta.nome.includes(selectedPerson);
    const matchesTag = selectedTag === 'todos' || (conta.favorito && selectedTag === 'VIP');
    
    return matchesSearch && matchesProgram && matchesPerson && matchesTag;
  });

  // Ordenar contas
  const contasOrdenadas = [...contasFiltradas].sort((a, b) => {
    switch (sortBy) {
      case 'nome':
        return a.nome.localeCompare(b.nome);
      case 'programa':
        return a.programa.localeCompare(b.programa);
      case 'milhas_crescente':
        return a.milhas - b.milhas;
      case 'milhas_decrescente':
        return b.milhas - a.milhas;
      case 'valor_crescente':
        return a.valor - b.valor;
      case 'valor_decrescente':
        return b.valor - a.valor;
      default:
        return 0;
    }
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterOpen = (event) => {
    setFilterMenu(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterMenu(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Dashboard SS Milhas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Bem-vindo de volta, {user?.nome || 'Usuário'}! • {dashboardData.contas.length} contas cadastradas
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Atualizar">
            <IconButton onClick={() => window.location.reload()}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filtros e Pesquisa */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Pessoa</InputLabel>
                <Select
                  value={selectedPerson}
                  label="Pessoa"
                  onChange={(e) => setSelectedPerson(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  {Array.from(new Set(dashboardData.contas.map(c => c.nome.split(' ')[0])))
                    .sort().map(nome => (
                    <MenuItem key={nome} value={nome}>{nome}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Programa</InputLabel>
                <Select
                  value={selectedProgram}
                  label="Programa"
                  onChange={(e) => setSelectedProgram(e.target.value)}
                >
                  {programasFidelidade.map(programa => (
                    <MenuItem key={programa} value={programa === 'Todos' ? 'todos' : programa}>
                      {programa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Ordenação</InputLabel>
                <Select
                  value={sortBy}
                  label="Ordenação"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="programa">Programa</MenuItem>
                  <MenuItem value="nome">Nome</MenuItem>
                  <MenuItem value="milhas_crescente">Milhas Crescente</MenuItem>
                  <MenuItem value="milhas_decrescente">Milhas Decrescente</MenuItem>
                  <MenuItem value="valor_crescente">Valor Crescente</MenuItem>
                  <MenuItem value="valor_decrescente">Valor Decrescente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Etiqueta</InputLabel>
                <Select
                  value={selectedTag}
                  label="Etiqueta"
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  {dashboardData.etiquetas.map(etiqueta => (
                    <MenuItem key={etiqueta} value={etiqueta}>{etiqueta}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button 
                variant="contained" 
                fullWidth
                startIcon={<Search />}
                size="small"
              >
                Pesquisar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Botões de Resumo */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={resumoType}
          exclusive
          onChange={(e, newValue) => newValue && setResumoType(newValue)}
          size="small"
        >
          <ToggleButton value="mensal">
            <CalendarToday sx={{ mr: 1 }} />
            Resumo Mensal
          </ToggleButton>
          <ToggleButton value="anual">
            <CalendarMonth sx={{ mr: 1 }} />
            Resumo Anual
          </ToggleButton>
          <ToggleButton value="total">
            <CalendarViewYear sx={{ mr: 1 }} />
            Resumo Total
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Cards de Resumo Financeiro */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Compras
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                R$ {dashboardData.resumo.compras.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Vendas
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                R$ {dashboardData.resumo.vendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Recebimentos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                R$ {dashboardData.resumo.recebimentos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Banner de Tarefas */}
      <Alert 
        severity="info" 
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small" startIcon={<TaskAlt />}>
            Ver Tarefas
          </Button>
        }
      >
        <Typography variant="body2">
          Você possui <strong>{dashboardData.tarefas.total} tarefas</strong> • 
          {dashboardData.tarefas.atrasadas} atrasada(s) • 
          {dashboardData.tarefas.proximosDias} nos próximos dias • 
          {dashboardData.tarefas.longoPrazo} longo prazo
        </Typography>
      </Alert>

      {/* Grid de Contas - Cards Individuais */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Contas Cadastradas ({contasFiltradas.length} de {dashboardData.contas.length})
        </Typography>
        
        <Grid container spacing={2}>
          {contasOrdenadas.slice(0, 24).map((conta) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={conta.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <CardActionArea sx={{ flexGrow: 1 }}>
                  <CardContent sx={{ pb: 1 }}>
                    {/* Header do Card */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '1rem',
                          color: conta.favorito ? 'warning.main' : 'text.primary'
                        }}
                      >
                        {conta.nome} {conta.favorito && '★'}
                      </Typography>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: 'primary.main',
                          fontSize: '0.875rem'
                        }}
                      >
                        {conta.programa.charAt(0)}
                      </Avatar>
                    </Box>

                    {/* Programa */}
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={conta.programa}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>

                    {/* Informações Financeiras */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Milhas:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {conta.milhas.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          CM:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          R$ {conta.cm.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          R$:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>

                {/* Ações */}
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    startIcon={<ShoppingCart />}
                    variant="outlined"
                    color="success"
                    sx={{ flexGrow: 1, fontSize: '0.75rem' }}
                  >
                    + Comprar
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<TransferWithinAStation />}
                    variant="outlined"
                    color="warning"
                    sx={{ flexGrow: 1, fontSize: '0.75rem' }}
                  >
                    - Transferir
                  </Button>
                  <IconButton size="small">
                    <List />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Botão para carregar mais */}
        {contasOrdenadas.length > 24 && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<Add />}
            >
              Carregar Mais Contas ({contasOrdenadas.length - 24} restantes)
            </Button>
          </Box>
        )}
      </Box>

    </Box>
  );
};

export default Dashboard;