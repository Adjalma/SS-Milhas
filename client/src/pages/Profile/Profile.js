/**
 * Página de Perfil
 * 
 * Interface para gerenciar perfil do usuário.
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
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Alert,
  Skeleton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Star,
  TrendingUp,
  AccountBalanceWallet,
  Security,
  Notifications,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';

// Dados mockados
const mockProfile = {
  id: 1,
  nome: 'João Silva',
  email: 'joao.silva@email.com',
  telefone: '(11) 99999-9999',
  dataNascimento: '1990-05-15',
  endereco: {
    rua: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
  },
  avatar: null,
  nivel: 3,
  pontos: 1250,
  dataCadastro: '2024-01-15',
  ultimoAcesso: '2024-08-15',
  estatisticas: {
    totalContas: 4,
    totalTransacoes: 23,
    totalMilhas: 125000,
    valorTotal: 8750.50,
  },
  configuracoes: {
    notificacoesEmail: true,
    notificacoesPush: true,
    notificacoesSms: false,
    privacidade: 'publico',
    tema: 'claro',
  },
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(mockProfile);
      setFormData(mockProfile);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(profile);
  };

  const handleSave = async () => {
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(formData);
      setEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil');
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordSave = async () => {
    try {
      if (passwordData.novaSenha !== passwordData.confirmarSenha) {
        alert('As senhas não coincidem');
        return;
      }
      
      // Simular alteração de senha
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordDialogOpen(false);
      setPasswordData({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: '',
      });
      alert('Senha alterada com sucesso!');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert('Erro ao alterar senha');
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" height={40} width={200} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Skeleton variant="rectangular" height={200} />
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
              Meu Perfil
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie suas informações pessoais
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {editing ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                >
                  Salvar
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEdit}
              >
                Editar
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Informações Pessoais */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Informações Pessoais
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome completo"
                      value={formData.nome || ''}
                      onChange={(e) => handleFormChange('nome', e.target.value)}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      value={formData.telefone || ''}
                      onChange={(e) => handleFormChange('telefone', e.target.value)}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Data de nascimento"
                      type="date"
                      value={formData.dataNascimento || ''}
                      onChange={(e) => handleFormChange('dataNascimento', e.target.value)}
                      disabled={!editing}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <CalendarToday sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Endereço"
                      value={formData.endereco?.rua || ''}
                      onChange={(e) => handleFormChange('endereco', { ...formData.endereco, rua: e.target.value })}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Cidade"
                      value={formData.endereco?.cidade || ''}
                      onChange={(e) => handleFormChange('endereco', { ...formData.endereco, cidade: e.target.value })}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        value={formData.endereco?.estado || ''}
                        label="Estado"
                        onChange={(e) => handleFormChange('endereco', { ...formData.endereco, estado: e.target.value })}
                      >
                        <MenuItem value="SP">São Paulo</MenuItem>
                        <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                        <MenuItem value="MG">Minas Gerais</MenuItem>
                        <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                        <MenuItem value="PR">Paraná</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="CEP"
                      value={formData.endereco?.cep || ''}
                      onChange={(e) => handleFormChange('endereco', { ...formData.endereco, cep: e.target.value })}
                      disabled={!editing}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Configurações */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Configurações
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Notificações por Email</InputLabel>
                      <Select
                        value={formData.configuracoes?.notificacoesEmail ? 'sim' : 'nao'}
                        label="Notificações por Email"
                        onChange={(e) => handleFormChange('configuracoes', { 
                          ...formData.configuracoes, 
                          notificacoesEmail: e.target.value === 'sim' 
                        })}
                      >
                        <MenuItem value="sim">Sim</MenuItem>
                        <MenuItem value="nao">Não</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Notificações Push</InputLabel>
                      <Select
                        value={formData.configuracoes?.notificacoesPush ? 'sim' : 'nao'}
                        label="Notificações Push"
                        onChange={(e) => handleFormChange('configuracoes', { 
                          ...formData.configuracoes, 
                          notificacoesPush: e.target.value === 'sim' 
                        })}
                      >
                        <MenuItem value="sim">Sim</MenuItem>
                        <MenuItem value="nao">Não</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Tema</InputLabel>
                      <Select
                        value={formData.configuracoes?.tema || 'claro'}
                        label="Tema"
                        onChange={(e) => handleFormChange('configuracoes', { 
                          ...formData.configuracoes, 
                          tema: e.target.value 
                        })}
                      >
                        <MenuItem value="claro">Claro</MenuItem>
                        <MenuItem value="escuro">Escuro</MenuItem>
                        <MenuItem value="auto">Automático</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Privacidade</InputLabel>
                      <Select
                        value={formData.configuracoes?.privacidade || 'publico'}
                        label="Privacidade"
                        onChange={(e) => handleFormChange('configuracoes', { 
                          ...formData.configuracoes, 
                          privacidade: e.target.value 
                        })}
                      >
                        <MenuItem value="publico">Público</MenuItem>
                        <MenuItem value="privado">Privado</MenuItem>
                        <MenuItem value="amigos">Apenas Amigos</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Avatar e Informações Básicas */}
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={formData.avatar}
                      sx={{
                        width: 120,
                        height: 120,
                        fontSize: '3rem',
                        bgcolor: 'primary.main',
                        mb: 2,
                      }}
                    >
                      {formData.nome?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {editing && (
                      <IconButton
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          bgcolor: 'background.paper',
                          '&:hover': { bgcolor: 'background.paper' },
                        }}
                        size="small"
                      >
                        <PhotoCamera />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {formData.nome}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {formData.email}
                  </Typography>
                  <Chip
                    icon={<Star />}
                    label={`Nível ${formData.nivel}`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Pontos de Fidelidade
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formData.pontos?.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Membro desde
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {format(new Date(formData.dataCadastro), 'MMM/yyyy', { locale: ptBR })}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Último acesso
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {format(new Date(formData.ultimoAcesso), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Estatísticas
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccountBalanceWallet sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      Total de Contas
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formData.estatisticas?.totalContas}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      Total de Transações
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {formData.estatisticas?.totalTransacoes}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Star sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      Total de Milhas
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {formData.estatisticas?.totalMilhas?.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Security sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      Valor Total
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                    R$ {formData.estatisticas?.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Segurança */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Segurança
                </Typography>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Security />}
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog de Alteração de Senha */}
        <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Alterar Senha</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Senha atual"
                type="password"
                value={passwordData.senhaAtual}
                onChange={(e) => handlePasswordChange('senhaAtual', e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Nova senha"
                type="password"
                value={passwordData.novaSenha}
                onChange={(e) => handlePasswordChange('novaSenha', e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirmar nova senha"
                type="password"
                value={passwordData.confirmarSenha}
                onChange={(e) => handlePasswordChange('confirmarSenha', e.target.value)}
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordSave} variant="contained">
              Alterar Senha
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Profile;
