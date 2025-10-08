/**
 * Página de Tutoriais
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Refresh,
  Visibility,
  Download,
  VideoLibrary,
  Article,
  School,
  Help,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Tutoriais = () => {
  const { user } = useAuth();

  const [tutoriais] = useState([
    {
      id: 1,
      titulo: 'Como cadastrar uma nova conta',
      tipo: 'video',
      duracao: '5:30',
      nivel: 'iniciante',
      visualizacoes: 1250,
      concluido: true,
      descricao: 'Aprenda a cadastrar uma nova conta bancária no sistema'
    },
    {
      id: 2,
      titulo: 'Gestão de movimentações',
      tipo: 'video',
      duracao: '12:45',
      nivel: 'intermediario',
      visualizacoes: 890,
      concluido: false,
      descricao: 'Como gerenciar compras, vendas e transferências'
    },
    {
      id: 3,
      titulo: 'Relatórios financeiros',
      tipo: 'artigo',
      duracao: '8 min',
      nivel: 'avancado',
      visualizacoes: 654,
      concluido: false,
      descricao: 'Guia completo para gerar relatórios financeiros'
    },
    {
      id: 4,
      titulo: 'Configuração de notificações',
      tipo: 'video',
      duracao: '3:20',
      nivel: 'iniciante',
      visualizacoes: 432,
      concluido: true,
      descricao: 'Como configurar alertas e notificações'
    }
  ]);

  const categorias = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];
  const tipos = ['Todos', 'Vídeo', 'Artigo'];

  const getNivelColor = (nivel) => {
    switch (nivel) {
      case 'iniciante': return 'success';
      case 'intermediario': return 'warning';
      case 'avancado': return 'error';
      default: return 'default';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'video': return <VideoLibrary />;
      case 'artigo': return <Article />;
      default: return <Help />;
    }
  };

  const stats = {
    totalTutoriais: tutoriais.length,
    videos: tutoriais.filter(t => t.tipo === 'video').length,
    artigos: tutoriais.filter(t => t.tipo === 'artigo').length,
    concluidos: tutoriais.filter(t => t.concluido).length
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Tutoriais
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Aprenda a usar o sistema com nossos tutoriais
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
            Atualizar
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalTutoriais}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VideoLibrary sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Vídeos</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.videos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Article sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Artigos</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.artigos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Concluídos</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.concluidos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                Tutoriais Disponíveis
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Título</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Nível</TableCell>
                      <TableCell>Duração</TableCell>
                      <TableCell>Visualizações</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tutoriais.map((tutorial) => (
                      <TableRow key={tutorial.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {tutorial.titulo}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {tutorial.descricao}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getTipoIcon(tutorial.tipo)}
                            <Chip
                              label={tutorial.tipo === 'video' ? 'Vídeo' : 'Artigo'}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tutorial.nivel}
                            color={getNivelColor(tutorial.nivel)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {tutorial.duracao}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{tutorial.visualizacoes}</TableCell>
                        <TableCell>
                          {tutorial.concluido ? (
                            <Chip
                              label="Concluído"
                              color="success"
                              size="small"
                              icon={<CheckCircle />}
                            />
                          ) : (
                            <Chip
                              label="Pendente"
                              color="warning"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Assistir">
                              <IconButton size="small" color="primary">
                                <PlayArrow />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Visualizar">
                              <IconButton size="small">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton size="small" color="success">
                                <Download />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <Help sx={{ mr: 1, verticalAlign: 'middle' }} />
                Ajuda Rápida
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <VideoLibrary color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Vídeos Tutoriais"
                    secondary="Aprenda com vídeos explicativos"
                  />
                </ListItem>
                
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <Article color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Documentação"
                    secondary="Leia nossa documentação completa"
                  />
                </ListItem>
                
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <Help color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Suporte"
                    secondary="Entre em contato conosco"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Tutoriais;
