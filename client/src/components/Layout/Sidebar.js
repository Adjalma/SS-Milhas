import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Badge
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  TaskAlt,
  ExpandLess,
  ExpandMore,
  ArrowDownward,
  ArrowUpward,
  SwapHoriz,
  TransferWithinAStation,
  Schedule,
  Flight,
  FlightTakeoff,
  Remove,
  Receipt,
  Assessment,
  Person,
  AccountBalance,
  CreditCard,
  EmojiEvents,
  Business,
  People,
  RequestQuote,
  Description,
  Help,
  Search,
  Clear,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  CompareArrows,
  CheckCircle,
  ShowChart,
  PersonAdd,
  AccountBalanceWallet,
  LocalOffer,
  Receipt as ReceiptIcon,
  PlayArrow,
  HelpOutline,
  Message,
  SmartToy,
  Psychology,
  Settings,
  Group
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    movimentacoes: true,
    relatorios: true,
    financeiro: true,
    cadastros: true,
    servicos: true,
    ajuda: true
  });
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      badge: null
    },
    {
      id: 'tarefas',
      label: 'Tarefas',
      icon: <TaskAlt />,
      path: '/tarefas',
      badge: 2
    },
    {
      id: 'movimentacoes',
      label: 'Movimentações',
      icon: <SwapHoriz />,
      expandable: true,
      items: [
        {
          id: 'compra-entrada',
          label: 'Compra (Entrada)',
          icon: <ArrowDownward />,
          path: '/movimentacoes/compra-entrada'
        },
        {
          id: 'compra-bonificada',
          label: 'Compra Bonificada',
          icon: <ArrowDownward />,
          path: '/movimentacoes/compra-bonificada'
        },
        {
          id: 'transferencia',
          label: 'Transferência',
          icon: <SwapHoriz />,
          path: '/movimentacoes/transferencia'
        },
        {
          id: 'transferencia-pessoas',
          label: 'Transf. entre Pessoas',
          icon: <TransferWithinAStation />,
          path: '/movimentacoes/transferencia-pessoas'
        },
        {
          id: 'agendamento',
          label: 'Agendamento',
          icon: <Schedule />,
          path: '/movimentacoes/agendamento'
        },
        {
          id: 'venda',
          label: 'Venda',
          icon: <ArrowUpward />,
          path: '/movimentacoes/venda'
        },
        {
          id: 'processos',
          label: 'Processos',
          icon: <Assignment />,
          path: '/movimentacoes/processos'
        },
        {
          id: 'saida-manual',
          label: 'Saída Manual',
          icon: <Remove />,
          path: '/movimentacoes/saida-manual'
        },
        {
          id: 'passagem',
          label: 'Passagem',
          icon: <FlightTakeoff />,
          path: '/movimentacoes/passagem'
        }
      ]
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: <Assessment />,
      expandable: true,
      items: [
        {
          id: 'passagens',
          label: 'Passagens',
          icon: <Flight />,
          path: '/relatorios/passagens'
        },
        {
          id: 'controle-cpf',
          label: 'Controle de CPF',
          icon: <Person />,
          path: '/relatorios/controle-cpf'
        },
        {
          id: 'transferencias',
          label: 'Transferências',
          icon: <SwapHoriz />,
          path: '/relatorios/transferencias'
        },
        {
          id: 'vendas',
          label: 'Vendas',
          icon: <AttachMoney />,
          path: '/relatorios/vendas'
        },
        {
          id: 'resumo',
          label: 'Resumo',
          icon: <Receipt />,
          path: '/relatorios/resumo'
        },
        {
          id: 'grafico-lucro',
          label: 'Gráfico de Lucro',
          icon: <TrendingUp />,
          path: '/relatorios/grafico-lucro'
        },
        {
          id: 'evolucao',
          label: 'Evolução',
          icon: <ShowChart />,
          path: '/relatorios/evolucao'
        }
      ]
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: <AccountBalance />,
      expandable: true,
      items: [
        {
          id: 'fluxo-caixa',
          label: 'Fluxo de Caixa',
          icon: <CompareArrows />,
          path: '/financeiro/fluxo-caixa'
        },
        {
          id: 'receitas',
          label: 'Receitas',
          icon: <TrendingUp />,
          path: '/financeiro/receitas'
        },
        {
          id: 'despesas',
          label: 'Despesas',
          icon: <TrendingDown />,
          path: '/financeiro/despesas'
        },
        {
          id: 'transferencia-financeira',
          label: 'Transferência',
          icon: <SwapHoriz />,
          path: '/financeiro/transferencia'
        },
        {
          id: 'conciliacao',
          label: 'Conciliação',
          icon: <CheckCircle />,
          path: '/financeiro/conciliacao'
        }
      ]
    },
    {
      id: 'cadastros',
      label: 'Cadastros',
      icon: <PersonAdd />,
      expandable: true,
      items: [
        {
          id: 'pessoa',
          label: 'Pessoa',
          icon: <Person />,
          path: '/cadastros/pessoa'
        },
        {
          id: 'conta-bancaria',
          label: 'Conta Bancária',
          icon: <AccountBalanceWallet />,
          path: '/cadastros/conta-bancaria'
        },
        {
          id: 'cartao',
          label: 'Cartão',
          icon: <CreditCard />,
          path: '/cadastros/cartao'
        },
        {
          id: 'clubes',
          label: 'Clubes',
          icon: <EmojiEvents />,
          path: '/cadastros/clubes'
        },
        {
          id: 'programas',
          label: 'Programas',
          icon: <Business />,
          path: '/cadastros/programas'
        },
        {
          id: 'cliente',
          label: 'Cliente',
          icon: <People />,
          path: '/cadastros/cliente'
        },
        {
          id: 'etiqueta',
          label: 'Etiqueta',
          icon: <LocalOffer />,
          path: '/cadastros/etiqueta'
        }
      ]
    },
    {
      id: 'servicos',
      label: 'Serviços',
      icon: <Description />,
      expandable: true,
      items: [
        {
          id: 'orcamentos',
          label: 'Orçamentos',
          icon: <RequestQuote />,
          path: '/servicos/orcamentos'
        },
        {
          id: 'recibos',
          label: 'Recibos',
          icon: <ReceiptIcon />,
          path: '/servicos/recibos'
        }
      ]
    },
      {
        id: 'ajuda',
        label: 'Ajuda',
        icon: <Help />,
        expandable: true,
        items: [
          {
            id: 'tutoriais',
            label: 'Tutoriais',
            icon: <PlayArrow />,
            path: '/ajuda/tutoriais'
          },
          {
            id: 'ticket',
            label: 'Ticket',
            icon: <HelpOutline />,
            path: '/ajuda/ticket'
          },
          {
            id: 'whatsapp',
            label: 'WhatsApp',
            icon: <Message />,
            path: '/ajuda/whatsapp'
          }
        ]
      },
      {
        id: 'configuracoes',
        label: 'Configurações',
        icon: <Settings />,
        expandable: true,
        items: [
          {
            id: 'usuarios',
            label: 'Gerenciar Usuários',
            icon: <Group />,
            path: '/configuracoes/usuarios'
          },
          {
            id: 'perfil',
            label: 'Perfil',
            icon: <Person />,
            path: '/configuracoes/perfil'
          }
        ]
      },
      {
        id: 'ia',
        label: 'IA & Automação',
        icon: <SmartToy />,
        expandable: true,
        items: [
          {
            id: 'dashboard-ai',
            label: 'Dashboard IA',
            icon: <Psychology />,
            path: '/ai/dashboard'
          }
        ]
      }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.items && item.items.some(subItem => 
      subItem.label.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const renderMenuItem = (item) => {
    const isActive = location.pathname === item.path;
    const isExpanded = expandedSections[item.id];

    if (item.expandable) {
      return (
        <React.Fragment key={item.id}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => toggleSection(item.id)}>
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'primary.main' : 'text.primary'
                }}
              />
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.items.map((subItem) => {
                const isSubActive = location.pathname === subItem.path;
                return (
                  <ListItem key={subItem.id} disablePadding>
                    <ListItemButton 
                      sx={{ pl: 4 }}
                      onClick={() => handleNavigation(subItem.path)}
                    >
                      <ListItemIcon sx={{ 
                        color: isSubActive ? 'primary.main' : 'text.secondary',
                        minWidth: 36
                      }}>
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={subItem.label}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isSubActive ? 600 : 400,
                          color: isSubActive ? 'primary.main' : 'text.secondary'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    return (
      <ListItem key={item.id} disablePadding>
        <ListItemButton 
          onClick={() => handleNavigation(item.path)}
          sx={{
            backgroundColor: isActive ? 'primary.light' : 'transparent',
            '&:hover': {
              backgroundColor: isActive ? 'primary.light' : 'action.hover'
            }
          }}
        >
          <ListItemIcon sx={{ 
            color: isActive ? 'primary.main' : 'text.secondary',
            minWidth: 36
          }}>
            {item.badge ? (
              <Badge badgeContent={item.badge} color="error">
                {item.icon}
              </Badge>
            ) : (
              item.icon
            )}
          </ListItemIcon>
          <ListItemText 
            primary={item.label}
            primaryTypographyProps={{
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'primary.main' : 'text.primary'
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box sx={{ width: 280, height: '100%' }}>
      <Box sx={{ p: 2 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FlightTakeoff sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            SS Milhas
          </Typography>
        </Box>

        {/* Campo de Pesquisa */}
        <TextField
          fullWidth
          size="small"
          placeholder="Pesquisar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm('')}
                >
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        <Divider sx={{ mb: 1 }} />
      </Box>

      {/* Menu Items */}
      <List sx={{ px: 1 }}>
        {filteredMenuItems.map(renderMenuItem)}
      </List>

      {/* Footer */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            SS Milhas v1.0.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;