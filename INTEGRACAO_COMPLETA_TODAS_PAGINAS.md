# 🔌 INTEGRAÇÃO COMPLETA - TODAS AS PÁGINAS

**Progresso:** 2/22 ✅ | Faltam: 20 páginas

---

## ✅ JÁ CONECTADAS

1. ✅ **Receitas** - `client/src/pages/Financeiro/Receitas.js`
2. ✅ **Despesas** - `client/src/pages/Financeiro/Despesas.js`

---

## 📋 CÓDIGO PARA APLICAR EM CADA PÁGINA

### 🔧 PADRÃO UNIVERSAL (Use em TODAS as páginas)

#### Passo 1: Import no topo
```javascript
import { financialAPI } from '../../services'; // ou taskAPI, movementAPI, dashboardAPI
```

#### Passo 2: Estado
```javascript
// Substituir:
const [data] = useState([...mock...]);

// Por:
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

#### Passo 3: Fetch
```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await API.getMethod();
    setData(response.data || []);
  } catch (err) {
    console.error('Erro:', err);
    setError('Erro ao carregar dados');
  } finally {
    setLoading(false);
  }
};

React.useEffect(() => {
  fetchData();
}, []);
```

#### Passo 4: Submit
```javascript
const handleSubmit = async (formData) => {
  try {
    setLoading(true);
    setError(null);
    await API.createMethod(formData);
    await fetchData();
    setOpenDialog(false);
  } catch (err) {
    setError(err.response?.data?.message || 'Erro ao salvar');
  } finally {
    setLoading(false);
  }
};
```

---

## 💰 FINANCEIRO (Faltam 2 páginas)

### 3. Fluxo de Caixa
**Arquivo:** `client/src/pages/Financeiro/FluxoCaixa.js`

```javascript
// Import
import { financialAPI } from '../../services';

// Estado
const [cashFlow, setCashFlow] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Fetch
const fetchCashFlow = async () => {
  try {
    setLoading(true);
    const response = await financialAPI.getCashFlow();
    setCashFlow(response.cashFlow || []);
  } catch (err) {
    setError('Erro ao carregar fluxo de caixa');
  } finally {
    setLoading(false);
  }
};

React.useEffect(() => { fetchCashFlow(); }, []);

// Create
await financialAPI.createCashFlow(formData);
```

### 4. Conciliação
**Arquivo:** `client/src/pages/Financeiro/Conciliacao.js`

```javascript
import { financialAPI } from '../../services';

// Contas
const [bankAccounts, setBankAccounts] = useState([]);
const fetchAccounts = async () => {
  const response = await financialAPI.getBankAccounts();
  setBankAccounts(response.accounts || []);
};

// Cartões
const [cards, setCards] = useState([]);
const fetchCards = async () => {
  const response = await financialAPI.getCards();
  setCards(response.cards || []);
};

React.useEffect(() => {
  fetchAccounts();
  fetchCards();
}, []);
```

---

## 🔄 MOVIMENTAÇÕES (9 páginas)

### 5. Compra/Entrada
**Arquivo:** `client/src/pages/Movimentacoes/CompraEntrada.js`

```javascript
import { movementAPI } from '../../services';

const handleSubmit = async (formData) => {
  await movementAPI.createMovement({
    tipo: 'compra',
    programa: formData.programa,
    quantidade: formData.quantidade,
    valorUnitario: formData.valorUnitario,
    cpf: formData.cpf,
    descricao: formData.descricao
  });
};
```

### 6. Venda
**Arquivo:** `client/src/pages/Movimentacoes/Venda.js`

```javascript
import { movementAPI } from '../../services';

await movementAPI.createMovement({
  tipo: 'venda',
  ...formData
});
```

### 7. Transferência
**Arquivo:** `client/src/pages/Movimentacoes/Transferencia.js`

```javascript
import { movementAPI } from '../../services';

await movementAPI.createMovement({
  tipo: 'transferencia',
  ...formData
});
```

### 8. Compra Bonificada
**Arquivo:** `client/src/pages/Movimentacoes/CompraBonificada.js`

```javascript
import { movementAPI } from '../../services';

await movementAPI.createMovement({
  tipo: 'compra',
  bonificada: true,
  ...formData
});
```

### 9. Transferência Pessoas
**Arquivo:** `client/src/pages/Movimentacoes/TransferenciaPessoas.js`

```javascript
import { movementAPI } from '../../services';

await movementAPI.createMovement({
  tipo: 'transferencia',
  entrePessoas: true,
  ...formData
});
```

### 10. Agendamento
**Arquivo:** `client/src/pages/Movimentacoes/Agendamento.js`

```javascript
import { movementAPI } from '../../services';

// Listar
const response = await movementAPI.getScheduledTransactions();
setAgendamentos(response.scheduled || []);

// Criar
await movementAPI.createScheduledTransaction(formData);
```

### 11. Processos
**Arquivo:** `client/src/pages/Movimentacoes/Processos.js`

```javascript
import { movementAPI } from '../../services';

const response = await movementAPI.getMovements({ status: 'pendente' });
setProcessos(response.movements || []);
```

### 12. Saída Manual
**Arquivo:** `client/src/pages/Movimentacoes/SaidaManual.js`

```javascript
import { movementAPI } from '../../services';

await movementAPI.createMovement({
  tipo: 'saida_manual',
  ...formData
});
```

### 13. Passagem
**Arquivo:** `client/src/pages/Movimentacoes/Passagem.js`

```javascript
import { movementAPI } from '../../services';

await movementAPI.createMovement({
  tipo: 'passagem',
  ...formData
});
```

---

## ✅ TAREFAS (1 página)

### 14. Tarefas/Kanban
**Arquivo:** `client/src/pages/Tarefas/Tarefas.js`

```javascript
import { taskAPI } from '../../services';

// Estado
const [tasks, setTasks] = useState([]);

// Fetch
const fetchTasks = async () => {
  const response = await taskAPI.getTasks();
  setTasks(response.tasks || []);
};

React.useEffect(() => { fetchTasks(); }, []);

// Criar
await taskAPI.createTask({
  titulo: formData.titulo,
  descricao: formData.descricao,
  status: 'todo',
  prioridade: 'media'
});

// Mover no Kanban
await taskAPI.updateTaskStatus(taskId, newStatus);

// ou
await taskAPI.moveTaskInKanban(taskId, newStatus, position);
```

---

## 📊 DASHBOARD (1 página)

### 15. Dashboard
**Arquivo:** `client/src/pages/Dashboard/Dashboard.js`

```javascript
import { dashboardAPI } from '../../services';

// Estado
const [stats, setStats] = useState({});
const [metrics, setMetrics] = useState({});
const [activities, setActivities] = useState([]);

// Fetch tudo
const fetchDashboardData = async () => {
  try {
    setLoading(true);
    
    const [statsRes, metricsRes, activitiesRes] = await Promise.all([
      dashboardAPI.getDashboardStats(),
      dashboardAPI.getFinancialMetrics(),
      dashboardAPI.getRecentActivity()
    ]);
    
    setStats(statsRes.stats || {});
    setMetrics(metricsRes.metrics || {});
    setActivities(activitiesRes.activities || []);
  } catch (err) {
    setError('Erro ao carregar dashboard');
  } finally {
    setLoading(false);
  }
};

React.useEffect(() => { fetchDashboardData(); }, []);
```

---

## 📈 RELATÓRIOS (7 páginas)

### 16. Controle CPF
**Arquivo:** `client/src/pages/Relatorios/ControleCPF.js`

```javascript
import { reportAPI } from '../../services';

const response = await reportAPI.getCPFControlReport();
setReportData(response.report || {});
```

### 17. Passagens
**Arquivo:** `client/src/pages/Relatorios/Passagens.js`

```javascript
import { reportAPI } from '../../services';

const response = await reportAPI.getTicketsReport(filters);
setReportData(response.report || {});
```

### 18. Transferências
**Arquivo:** `client/src/pages/Relatorios/Transferencias.js`

```javascript
import { reportAPI } from '../../services';

const response = await reportAPI.getTransfersReport(filters);
setReportData(response.report || {});
```

### 19. Vendas
**Arquivo:** `client/src/pages/Relatorios/Vendas.js`

```javascript
import { reportAPI } from '../../services';

const response = await reportAPI.getSalesReport(filters);
setReportData(response.report || {});
```

### 20. Resumo
**Arquivo:** `client/src/pages/Relatorios/Resumo.js`

```javascript
import { reportAPI, financialAPI } from '../../services';

const [summary, setSummary] = useState({});

const fetchSummary = async () => {
  const response = await financialAPI.getFinancialSummary(startDate, endDate);
  setSummary(response.summary || {});
};
```

### 21. Gráfico Lucro
**Arquivo:** `client/src/pages/Relatorios/GraficoLucro.js`

```javascript
import { reportAPI } from '../../services';

const response = await reportAPI.getProfitReport(period);
setChartData(response.data || []);
```

### 22. Evolução
**Arquivo:** `client/src/pages/Relatorios/Evolucao.js`

```javascript
import { dashboardAPI } from '../../services';

const response = await dashboardAPI.getEvolutionChartData(period);
setEvolutionData(response.data || []);
```

---

## 🚀 MODO TURBO - SCRIPT DE BUSCA E SUBSTITUIÇÃO

Para aplicar rapidamente em todas as páginas, use este padrão:

```javascript
// 1. SEMPRE adicionar no topo (após imports MUI):
import { NOME_API } from '../../services';

// 2. SEMPRE mudar estado de:
const [data] = useState([...mock...]);
// PARA:
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// 3. SEMPRE adicionar useEffect:
React.useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true);
      const res = await API.getMethod();
      setData(res.data || []);
    } catch (err) {
      setError('Erro');
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);

// 4. SEMPRE atualizar handleSubmit:
await API.createMethod(formData);
await fetch(); // recarregar
```

---

## ✅ CHECKLIST FINAL

- [ ] Financeiro (4 páginas)
  - [x] Receitas ✅
  - [x] Despesas ✅
  - [ ] Fluxo de Caixa
  - [ ] Conciliação

- [ ] Movimentações (9 páginas)
  - [ ] Compra/Entrada
  - [ ] Venda
  - [ ] Transferência
  - [ ] Compra Bonificada
  - [ ] Transferência Pessoas
  - [ ] Agendamento
  - [ ] Processos
  - [ ] Saída Manual
  - [ ] Passagem

- [ ] Tarefas (1 página)
  - [ ] Kanban

- [ ] Dashboard (1 página)
  - [ ] Dashboard principal

- [ ] Relatórios (7 páginas)
  - [ ] Controle CPF
  - [ ] Passagens
  - [ ] Transferências
  - [ ] Vendas
  - [ ] Resumo
  - [ ] Gráfico Lucro
  - [ ] Evolução

---

## 📊 PROGRESSO

**Conectadas:** 2/22 (9%)  
**Faltam:** 20 páginas (91%)

---

**Criado em:** 01/11/2025  
**Todas as integrações documentadas e prontas para aplicar**

