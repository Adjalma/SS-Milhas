/**
 * Página de Configurações
 * 
 * Interface para configurar o sistema.
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
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Save,
  Refresh,
  Notifications,
  Security,
  Palette,
  Language,
  Storage,
  Backup,
  Restore,
  Delete,
  Add,
  Edit,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

import Layout from '../../components/Layout/Layout';

// Dados mockados
const mockSettings = {
  notificacoes: {
    email: true,
    push: true,
    sms: false,
    expiracao: true,
    promocoes: true,
    transacoes: true,
    relatorios: false,
  },
  privacidade: {
    perfilPublico: false,
    mostrarEstatisticas: true,
    compartilharDados: false,
    analytics: true,
  },
  sistema: {
    tema: 'claro',
    idioma: 'pt-BR',
    fusoHorario: 'America/Sao_Paulo',
    formatoData: 'dd/MM/yyyy',
    formatoMoeda: 'BRL',
    autoBackup: true,
    frequenciaBackup: 'diario',
  },
  seguranca: {
    autenticacao2FA: false,
    sessaoTimeout: 30,
    logAcesso: true,
    criptografia: true,
  },
  integracoes: [
    {
      id: 1,
      nome: 'Google Calendar',
      ativo: true,
      tipo: 'calendario',
    },
    {
      id: 2,
      nome: 'Dropbox',
      ativo: false,
      tipo: 'backup',
    },
    {
      id: 3,
      nome: 'Slack',
      ativo: true,
      tipo: 'notificacao',
    },
  ],
};

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [integracaoDialogOpen, setIntegracaoDialogOpen] = useState(false);
  const [novaIntegracao, setNovaIntegracao] = useState({
    nome: '',
    tipo: 'notificacao',
    ativo: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(mockSettings);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      loadSettings();
      alert('Configurações restauradas!');
    }
  };

  const handleSettingChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleIntegracaoToggle = (id) => {
    setSettings(prev => ({
      ...prev,
      integracoes: prev.integracoes.map(integracao =>
        integracao.id === id
          ? { ...integracao, ativo: !integracao.ativo }
          : integracao
      ),
    }));
  };

  const handleAddIntegracao = () => {
    const novaIntegracaoComId = {
      ...novaIntegracao,
      id: Date.now(),
    };
    
    setSettings(prev => ({
      ...prev,
      integracoes: [...prev.integracoes, novaIntegracaoComId],
    }));
    
    setNovaIntegracao({
      nome: '',
      tipo: 'notificacao',
      ativo: true,
    });
    setIntegracaoDialogOpen(false);
  };

  const handleDeleteIntegracao = (id) => {
    if (window.confirm('Tem certeza que deseja remover esta integração?')) {
      setSettings(prev => ({
        ...prev,
        integracoes: prev.integracoes.filter(integracao => integracao.id !== id),
      }));
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" height={40} width={200} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Skeleton variant="rectangular" height={300} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Configurações
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Personalize sua experiência no sistema
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleReset}
            >
              Restaurar
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Notificações */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Notifications sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Notificações
                  </Typography>
                </Box>

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Notificações por Email"
                      secondary="Receber notificações importantes por email"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notificacoes.email}
                        onChange={(e) => handleSettingChange('notificacoes', 'email', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Notificações Push"
                      secondary="Receber notificações no navegador"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notificacoes.push}
                        onChange={(e) => handleSettingChange('notificacoes', 'push', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Notificações SMS"
                      secondary="Receber notificações por SMS"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notificacoes.sms}
                        onChange={(e) => handleSettingChange('notificacoes', 'sms', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Alertas de Expiração"
                      secondary="Notificar sobre milhas que vão expirar"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notificacoes.expiracao}
                        onChange={(e) => handleSettingChange('notificacoes', 'expiracao', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Promoções"
                      secondary="Receber ofertas e promoções especiais"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notificacoes.promocoes}
                        onChange={(e) => handleSettingChange('notificacoes', 'promocoes', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Transações"
                      secondary="Notificar sobre novas transações"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notificacoes.transacoes}
                        onChange={(e) => handleSettingChange('notificacoes', 'transacoes', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Privacidade */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Security sx={{ mr: 2, color: 'success.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Privacidade
                  </Typography>
                </Box>

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Perfil Público"
                      secondary="Permitir que outros usuários vejam seu perfil"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.privacidade.perfilPublico}
                        onChange={(e) => handleSettingChange('privacidade', 'perfilPublico', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Mostrar Estatísticas"
                      secondary="Exibir estatísticas públicas"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.privacidade.mostrarEstatisticas}
                        onChange={(e) => handleSettingChange('privacidade', 'mostrarEstatisticas', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Compartilhar Dados"
                      secondary="Permitir uso de dados para melhorias"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.privacidade.compartilharDados}
                        onChange={(e) => handleSettingChange('privacidade', 'compartilharDados', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Analytics"
                      secondary="Coletar dados de uso para análise"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.privacidade.analytics}
                        onChange={(e) => handleSettingChange('privacidade', 'analytics', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Sistema */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Palette sx={{ mr: 2, color: 'info.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Sistema
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Tema</InputLabel>
                      <Select
                        value={settings.sistema.tema}
                        label="Tema"
                        onChange={(e) => handleSettingChange('sistema', 'tema', e.target.value)}
                      >
                        <MenuItem value="claro">Claro</MenuItem>
                        <MenuItem value="escuro">Escuro</MenuItem>
                        <MenuItem value="auto">Automático</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Idioma</InputLabel>
                      <Select
                        value={settings.sistema.idioma}
                        label="Idioma"
                        onChange={(e) => handleSettingChange('sistema', 'idioma', e.target.value)}
                      >
                        <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                        <MenuItem value="en-US">English (US)</MenuItem>
                        <MenuItem value="es-ES">Español</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Fuso Horário</InputLabel>
                      <Select
                        value={settings.sistema.fusoHorario}
                        label="Fuso Horário"
                        onChange={(e) => handleSettingChange('sistema', 'fusoHorario', e.target.value)}
                      >
                        <MenuItem value="America/Sao_Paulo">São Paulo (UTC-3)</MenuItem>
                        <MenuItem value="America/New_York">Nova York (UTC-5)</MenuItem>
                        <MenuItem value="Europe/London">Londres (UTC+0)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Formato de Data</InputLabel>
                      <Select
                        value={settings.sistema.formatoData}
                        label="Formato de Data"
                        onChange={(e) => handleSettingChange('sistema', 'formatoData', e.target.value)}
                      >
                        <MenuItem value="dd/MM/yyyy">dd/MM/yyyy</MenuItem>
                        <MenuItem value="MM/dd/yyyy">MM/dd/yyyy</MenuItem>
                        <MenuItem value="yyyy-MM-dd">yyyy-MM-dd</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Formato de Moeda</InputLabel>
                      <Select
                        value={settings.sistema.formatoMoeda}
                        label="Formato de Moeda"
                        onChange={(e) => handleSettingChange('sistema', 'formatoMoeda', e.target.value)}
                      >
                        <MenuItem value="BRL">Real Brasileiro (R$)</MenuItem>
                        <MenuItem value="USD">Dólar Americano ($)</MenuItem>
                        <MenuItem value="EUR">Euro (€)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.sistema.autoBackup}
                          onChange={(e) => handleSettingChange('sistema', 'autoBackup', e.target.checked)}
                        />
                      }
                      label="Backup Automático"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth disabled={!settings.sistema.autoBackup}>
                      <InputLabel>Frequência do Backup</InputLabel>
                      <Select
                        value={settings.sistema.frequenciaBackup}
                        label="Frequência do Backup"
                        onChange={(e) => handleSettingChange('sistema', 'frequenciaBackup', e.target.value)}
                      >
                        <MenuItem value="diario">Diário</MenuItem>
                        <MenuItem value="semanal">Semanal</MenuItem>
                        <MenuItem value="mensal">Mensal</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Segurança */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Security sx={{ mr: 2, color: 'warning.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Segurança
                  </Typography>
                </Box>

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Autenticação 2FA"
                      secondary="Requer código adicional para login"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.seguranca.autenticacao2FA}
                        onChange={(e) => handleSettingChange('seguranca', 'autenticacao2FA', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Log de Acesso"
                      secondary="Registrar todos os acessos ao sistema"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.seguranca.logAcesso}
                        onChange={(e) => handleSettingChange('seguranca', 'logAcesso', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Criptografia"
                      secondary="Criptografar dados sensíveis"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.seguranca.criptografia}
                        onChange={(e) => handleSettingChange('seguranca', 'criptografia', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <FormControl fullWidth>
                  <InputLabel>Timeout da Sessão (minutos)</InputLabel>
                  <Select
                    value={settings.seguranca.sessaoTimeout}
                    label="Timeout da Sessão (minutos)"
                    onChange={(e) => handleSettingChange('seguranca', 'sessaoTimeout', e.target.value)}
                  >
                    <MenuItem value={15}>15 minutos</MenuItem>
                    <MenuItem value={30}>30 minutos</MenuItem>
                    <MenuItem value={60}>1 hora</MenuItem>
                    <MenuItem value={120}>2 horas</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Integrações */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Storage sx={{ mr: 2, color: 'secondary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Integrações
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setIntegracaoDialogOpen(true)}
                  >
                    Nova Integração
                  </Button>
                </Box>

                <List>
                  {settings.integracoes.map((integracao) => (
                    <ListItem key={integracao.id}>
                      <ListItemText
                        primary={integracao.nome}
                        secondary={`Tipo: ${integracao.tipo}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => handleIntegracaoToggle(integracao.id)}
                          color={integracao.ativo ? 'primary' : 'default'}
                        >
                          {integracao.ativo ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteIntegracao(integracao.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog de Nova Integração */}
        <Dialog open={integracaoDialogOpen} onClose={() => setIntegracaoDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Nova Integração</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Nome da Integração"
                value={novaIntegracao.nome}
                onChange={(e) => setNovaIntegracao(prev => ({ ...prev, nome: e.target.value }))}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={novaIntegracao.tipo}
                  label="Tipo"
                  onChange={(e) => setNovaIntegracao(prev => ({ ...prev, tipo: e.target.value }))}
                >
                  <MenuItem value="notificacao">Notificação</MenuItem>
                  <MenuItem value="backup">Backup</MenuItem>
                  <MenuItem value="calendario">Calendário</MenuItem>
                  <MenuItem value="outro">Outro</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIntegracaoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddIntegracao} variant="contained">
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Settings;
