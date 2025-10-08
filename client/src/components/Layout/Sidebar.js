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
  Badge,
  Avatar,
  Stack,
  Chip
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
  Settings,
  SmartToy,
  Psychology,
  Group,
  WhatsApp,
  Support,
  Security,
  Storage,
  NetworkCheck,
  CloudSync,
  Speed,
  Analytics
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Componente de Item do Menu
const MenuItem = ({ 
  item, 
  level = 0, 
  isActive, 
  onNavigate, 
  onMobileClose 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isSubItem = level > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      onNavigate(item.path);
      if (onMobileClose) {
        onMobileClose();
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: level * 0.1 }}
      >
        <ListItem 
          disablePadding 
          sx={{ 
            mb: 0.5,
            pl: isSubItem ? 3 : 1,
          }}
        >
          <ListItemButton
            onClick={handleClick}
            sx={{
              borderRadius: 2,
              mx: 1,
              py: 1.5,
              px: 2,
              background: isActive 
                ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)'
                : 'transparent',
              border: isActive 
                ? '1px solid rgba(0, 212, 255, 0.3)'
                : '1px solid transparent',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                transform: 'translateX(4px)',
              },
              '& .MuiListItemIcon-root': {
                color: isActive ? '#00D4FF' : 'rgba(148, 163, 184, 0.8)',
                minWidth: 40,
              },
              '& .MuiListItemText-primary': {
                color: isActive ? '#E2E8F0' : 'rgba(148, 163, 184, 0.9)',
                fontWeight: isActive ? 600 : 500,
                fontSize: isSubItem ? '0.875rem' : '0.9rem',
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.title}
              secondary={item.subtitle}
            />
            {item.badge && (
              <Badge 
                badgeContent={item.badge} 
                color="primary"
                sx={{ mr: 1 }}
              />
            )}
            {hasChildren && (
              <IconButton size="small" sx={{ ml: 1 }}>
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>
      </motion.div>

      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child, index) => (
                  <MenuItem
                    key={index}
                    item={child}
                    level={level + 1}
                    isActive={isActive}
                    onNavigate={onNavigate}
                    onMobileClose={onMobileClose}
                  />
                ))}
              </List>
            </Collapse>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Componente de Seção do Menu
const MenuSection = ({ title, items, isActive, onNavigate, onMobileClose }) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant="overline"
      sx={{
        color: 'rgba(148, 163, 184, 0.6)',
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        px: 3,
        mb: 1,
        display: 'block'
      }}
    >
      {title}
    </Typography>
    <List>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          item={item}
          isActive={isActive}
          onNavigate={onNavigate}
          onMobileClose={onMobileClose}
        />
      ))}
    </List>
  </Box>
);

const Sidebar = ({ open, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleNavigation = (path) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Estrutura do menu com design técnico
  const menuSections = [
    {
      title: 'Principal',
      items: [
        {
          title: 'Dashboard',
          subtitle: 'Visão geral do sistema',
          icon: <Dashboard />,
          path: '/dashboard'
        },
        {
          title: 'Contas',
          subtitle: 'Gerenciar contas',
          icon: <AccountBalance />,
          path: '/accounts'
        },
        {
          title: 'Transações',
          subtitle: 'Histórico completo',
          icon: <SwapHoriz />,
          path: '/transactions',
          badge: '247'
        }
      ]
    },
    {
      title: 'Movimentações',
      items: [
        {
          title: 'Processos',
          subtitle: 'Kanban de processos',
          icon: <TaskAlt />,
          path: '/movimentacoes/processos'
        },
        {
          title: 'Compra Entrada',
          subtitle: 'Registrar entradas',
          icon: <ArrowDownward />,
          path: '/movimentacoes/compra-entrada'
        },
        {
          title: 'Compra Bonificada',
          subtitle: 'Milhas bonificadas',
          icon: <Receipt />,
          path: '/movimentacoes/compra-bonificada'
        },
        {
          title: 'Transferência',
          subtitle: 'Entre contas',
          icon: <TransferWithinAStation />,
          path: '/movimentacoes/transferencia'
        },
        {
          title: 'Transferência Pessoas',
          subtitle: 'Entre pessoas',
          icon: <People />,
          path: '/movimentacoes/transferencia-pessoas'
        },
        {
          title: 'Agendamento',
          subtitle: 'Agendar transações',
          icon: <Schedule />,
          path: '/movimentacoes/agendamento'
        },
        {
          title: 'Venda',
          subtitle: 'Vender milhas',
          icon: <ArrowUpward />,
          path: '/movimentacoes/venda'
        },
        {
          title: 'Saída Manual',
          subtitle: 'Saídas manuais',
          icon: <Remove />,
          path: '/movimentacoes/saida-manual'
        },
        {
          title: 'Passagem',
          subtitle: 'Gerenciar passagens',
          icon: <FlightTakeoff />,
          path: '/movimentacoes/passagem'
        }
      ]
    },
    {
      title: 'Relatórios',
      items: [
        {
          title: 'Relatórios',
          subtitle: 'Relatórios gerais',
          icon: <Assessment />,
          path: '/reports'
        },
        {
          title: 'Controle CPF',
          subtitle: 'Monitorar CPFs',
          icon: <Person />,
          path: '/relatorios/controle-cpf'
        },
        {
          title: 'Passagens',
          subtitle: 'Relatório de passagens',
          icon: <Flight />,
          path: '/relatorios/passagens'
        },
        {
          title: 'Transferências',
          subtitle: 'Relatório de transferências',
          icon: <CompareArrows />,
          path: '/relatorios/transferencias'
        },
        {
          title: 'Vendas',
          subtitle: 'Relatório de vendas',
          icon: <TrendingUp />,
          path: '/relatorios/vendas'
        },
        {
          title: 'Resumo',
          subtitle: 'Resumo executivo',
          icon: <ShowChart />,
          path: '/relatorios/resumo'
        },
        {
          title: 'Gráfico Lucro',
          subtitle: 'Análise de lucro',
          icon: <TrendingDown />,
          path: '/relatorios/grafico-lucro'
        },
        {
          title: 'Evolução',
          subtitle: 'Evolução temporal',
          icon: <CheckCircle />,
          path: '/relatorios/evolucao'
        }
      ]
    },
    {
      title: 'Financeiro',
      items: [
        {
          title: 'Fluxo de Caixa',
          subtitle: 'Controle financeiro',
          icon: <AttachMoney />,
          path: '/financeiro/fluxo-caixa'
        },
        {
          title: 'Receitas',
          subtitle: 'Gerenciar receitas',
          icon: <TrendingUp />,
          path: '/financeiro/receitas'
        },
        {
          title: 'Despesas',
          subtitle: 'Gerenciar despesas',
          icon: <TrendingDown />,
          path: '/financeiro/despesas'
        },
        {
          title: 'Conciliação',
          subtitle: 'Conciliação bancária',
          icon: <CheckCircle />,
          path: '/financeiro/conciliacao'
        },
        {
          title: 'Transferência',
          subtitle: 'Transferências financeiras',
          icon: <SwapHoriz />,
          path: '/financeiro/transferencia'
        }
      ]
    },
    {
      title: 'Cadastros',
      items: [
        {
          title: 'Pessoa',
          subtitle: 'Cadastrar pessoas',
          icon: <PersonAdd />,
          path: '/cadastros/pessoa'
        },
        {
          title: 'Conta Bancária',
          subtitle: 'Contas bancárias',
          icon: <AccountBalance />,
          path: '/cadastros/conta-bancaria'
        },
        {
          title: 'Cartão',
          subtitle: 'Cartões de crédito',
          icon: <CreditCard />,
          path: '/cadastros/cartao'
        },
        {
          title: 'Clubes',
          subtitle: 'Programas de fidelidade',
          icon: <EmojiEvents />,
          path: '/cadastros/clubes'
        },
        {
          title: 'Programas',
          subtitle: 'Programas de milhas',
          icon: <Business />,
          path: '/cadastros/programas'
        },
        {
          title: 'Cliente',
          subtitle: 'Clientes do sistema',
          icon: <People />,
          path: '/cadastros/cliente'
        },
        {
          title: 'Etiqueta',
          subtitle: 'Etiquetas personalizadas',
          icon: <Description />,
          path: '/cadastros/etiqueta'
        }
      ]
    },
    {
      title: 'Serviços',
      items: [
        {
          title: 'Orçamentos',
          subtitle: 'Gerenciar orçamentos',
          icon: <RequestQuote />,
          path: '/servicos/orcamentos'
        },
        {
          title: 'Recibos',
          subtitle: 'Emitir recibos',
          icon: <Receipt />,
          path: '/servicos/recibos'
        }
      ]
    },
    {
      title: 'IA & Automação',
      items: [
        {
          title: 'Dashboard IA',
          subtitle: 'Monitoramento inteligente',
          icon: <SmartToy />,
          path: '/ai/dashboard',
          badge: 'AI'
        }
      ]
    },
    {
      title: 'Ajuda',
      items: [
        {
          title: 'Tutoriais',
          subtitle: 'Guias e tutoriais',
          icon: <Help />,
          path: '/ajuda/tutoriais'
        },
        {
          title: 'Ticket',
          subtitle: 'Suporte técnico',
          icon: <Support />,
          path: '/ajuda/ticket'
        },
        {
          title: 'WhatsApp',
          subtitle: 'Contato via WhatsApp',
          icon: <WhatsApp />,
          path: '/ajuda/whatsapp'
        }
      ]
    },
    {
      title: 'Configurações',
      items: [
        {
          title: 'Gerenciar Usuários',
          subtitle: 'Administrar usuários',
          icon: <Group />,
          path: '/configuracoes/usuarios'
        },
        {
          title: 'Perfil',
          subtitle: 'Configurações pessoais',
          icon: <Person />,
          path: '/configuracoes/perfil'
        }
      ]
    }
  ];

  // Filtrar itens baseado na busca
  const filteredSections = searchTerm
    ? menuSections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(section => section.items.length > 0)
    : menuSections;

  return (
    <Box
      sx={{
        width: open ? 320 : 0,
        flexShrink: 0,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0A0B1E 0%, #1A1B2E 100%)',
        borderRight: '1px solid rgba(99, 102, 241, 0.1)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar
            sx={{
              bgcolor: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 100%)',
              width: 40,
              height: 40,
            }}
          >
            <Storage />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#E2E8F0' }}>
              SS Milhas
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sistema Técnico
            </Typography>
          </Box>
        </Stack>

        {/* Barra de Pesquisa */}
        <TextField
          size="small"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm('')}
                >
                  <Clear sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'rgba(99, 102, 241, 0.05)',
              '& fieldset': {
                borderColor: 'rgba(99, 102, 241, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 212, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00D4FF',
              },
            },
          }}
        />
      </Box>

      {/* Menu */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        {filteredSections.map((section, index) => (
          <MenuSection
            key={index}
            title={section.title}
            items={section.items}
            isActive={isActive}
            onNavigate={handleNavigation}
            onMobileClose={onMobileClose}
          />
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(99, 102, 241, 0.1)' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              bgcolor: 'rgba(99, 102, 241, 0.2)',
              width: 32,
              height: 32,
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#E2E8F0' }}>
              {user?.name || 'Usuário'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role || 'admin'}
            </Typography>
          </Box>
          <Chip
            label="Online"
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default Sidebar;