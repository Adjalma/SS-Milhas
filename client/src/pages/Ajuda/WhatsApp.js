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
  IconButton,
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
  Refresh,
  Add,
  Send,
  Phone,
  WhatsApp as WhatsAppIcon,
  Person,
  Schedule,
  AttachFile
} from '@mui/icons-material';

const WhatsApp = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConversa, setSelectedConversa] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      texto: 'Olá! Como posso ajudar?',
      tipo: 'recebida',
      status: 'lida',
      data: '14:25'
    },
    {
      id: 2,
      texto: 'Obrigado pelo atendimento!',
      tipo: 'enviada',
      status: 'entregue',
      data: '14:30'
    }
  ]);
  const [formData, setFormData] = useState({
    numero: '',
    mensagem: '',
    tipo: 'texto',
    agendamento: '',
    anexo: '',
    contato: ''
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


  const tiposMensagem = ['Texto', 'Imagem', 'Documento', 'Áudio'];

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
      
      // Enviar para o WhatsApp real do desenvolvedor
      const message = `${formData.mensagem}`;
      const whatsappUrl = `https://wa.me/5522974032357?text=${encodeURIComponent(message)}`;
      
      // Abrir WhatsApp em nova aba
      window.open(whatsappUrl, '_blank');
      
      console.log('Mensagem enviada para WhatsApp:', formData);
      setOpenDialog(false);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setLoading(true);
    
    try {
      // Adicionar mensagem ao chat local primeiro
      const novaMensagem = {
        id: Date.now(),
        texto: newMessage,
        tipo: 'enviada',
        status: 'enviando',
        data: new Date().toLocaleTimeString()
      };
      
      setMensagens(prev => [...prev, novaMensagem]);
      
      // Enviar mensagem via API do WhatsApp
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '5522974032357',
          message: newMessage,
          type: 'text'
        })
      });
      
      if (response.ok) {
        // Atualizar status da mensagem para enviada
        setMensagens(prev => 
          prev.map(msg => 
            msg.id === novaMensagem.id 
              ? { ...msg, status: 'enviada' }
              : msg
          )
        );
        
        // Simular resposta automática
        setTimeout(() => {
          const respostaAutomatica = {
            id: Date.now() + 1,
            texto: "Obrigado pela sua mensagem! Vou responder em breve.",
            tipo: 'recebida',
            status: 'recebida',
            data: new Date().toLocaleTimeString()
          };
          setMensagens(prev => [...prev, respostaAutomatica]);
        }, 2000);
        
        console.log('Mensagem enviada com sucesso:', newMessage);
      } else {
        throw new Error('Erro ao enviar mensagem');
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Atualizar status da mensagem para erro
      setMensagens(prev => 
        prev.map(msg => 
          msg.id === Date.now() - 1 
            ? { ...msg, status: 'erro' }
            : msg
        )
      );
      
      // Mostrar notificação de erro
      alert('Erro ao enviar mensagem. Tente novamente.');
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
      case 'enviando': return 'info';
      case 'enviada': return 'success';
      case 'erro': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'enviando': return '⏳';
      case 'enviada': return '✅';
      case 'erro': return '❌';
      default: return '';
    }
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
            placeholder="Buscar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            WhatsApp Business - Espelho
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Espelho do WhatsApp - Mensagens vão direto para seu WhatsApp
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
            Atualizar
          </Button>
                  <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
                    Nova Mensagem
                  </Button>
          <Button 
            variant="outlined" 
            onClick={() => window.history.back()}
            sx={{ ml: 2 }}
          >
            ← Voltar
          </Button>
        </Box>
      </Box>


      <Grid container spacing={1} sx={{ width: '100%' }}>
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ height: '80vh', minHeight: '500px' }}>
            <CardContent sx={{ p: 0, height: '100%' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  <WhatsAppIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Conversas
                </Typography>
              </Box>
              
              <Box sx={{ height: 'calc(100% - 60px)', overflow: 'auto' }}>
                <List>
                  {conversas
                    .filter(conversa => 
                      conversa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      conversa.numero.includes(searchTerm)
                    )
                    .map((conversa, index) => (
                    <React.Fragment key={conversa.id}>
                      <ListItem 
                        button 
                        onClick={() => setSelectedConversa(conversa.id)}
                        sx={{ 
                          '&:hover': { backgroundColor: 'action.hover' },
                          backgroundColor: selectedConversa === conversa.id 
                            ? 'primary.main' 
                            : conversa.mensagensNaoLidas > 0 
                              ? 'action.selected' 
                              : 'transparent',
                          color: selectedConversa === conversa.id ? 'white' : 'inherit'
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

        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ height: '80vh', minHeight: '500px' }}>
            <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  João Silva
                  <Chip label="+55 22 974032357" size="small" sx={{ ml: 2 }} />
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
                        maxWidth: '90%',
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
                              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                <Typography variant="caption" sx={{ mr: 0.5 }}>
                                  {getStatusIcon(mensagem.status)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {mensagem.data}
                                </Typography>
                              </Box>
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
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit(e);
                      }
                    }}
                  />
                  <IconButton color="primary">
                    <AttachFile />
                  </IconButton>
                  <Button 
                    variant="contained" 
                    startIcon={<Send />} 
                    onClick={handleChatSubmit}
                    disabled={!newMessage.trim() || loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar'}
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número do WhatsApp"
                  placeholder="+55 22 974032357"
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
    </Box>
  );
};

export default WhatsApp;
