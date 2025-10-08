/**
 * Página de WhatsApp
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Message,
  Refresh,
  Add,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Save,
  Send,
  Phone,
  WhatsApp as WhatsAppIcon,
  Person,
  Schedule,
  Chat,
  AttachFile
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const WhatsApp = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    numero: '',
    mensagem: '',
    tipo: 'texto',
    agendamento: '',
    anexo: ''
  });

  const [conversas] = useState([
    {
      id: 1,
      numero: '+55 11 99999-9999',
      nome: 'João Silva',
      ultimaMensagem: 'Obrigado pelo atendimento!',
      dataUltimaMensagem: '2024-01-15 14:30',
      status: 'respondido',
      mensagensNaoLidas: 0
    },
    {
      id: 2,
      numero: '+55 11 88888-8888',
      nome: 'Maria Santos',
      ultimaMensagem: 'Preciso de ajuda com a transferência',
      dataUltimaMensagem: '2024-01-15 13:45',
      status: 'aguardando',
      mensagensNaoLidas: 2
    },
    {
      id: 3,
      numero: '+55 11 77777-7777',
      nome: 'Pedro Costa',
      ultimaMensagem: 'Qual o status do meu pedido?',
      dataUltimaMensagem: '2024-01-15 12:20',
      status: 'em_andamento',
      mensagensNaoLidas: 1
    }
  ]);

  const [mensagens] = useState([
    {
      id: 1,
      conversaId: 1,
      texto: 'Olá! Como posso ajudar?',
      tipo: 'enviada',
      data: '2024-01-15 14:25',
      status: 'entregue'
    },
    {
      id: 2,
      conversaId: 1,
      texto: 'Obrigado pelo atendimento!',
      tipo: 'recebida',
      data: '2024-01-15 14:30',
      status: 'lida'
    }
  ]);

  const tiposMensagem = ['Texto', 'Imagem', 'Documento', 'Áudio'];
  const statusConversa = ['Aguardando', 'Em Andamento', 'Respondido', 'Finalizado'];

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
      console.log('Mensagem enviada:', formData);
      setOpenDialog(false);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aguardando': return 'warning';
      case 'em_andamento': return 'info';
      case 'respondido': return 'success';
      case 'finalizado': return 'default';
      default: return 'default';
    }
  };

  const getStatusMensagemColor = (status) => {
    switch (status) {
      case 'enviando': return 'warning';
      case 'entregue': return 'info';
      case 'lida': return 'success';
      default: return 'default';
    }
  };

  const stats = {
    totalConversas: conversas.length,
    aguardando: conversas.filter(c => c.status === 'aguardando').length,
    emAndamento: conversas.filter(c => c.status === 'em_andamento').length,
    respondidas: conversas.filter(c => c.status === 'respondido').length,
    mensagensNaoLidas: conversas.reduce((sum, c) => sum + c.mensagensNaoLidas, 0)
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            WhatsApp Business
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Central de atendimento via WhatsApp
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
            Atualizar
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Nova Mensagem
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Message sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalConversas}
              </Typography>
              <Typography variant="body2" color="text.secondary">conversas</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Aguardando</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.aguardando}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Em Andamento</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.emAndamento}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chat sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Não Lidas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                {stats.mensagensNaoLidas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '70vh' }}>
            <CardContent sx={{ p: 0, height: '100%' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  <WhatsAppIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Conversas
                </Typography>
              </Box>
              
              <Box sx={{ height: 'calc(100% - 60px)', overflow: 'auto' }}>
                <List>
                  {conversas.map((conversa, index) => (
                    <React.Fragment key={conversa.id}>
                      <ListItem 
                        button 
                        sx={{ 
                          '&:hover': { backgroundColor: 'action.hover' },
                          backgroundColor: conversa.mensagensNaoLidas > 0 ? 'action.selected' : 'transparent'
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            <Person />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {conversa.nome}
                              </Typography>
                              {conversa.mensagensNaoLidas > 0 && (
                                <Chip 
                                  label={conversa.mensagensNaoLidas} 
                                  size="small" 
                                  color="error" 
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {conversa.ultimaMensagem}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(conversa.dataUltimaMensagem).toLocaleDateString('pt-BR')}
                                </Typography>
                                <Chip
                                  label={conversa.status}
                                  size="small"
                                  color={getStatusColor(conversa.status)}
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < conversas.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: '70vh' }}>
            <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  João Silva
                  <Chip label="+55 11 99999-9999" size="small" sx={{ ml: 2 }} />
                </Typography>
              </Box>
              
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                <List>
                  {mensagens.map((mensagem) => (
                    <ListItem key={mensagem.id} sx={{ 
                      justifyContent: mensagem.tipo === 'enviada' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start'
                    }}>
                      <Card sx={{ 
                        maxWidth: '70%',
                        bgcolor: mensagem.tipo === 'enviada' ? 'primary.main' : 'grey.100',
                        color: mensagem.tipo === 'enviada' ? 'white' : 'text.primary'
                      }}>
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="body2">
                            {mensagem.texto}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              opacity: 0.7,
                              display: 'block',
                              textAlign: 'right',
                              mt: 1
                            }}
                          >
                            {new Date(mensagem.data).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                            {mensagem.tipo === 'enviada' && (
                              <CheckCircle sx={{ fontSize: 12, ml: 1 }} />
                            )}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))}
                </List>
              </Box>
              
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="Digite sua mensagem..."
                    variant="outlined"
                    size="small"
                  />
                  <IconButton color="primary">
                    <AttachFile />
                  </IconButton>
                  <Button variant="contained" startIcon={<Send />}>
                    Enviar
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <WhatsAppIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nova Mensagem
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número do WhatsApp"
                  placeholder="+55 11 99999-9999"
                  value={formData.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={formData.tipo}
                    label="Tipo"
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                  >
                    {tiposMensagem.map(tipo => (
                      <MenuItem key={tipo.toLowerCase()} value={tipo.toLowerCase()}>{tipo}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mensagem"
                  multiline
                  rows={4}
                  value={formData.mensagem}
                  onChange={(e) => handleInputChange('mensagem', e.target.value)}
                  required
                  placeholder="Digite sua mensagem aqui..."
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Agendamento (opcional)"
                  type="datetime-local"
                  value={formData.agendamento}
                  onChange={(e) => handleInputChange('agendamento', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Anexo (URL)"
                  value={formData.anexo}
                  onChange={(e) => handleInputChange('anexo', e.target.value)}
                  placeholder="Link para imagem, documento, etc."
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
            startIcon={<Send />}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Mensagem'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && <LinearProgress />}
    </Box>
  );
};

export default WhatsApp;
