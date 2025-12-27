/**
 * Componente principal da aplicação
 * 
 * Configura o roteamento, layout principal e
 * gerencia o estado global da aplicação.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';

import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoadingScreen from './components/Common/LoadingScreen';
import ErrorBoundary from './components/Common/ErrorBoundary';

// Páginas de autenticação
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyEmail from './pages/Auth/VerifyEmail';

// Páginas principais
import Dashboard from './pages/Dashboard/Dashboard';
import ControleProgramas from './pages/Dashboard/ControleProgramas';
import MonitoramentoCPF from './pages/Dashboard/ControleCPF';
import Accounts from './pages/Accounts/Accounts';
import AccountDetail from './pages/Accounts/AccountDetail';
import Transactions from './pages/Transactions/Transactions';
import TransactionDetail from './pages/Transactions/TransactionDetail';
import Reports from './pages/Reports/Reports';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Notifications from './pages/Notifications/Notifications';

// Páginas - Movimentações
import CompraEntrada from './pages/Movimentacoes/CompraEntrada';
import CompraBonificada from './pages/Movimentacoes/CompraBonificada';
import Transferencia from './pages/Movimentacoes/Transferencia';
import TransferenciaPessoas from './pages/Movimentacoes/TransferenciaPessoas';
import Agendamento from './pages/Movimentacoes/Agendamento';
import Processos from './pages/Movimentacoes/Processos';
import Venda from './pages/Movimentacoes/Venda';
import SaidaManual from './pages/Movimentacoes/SaidaManual';
import Passagem from './pages/Movimentacoes/Passagem';

// Páginas - Tarefas
import Tarefas from './pages/Tarefas/Tarefas';

// Páginas - Relatórios
import ControleCPF from './pages/Relatorios/ControleCPF';
import Passagens from './pages/Relatorios/Passagens';
import Transferencias from './pages/Relatorios/Transferencias';
import Vendas from './pages/Relatorios/Vendas';
import Resumo from './pages/Relatorios/Resumo';
import GraficoLucro from './pages/Relatorios/GraficoLucro';
import Evolucao from './pages/Relatorios/Evolucao';

// Páginas - Financeiro
import FluxoCaixa from './pages/Financeiro/FluxoCaixa';
import Receitas from './pages/Financeiro/Receitas';
import Despesas from './pages/Financeiro/Despesas';
import Conciliacao from './pages/Financeiro/Conciliacao';
import TransferenciaFinanceira from './pages/Financeiro/Transferencia';

// Páginas - Cadastros
import CadastroPessoa from './pages/Cadastros/Pessoa';
import ContaBancaria from './pages/Cadastros/ContaBancaria';
import Cartao from './pages/Cadastros/Cartao';
import Clubes from './pages/Cadastros/Clubes';
import Programas from './pages/Cadastros/Programas';
import Cliente from './pages/Cadastros/Cliente';
import Etiqueta from './pages/Cadastros/Etiqueta';

// Páginas - Serviços
import Orcamentos from './pages/Servicos/Orcamentos';
import Recibos from './pages/Servicos/Recibos';

// Páginas - Ajuda
import Tutoriais from './pages/Ajuda/Tutoriais';
import Ticket from './pages/Ajuda/Ticket';
import WhatsApp from './pages/Ajuda/WhatsApp';

// Páginas - IA
import DashboardAI from './pages/AI/DashboardAI';

// Páginas - Configurações
import GerenciarUsuarios from './pages/Configuracoes/GerenciarUsuarios';
import Perfil from './pages/Configuracoes/Perfil';


// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente para rotas públicas (apenas quando não logado)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { user, loading } = useAuth();

  // Timeout de segurança: se loading demorar muito, mostrar a aplicação
  const [forceRender, setForceRender] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn('Loading demorou muito - forçando renderização');
        setForceRender(true);
      }
    }, 6000); // 6 segundos

    return () => clearTimeout(timer);
  }, [loading]);

  // Reset forceRender quando loading mudar
  React.useEffect(() => {
    if (!loading) {
      setForceRender(false);
    }
  }, [loading]);

  if (loading && !forceRender) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Routes>
            {/* Rotas públicas */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-email"
              element={
                <PublicRoute>
                  <VerifyEmail />
                </PublicRoute>
              }
            />

            {/* Rotas protegidas */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/dashboard/controle-programas" element={<ControleProgramas />} />
                      <Route path="/dashboard/monitoramento-cpf" element={<MonitoramentoCPF />} />
                      
                      {/* Contas */}
                      <Route path="/accounts" element={<Accounts />} />
                      <Route path="/accounts/:id" element={<AccountDetail />} />
                      
                      {/* Transações */}
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/transactions/:id" element={<TransactionDetail />} />
                      
                      {/* Relatórios */}
                      <Route path="/reports" element={<Reports />} />
                      
                      {/* Movimentações */}
                      <Route path="/movimentacoes/compra-entrada" element={<CompraEntrada />} />
                      <Route path="/movimentacoes/compra-bonificada" element={<CompraBonificada />} />
                      <Route path="/movimentacoes/transferencia" element={<Transferencia />} />
                      <Route path="/movimentacoes/transferencia-pessoas" element={<TransferenciaPessoas />} />
                      <Route path="/movimentacoes/agendamento" element={<Agendamento />} />
                      <Route path="/movimentacoes/processos" element={<Processos />} />
                      <Route path="/movimentacoes/venda" element={<Venda />} />
                      <Route path="/movimentacoes/saida-manual" element={<SaidaManual />} />
                      <Route path="/movimentacoes/passagem" element={<Passagem />} />
                      
                      {/* Tarefas */}
                      <Route path="/tarefas" element={<Tarefas />} />
                      
                      {/* Relatórios Específicos */}
                      <Route path="/relatorios/controle-cpf" element={<ControleCPF />} />
                      <Route path="/relatorios/passagens" element={<Passagens />} />
                      <Route path="/relatorios/transferencias" element={<Transferencias />} />
                      <Route path="/relatorios/vendas" element={<Vendas />} />
                      <Route path="/relatorios/resumo" element={<Resumo />} />
                      <Route path="/relatorios/grafico-lucro" element={<GraficoLucro />} />
                      <Route path="/relatorios/evolucao" element={<Evolucao />} />
                      
                      {/* Financeiro */}
                      <Route path="/financeiro/fluxo-caixa" element={<FluxoCaixa />} />
                      <Route path="/financeiro/receitas" element={<Receitas />} />
                      <Route path="/financeiro/despesas" element={<Despesas />} />
                      <Route path="/financeiro/conciliacao" element={<Conciliacao />} />
                      <Route path="/financeiro/transferencia" element={<TransferenciaFinanceira />} />
                      
                      {/* Cadastros */}
                      <Route path="/cadastros/pessoa" element={<CadastroPessoa />} />
                      <Route path="/cadastros/conta-bancaria" element={<ContaBancaria />} />
                      <Route path="/cadastros/cartao" element={<Cartao />} />
                      <Route path="/cadastros/clubes" element={<Clubes />} />
                      <Route path="/cadastros/programas" element={<Programas />} />
                      <Route path="/cadastros/cliente" element={<Cliente />} />
                      <Route path="/cadastros/etiqueta" element={<Etiqueta />} />
                      
                      {/* Serviços */}
                      <Route path="/servicos/orcamentos" element={<Orcamentos />} />
                      <Route path="/servicos/recibos" element={<Recibos />} />
                      
                      {/* Ajuda */}
                      <Route path="/ajuda/tutoriais" element={<Tutoriais />} />
                      <Route path="/ajuda/ticket" element={<Ticket />} />
                      <Route path="/ajuda/whatsapp" element={<WhatsApp />} />
                      
                      {/* IA */}
                      <Route path="/ai/dashboard" element={<DashboardAI />} />

            {/* Configurações */}
            <Route path="/configuracoes/usuarios" element={<GerenciarUsuarios />} />
            <Route path="/configuracoes/perfil" element={<Perfil />} />
                      
                      {/* Perfil e configurações */}
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />
                      
                      {/* Notificações */}
                      <Route path="/notifications" element={<Notifications />} />
                      
                      
                      {/* Rota 404 */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          </Box>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
