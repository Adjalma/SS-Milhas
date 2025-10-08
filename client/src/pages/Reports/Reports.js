/**
 * Página de Relatórios
 * 
 * Interface para visualizar relatórios e análises.
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Download,
  Print,
  Email,
  Assessment,
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  Receipt,
  CalendarToday,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Layout from '../../components/Layout/Layout';

// Dados mockados
const mockReports = {
  resumo: {
    totalMilhas: 125000,
    totalContas: 4,
    totalTransacoes: 23,
    valorTotal: 8750.50,
    lucro: 1250.00,
    variacao: 12.5,
  },
  evolucao: [
    { mes: 'Jan', milhas: 45000, valor: 3200.00 },
    { mes: 'Fev', milhas: 52000, valor: 3800.00 },
    { mes: 'Mar', milhas: 48000, valor: 3500.00 },
    { mes: 'Abr', milhas: 61000, valor: 4200.00 },
    { mes: 'Mai', milhas: 75000, valor: 5200.00 },
    { mes: 'Jun', milhas: 89000, valor: 6200.00 },
    { mes: 'Jul', milhas: 105000, valor: 7500.00 },
    { mes: 'Ago', milhas: 125000, valor: 8750.00 },
  ],
  distribuicao: [
    { name: 'Latam Pass', value: 45000, color: '#8884d8' },
    { name: 'Smiles', value: 32000, color: '#82ca9d' },
    { name: 'TudoAzul', value: 28000, color: '#ffc658' },
    { name: 'Azul Fidelidade', value: 20000, color: '#ff7300' },
  ],
  transacoesPorTipo: [
    { tipo: 'Compra', quantidade: 12, valor: 4500.00 },
    { tipo: 'Venda', quantidade: 8, valor: 2400.00 },
    { tipo: 'Transferência', quantidade: 3, valor: 0.00 },
  ],
  topContas: [
    { nome: 'Latam Pass', saldo: 45000, variacao: 15.2, status: 'ativa' },
    { nome: 'Smiles', saldo: 32000, variacao: 8.5, status: 'ativa' },
    { nome: 'TudoAzul', saldo: 28000, variacao: -2.1, status: 'expirando' },
    { nome: 'Azul Fidelidade', saldo: 20000, variacao: 5.3, status: 'ativa' },
  ],
};

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('6m');
  const [tipoRelatorio, setTipoRelatorio] = useState('geral');

  useEffect(() => {
    loadReports();
  }, [periodo, tipoRelatorio]);

  const loadReports = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReports(mockReports);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    // Simular exportação
    alert(`Exportando relatório em formato ${format}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    // Simular envio por email
    alert('Relatório enviado por email');
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" height={40} width={200} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[...Array(6)].map((_, index) => (
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
              Relatórios
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Análises e relatórios das suas milhas
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Período</InputLabel>
              <Select
                value={periodo}
                label="Período"
                onChange={(e) => setPeriodo(e.target.value)}
              >
                <MenuItem value="1m">Último mês</MenuItem>
                <MenuItem value="3m">Últimos 3 meses</MenuItem>
                <MenuItem value="6m">Últimos 6 meses</MenuItem>
                <MenuItem value="1y">Último ano</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => handleExport('PDF')}
            >
              PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrint}
            >
              Imprimir
            </Button>
            <Button
              variant="outlined"
              startIcon={<Email />}
              onClick={handleEmail}
            >
              Email
            </Button>
          </Box>
        </Box>

        {/* Resumo Executivo */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceWallet color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {reports.resumo.totalMilhas.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Milhas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Receipt color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {reports.resumo.totalTransacoes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transações
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assessment color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      R$ {reports.resumo.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Valor Total
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                      R$ {reports.resumo.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lucro
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      +{reports.resumo.variacao}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Variação
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {reports.resumo.totalContas}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Contas Ativas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Evolução das Milhas e Valor
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reports.evolucao}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="milhas"
                      stroke="#8884d8"
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="valor"
                      stroke="#82ca9d"
                      strokeWidth={3}
                      dot={{ fill: '#82ca9d', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Distribuição por Conta
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reports.distribuicao}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {reports.distribuicao.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {reports.distribuicao.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: item.color,
                          borderRadius: '50%',
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">
                        {item.name}: {item.value.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Análise de Transações */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Transações por Tipo
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={reports.transacoesPorTipo}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Valor por Tipo de Transação
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={reports.transacoesPorTipo}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="valor" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Ranking de Contas */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Ranking de Contas
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Posição</TableCell>
                    <TableCell>Conta</TableCell>
                    <TableCell align="right">Saldo</TableCell>
                    <TableCell align="right">Variação</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.topContas.map((conta, index) => (
                    <TableRow key={conta.nome} hover>
                      <TableCell>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          #{index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {conta.nome}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {conta.saldo.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body1"
                          sx={{
                            color: conta.variacao >= 0 ? 'success.main' : 'error.main',
                            fontWeight: 600,
                          }}
                        >
                          {conta.variacao >= 0 ? '+' : ''}{conta.variacao}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={conta.status}
                          color={conta.status === 'ativa' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small">
                          <Assessment />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default Reports;
