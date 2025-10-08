/**
 * Página de Perfil do Usuário
 * 
 * Interface para visualizar e editar informações
 * do perfil do usuário logado.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Person,
  Email,
  Phone,
  Business,
  Security,
  AdminPanelSettings,
  SupportAgent,
  AccountBalance,
  Notifications,
  Language,
  Palette
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../../services/api';

const Perfil = () => {
  const [editing, setEditing] = useState(false);
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    idioma: 'pt-BR',
    tema: 'light',
    notificacoes: true
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const queryClient = useQueryClient();

  // Buscar dados do perfil
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => usersAPI.get('/users/profile'),
    select: (response) => response.data
  });

  // Mutação para atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: (data) => usersAPI.put('/users/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-profile']);
      setEditing(false);
    }
  });

  // Mutação para upload de avatar
  const uploadAvatarMutation = useMutation({
    mutationFn: (file) => usersAPI.post('/users/profile/avatar', file),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-profile']);
      setOpenAvatarDialog(false);
      setAvatar(null);
      setPreview(null);
    }
  });

  // Carregar dados do perfil quando disponíveis
  useEffect(() => {
    if (profileData) {
      setFormData({
        nome: profileData.nome || '',
        email: profileData.email || '',
        telefone: profileData.telefone || '',
        empresa: profileData.empresa || '',
        idioma: profileData.idioma || 'pt-BR',
        tema: profileData.tema || 'light',
        notificacoes: profileData.notificacoes !== false
      });
    }
  }, [profileData]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (profileData) {
      setFormData({
        nome: profileData.nome || '',
        email: profileData.email || '',
        telefone: profileData.telefone || '',
        empresa: profileData.empresa || '',
        idioma: profileData.idioma || 'pt-BR',
        tema: profileData.tema || 'light',
        notificacoes: profileData.notificacoes !== false
      });
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = () => {
    if (avatar) {
      uploadAvatarMutation.mutate(avatar);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <AccountBalance color="primary" />;
      case 'admin':
        return <AdminPanelSettings color="success" />;
      case 'auxiliar':
        return <SupportAgent color="info" />;
      default:
        return <Person />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner':
        return 'primary';
      case 'admin':
        return 'success';
      case 'auxiliar':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'owner':
        return 'Proprietário';
      case 'admin':
        return 'Administrador';
      case 'auxiliar':
        return 'Auxiliar';
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Carregando perfil...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Erro ao carregar perfil: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
        Meu Perfil
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Gerencie suas informações pessoais e configurações da conta.
      </Typography>

      <Grid container spacing={3}>
        {/* Informações Básicas */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Informações Pessoais</Typography>
                {!editing ? (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                  >
                    Editar
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? <CircularProgress size={20} /> : 'Salvar'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={formData.nome}
                    onChange={handleInputChange('nome')}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={formData.telefone}
                    onChange={handleInputChange('telefone')}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Empresa"
                    value={formData.empresa}
                    onChange={handleInputChange('empresa')}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Avatar e Informações da Conta */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={profileData?.avatar || preview}
                  sx={{ width: 120, height: 120, mx: 'auto' }}
                >
                  {profileData?.nome?.charAt(0)?.toUpperCase()}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                  onClick={() => setOpenAvatarDialog(true)}
                >
                  <PhotoCamera />
                </IconButton>
              </Box>

              <Typography variant="h6" gutterBottom>
                {profileData?.nome || 'Usuário'}
              </Typography>

              <Chip
                icon={getRoleIcon(profileData?.role)}
                label={getRoleLabel(profileData?.role)}
                color={getRoleColor(profileData?.role)}
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" color="text.secondary">
                {profileData?.email}
              </Typography>
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configurações
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Language />
                  </ListItemIcon>
                  <ListItemText
                    primary="Idioma"
                    secondary={formData.idioma === 'pt-BR' ? 'Português (Brasil)' : formData.idioma}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Palette />
                  </ListItemIcon>
                  <ListItemText
                    primary="Tema"
                    secondary={formData.tema === 'light' ? 'Claro' : 'Escuro'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="Notificações"
                    secondary={formData.notificacoes ? 'Ativadas' : 'Desativadas'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog para Upload de Avatar */}
      <Dialog open={openAvatarDialog} onClose={() => setOpenAvatarDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Alterar Foto do Perfil</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {preview ? (
              <Avatar src={preview} sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }} />
            ) : (
              <Avatar sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}>
                {profileData?.nome?.charAt(0)?.toUpperCase()}
              </Avatar>
            )}
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                Escolher Foto
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAvatarDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleAvatarUpload}
            disabled={!avatar || uploadAvatarMutation.isPending}
          >
            {uploadAvatarMutation.isPending ? <CircularProgress size={20} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Perfil;
