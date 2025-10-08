/**
 * Página de Gerenciamento de Usuários
 * 
 * Interface para gerenciar usuários da conta,
 * incluindo criação, edição e controle de permissões.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Person,
  AdminPanelSettings,
  SupportAgent,
  Visibility,
  VisibilityOff,
  AccountBalance
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../../services/api';

const GerenciarUsuarios = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'auxiliar'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [permissions, setPermissions] = useState({
    financeiro: false,
    valores: false,
    relatorios: false,
    monitoramento: true,
    cadastros: false
  });

  const queryClient = useQueryClient();

  // Buscar usuários
  const { data: usuariosData, isLoading, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usersAPI.get('/usuarios'),
    refetchInterval: 30000,
    retry: false
  });

  // Buscar informações da conta
  const { data: accountData, isLoading: accountLoading } = useQuery({
    queryKey: ['account-info'],
    queryFn: () => usersAPI.get('/usuarios/account/info'),
    retry: false
  });

  // Mutação para criar usuário
  const createUserMutation = useMutation({
    mutationFn: (userData) => usersAPI.post('/usuarios', userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      queryClient.invalidateQueries(['account-info']);
      setOpenDialog(false);
      resetForm();
    }
  });

  // Mutação para editar usuário
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }) => usersAPI.put(`/usuarios/${id}`, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      setOpenDialog(false);
      resetForm();
    }
  });

  // Mutação para remover usuário
  const deleteUserMutation = useMutation({
    mutationFn: (id) => usersAPI.delete(`/usuarios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      queryClient.invalidateQueries(['account-info']);
    }
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      senha: '',
      role: 'auxiliar'
    });
    setPermissions({
      financeiro: false,
      valores: false,
      relatorios: false,
      monitoramento: true,
      cadastros: false
    });
    setEditingUser(null);
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nome: user.nome,
        email: user.email,
        senha: '',
        role: user.role
      });
      setPermissions(user.permissions || {
        financeiro: false,
        valores: false,
        relatorios: false,
        monitoramento: true,
        cadastros: false
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      role: formData.role
    };

    console.log('Enviando dados:', userData);

    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser._id,
        userData
      });
    } else {
      createUserMutation.mutate(userData);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      deleteUserMutation.mutate(userId);
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

  if (isLoading || accountLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Carregando dados...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Erro ao carregar usuários: {error.message}
      </Alert>
    );
  }

  const usuarios = usuariosData?.data?.usuarios || [];
  const accountInfo = accountData?.data;
  
  console.log('usuariosData:', usuariosData);
  console.log('usuarios:', usuarios);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
        Gerenciar Usuários
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Gerencie os usuários da sua conta e suas permissões de acesso.
      </Typography>

      {/* Informações da Conta */}
      {accountInfo && accountInfo.conta && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Informações da Conta
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main">
                    {accountInfo.conta.usuariosAtivos || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usuários Ativos
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {accountInfo.conta.limiteUsuarios || 3}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Limite Total
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {accountInfo.conta.plano || 'premium'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Plano
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip
                    label={accountInfo.conta.status || 'ativo'}
                    color={accountInfo.conta.status === 'ativo' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Status
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Usuários ({usuarios.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          disabled={false}
        >
          Adicionar Usuário
        </Button>
      </Box>

      {/* Tabela de Usuários */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Usuário</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Permissões</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  usuarios.map((usuario) => (
                    <TableRow key={usuario._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {usuario.nome.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {usuario.nome}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {usuario.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getRoleIcon(usuario.role)}
                          label={getRoleLabel(usuario.role)}
                          color={getRoleColor(usuario.role)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {usuario.permissions?.financeiro && (
                            <Chip size="small" label="Financeiro" color="success" />
                          )}
                          {usuario.permissions?.valores && (
                            <Chip size="small" label="Valores" color="success" />
                          )}
                          {usuario.permissions?.relatorios && (
                            <Chip size="small" label="Relatórios" color="success" />
                          )}
                          {usuario.permissions?.monitoramento && (
                            <Chip size="small" label="Monitoramento" color="info" />
                          )}
                          {usuario.permissions?.cadastros && (
                            <Chip size="small" label="Cadastros" color="success" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={usuario.status}
                          color={usuario.status === 'ativo' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenDialog(usuario)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          {usuario.role !== 'owner' && (
                            <Tooltip title="Remover">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(usuario._id)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog de Criação/Edição */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuário' : 'Adicionar Usuário'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={editingUser ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                  type={showPassword ? "text" : "password"}
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  required={!editingUser}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="auxiliar">Auxiliar</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {formData.role === 'admin' && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Permissões do Administrador
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={permissions.financeiro}
                            onChange={(e) => setPermissions({ ...permissions, financeiro: e.target.checked })}
                          />
                        }
                        label="Acesso Financeiro"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={permissions.valores}
                            onChange={(e) => setPermissions({ ...permissions, valores: e.target.checked })}
                          />
                        }
                        label="Valores de Milhas"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={permissions.relatorios}
                            onChange={(e) => setPermissions({ ...permissions, relatorios: e.target.checked })}
                          />
                        }
                        label="Relatórios"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={permissions.cadastros}
                            onChange={(e) => setPermissions({ ...permissions, cadastros: e.target.checked })}
                          />
                        }
                        label="Cadastros"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
            >
              {createUserMutation.isPending || updateUserMutation.isPending ? (
                <CircularProgress size={20} />
              ) : (
                editingUser ? 'Atualizar' : 'Criar'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default GerenciarUsuarios;
