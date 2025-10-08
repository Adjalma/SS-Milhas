import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Divider,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Support,
  Add,
  Refresh,
  Send,
  Person,
  Email,
  Phone,
  PriorityHigh,
  CheckCircle,
  Schedule,
  Cancel,
  WhatsApp,
  AttachFile,
  Visibility,
  Edit,
  Delete
} from '@mui/icons-material';

const Ticket = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    categoria: 'tecnica',
    contato: '',
    email: ''
  });

  // Mock data para tickets
  useEffect(() => {
    const mockTickets = [
      {
        id: 1,
        titulo: 'Problema com login no sistema',
        descricao: 'Não consigo fazer login com minhas credenciais',
        prioridade: 'alta',
        categoria: 'tecnica',
        status: 'aberto',
        contato: 'João Silva',
        whatsapp: '+55 22 97403-2357',
        dataAbertura: '2024-01-15',
        ultimaAtualizacao: '2024-01-15 14:30',
        mensagens: [
          {
            id: 1,
            texto: 'Olá! Preciso de ajuda com o login.',
            autor: 'João Silva',
            data: '2024-01-15 14:30',
            tipo: 'cliente'
          },
          {
            id: 2,
            texto: 'Olá João! Vou verificar seu problema. Pode tentar limpar o cache do navegador?',
            autor: 'Suporte Técnico',
            data: '2024-01-15 14:35',
            tipo: 'suporte'
          }
        ]
      },
      {
        id: 2,
        titulo: 'Dúvida sobre transferência de milhas',
        descricao: 'Como faço para transferir milhas para outra pessoa?',
        prioridade: 'media',
        categoria: 'duvida',
        status: 'em_andamento',
        contato: 'Maria Santos',
        whatsapp: '+55 22 97403-2357',
        dataAbertura: '2024-01-14',
        ultimaAtualizacao: '2024-01-15 09:15',
        mensagens: [
          {
            id: 1,
            texto: 'Boa tarde! Gostaria de saber como transferir milhas.',
            autor: 'Maria Santos',
            data: '2024-01-14 16:20',
            tipo: 'cliente'
          }
        ]
      },
      {
        id: 3,
        titulo: 'Erro na compra de passagem',
        descricao: 'Está dando erro ao finalizar a compra',
        prioridade: 'alta',
        categoria: 'tecnica',
        status: 'fechado',
        contato: 'Pedro Costa',
        whatsapp: '+55 22 97403-2357',
        dataAbertura: '2024-01-13',
        ultimaAtualizacao: '2024-01-15 11:00',
        mensagens: [
          {
            id: 1,
            texto: 'Estou com erro ao comprar passagem.',
            autor: 'Pedro Costa',
            data: '2024-01-13 10:15',
            tipo: 'cliente'
          },
          {
            id: 2,
            texto: 'Problema resolvido! Obrigado pelo contato.',
            autor: 'Pedro Costa',
            data: '2024-01-15 11:00',
            tipo: 'cliente'
          }
        ]
      }
    ];
    setTickets(mockTickets);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envio do ticket
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTicket = {
      id: tickets.length + 1,
      ...formData,
      status: 'aberto',
      dataAbertura: new Date().toISOString().split('T')[0],
      ultimaAtualizacao: new Date().toLocaleString(),
      mensagens: []
    };
    
    setTickets(prev => [newTicket, ...prev]);
    setOpenDialog(false);
    setFormData({
      titulo: '',
      descricao: '',
      prioridade: 'media',
      categoria: 'tecnica',
      contato: '',
      email: ''
    });
    setLoading(false);
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'aberto': return 'error';
      case 'em_andamento': return 'warning';
      case 'fechado': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aberto': return 'Aberto';
      case 'em_andamento': return 'Em Andamento';
      case 'fechado': return 'Fechado';
      default: return status;
    }
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'baixa': return 'success';
      case 'media': return 'warning';
      case 'alta': return 'error';
      default: return 'default';
    }
  };

  const getPriorityText = (prioridade) => {
    switch (prioridade) {
      case 'baixa': return 'Baixa';
      case 'media': return 'Média';
      case 'alta': return 'Alta';
      default: return prioridade;
    }
  };

  const stats = {
    total: tickets.length,
    abertos: tickets.filter(t => t.status === 'aberto').length,
    emAndamento: tickets.filter(t => t.status === 'em_andamento').length,
    fechados: tickets.filter(t => t.status === 'fechado').length
  };

  return (
    <Box sx={{ 
      p: 0, 
      m: 0, 
      width: '100vw', 
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      background: 'linear-gradient(135deg, #0A0B1E 0%, #1A1B2E 100%)',
      overflow: 'auto',
      boxSizing: 'border-box',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: '320px', 
        height: '100vh',
        background: 'linear-gradient(180deg, #0A0B1E 0%, #1A1B2E 100%)',
        borderRight: '1px solid rgba(99, 102, 241, 0.1)',
        p: 2,
        overflow: 'auto'
      }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
            SS Milhas
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Sistema Técnico
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="Buscar tickets..." 
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>NAVEGAÇÃO</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button variant="outlined" fullWidth onClick={() => window.history.back()}>
              ← Voltar ao Dashboard
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>CONTATO DIRETO</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button variant="outlined" fullWidth startIcon={<Email />}>
              Email: suporte@sistemassentinela.com.br
            </Button>
            <Button variant="outlined" fullWidth startIcon={<Phone />}>
              Telefone: (22) 97403-2357
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Para conversas via WhatsApp, use a página WhatsApp
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Typography variant="body2" color="text.secondary">Usuário</Typography>
          <Typography variant="body1">admin</Typography>
          <Chip label="Online" size="small" color="success" />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 0, m: 0, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, p: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Sistema de Tickets
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Central de suporte e atendimento
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
              Atualizar
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
              Novo Ticket
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4, width: '100%', p: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Support sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Total</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">tickets</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PriorityHigh sx={{ mr: 1, color: 'error.main' }} />
                  <Typography variant="h6">Abertos</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {stats.abertos}
                </Typography>
                <Typography variant="body2" color="text.secondary">aguardando</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Schedule sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="h6">Em Andamento</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {stats.emAndamento}
                </Typography>
                <Typography variant="body2" color="text.secondary">processando</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6">Fechados</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {stats.fechados}
                </Typography>
                <Typography variant="body2" color="text.secondary">resolvidos</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ p: 2 }}>
          <Card sx={{ height: '70vh', minHeight: '500px' }}>
            <CardContent sx={{ p: 0, height: '100%' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  <Support sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Tickets Recentes
                </Typography>
              </Box>
              
              <Box sx={{ height: 'calc(100% - 60px)', overflow: 'auto' }}>
                <List>
                  {tickets.map((ticket) => (
                    <ListItem 
                      key={ticket.id}
                      sx={{ 
                        borderBottom: 1,
                        borderColor: 'divider',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getStatusColor(ticket.status) + '.main' }}>
                          <Support />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              #{ticket.id} - {ticket.titulo}
                            </Typography>
                            <Chip 
                              label={getStatusText(ticket.status)} 
                              size="small" 
                              color={getStatusColor(ticket.status)}
                            />
                            <Chip 
                              label={getPriorityText(ticket.prioridade)} 
                              size="small" 
                              color={getPriorityColor(ticket.prioridade)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {ticket.contato} • {ticket.dataAbertura}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {ticket.descricao.substring(0, 100)}...
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setViewDialog(true);
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setViewDialog(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Dialog para criar novo ticket */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Support sx={{ mr: 1, verticalAlign: 'middle' }} />
            Novo Ticket de Suporte
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Título do Ticket"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição do Problema"
                    multiline
                    rows={4}
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Prioridade</InputLabel>
                    <Select
                      value={formData.prioridade}
                      onChange={(e) => handleInputChange('prioridade', e.target.value)}
                    >
                      <MenuItem value="baixa">Baixa</MenuItem>
                      <MenuItem value="media">Média</MenuItem>
                      <MenuItem value="alta">Alta</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Categoria</InputLabel>
                    <Select
                      value={formData.categoria}
                      onChange={(e) => handleInputChange('categoria', e.target.value)}
                    >
                      <MenuItem value="tecnica">Técnica</MenuItem>
                      <MenuItem value="duvida">Dúvida</MenuItem>
                      <MenuItem value="financeira">Financeira</MenuItem>
                      <MenuItem value="outras">Outras</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome de Contato"
                    value={formData.contato}
                    onChange={(e) => handleInputChange('contato', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    placeholder="usuario@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Ticket'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Dialog para visualizar ticket */}
        <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Support sx={{ mr: 1, verticalAlign: 'middle' }} />
            Ticket #{selectedTicket?.id} - {selectedTicket?.titulo}
          </DialogTitle>
          <DialogContent>
            {selectedTicket && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                    <Chip 
                      label={getStatusText(selectedTicket.status)} 
                      color={getStatusColor(selectedTicket.status)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Prioridade</Typography>
                    <Chip 
                      label={getPriorityText(selectedTicket.prioridade)} 
                      color={getPriorityColor(selectedTicket.prioridade)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Contato</Typography>
                    <Typography variant="body1">{selectedTicket.contato}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">WhatsApp</Typography>
                    <Typography variant="body1">{selectedTicket.whatsapp}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Descrição
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {selectedTicket.descricao}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Mensagens ({selectedTicket.mensagens.length})
                </Typography>
                <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                  {selectedTicket.mensagens.map((msg) => (
                    <Paper 
                      key={msg.id} 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        bgcolor: msg.tipo === 'suporte' ? 'primary.main' : 'grey.100',
                        color: msg.tipo === 'suporte' ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {msg.autor}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {msg.texto}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {msg.data}
                      </Typography>
                    </Paper>
                  ))}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Para conversas via WhatsApp, vá para a página WhatsApp no menu lateral.
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialog(false)}>Fechar</Button>
          </DialogActions>
        </Dialog>

        {loading && <LinearProgress />}
      </Box>
    </Box>
  );
};

export default Ticket;